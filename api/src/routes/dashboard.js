const router      = require('express').Router();
const db          = require('../db');
const requireAuth = require('../middleware/auth');

// GET /dashboard
// Returns the combined payload the frontend expects.
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. User + partner info via couple
    const coupleRes = await db.query(
      `SELECT c.id AS couple_id, c.streak_days,
              u1.id AS u1_id, u1.name AS u1_name, u1.avatar AS u1_avatar,
              u1.level AS u1_level, u1.lbs_lost AS u1_lbs_lost,
              u2.id AS u2_id, u2.name AS u2_name, u2.avatar AS u2_avatar,
              u2.level AS u2_level, u2.lbs_lost AS u2_lbs_lost
       FROM couples c
       JOIN users u1 ON u1.id = c.user1_id
       JOIN users u2 ON u2.id = c.user2_id
       WHERE c.user1_id = $1 OR c.user2_id = $1`,
      [userId]
    );

    // 2. My own user row (for solo / pre-couple mode)
    const meRes = await db.query(
      'SELECT id, name, avatar, level, lbs_lost FROM users WHERE id = $1',
      [userId]
    );
    const me = meRes.rows[0];

    // Build members array: always put the authenticated user first
    let members, streakDays = 0, coupleId = null;
    if (coupleRes.rows.length) {
      const c = coupleRes.rows[0];
      coupleId  = c.couple_id;
      streakDays = c.streak_days;
      const iUser1 = c.u1_id === userId;
      members = [
        { id: iUser1 ? c.u1_id : c.u2_id, name: iUser1 ? c.u1_name : c.u2_name,
          level: iUser1 ? c.u1_level : c.u2_level, lbsLost: iUser1 ? Number(c.u1_lbs_lost) : Number(c.u2_lbs_lost),
          avatar: iUser1 ? c.u1_avatar : c.u2_avatar },
        { id: iUser1 ? c.u2_id : c.u1_id, name: iUser1 ? c.u2_name : c.u1_name,
          level: iUser1 ? c.u2_level : c.u1_level, lbsLost: iUser1 ? Number(c.u2_lbs_lost) : Number(c.u1_lbs_lost),
          avatar: iUser1 ? c.u2_avatar : c.u1_avatar },
      ];
    } else {
      members = [
        { id: me.id, name: me.name, level: me.level, lbsLost: Number(me.lbs_lost), avatar: me.avatar },
        { id: null,  name: 'Invite Partner', level: 1, lbsLost: 0, avatar: '❓' },
      ];
    }

    const partnerId = members[1].id;

    // 3. Today's water for both users
    const today = new Date().toISOString().slice(0, 10);
    const waterRes = await db.query(
      `SELECT user_id, water_glasses FROM daily_metrics WHERE date = $1 AND user_id = ANY($2)`,
      [today, [userId, partnerId].filter(Boolean)]
    );
    const waterMap = Object.fromEntries(waterRes.rows.map(r => [r.user_id, r.water_glasses]));

    // 4. This week's workout counts
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().slice(0, 10);
    const workoutRes = await db.query(
      `SELECT user_id, COUNT(*)::int AS count FROM workout_log
       WHERE date >= $1 AND user_id = ANY($2)
       GROUP BY user_id`,
      [weekStartStr, [userId, partnerId].filter(Boolean)]
    );
    const workoutMap = Object.fromEntries(workoutRes.rows.map(r => [r.user_id, r.count]));

    // 5. Wallet
    const walletRes = await db.query('SELECT coins FROM wallets WHERE user_id = $1', [userId]);
    const coins = walletRes.rows[0]?.coins ?? 0;

    // 6. Steps this week (7-day window)
    const stepsRes = await db.query(
      `SELECT user_id, steps FROM daily_metrics
       WHERE date >= $1 AND user_id = ANY($2)
       ORDER BY date ASC`,
      [weekStartStr, [userId, partnerId].filter(Boolean)]
    );
    const buildSteps = (uid) => {
      const rows = stepsRes.rows.filter(r => r.user_id === uid);
      const arr = Array(7).fill(0);
      rows.forEach((r, i) => { if (i < 7) arr[i] = r.steps; });
      return arr;
    };

    res.json({
      couple: { streakDays, members },
      coupleId,
      today: {
        waterAustin:  waterMap[userId]    ?? 0,
        waterPartner: waterMap[partnerId] ?? 0,
        targetWater: 8,
      },
      week: {
        workoutsAustin:  workoutMap[userId]    ?? 0,
        workoutsPartner: workoutMap[partnerId] ?? 0,
        targetWorkouts: 5,
      },
      steps: {
        austin:       buildSteps(userId),
        partner:      buildSteps(partnerId),
        perDayTarget: 12000,
      },
      wallet: { coins },
    });
  } catch (err) { next(err); }
});

module.exports = router;
