const { query } = require("../../config/database");

// Order the pair deterministically so a conversation is unique regardless of who starts it.
function orderPair(a, b) {
  return a < b ? [a, b] : [b, a];
}

async function getOrCreateConversation(meId, otherId) {
  if (meId === otherId) {
    const err = new Error("Cannot start a conversation with yourself");
    err.statusCode = 400;
    throw err;
  }

  const other = await query("SELECT id FROM users WHERE id = $1", [otherId]);
  if (other.rowCount === 0) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const [user_a, user_b] = orderPair(meId, otherId);
  const { rows } = await query(
    `INSERT INTO conversations (user_a, user_b)
     VALUES ($1, $2)
     ON CONFLICT (user_a, user_b) DO UPDATE SET updated_at = conversations.updated_at
     RETURNING id, user_a, user_b, created_at`,
    [user_a, user_b]
  );
  return rows[0];
}

async function assertParticipant(conversationId, userId) {
  const { rows } = await query(
    "SELECT id FROM conversations WHERE id = $1 AND $2 IN (user_a, user_b)",
    [conversationId, userId]
  );
  if (rows.length === 0) {
    const err = new Error("Conversation not found");
    err.statusCode = 404;
    throw err;
  }
}

async function sendMessage({ conversationId, senderId, body }) {
  await assertParticipant(conversationId, senderId);
  const { rows } = await query(
    `INSERT INTO messages (conversation_id, sender_id, body)
     VALUES ($1, $2, $3)
     RETURNING id, conversation_id, sender_id, body, is_read, created_at`,
    [conversationId, senderId, body]
  );
  await query("UPDATE conversations SET updated_at = NOW() WHERE id = $1", [conversationId]);
  return rows[0];
}

async function listConversations(userId) {
  const { rows } = await query(
    `SELECT c.id, c.created_at, c.updated_at,
            other.id AS other_user_id, other.full_name AS other_user_name,
            fp.profile_picture_url AS other_user_avatar,
            lm.body AS last_message, lm.created_at AS last_message_at,
            (SELECT COUNT(*)::int FROM messages m
              WHERE m.conversation_id = c.id AND m.sender_id <> $1 AND m.is_read = FALSE) AS unread_count
     FROM conversations c
     JOIN users other ON other.id = CASE WHEN c.user_a = $1 THEN c.user_b ELSE c.user_a END
     LEFT JOIN freelancer_profiles fp ON fp.user_id = other.id
     LEFT JOIN LATERAL (
       SELECT body, created_at FROM messages
       WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1
     ) lm ON TRUE
     WHERE c.user_a = $1 OR c.user_b = $1
     ORDER BY c.updated_at DESC`,
    [userId]
  );
  return rows;
}

async function getMessages(conversationId, userId) {
  await assertParticipant(conversationId, userId);
  // Reading a conversation marks the other party's messages as read.
  await query(
    "UPDATE messages SET is_read = TRUE WHERE conversation_id = $1 AND sender_id <> $2 AND is_read = FALSE",
    [conversationId, userId]
  );
  const { rows } = await query(
    `SELECT id, conversation_id, sender_id, body, is_read, created_at
     FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
    [conversationId]
  );
  return rows;
}

module.exports = { getOrCreateConversation, sendMessage, listConversations, getMessages };
