const { query, getClient } = require("../../config/database");

async function createReview({ reviewer_id, reviewee_id, job_id = null, rating, comment = null }) {
  if (reviewer_id === reviewee_id) {
    const err = new Error("You cannot review yourself");
    err.statusCode = 400;
    throw err;
  }

  const client = await getClient();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `INSERT INTO reviews (reviewer_id, reviewee_id, job_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, reviewer_id, reviewee_id, job_id, rating, comment, created_at`,
      [reviewer_id, reviewee_id, job_id, rating, comment]
    );
    const review = rows[0];

    // Recompute the reviewee's aggregate rating so the profile stays in sync.
    await client.query(
      `UPDATE freelancer_profiles fp
       SET rating = sub.avg_rating, review_count = sub.cnt, updated_at = NOW()
       FROM (
         SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0) AS avg_rating, COUNT(*) AS cnt
         FROM reviews WHERE reviewee_id = $1
       ) sub
       WHERE fp.user_id = $1`,
      [reviewee_id]
    );

    await client.query("COMMIT");
    return review;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function getReviewsForUser(userId) {
  const { rows } = await query(
    `SELECT r.id, r.rating, r.comment, r.job_id, r.created_at,
            u.id AS reviewer_id, u.full_name AS reviewer_name,
            fp.profile_picture_url AS reviewer_avatar
     FROM reviews r
     JOIN users u ON u.id = r.reviewer_id
     LEFT JOIN freelancer_profiles fp ON fp.user_id = u.id
     WHERE r.reviewee_id = $1
     ORDER BY r.created_at DESC`,
    [userId]
  );

  const summary = await query(
    `SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0) AS average, COUNT(*)::int AS total
     FROM reviews WHERE reviewee_id = $1`,
    [userId]
  );

  return { summary: summary.rows[0], reviews: rows };
}

module.exports = { createReview, getReviewsForUser };
