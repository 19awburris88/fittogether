const wait = (ms = 150) => new Promise((r) => setTimeout(r, ms));

const STATE_KEY = "ft_mock_state";

const DEFAULT_STATE = {
  couple: {
    streakDays: 12,
    members: [
      { id: "austin",  name: "Austin",  level: 5, lbsLost: 15, avatar: "🟦" },
      { id: "partner", name: "Partner", level: 4, lbsLost: 10, avatar: "🟣" },
    ],
  },
  today: { waterAustin: 6, waterPartner: 8, targetWater: 8 },
  week:  { workoutsAustin: 3, workoutsPartner: 4, targetWorkouts: 5 },
  steps: {
    austin:       [12000, 9000, 13250, 12100, 8400, 0, 0],
    partner:      [12500, 10050, 9000, 14000, 12000, 0, 0],
    perDayTarget: 12000,
  },
  wagers: [
    {
      id: "w1",
      title: "12k Steps x 7 Days",
      type: "both_meet",
      metric: "steps",
      perDayTarget: 12000,
      days: 7,
      startedAt: Date.now(),
      stakes: {
        if_partner_wins: "New walking shoes",
        if_austin_wins:  "Next date paid by partner",
      },
      progress: {
        austin:  [true, false, true, true, false, false, false],
        partner: [true, true,  false, true, true,  false, false],
      },
      status: "ongoing",
    },
  ],
  wallet: { coins: 320 },
  challenges: [
    {
      id: "water",
      title: "Water Wars (Daily)",
      type: "head_to_head",
      reward: 50,
      desc: "Hit 8 cups. Bonus if you beat your partner.",
      progress: { austin: 6, partner: 8, target: 8 },
    },
    {
      id: "sync",
      title: "Workout Sync (Weekly)",
      type: "collab",
      reward: 150,
      desc: "Both complete 5+ workouts this week.",
      progress: { austin: 3, partner: 4, target: 5 },
    },
  ],
  rewards: [
    { id: "badge1", title: "Dynamic Duo Badge",            cost: 100, redeemed: false },
    { id: "skin1",  title: "Avatar Outfit: Teal Runner",   cost: 250, redeemed: false },
    { id: "perk1",  title: "10% Off Healthy Meal Partner", cost: 300, redeemed: false },
  ],
  activity: [
    { id: "a1", ts: Date.now() - 1000 * 60 * 30, who: "Austin",  text: "logged 2 glasses of water" },
    { id: "a2", ts: Date.now() - 1000 * 60 * 60, who: "Partner", text: "finished a 20-min workout" },
  ],
  workoutLog: [
    { id: "wl1", userId: "austin",  date: "2026-06-08", name: "Morning Run",  type: "cardio",      duration: 30, notes: "" },
    { id: "wl2", userId: "austin",  date: "2026-06-07", name: "Upper Body",   type: "strength",    duration: 45, notes: "Felt strong today" },
    { id: "wl3", userId: "partner", date: "2026-06-07", name: "Yoga Flow",    type: "flexibility", duration: 40, notes: "" },
    { id: "wl4", userId: "austin",  date: "2026-06-05", name: "HIIT Cardio",  type: "cardio",      duration: 25, notes: "" },
    { id: "wl5", userId: "partner", date: "2026-06-05", name: "Leg Day",      type: "strength",    duration: 50, notes: "" },
    { id: "wl6", userId: "austin",  date: "2026-06-03", name: "Core & Abs",   type: "strength",    duration: 20, notes: "" },
  ],
  history: {
    weeklyWorkouts: [
      { week: "Apr 21", austin: 3, partner: 2 },
      { week: "Apr 28", austin: 4, partner: 4 },
      { week: "May 5",  austin: 2, partner: 3 },
      { week: "May 12", austin: 5, partner: 4 },
      { week: "May 19", austin: 3, partner: 5 },
      { week: "May 26", austin: 4, partner: 3 },
      { week: "Jun 2",  austin: 4, partner: 4 },
      { week: "Jun 9",  austin: 3, partner: 4 },
    ],
    dailySteps: [
      { day: "Mon", austin: 12000, partner: 12500 },
      { day: "Tue", austin: 9000,  partner: 10050 },
      { day: "Wed", austin: 13250, partner: 9000  },
      { day: "Thu", austin: 12100, partner: 14000 },
      { day: "Fri", austin: 8400,  partner: 12000 },
      { day: "Sat", austin: 0,     partner: 0     },
      { day: "Sun", austin: 0,     partner: 0     },
    ],
    streakHistory: [5, 7, 3, 9, 6, 10, 12],
  },
};

