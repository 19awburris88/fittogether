const router      = require('express').Router();
const db          = require('../db');
const requireAuth = require('../middleware/auth');

// GET /activity — recent activity feed for the couple
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const coupleRes = await db.query(
      'SELECT id FROM couples WHERE user1_id = $1 OR user2_id = $1',
      [req.user.id]
    );
    if (!coupleRes.rows.length) return res.json([]);
    const coupleId = coupleRes.rows[0].id;

    const { rows } = await db.query(
      `SELECT a.id, a.text, a.created_at, u.name AS user_name
       FROM activity_feed a
       JOIN users u ON u.id = a.user_id
       WHERE a.couple_id = $1
       ORDER BY a.created_at DESC
       LIMIT 20`,
      [coupleId]
    );

    res.json(rows.map(r => ({
      id:        r.id,
      user:      r.user_name,
      text:      r.text,
      createdAt: r.created_at,
    })));
  } catch (err) { next(err); }
});

module.exports = router;
