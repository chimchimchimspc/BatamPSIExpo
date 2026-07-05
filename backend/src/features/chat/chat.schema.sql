-- ============================================================
-- CHAT FEATURE — conversations & messages
-- Jalankan sekali:  psql -U postgres -d jogja_freelance_db -f chat.schema.sql
-- ============================================================

-- Percakapan 1-lawan-1. Pasangan disimpan terurut (user_a < user_b)
-- supaya UNIQUE mencegah percakapan ganda apa pun urutan pembuatnya.
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
