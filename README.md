# FitTogether

**Couples fitness platform — gamified workouts, challenges, and streaks for two.**

Live → [fittogether-mauve.vercel.app](https://fittogether-mauve.vercel.app)

---

## Overview

FitTogether is a web app built for couples who want to train together, stay accountable, and make fitness competitive and fun. Partners share challenges, track streaks, log workouts, earn FitCoins, and compete in head-to-head side bets.

The app runs on a real Node/Express + PostgreSQL backend (hosted on Railway) with JWT authentication, live data, and Web Push notifications.

---

## Features

### Public
- **Marketing landing page** — 10-section site with hero, stats, features, how it works, challenges preview, testimonials, pricing, and CTA
- **Auth** — Register and Login with JWT sessions (real database, bcrypt-hashed passwords)

### Onboarding
- 4-step flow: Welcome → Goals → Invite Partner → All Set
- Partner invite: generate a 6-character code or join with a partner's code

### App (authenticated)
| Route | View | Description |
|---|---|---|
| `/app` | Dashboard | Streak banner, partner cards, water + workout progress, FitCoins wallet, activity feed |
| `/app/workouts` | Workout Log | Logged workouts grouped by date, add workout modal (name, type, duration, notes) |
| `/app/challenges` | Challenges | Head-to-head and collaborative challenges, side bets/wagers with day-by-day progress |
| `/app/challenges/:id` | Challenge Detail | Individual challenge breakdown |
| `/app/rewards` | Rewards Store | Spend FitCoins to unlock real rewards |
| `/app/progress` | Progress | Bar chart (weekly workouts), area chart (daily steps), stat cards |
| `/app/profile` | Profile | Couple header, stats grid, achievement badges, avatar picker |
| `/app/settings` | Settings | Name, partner name, goals, notifications, units, sign out |

### Gamification
- **FitCoins** — +10 per workout logged, +5 when hitting 8 glasses of water; spendable in the Rewards Store
- **Couple streaks** — auto-increments on daily activity, resets if a day is missed
- **Achievements** — badges computed from real activity (streak length, workout count, FitCoins balance)
- **Side bets / Wagers** — set tangible stakes (e.g. "winner picks dinner"), track day-by-day step goals

### Notifications
- Web Push notifications when your partner logs a workout
- Service worker at `public/sw.js`, VAPID key-based subscription

---

## Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 7 |
| UI | MUI v7 (Material UI) + Emotion |
| Routing | React Router v7 |
| Data fetching | TanStack React Query v5 |
| Charts | Recharts |
| Animation | Framer Motion v12 |
| Deployment | Vercel (auto-deploy from `main`) |

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js + Express |
| Database | PostgreSQL (via `pg`) |
| Auth | JWT (`jsonwebtoken`) + bcryptjs |
| Push | Web Push (`web-push`, VAPID) |
| Deployment | Railway |

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
fittogether/
├── src/                         # React frontend
│   ├── lib/
│   │   ├── mock.js              # In-memory mock API (dev/offline)
│   │   ├── realApi.js           # Fetch-based real API client
│   │   ├── dataSource.js        # Switches mock ↔ real via VITE_USE_MOCK
│   │   ├── usePush.js           # Web Push subscription hook
│   │   └── store.js             # localStorage helpers
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── views/
│   │   ├── Dashboard.jsx
│   │   ├── WorkoutLog.jsx
│   │   ├── Challenges.jsx
│   │   ├── Rewards.jsx
│   │   ├── Progress.jsx
│   │   ├── Profile.jsx
│   │   ├── Settings.jsx
│   │   └── Onboarding.jsx
│   ├── ui/                      # Shared components
│   └── main.jsx
├── public/
│   └── sw.js                    # Service worker (push notifications)
├── api/                         # Node/Express backend (deployed to Railway)
│   ├── src/
│   │   ├── index.js             # Express app entry point
│   │   ├── db.js                # PostgreSQL pool
│   │   ├── lib/
│   │   │   └── coins.js         # FitCoins + streak logic
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT middleware
│   │   └── routes/
│   │       ├── auth.js          # POST /auth/register, /auth/login
│   │       ├── couples.js       # Partner invite + join
│   │       ├── dashboard.js     # GET /dashboard
│   │       ├── workouts.js      # Workout log CRUD
│   │       ├── challenges.js    # Challenges
│   │       ├── wagers.js        # Side bets
│   │       ├── rewards.js       # Rewards store + redemption
│   │       ├── activity.js      # Activity feed
│   │       ├── history.js       # Chart data (weekly workouts, steps, streaks)
│   │       ├── log.js           # Water + steps logging
│   │       ├── push.js          # Web Push subscriptions
│   │       └── me.js            # Profile updates
│   ├── schema.sql               # Full database schema
│   └── package.json
└── vercel.json                  # SPA rewrite rules
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL (local) or a Railway Postgres instance

### Frontend

```bash
git clone https://github.com/19awburris88/fittogether.git
cd fittogether
npm install
npm run dev
```

Create a `.env.local`:
```bash
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:3001
VITE_VAPID_PUBLIC_KEY=<your_vapid_public_key>
```

### Backend

```bash
cd api
npm install
```

Create `api/.env`:
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/fittogether
JWT_SECRET=your_secret_here
FRONTEND_URL=http://localhost:5173
VAPID_PUBLIC_KEY=<your_vapid_public_key>
VAPID_PRIVATE_KEY=<your_vapid_private_key>
VAPID_EMAIL=you@example.com
```

Run the schema:
```bash
psql $DATABASE_URL -f api/schema.sql
```

Start the API:
```bash
npm run dev   # nodemon, port 3001
```

### Generate VAPID keys
```bash
cd api && node -e "const wp=require('web-push'); const k=wp.generateVAPIDKeys(); console.log(k)"
```

---

## Deployment

| Service | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Auto-deploys from `main`; `api/` is excluded via `.vercelignore` |
| Backend API | Railway | Start command: `node api/src/index.js` |
| Database | Railway PostgreSQL | `DATABASE_URL` linked as a variable reference |

### Required Railway env vars
```
DATABASE_URL        (linked from Postgres service)
JWT_SECRET
FRONTEND_URL        (your Vercel URL)
PORT                3001
VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY
VAPID_EMAIL
```

### Required Vercel env vars
```
VITE_USE_MOCK       false
VITE_API_URL        https://your-railway-api-url.railway.app
VITE_VAPID_PUBLIC_KEY
```

---

## Roadmap

- [ ] Apple Health / Google Fit integration — auto-import workouts and steps
- [ ] Custom domain (fittogether.dev)
- [ ] Mobile app (React Native)
