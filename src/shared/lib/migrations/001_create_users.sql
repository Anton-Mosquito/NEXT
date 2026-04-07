-- Migration 001: Create users table
-- Run via: npm run db:migrate

CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100)        NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

-- Seed some initial rows for development
INSERT INTO users (name, email) VALUES
  ('Alice Johnson',  'alice@example.com'),
  ('Bob Smith',      'bob@example.com'),
  ('Carol Williams', 'carol@example.com')
ON CONFLICT (email) DO NOTHING;
