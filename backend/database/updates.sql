-- ============================================================
-- UPDATES — perubahan skema di atas schema.sql
-- Aman dijalankan berulang (idempotent).
-- Jalankan SETELAH schema.sql (+ seed.sql bila perlu):
--   psql -U postgres -d jogja_freelance_db -f database/updates.sql
-- ============================================================

-- ---- Login Google: penanda akun Google ----
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_sub TEXT UNIQUE;

-- ---- Lowongan: foto & pin lokasi peta ----
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS latitude  double precision;
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS longitude double precision;

-- ---- Koordinat event → double precision (fix numeric field overflow) ----
ALTER TABLE events ALTER COLUMN latitude  TYPE double precision;
ALTER TABLE events ALTER COLUMN longitude TYPE double precision;

-- ---- Status lamaran 'completed' (pekerjaan selesai + ulasan) ----
ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'completed';

-- ---- Pelacak minat untuk fitur rekomendasi dashboard ----
CREATE TABLE IF NOT EXISTS user_view_preferences (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind        TEXT NOT NULL,   -- 'job_category' | 'event_type'
  value       TEXT NOT NULL,   -- mis. 'Web Development' | 'workshop'
  view_count  INT DEFAULT 1,
  last_viewed TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, kind, value)
);
CREATE INDEX IF NOT EXISTS idx_view_prefs_user
  ON user_view_preferences(user_id, kind, view_count DESC);

-- ---- Chat 1-lawan-1 (sama dengan src/features/chat/chat.schema.sql) ----
CREATE TABLE IF NOT EXISTS conversations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_a      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_b      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW(),
  CHECK (user_a <> user_b),
  UNIQUE (user_a, user_b)
);

CREATE TABLE IF NOT EXISTS messages (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id  UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body             TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  is_read          BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_user_a  ON conversations(user_a);
CREATE INDEX IF NOT EXISTS idx_conversations_user_b  ON conversations(user_b);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at);

-- Catatan:
-- * Tabel user_sessions dibuat otomatis oleh connect-pg-simple saat backend jalan.
-- * Password hash admin & freelancer di seed.sql lama tidak valid — reset via:
--     node -e "console.log(require('bcryptjs').hashSync('PasswordBaru', 12))"
--     lalu UPDATE users SET password_hash='<hash>' WHERE email='...';
