const { query } = require("../config/database");
const { success } = require("../utils/response.util");
const { getTopPreferences } = require("../services/preference.service");

async function getRecommendations(req, res, next) {
  try {
    const userId = req.user.id;

    const [topCategories, topEventTypes, userSkillsRes] = await Promise.all([
      getTopPreferences(userId, "job_category", 3),
      getTopPreferences(userId, "event_type", 2),
      query(
        `SELECT COALESCE(json_agg(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL), '[]') AS skills
         FROM user_skills us
         LEFT JOIN skills s ON s.id = us.skill_id
         WHERE us.user_id = $1`,
        [userId]
      ),
    ]);

    const categoryNames = topCategories.map((c) => c.value);
    const eventTypes = topEventTypes.map((t) => t.value);
    const userSkills = (userSkillsRes.rows[0]?.skills || []).map(s => s.toLowerCase());

    let jobs = [];
    if (categoryNames.length > 0) {
      const jobRes = await query(
        `SELECT jp.id, jp.title, ep.company_name AS company,
                ep.company_logo_url AS company_logo,
                jc.name AS category, jp.budget_min, jp.budget_max,
                jp.location_type, jp.created_at,
                COALESCE(json_agg(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL), '[]') AS skills,
                COALESCE(uvp.view_count, 0) AS freq_score
         FROM job_postings jp
         JOIN job_categories jc ON jc.id = jp.category_id
         LEFT JOIN employer_profiles ep ON ep.user_id = jp.employer_id
         LEFT JOIN job_skills js ON js.job_id = jp.id
         LEFT JOIN skills s ON s.id = js.skill_id
         LEFT JOIN user_view_preferences uvp ON uvp.user_id = $1
           AND uvp.kind = 'job_category' AND uvp.value = jc.name
         WHERE jp.status = 'active'
           AND jc.name = ANY($2)
           AND jp.id NOT IN (SELECT job_id FROM applications WHERE freelancer_id = $1)
         GROUP BY jp.id, ep.company_name, ep.company_logo_url, jc.name, uvp.view_count`,
        [userId, categoryNames]
      );

      jobs = jobRes.rows.map(job => {
        const jobSkills = job.skills.map(s => s.toLowerCase());
        const matchedSkills = userSkills.filter(us => jobSkills.includes(us)).length;
        const totalJobSkills = jobSkills.length > 0 ? jobSkills.length : 1;
        const skillsMatchScore = (matchedSkills / totalJobSkills) * 100;
        const frequencyScore = Math.min(job.freq_score * 20, 100);
        const totalScore = (frequencyScore * 0.6) + (skillsMatchScore * 0.4);

        return { ...job, score: totalScore };
      }).sort((a, b) => b.score - a.score).slice(0, 3);
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
         LIMIT 2`,
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
