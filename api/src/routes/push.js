const router      = require('express').Router();
const db          = require('../db');
const requireAuth = require('../middleware/auth');
const webpush     = require('web-push');

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL || 'hello@fittogether.app'}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// POST /push/subscribe — save a push subscription for this user
router.post('/subscribe', requireAuth, async (req, res, next) => {
  try {
    const { subscription } = req.body;
    if (!subscription?.endpoint) return res.status(400).json({ error: 'subscription required' });

    await db.query(
      `INSERT INTO push_subscriptions (user_id, subscription)
       VALUES ($1, $2)
       ON CONFLICT (user_id, endpoint) DO UPDATE SET subscription = $2`,
      [req.user.id, JSON.stringify(subscription)]
    );
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// Helper: send a push to all subscriptions for a given user
async function sendPush(userId, title, body) {
  if (!process.env.VAPID_PUBLIC_KEY) return;
  const { rows } = await db.query(
    'SELECT subscription FROM push_subscriptions WHERE user_id = $1',
    [userId]
  );
  await Promise.allSettled(
    rows.map((r) => webpush.sendNotification(JSON.parse(r.subscription), JSON.stringify({ title, body })))
  );
}

module.exports = router;
module.exports.sendPush = sendPush;