// --- persistence ---

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function persist() {
  try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch {}
}

let state = loadInitialState();

// --- internal helpers ---

function myName()      { return state.couple.members[0].name; }
function partnerName() { return state.couple.members[1].name; }
function whoName(user) { return user === "austin" ? myName() : partnerName(); }

function pushActivity(text, who) {
  state.activity.unshift({ id: Math.random().toString(36).slice(2), ts: Date.now(), who, text });
  state.activity = state.activity.slice(0, 30);
}

function clampIndex(i) { return Math.max(0, Math.min(6, i | 0)); }

function recomputeWagerStatus(w) {
  const done =
    w.progress.austin.length >= w.days &&
    w.progress.partner.length >= w.days &&
    !w.progress.austin.includes(undefined) &&
    !w.progress.partner.includes(undefined);
  if (!done) return "ongoing";
  const aScore = w.progress.austin.filter(Boolean).length;
  const pScore = w.progress.partner.filter(Boolean).length;
  if (aScore > pScore) return "austin_won";
  if (pScore > aScore) return "partner_won";
  return "no_winner";
}

// Sync display names from auth/settings into the live state object
function syncNames() {
  try {
    const s   = localStorage.getItem("ft_settings");
    const ob  = localStorage.getItem("ft_onboarding");
    const ses = localStorage.getItem("ft_session");
    const settings   = s   ? JSON.parse(s)   : null;
    const onboarding = ob  ? JSON.parse(ob)  : null;
    const session    = ses ? JSON.parse(ses) : null;

    const name = settings?.name || onboarding?.name || session?.name;
    if (name) state.couple.members[0].name = name;

    const pName = settings?.partnerName;
    if (pName) state.couple.members[1].name = pName;
  } catch {}
}

// --- exported "API" ---

export async function getDashboard() {
  await wait();
  syncNames();
  return state;
}

export async function addWater(user = "austin", count = 1) {
  await wait(80);
  for (let i = 0; i < count; i++) {
    if (user === "austin") {
      state.today.waterAustin++;
      if (state.challenges[0]) state.challenges[0].progress.austin++;
    } else {
      state.today.waterPartner++;
      if (state.challenges[0]) state.challenges[0].progress.partner++;
    }
  }
  pushActivity(`logged ${count} glass${count > 1 ? "es" : ""} of water`, whoName(user));
  persist();
  return state;
}

export async function logWorkout(user = "austin", minutes = 20) {
  await wait(40);
  if (user === "austin") {
    state.week.workoutsAustin++;
    if (state.challenges[1]) state.challenges[1].progress.austin++;
  } else {
    state.week.workoutsPartner++;
    if (state.challenges[1]) state.challenges[1].progress.partner++;
  }
  // Write to Log view so both paths stay in sync
  state.workoutLog.unshift({
    id:       Math.random().toString(36).slice(2, 7),
    userId:   user,
    date:     new Date().toISOString().slice(0, 10),
    name:     `${minutes}-min Workout`,
    type:     "other",
    duration: minutes,
    notes:    "",
  });
  pushActivity(`completed a ${minutes}-min workout`, whoName(user));
  persist();
  return state;
}

export async function getChallenges() {
  await wait();
  return state.challenges;
}

export async function getRewards() {
  await wait();
  return state.rewards;
}

export async function getActivity() {
  await wait(60);
  return state.activity;
}

