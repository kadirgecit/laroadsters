-- One-time migration: add the show_in_club column to documents.
-- Run BEFORE deploying the admin code that uses this field, otherwise
-- the API will fail with "column does not exist".
--
-- Idempotent: uses IF NOT EXISTS so it's safe to re-run.
-- Existing rows default to true (shown on Members page), preserving the
-- previous behavior.

ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS show_in_club BOOLEAN NOT NULL DEFAULT true;
