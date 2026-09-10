-- =============================================================
-- Migration: Add priority_score and recommended_action columns
-- Table:     incidents
-- Run once against your PostgreSQL database.
-- Both columns are nullable so existing rows are unaffected.
-- =============================================================

ALTER TABLE incidents
    ADD COLUMN IF NOT EXISTS priority_score     INTEGER,   -- 0-100 calculated priority
    ADD COLUMN IF NOT EXISTS recommended_action TEXT;      -- human-readable action string
