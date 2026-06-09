# FitTogether

**Couples fitness platform — gamified workouts, challenges, and streaks for two.**

Live demo → [fittogether-mauve.vercel.app](https://fittogether-mauve.vercel.app)

---

## Overview

FitTogether is a web app built for couples who want to train together, stay accountable, and make fitness competitive and fun. Partners share challenges, track streaks, log workouts, earn FitCoins, and compete in head-to-head side bets.

The current version is a fully functional frontend with mock data and localStorage persistence. A real backend (Node/Express + PostgreSQL) is the planned next phase.

---

## Features

### Public
- **Marketing landing page** — full 10-section site with hero, stats, feature breakdown, how it works, challenges preview, testimonials, pricing, and CTA
- **Auth** — Register and Login with localStorage-based sessions

### Onboarding
- 4-step flow: Welcome → Goals → Invite Partner → All Set
- Goal selection, partner email invite, progress bar

### App (authenticated)
| Route | View | Description |
|---|---|---|
| `/app` | Dashboard | Streak banner, partner cards, water + workout progress, FitCoins wallet, activity feed |
| `/app/workouts` | Workout Log | Logged workouts grouped by date, add workout modal (name, type, duration, notes) |
| `/app/challenges` | Challenges | Head-to-head and collaborative challenges, side bets/wagers with day-by-day progress |
| `/app/challenges/:id` | Challenge Detail | Individual challenge breakdown |
| `/app/rewards` | Rewards Store | Spend FitCoins to unlock real rewards |
| `/app/progress` | Progress | Bar chart (weekly workouts), area chart (daily steps), stat cards |
| `/app/profile` | Profile | Couple header, stats grid, data-driven achievement badges, avatar picker |
| `/app/settings` | Settings | Name, partner name, goals, notifications, units, sign out, reset |

### Gamification
- **FitCoins** — earned through challenge completions, spendable in the Rewards Store
- **Streaks** — couple streak counter displayed on Dashboard and Profile
- **Achievements** — badges computed from real activity (streak length, workout count, FitCoins balance, weight lost)
- **Side bets / Wagers** — set tangible stakes (e.g. "winner picks dinner"), track day-by-day step goals

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 7 |
| UI | MUI v7 (Material UI) + Emotion |
| Routing | React Router v7 |
| Data fetching | TanStack React Query v5 |
| Charts | Recharts |
| Animation | Framer Motion v12 |
| Dates | Day.js |
| IDs | UUID |
| Data layer | Mock API (`src/lib/mock.js`) with localStorage persistence |
| Deployment | Vercel (auto-deploy from GitHub `main`) |

### Brand Colors
| Name | Hex |
|---|---|
| Navy | `#0F172A` |
| Emerald | `#10B981` |
| Coral | `#FB7185` |
| Gold | `#F59E0B` |

---

## Project Structure

```
src/
├── lib/
│   ├── mock.js          # In-memory mock API with localStorage persistence
│   ├── dataSource.js    # API switch (mock vs real) via VITE_USE_MOCK env var
│   └── store.js         # localStorage helpers (auth session, onboarding, settings)
├── pages/
│   ├── Landing.jsx      # Full marketing landing page
│   ├── Login.jsx        # Login page
│   └── Register.jsx     # Registration page
├── views/
│   ├── Dashboard.jsx
│   ├── WorkoutLog.jsx
│   ├── Challenges.jsx
│   ├── ChallengeDetail.jsx
│   ├── Rewards.jsx
│   ├── Progress.jsx
│   ├── Profile.jsx
│   ├── Settings.jsx
│   └── Onboarding.jsx
├── ui/
│   ├── AppShell.jsx         # Top nav + bottom nav (5 tabs)
│   ├── LogModal.jsx         # Quick water/workout log modal
│   ├── ActivityFeed.jsx     # Live activity feed component
│   ├── AvatarPickerModal.jsx
│   ├── CreateChallengeModal.jsx
│   ├── CreateWagerModal.jsx
│   ├── ConfirmDialog.jsx
│   ├── Toast.jsx            # Toast notification provider
│   └── Page.jsx             # Page wrapper
├── theme.js             # MUI theme with brand colors
├── main.jsx             # App entry point + router
└── styles.css           # Global styles
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install & Run

```bash
git clone https://github.com/19awburris88/fittogether.git
cd fittogether
npm install
npm run dev
```

App runs at `http://localhost:5173`

### Build

```bash
npm run build
npm run preview
```

### Demo Account

A hardcoded demo account is always available:

| Field | Value |
|---|---|
| Email | `austin@fittogether.com` |
| Password | `admin123` |

---

## Data Layer

The data layer is designed to switch between mock and real API with a single environment variable:

```bash
# .env.local
VITE_USE_MOCK=false   # switch to real API (default: true)
```

All mock functions are in `src/lib/mock.js`. The `src/lib/dataSource.js` file exports a `ds` object that all views import — replacing the mock with a real API only requires implementing the same function signatures in a `realApi.js` file.

Mock state persists across page refreshes via `localStorage` under the key `ft_mock_state`.

---

## Deployment

Deployed on Vercel with automatic deployments from the `main` branch.

`vercel.json` rewrites all routes to `index.html` for client-side routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Roadmap

- [ ] **Real backend** — Node/Express + PostgreSQL + JWT auth
- [ ] **Partner linking** — invite code system to connect two real accounts
- [ ] **Live streak logic** — auto-increment/reset based on daily activity
- [ ] **Push notifications** — streak reminders, partner activity alerts
- [ ] **Apple Health / Google Fit integration** — auto-import workouts and steps
- [ ] **Custom domain**