export async function createChallenge({ title, type, target, reward, desc }) {
  await wait(120);
  const id = Math.random().toString(36).slice(2, 7);
  state.challenges.unshift({
    id,
    title:   title || "Custom Challenge",
    type:    type  || "collab",
    reward:  Number(reward) || 50,
    desc:    desc || (type === "collab" ? "Work together to hit the target." : "Beat your partner today."),
    progress: { austin: 0, partner: 0, target: Number(target) || 5 },
  });
  pushActivity(`started a new challenge "${title || "Custom Challenge"}"`, myName());
  persist();
  return state.challenges[0];
}

export async function setAvatar(user = "austin", emoji) {
  await wait(40);
  const m = state.couple.members.find((x) => x.id === user);
  if (m) m.avatar = emoji;
  persist();
  return m;
}

// --- rewards ---

export async function redeemReward(id) {
  await wait(120);
  const r = state.rewards.find((r) => r.id === id);
  if (!r)          throw new Error("Reward not found");
  if (r.redeemed)  throw new Error("Already redeemed");
  if (state.wallet.coins < r.cost) throw new Error("Not enough FitCoins");
  state.wallet.coins -= r.cost;
  r.redeemed = true;
  pushActivity(`unlocked "${r.title}"`, myName());
  persist();
  return { reward: r, balance: state.wallet.coins };
}

// --- wagers / side bets ---

export async function getWagers() {
  await wait(60);
  return state.wagers;
}

export async function createWager(payload) {
  await wait(40);
  const id          = Math.random().toString(36).slice(2, 7);
  const days        = Number(payload.days) || 7;
  const perDayTarget = Number(payload.perDayTarget) || state.steps.perDayTarget || 12000;
  const w = {
    id, days, perDayTarget,
    title:     payload.title || "Custom Side Bet",
    type:      payload.type  || "both_meet",
    metric:    "steps",
    startedAt: Date.now(),
    stakes: {
      if_partner_wins: payload.stakes?.partner || "Partner reward",
      if_austin_wins:  payload.stakes?.austin  || "Austin reward",
    },
    progress: { austin: Array(days).fill(false), partner: Array(days).fill(false) },
    status: "ongoing",
  };
  state.wagers.unshift(w);
  pushActivity(`created side bet "${w.title}"`, myName());
  persist();
  return w;
}

export async function markStepsForDay(user = "austin", dayIndex, steps) {
  await wait(60);
  const d = clampIndex(dayIndex);
  if (user === "austin") state.steps.austin[d]  = steps;
  else                   state.steps.partner[d] = steps;

  state.wagers.forEach((w) => {
    if (w.metric !== "steps" || w.status !== "ongoing") return;
    const met = steps >= (w.perDayTarget || state.steps.perDayTarget);
    if (user === "austin") w.progress.austin[d]  = met;
    else                   w.progress.partner[d] = met;
    w.status = recomputeWagerStatus(w);
  });

  pushActivity(`updated steps for Day ${d + 1} (${Number(steps).toLocaleString()} steps)`, whoName(user));
  persist();
  return state;
}

// --- workout log ---

export async function getWorkoutLog() {
  await wait();
  return [...state.workoutLog];
}

export async function addWorkoutEntry({ name, type, duration, notes }) {
  await wait(40);
  const entry = {
    id:       Math.random().toString(36).slice(2, 7),
    userId:   "austin",
    date:     new Date().toISOString().slice(0, 10),
    name:     name     || "Workout",
    type:     type     || "strength",
    duration: Number(duration) || 30,
    notes:    notes    || "",
  };
  state.workoutLog.unshift(entry);
  state.week.workoutsAustin++;
  if (state.challenges[1]) state.challenges[1].progress.austin++;
  pushActivity(`logged a ${entry.duration}-min ${entry.name}`, myName());
  persist();
  return entry;
}

// --- history / progress charts ---

export async function getHistory() {
  await wait(80);
  return state.history;
}

// --- reset ---

export function resetMockState() {
  localStorage.removeItem(STATE_KEY);
  state = JSON.parse(JSON.stringify(DEFAULT_STATE));
}
