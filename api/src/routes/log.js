const router      = require('express').Router();
const db          = require('../db');
const requireAuth = require('../middleware/auth');
const { _pushActivity } = require('./workouts');
const { addCoins, updateCoupleStreak, COINS_WATER_GOAL, WATER_GOAL } = require('../lib/coins');

// POST /log/water — record water glasses for today
router.post('/water', requireAuth, async (req, res, next) => {
  try {
    const { glasses } = req.body;
    if (glasses == null) return res.status(400).json({ error: 'glasses is required' });

    const today = new Date().toISOString().slice(0, 10);

    // Get previous count so we only award coins once when goal is first crossed
    const prev = await db.query(
      'SELECT water_glasses FROM daily_metrics WHERE user_id = $1 AND date = $2',
      [req.user.id, today]
    );
    const prevGlasses = prev.rows[0]?.water_glasses ?? 0;

    const { rows } = await db.query(
      `INSERT INTO daily_metrics (user_id, date, water_glasses)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, date)
       DO UPDATE SET water_glasses = $3
       RETURNING user_id, date, water_glasses, steps`,
      [req.user.id, today, glasses]
    );

    let coinsEarned = 0;
    if (prevGlasses < WATER_GOAL && glasses >= WATER_GOAL) {
      await addCoins(req.user.id, COINS_WATER_GOAL);
      await updateCoupleStreak(req.user.id);
      coinsEarned = COINS_WATER_GOAL;
    }

    res.json({ ...rows[0], coinsEarned });
  } catch (err) { next(err); }
});

// POST /log/steps — record steps for today
router.post('/steps', requireAuth, async (req, res, next) => {
  try {
    const { steps } = req.body;
    if (steps == null) return res.status(400).json({ error: 'steps is required' });

    const today = new Date().toISOString().slice(0, 10);
    const { rows } = await db.query(
      `INSERT INTO daily_metrics (user_id, date, steps)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, date)
       DO UPDATE SET steps = $3
       RETURNING user_id, date, water_glasses, steps`,
      [req.user.id, today, steps]
    );
    await _pushActivity(req.user.id, `logged ${steps.toLocaleString()} steps today`);
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// GET /log/metrics — today's metrics for both users in couple
router.get('/metrics', requireAuth, async (req, res, next) => {
  try {
    const coupleRes = await db.query(
      'SELECT user1_id, user2_id FROM couples WHERE user1_id = $1 OR user2_id = $1',
      [req.user.id]
    );

    const today = new Date().toISOString().slice(0, 10);
    const userIds = coupleRes.rows.length
      ? [coupleRes.rows[0].user1_id, coupleRes.rows[0].user2_id]
      : [req.user.id];

    const { rows } = await db.query(
      'SELECT user_id, water_glasses, steps FROM daily_metrics WHERE date = $1 AND user_id = ANY($2)',
      [today, userIds]
    );

    const map = Object.fromEntries(rows.map(r => [r.user_id, r]));
    res.json({
      mine:    map[req.user.id]    ?? { water_glasses: 0, steps: 0 },
      partner: map[userIds.find(id => id !== req.user.id)] ?? { water_glasses: 0, steps: 0 },
    });
  } catch (err) { next(err); }
});

module.exports = router;
