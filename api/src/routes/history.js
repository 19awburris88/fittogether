const router      = require('express').Router();
const db          = require('../db');
const requireAuth = require('../middleware/auth');

// GET /history — chart data for the Progress page
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Resolve partner
    const coupleRes = await db.query(
      `SELECT id, user1_id, user2_id, streak_days
       FROM couples WHERE user1_id = $1 OR user2_id = $1`,
      [userId]
    );
    const couple     = coupleRes.rows[0];
    const partnerId  = couple
      ? (couple.user1_id === userId ? couple.user2_id : couple.user1_id)
      : null;
    const streakDays = couple?.streak_days ?? 0;
    const userIds    = [userId, partnerId].filter(Boolean);

    // ── Weekly workout counts — last 8 ISO weeks ─────────────────────────
    const { rows: wkRows } = await db.query(
      `SELECT
         to_char(date_trunc('week', date::date), 'MM/DD') AS week,
         user_id,
         COUNT(*)::int AS cnt
       FROM workout_log
       WHERE date >= NOW() - INTERVAL '56 days'
         AND user_id = ANY($1)
       GROUP BY week, user_id
       ORDER BY week`,
      [userIds]
    );

    // Build week list (last 8 weeks)
    const weekKeys = [];
    for (let i = 7; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i * 7 - d.getDay());
      weekKeys.push(d.toISOString().slice(5, 10).replace('-', '/'));
    }

    const weeklyWorkouts = weekKeys.map((week) => {
      const me  = wkRows.find(r => r.week === week && r.user_id === userId);
      const par = wkRows.find(r => r.week === week && r.user_id === partnerId);
      return { week, austin: me?.cnt ?? 0, partner: par?.cnt ?? 0 };
    });

    // ── Daily steps — this week ───────────────────────────────────────────
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().slice(0, 10);
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const { rows: stepRows } = await db.query(
      `SELECT user_id, date, steps
       FROM daily_metrics
       WHERE date >= $1 AND user_id = ANY($2)
       ORDER BY date ASC`,
      [weekStartStr, userIds]
    );

    const dailySteps = DAYS.map((day, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const me  = stepRows.find(r => r.user_id === userId    && r.date?.toISOString?.().slice(0,10) === dateStr);
      const par = stepRows.find(r => r.user_id === partnerId && r.date?.toISOString?.().slice(0,10) === dateStr);
      return { day, austin: me?.steps ?? 0, partner: par?.steps ?? 0 };
    });

    // ── Streak history — derive from consecutive workout days ─────────────
    const { rows: allWorkouts } = await db.query(
      `SELECT DISTINCT date::date AS d FROM workout_log
       WHERE user_id = $1 ORDER BY d DESC LIMIT 90`,
      [userId]
    );

    // Build streak lengths over rolling window
    const streakHistory = [];
    let cur = 0;
    const dateSet = new Set(allWorkouts.map(r => r.d.toISOString?.().slice(0,10) ?? String(r.d)));
    for (let i = 89; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      if (dateSet.has(ds)) {
        cur++;
      } else {
        if (cur > 0) streakHistory.push(cur);
        cur = 0;
      }
    }
    if (cur > 0) streakHistory.push(cur);
    if (!streakHistory.length) streakHistory.push(0);

    res.json({ weeklyWorkouts, dailySteps, streakHistory, streakDays });
  } catch (err) { next(err); }
});

module.exports = router;
