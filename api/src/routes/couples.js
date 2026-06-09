const router      = require('express').Router();
const db          = require('../db');
const requireAuth = require('../middleware/auth');

function randomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

// GET /couples/me — current couple info
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT c.id, c.streak_days, c.last_activity_date,
              u1.id AS user1_id, u1.name AS user1_name,
              u2.id AS user2_id, u2.name AS user2_name
       FROM couples c
       JOIN users u1 ON u1.id = c.user1_id
       JOIN users u2 ON u2.id = c.user2_id
       WHERE c.user1_id = $1 OR c.user2_id = $1`,
      [req.user.id]
    );
    if (!rows.length) return res.json(null);
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// POST /couples/invite — generate an invite code
router.post('/invite', requireAuth, async (req, res, next) => {
  try {
    // Check not already in a couple
    const coupled = await db.query(
      'SELECT id FROM couples WHERE user1_id = $1 OR user2_id = $1',
      [req.user.id]
    );
    if (coupled.rows.length) {
      return res.status(400).json({ error: 'You are already in a couple' });
    }

    // Invalidate any existing pending invite
    await db.query(
      'DELETE FROM couple_invites WHERE inviter_id = $1 AND accepted = FALSE',
      [req.user.id]
    );

    const code = randomCode();
    await db.query(
      `INSERT INTO couple_invites (code, inviter_id)
       VALUES ($1, $2)`,
      [code, req.user.id]
    );
    res.json({ code });
  } catch (err) { next(err); }
});

// POST /couples/join — accept an invite code
router.post('/join', requireAuth, async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'code is required' });

    // Check not already in a couple
    const coupled = await db.query(
      'SELECT id FROM couples WHERE user1_id = $1 OR user2_id = $1',
      [req.user.id]
    );
    if (coupled.rows.length) {
      return res.status(400).json({ error: 'You are already in a couple' });
    }

    const { rows } = await db.query(
      `SELECT * FROM couple_invites
       WHERE code = $1 AND accepted = FALSE AND expires_at > NOW()`,
      [code.toUpperCase()]
    );
    if (!rows.length) return res.status(404).json({ error: 'Invalid or expired invite code' });

    const invite = rows[0];
    if (invite.inviter_id === req.user.id) {
      return res.status(400).json({ error: 'You cannot join your own invite' });
    }

    // Create the couple
    const coupleRes = await db.query(
      `INSERT INTO couples (user1_id, user2_id)
       VALUES ($1, $2)
       RETURNING id`,
      [invite.inviter_id, req.user.id]
    );
    const coupleId = coupleRes.rows[0].id;

    // Mark invite accepted
    await db.query('UPDATE couple_invites SET accepted = TRUE WHERE id = $1', [invite.id]);

    // Seed default challenges for the couple
    await db.query(
      `INSERT INTO challenges (couple_id, title, type, reward, description, target) VALUES
       ($1, 'Water Wars (Daily)',    'head_to_head', 50,  'Hit 8 cups. Bonus if you beat your partner.', 8),
       ($1, 'Workout Sync (Weekly)', 'collab',       150, 'Both complete 5+ workouts this week.',        5)`,
      [coupleId]
    );

    res.json({ coupleId });
  } catch (err) { next(err); }
});

module.exports = router;
