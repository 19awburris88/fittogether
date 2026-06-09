// Real API client — mirrors every ds.* method from mock.js.
// Set VITE_API_URL and VITE_USE_MOCK=false in .env to activate.

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function token() {
  try { return JSON.parse(localStorage.getItem('ft_session'))?.token; } catch { return null; }
}

async function req(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const t = token();
  if (t) headers['Authorization'] = `Bearer ${t}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'API error');
  }
  return res.json();
}

const get  = (path)        => req('GET',  path);
const post = (path, body)  => req('POST', path, body);
const put  = (path, body)  => req('PUT',  path, body);

// ── Dashboard / metrics ────────────────────────────────────────────────────

export async function getDashboard() {
  return get('/dashboard');
}

export async function addWater({ userId, glasses }) {
  return post('/log/water', { userId, glasses });
}

export async function logWorkout({ name, type, duration, notes }) {
  return post('/workouts', { name, type, duration, notes });
}

// ── Challenges ─────────────────────────────────────────────────────────────

export async function getChallenges() {
  return get('/challenges');
}

export async function createChallenge(data) {
  return post('/challenges', data);
}

// ── Wagers ─────────────────────────────────────────────────────────────────

export async function getWagers() {
  return get('/wagers');
}

export async function createWager(data) {
  return post('/wagers', data);
}

export async function markStepsForDay({ wagerId, value }) {
  return post(`/wagers/${wagerId}/progress`, { value });
}

// ── Rewards ────────────────────────────────────────────────────────────────

export async function getRewards() {
  return get('/rewards');
}

export async function redeemReward(id) {
  return post(`/rewards/${id}/redeem`);
}

// ── Workout log ───────────────────────────────────────────────────────────

export async function getWorkoutLog() {
  return get('/workouts');
}

export async function addWorkoutEntry({ name, type, duration, notes }) {
  return post('/workouts', { name, type, duration, notes });
}

// ── Progress / history ────────────────────────────────────────────────────

export async function getHistory() {
  return get('/history');
}

// ── Activity feed ─────────────────────────────────────────────────────────

export async function getActivity() {
  return get('/activity');
}

// ── Profile / avatar ──────────────────────────────────────────────────────

export async function setAvatar(avatar) {
  return put('/me', { avatar });
}

// ── Couple invite / join ──────────────────────────────────────────────────

export async function invitePartner() {
  return post('/couples/invite');
}

export async function joinCouple(code) {
  return post('/couples/join', { code });
}

// ── Auth helpers (used by Login/Register pages directly) ──────────────────

export async function authLogin(email, password) {
  return post('/auth/login', { email, password });
}

export async function authRegister(name, email, password) {
  return post('/auth/register', { name, email, password });
}

// ── Push notifications ────────────────────────────────────────────────────

export async function subscribePush(subscription) {
  return post('/push/subscribe', { subscription });
}
