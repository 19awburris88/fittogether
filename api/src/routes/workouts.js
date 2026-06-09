const router      = require('express').Router();
const db          = require('../db');
const requireAuth = require('../middleware/auth');

// GET /workouts — log for the authenticated user + their partner
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get partner id if in a couple
    const coupleRes = await db.query(
      `SELECT user1_id, user2_id FROM couples
       WHERE user1_id = $1 OR user2_id = $1`,
      [userId]
    );
    const partnerIds = coupleRes.rows.length
      ? [coupleRes.rows[0].user1_id, coupleRes.rows[0].user2_id].filter(id => id !== userId)
      : [];

    const userIds = [userId, ...partnerIds];
    const { rows } = await db.query(
      `SELECT w.id, w.user_id, w.date, w.name, w.type,
              w.duration_minutes AS duration, w.notes,
              u.name AS user_name
       FROM workout_log w
       JOIN users u ON u.id = w.user_id
       WHERE w.user_id = ANY($1)
       ORDER BY w.date DESC, w.created_at DESC
       LIMIT 100`,
      [userIds]
    );

    // Normalise to match mock shape
    res.json(rows.map(r => ({
      id:       r.id,
      userId:   r.user_id === userId ? 'austin' : 'partner',
      date:     r.date,
      name:     r.name,
      type:     r.type,
      duration: r.duration,
      notes:    r.notes,
    })));
  } catch (err) { next(err); }
});

// POST /workouts — add a workout entry
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { name, type, duration, notes } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });

    const today = new Date().toISOString().slice(0, 10);
    const { rows } = await db.query(
      `INSERT INTO workout_log (user_id, date, name, type, duration_minutes, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, date, name, type, duration_minutes AS duration, notes`,
      [req.user.id, today, name, type || 'other', duration || 30, notes || '']
    );

    const entry = rows[0];
    await _pushActivity(req.user.id, `logged a ${entry.duration}-min ${entry.name}`);

    res.status(201).json({ ...entry, userId: 'austin' });
  } catch (err) { next(err); }
});

// Helper: push an activity entry for the user's couple
async function _pushActivity(userId, text) {
  const coupleRes = await db.query(
    'SELECT id FROM couples WHERE user1_id = $1 OR user2_id = $1',
    [userId]
  );
  if (!coupleRes.rows.length) return;
  const coupleId = coupleRes.rows[0].id;
  await db.query(
    'INSERT INTO activity_feed (couple_id, user_id, text) VALUES ($1, $2, $3)',
    [coupleId, userId, text]
  );
}

module.exports = router;
module.exports._pushActivity = _pushActivity;
