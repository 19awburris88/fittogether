const KEY = "ft_onboarding";
const SETTINGS_KEY = "ft_settings";
const SESSION_KEY = "ft_session";
const USERS_KEY = "ft_users";

// --- Auth ---
export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

const ADMIN_USER = { id: "admin", name: "Austin", email: "austin@fittogether.com", password: "admin123" };

function getUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  const stored = raw ? JSON.parse(raw) : [];
  // Always include the hardcoded admin account
  const hasAdmin = stored.some((u) => u.id === ADMIN_USER.id);
  return hasAdmin ? stored : [ADMIN_USER, ...stored];
}

export function registerUser(name, email, password) {
  const users = getUsers();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("An account with this email already exists");
  }
  const user = { id: Math.random().toString(36).slice(2), name, email, password };
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  const session = { id: user.id, name: user.name, email: user.email };
  setSession(session);
  return session;
}

export function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) throw new Error("Invalid email or password");
  const session = { id: user.id, name: user.name, email: user.email };
  setSession(session);
  return session;
}

export function getOnboarding() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : { finished:false, userId:null, coupleId:null, goals:[] };
}
export function setOnboarding(patch) {
  const cur = getOnboarding();
  const next = { ...cur, ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
export function resetOnboarding() {
  localStorage.removeItem(KEY);
}

// --- Settings ---
export function getSettings() {
  const raw = localStorage.getItem(SETTINGS_KEY);
  return raw ? JSON.parse(raw) : {
    name: "Austin",
    partnerName: "",
    notifications: { water: true, workouts: true, streaks: true },
    units: { weight: "lb", distance: "mi" },
    goals: ["consistency","hydrate"],
  };
}
export function setSettings(patch) {
  const cur = getSettings();
  const next = { ...cur, ...patch };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  return next;
}
export function resetAllData() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(SETTINGS_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem("ft_mock_state");
}
