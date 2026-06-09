const router      = require('express').Router();
const db          = require('../db');
const requireAuth = require('../middleware/auth');
const { _pushActivity } = require('./workouts');

async function getCouple(userId) {
  const { rows } = await db.query(
    'SELECT id, user1_id, user2_id FROM couples WHERE user1_id = $1 OR user2_id = $1',
    [userId]
  );
  return rows[0] || null;
}

// GET /wagers
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const couple = await getCouple(req.user.id);
    if (!couple) return res.json([]);

    const { rows: wagers } = await db.query(
      `SELECT w.id, w.title, w.target, w.status, w.created_at,
              wp.user_id, wp.value, wp.won
       FROM wagers w
       LEFT JOIN wager_progress wp ON wp.wager_id = w.id
       WHERE w.couple_id = $1
       ORDER BY w.created_at DESC`,
      [couple.id]
    );

    // Collapse rows per wager
    const map = {};
    wagers.forEach(r => {
      if (!map[r.id]) {
        map[r.id] = { id: r.id, title: r.title, target: r.target, status: r.status,
          progress: { austin: 0, partner: 0 } };
      }
      if (r.user_id) {
        const key = r.user_id === req.user.id ? 'austin' : 'partner';
        map[r.id].progress[key] = r.value;
        if (r.won && key === 'austin') map[r.id].winner = 'austin';
        if (r.won && key === 'partner') map[r.id].winner = 'partner';
      }
    });

    res.json(Object.values(map));
  } catch (err) { next(err); }
});

// POST /wagers — create a new wager
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const couple = await getCouple(req.user.id);
    if (!couple) return res.status(400).json({ error: 'Must be in a couple to create a wager' });

    const { title, target } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });

    const { rows } = await db.query(
      `INSERT INTO wagers (couple_id, title, target)
       VALUES ($1, $2, $3)
       RETURNING id, title, target, status`,
      [couple.id, title, target || 10]
    );
    const w = rows[0];
    await _pushActivity(req.user.id, `created a wager: "${w.title}"`);
    res.status(201).json({ ...w, progress: { austin: 0, partner: 0 } });
  } catch (err) { next(err); }
});

// POST /wagers/:id/progress — record a step
router.post('/:id/progress', requireAuth, async (req, res, next) => {
  try {
    const { value } = req.body;
    if (value == null) return res.status(400).json({ error: 'value is required' });

    const { rows } = await db.query(
      `INSERT INTO wager_progress (wager_id, user_id, value)
       VALUES ($1, $2, $3)
       ON CONFLICT (wager_id, user_id) DO UPDATE SET value = $3
       RETURNING *`,
      [req.params.id, req.user.id, value]
    );

    // Check if wager is done
    const wagerRes = await db.query('SELECT target FROM wagers WHERE id = $1', [req.params.id]);
    const target = wagerRes.rows[0]?.target;
    if (target && value >= target) {
      await db.query(
        `UPDATE wagers SET status = 'complete' WHERE id = $1 AND status = 'active'`,
        [req.params.id]
      );
      await db.query(
        'UPDATE wager_progress SET won = TRUE WHERE wager_id = $1 AND user_id = $2',
        [req.params.id, req.user.id]
      );
    }

    res.json(rows[0]);
  } catch (err) { next(err); }
});

module.exports = router;
