const router      = require('express').Router();
const db          = require('../db');
const requireAuth = require('../middleware/auth');
const { _pushActivity } = require('./workouts');

// GET /rewards
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { rows: redemptions } = await db.query(
      'SELECT reward_id FROM reward_redemptions WHERE user_id = $1',
      [req.user.id]
    );
    const redeemedIds = new Set(redemptions.map(r => r.reward_id));

    const { rows } = await db.query(
      'SELECT id, title, description, cost, emoji FROM rewards ORDER BY cost ASC'
    );

    res.json(rows.map(r => ({ ...r, redeemed: redeemedIds.has(r.id) })));
  } catch (err) { next(err); }
});

// POST /rewards/:id/redeem
router.post('/:id/redeem', requireAuth, async (req, res, next) => {
  try {
    const rewardId = req.params.id;

    // Check already redeemed
    const alreadyRes = await db.query(
      'SELECT id FROM reward_redemptions WHERE user_id = $1 AND reward_id = $2',
      [req.user.id, rewardId]
    );
    if (alreadyRes.rows.length) {
      return res.status(400).json({ error: 'Already redeemed' });
    }

    // Get reward cost
    const rewardRes = await db.query('SELECT id, title, cost FROM rewards WHERE id = $1', [rewardId]);
    if (!rewardRes.rows.length) return res.status(404).json({ error: 'Reward not found' });
    const reward = rewardRes.rows[0];

    // Get wallet balance
    const walletRes = await db.query('SELECT coins FROM wallets WHERE user_id = $1', [req.user.id]);
    if (!walletRes.rows.length) return res.status(400).json({ error: 'No wallet found' });
    const coins = walletRes.rows[0].coins;

    if (coins < reward.cost) {
      return res.status(402).json({ error: `Not enough FitCoins — need ${reward.cost}, have ${coins}` });
    }

    // Deduct coins + record redemption in a transaction
    await db.query('BEGIN');
    await db.query(
      'UPDATE wallets SET coins = coins - $1 WHERE user_id = $2',
      [reward.cost, req.user.id]
    );
    await db.query(
      'INSERT INTO reward_redemptions (user_id, reward_id) VALUES ($1, $2)',
      [req.user.id, rewardId]
    );
    await db.query('COMMIT');

    await _pushActivity(req.user.id, `redeemed "${reward.title}" for ${reward.cost} FitCoins`);

    const newBalance = coins - reward.cost;
    res.json({ success: true, coins: newBalance });
  } catch (err) {
    await db.query('ROLLBACK').catch(() => {});
    next(err);
  }
});

module.exports = router;
