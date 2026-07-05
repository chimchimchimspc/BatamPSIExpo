const { query } = require("../config/database");
const { success } = require("../utils/response.util");
const { getTopPreferences } = require("../services/preference.service");

// Rekomendasi berdasarkan kategori lowongan & tipe event yang sering dibuka user
async function getRecommendations(req, res, next) {
  try {
    const userId = req.user.id;

    const [topCategories, topEventTypes] = await Promise.all([
      getTopPreferences(userId, "job_category", 3),
      getTopPreferences(userId, "event_type", 2),
    ]);

    const categoryNames = topCategories.map((c) => c.value);
    const eventTypes = topEventTypes.map((t) => t.value);

    let jobs = [];
    if (categoryNames.length > 0) {
      const jobRes = await query(
        `SELECT jp.id, jp.title, ep.company_name AS company,
                ep.company_logo_url AS company_logo,
                jc.name AS category, jp.budget_min, jp.budget_max,
                jp.location_type, jp.created_at,
                COALESCE(json_agg(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL), '[]') AS skills
         FROM job_postings jp
         JOIN job_categories jc ON jc.id = jp.category_id
         LEFT JOIN employer_profiles ep ON ep.user_id = jp.employer_id
         LEFT JOIN job_skills js ON js.job_id = jp.id
         LEFT JOIN skills s ON s.id = js.skill_id
         WHERE jp.status = 'active'
           AND jc.name = ANY($2)
           AND jp.id NOT IN (SELECT job_id FROM applications WHERE freelancer_id = $1)
         GROUP BY jp.id, ep.company_name, ep.company_logo_url, jc.name
         ORDER BY jp.created_at DESC
         LIMIT 4`,
        [userId, categoryNames]
      );
      jobs = jobRes.rows;
    }

    let events = [];
    if (eventTypes.length > 0) {
      const evRes = await query(
        `SELECT e.id, e.title, e.type, e.event_date, e.event_time,
                e.location_name, e.image_url, e.is_free, e.price,
                e.attendee_count, e.attendee_limit
         FROM events e
         WHERE e.status = 'active'
           AND e.event_date >= CURRENT_DATE
           AND e.type::text = ANY($2)
           AND e.id NOT IN (SELECT event_id FROM event_attendance WHERE user_id = $1)
         ORDER BY e.event_date ASC
         LIMIT 3`,
        [userId, eventTypes]
      );
      events = evRes.rows;
    }

    return success(res, {
      top_categories: categoryNames,
      top_event_types: eventTypes,
      jobs,
      events,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getRecommendations };
