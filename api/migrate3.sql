-- Migration: add push_subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint     TEXT        NOT NULL,
  subscription JSONB       NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);
