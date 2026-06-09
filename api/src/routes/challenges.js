const router      = require('express').Router();
const db          = require('../db');
const requireAuth = require('../middleware/auth');
const { _pushActivity } = require('./workouts');

async function getCoupleId(userId) {
  const { rows } = await db.query(
    'SELECT id, user1_id, user2_id FROM couples WHERE user1_id = $1 OR user2_id = $1',
    [userId]
  );
  return rows[0] || null;
}

// GET /challenges
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const couple = await getCoupleId(req.user.id);
    if (!couple) return res.json([]);

    const { rows: challenges } = await db.query(
      `SELECT id, title, type, reward, description AS desc, target FROM challenges
       WHERE couple_id = $1 ORDER BY created_at ASC`,
      [couple.id]
    );

    // Get progress for each challenge
    const challengeIds = challenges.map(c => c.id);
    if (!challengeIds.length) return res.json([]);

    const { rows: progress } = await db.query(
      `SELECT challenge_id, user_id, value FROM challenge_progress
       WHERE challenge_id = ANY($1)`,
      [challengeIds]
    );

    const progressMap = {};
    progress.forEach(p => {
      if (!progressMap[p.challenge_id]) progressMap[p.challenge_id] = {};
      const role = p.user_id === couple.user1_id ? 'austin' : 'partner';
      if (couple.user1_id !== req.user.id && couple.user2_id === req.user.id) {
        // current user is user2, so flip
      }
      progressMap[p.challenge_id][p.user_id === req.user.id ? 'austin' : 'partner'] = p.value;
    });

    res.json(challenges.map(c => ({
      ...c,
      progress: {
        austin:  progressMap[c.id]?.austin  ?? 0,
        partner: progressMap[c.id]?.partner ?? 0,
        target:  c.target,
      },
    })));
  } catch (err) { next(err); }
});

// POST /challenges
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const couple = await getCoupleId(req.user.id);
    if (!couple) return res.status(400).json({ error: 'You must be in a couple to create challenges' });

    const { title, type, target, reward, desc } = req.body;
    const { rows } = await db.query(
      `INSERT INTO challenges (couple_id, title, type, reward, description, target)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, title, type, reward, description AS desc, target`,
      [couple.id, title || 'Custom Challenge', type || 'collab',
       reward || 50, desc || '', target || 5]
    );
    const ch = rows[0];
    await _pushActivity(req.user.id, `started a new challenge "${ch.title}"`);
    res.status(201).json({ ...ch, progress: { austin: 0, partner: 0, target: ch.target } });
  } catch (err) { next(err); }
});

// GET /challenges/:id
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT c.id, c.title, c.type, c.reward, c.description AS desc, c.target,
              cp.user_id, cp.value
       FROM challenges c
       LEFT JOIN challenge_progress cp ON cp.challenge_id = c.id
       WHERE c.id = $1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Challenge not found' });

    const ch = rows[0];
    const progress = { austin: 0, partner: 0, target: ch.target };
    rows.forEach(r => {
      if (r.user_id === req.user.id) progress.austin = r.value;
      else if (r.user_id) progress.partner = r.value;
    });
    res.json({ id: ch.id, title: ch.title, type: ch.type, reward: ch.reward, desc: ch.desc, progress });
  } catch (err) { next(err); }
});

module.exports = router;
