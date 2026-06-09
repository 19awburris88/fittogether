-- FitTogether Database Schema
-- Run this against a fresh PostgreSQL database to initialize all tables.

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT        NOT NULL,
  email         TEXT        UNIQUE NOT NULL,
  password_hash TEXT        NOT NULL,
  avatar        TEXT        DEFAULT '🙂',
  level         INT         DEFAULT 1,
  lbs_lost      NUMERIC(6,1) DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Couples ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS couples (
  id                 UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id           UUID  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user2_id           UUID  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  streak_days        INT   DEFAULT 0,
  last_activity_date DATE,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- ─── Couple invite codes ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS couple_invites (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT        UNIQUE NOT NULL,
  inviter_id  UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  accepted    BOOLEAN     DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  expires_at  TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

-- ─── Wallets (FitCoins) ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wallets (
  user_id  UUID  PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  coins    INT   DEFAULT 0
);

-- ─── Daily metrics (water + steps) ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS daily_metrics (
  id             UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date           DATE  NOT NULL DEFAULT CURRENT_DATE,
  water_glasses  INT   DEFAULT 0,
  steps          INT   DEFAULT 0,
  UNIQUE(user_id, date)
);

-- ─── Workout log ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workout_log (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date             DATE        NOT NULL DEFAULT CURRENT_DATE,
  name             TEXT        NOT NULL,
  type             TEXT        NOT NULL DEFAULT 'other',
  duration_minutes INT         NOT NULL DEFAULT 30,
  notes            TEXT        DEFAULT '',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Challenges ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS challenges (
  id         UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id  UUID  NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  title      TEXT  NOT NULL,
  type       TEXT  NOT NULL DEFAULT 'collab',
  reward     INT   DEFAULT 50,
  description TEXT DEFAULT '',
  target     INT   DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS challenge_progress (
  id            UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id  UUID  NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id       UUID  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  value         INT   DEFAULT 0,
  UNIQUE(challenge_id, user_id)
);

-- ─── Wagers (side bets) ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wagers (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id       UUID        NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  title           TEXT        NOT NULL,
  per_day_target  INT         DEFAULT 12000,
  days            INT         DEFAULT 7,
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  status          TEXT        DEFAULT 'ongoing',
  stake_user1     TEXT        DEFAULT '',
  stake_user2     TEXT        DEFAULT ''
);

CREATE TABLE IF NOT EXISTS wager_progress (
  id         UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  wager_id   UUID     NOT NULL REFERENCES wagers(id) ON DELETE CASCADE,
  user_id    UUID     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_index  INT      NOT NULL,
  met        BOOLEAN  DEFAULT FALSE,
  UNIQUE(wager_id, user_id, day_index)
);

-- ─── Rewards catalog ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rewards (
  id    TEXT  PRIMARY KEY,
  title TEXT  NOT NULL,
  cost  INT   NOT NULL
);

CREATE TABLE IF NOT EXISTS reward_redemptions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_id    TEXT        NOT NULL REFERENCES rewards(id),
  redeemed_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, reward_id)
);

-- ─── Activity feed ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_feed (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id  UUID        NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text       TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Seed data ────────────────────────────────────────────────────────────────
INSERT INTO rewards (id, title, cost) VALUES
  ('badge1', 'Dynamic Duo Badge',            100),
  ('skin1',  'Avatar Outfit: Teal Runner',   250),
  ('perk1',  '10% Off Healthy Meal Partner', 300)
ON CONFLICT (id) DO NOTHING;
