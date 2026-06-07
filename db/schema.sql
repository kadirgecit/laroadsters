-- LA Roadsters admin panel schema
-- Run once on a fresh Neon database to create all tables.
-- In production this is also executed by db/migrate.ts on first deploy.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Single admin user. One row only by convention; no roles.
CREATE TABLE IF NOT EXISTS admin_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Editable content blocks for the 11 Show News page cards.
-- JSX in src/app/pages/News.tsx stays unchanged; only the data inside
-- each card comes from this table. enabled=false hides the card.
CREATE TABLE IF NOT EXISTS news_cards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,   -- 'about_show', 'main_attraction', 'general_public', etc.
  title       TEXT NOT NULL,
  body_text   TEXT NOT NULL DEFAULT '',
  flyer_url   TEXT,                    -- nullable; only the flyer card uses this
  image_urls  JSONB NOT NULL DEFAULT '[]'::jsonb,  -- array of URLs for the photo grid
  enabled     BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INT NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Free-form news posts (Member News page). Plain text body, no rich text.
CREATE TABLE IF NOT EXISTS news_posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  body_text    TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Show events displayed on the Members page.
CREATE TABLE IF NOT EXISTS events (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT NOT NULL,
  date           TEXT NOT NULL,         -- free text like "June 19-20, 2026"
  location       TEXT,
  description    TEXT,
  flyer_pdf_url  TEXT,
  sort_order     INT NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Club documents (bylaws, roster, forms) available for download.
CREATE TABLE IF NOT EXISTS documents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,            -- display name, customer-editable
  file_url    TEXT NOT NULL,            -- Vercel Blob URL
  size_label  TEXT,                     -- "PDF", "DOCX", etc. display hint
  category    TEXT,                     -- 'bylaws' | 'form' | 'flyer' | 'other'
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sponsors shown in the News page and footer.
CREATE TABLE IF NOT EXISTS sponsors (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  logo_url    TEXT NOT NULL,
  url         TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Gallery albums: a named collection of photos.
CREATE TABLE IF NOT EXISTS gallery_albums (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  cover_photo_id  UUID,                 -- points to gallery_photos.id once photos exist
  sort_order      INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Individual photos inside an album. Compressed on upload, size limit enforced.
CREATE TABLE IF NOT EXISTS gallery_photos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id    UUID NOT NULL REFERENCES gallery_albums(id) ON DELETE CASCADE,
  blob_url    TEXT NOT NULL,
  title       TEXT,
  caption     TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Generic key/value table for homepage blurb, event card text, etc.
-- Avoids needing a separate "pages" table for small edit-in-place content.
CREATE TABLE IF NOT EXISTS site_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_news_cards_enabled_sort ON news_cards (enabled, sort_order);
CREATE INDEX IF NOT EXISTS idx_news_posts_published ON news_posts (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_sort ON events (sort_order);
CREATE INDEX IF NOT EXISTS idx_documents_category_sort ON documents (category, sort_order);
CREATE INDEX IF NOT EXISTS idx_sponsors_sort ON sponsors (sort_order);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_sort ON gallery_albums (sort_order);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_album ON gallery_photos (album_id, sort_order);
