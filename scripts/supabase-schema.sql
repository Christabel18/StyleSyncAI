-- StyleSync AI — Supabase Schema
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard → your project → SQL Editor

-- ─── Users ───────────────────────────────────────────────────────────────────
-- No auth. A UUID is generated server-side and stored in the client's localStorage.

CREATE TABLE IF NOT EXISTS users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  style_vibe   TEXT NOT NULL,
  assistant    TEXT NOT NULL DEFAULT 'Nova',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Outfits ──────────────────────────────────────────────────────────────────
-- One row per uploaded + analyzed outfit.

CREATE TABLE IF NOT EXISTS outfits (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url          TEXT,
  tags               JSONB NOT NULL DEFAULT '[]',
  colors             JSONB NOT NULL DEFAULT '[]',
  score              INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  recommendations    JSONB NOT NULL DEFAULT '[]',
  assistant_message  TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS outfits_user_id_idx ON outfits(user_id);
CREATE INDEX IF NOT EXISTS outfits_created_at_idx ON outfits(created_at DESC);

-- ─── Style Memory ─────────────────────────────────────────────────────────────
-- Aggregated per-user stats. Upserted every time a new outfit is saved.

CREATE TABLE IF NOT EXISTS style_memory (
  user_id        UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_outfits  INTEGER NOT NULL DEFAULT 0,
  avg_score      NUMERIC(5, 2) NOT NULL DEFAULT 0,
  top_colors     TEXT[] NOT NULL DEFAULT '{}',
  top_items      TEXT[] NOT NULL DEFAULT '{}',
  style_trend    TEXT NOT NULL DEFAULT 'exploring'
                   CHECK (style_trend IN ('improving', 'consistent', 'exploring')),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- Using anon key (no auth for MVP). All operations allowed.

ALTER TABLE users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfits      ENABLE ROW LEVEL SECURITY;
ALTER TABLE style_memory ENABLE ROW LEVEL SECURITY;

-- Drop policies first so this script is re-runnable
DROP POLICY IF EXISTS "Allow all on users"        ON users;
DROP POLICY IF EXISTS "Allow all on outfits"      ON outfits;
DROP POLICY IF EXISTS "Allow all on style_memory" ON style_memory;

CREATE POLICY "Allow all on users"        ON users        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on outfits"      ON outfits      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on style_memory" ON style_memory FOR ALL USING (true) WITH CHECK (true);
