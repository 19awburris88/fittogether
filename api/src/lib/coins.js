const db = require('../db');

const COINS_PER_WORKOUT = 10;
const COINS_WATER_GOAL  = 5;
const WATER_GOAL        = 8;

async function addCoins(userId, amount) {
  await db.query(
    'UPDATE wallets SET coins = coins + $1 WHERE user_id = $2',
    [amount, userId]
  );
}

async function updateCoupleStreak(userId) {
  const today     = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  const { rows } = await db.query(
    'SELECT id, streak_days, last_activity_date FROM couples WHERE user1_id = $1 OR user2_id = $1',
    [userId]
  );
  if (!rows.length) return 0;

  const couple = rows[0];
  const last   = couple.last_activity_date
    ? new Date(couple.last_activity_date).toISOString().slice(0, 10)
    : null;

  if (last === today) return couple.streak_days;

  const newStreak = last === yesterday ? couple.streak_days + 1 : 1;
  await db.query(
    'UPDATE couples SET streak_days = $1, last_activity_date = $2 WHERE id = $3',
    [newStreak, today, couple.id]
  );
  return newStreak;
}

module.exports = { addCoins, updateCoupleStreak, COINS_PER_WORKOUT, COINS_WATER_GOAL, WATER_GOAL };
