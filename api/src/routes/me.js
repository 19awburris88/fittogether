const router      = require('express').Router();
const db          = require('../db');
const requireAuth = require('../middleware/auth');

// GET /me
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT id, name, email, avatar, level, lbs_lost FROM users WHERE id = $1',
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// PUT /me  — update name, avatar, lbs_lost
router.put('/', requireAuth, async (req, res, next) => {
  try {
    const { name, avatar, lbs_lost } = req.body;
    const { rows } = await db.query(
      `UPDATE users
       SET name     = COALESCE($1, name),
           avatar   = COALESCE($2, avatar),
           lbs_lost = COALESCE($3, lbs_lost)
       WHERE id = $4
       RETURNING id, name, email, avatar, level, lbs_lost`,
      [name, avatar, lbs_lost, req.user.id]
    );
    res.json(rows[0]);
  } catch (err) { next(err); }
});

module.exports = router;
