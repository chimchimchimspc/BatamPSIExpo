const { query } = require("../config/database");
const { success, created, notFound, badRequest, paginated } = require("../utils/response.util");
const { sendJobMatchNotifications } = require("../services/notification.service");
const { verifyBadge } = require("../services/badge.service");

async function getDashboardAnalytics(req, res, next) {
  try {
    const [users, activeJobs, pendingJobs, events, pendingEvents, pendingBadges, appsToday, newUsers, checkIns] = await Promise.all([
      query("SELECT COUNT(*) FROM users"),
      query("SELECT COUNT(*) FROM job_postings WHERE status = 'active'"),
      query("SELECT COUNT(*) FROM job_postings WHERE status = 'pending_review'"),
      query("SELECT COUNT(*) FROM events WHERE status = 'active'"),
      query("SELECT COUNT(*) FROM events WHERE status = 'pending_review'"),
      query("SELECT COUNT(*) FROM user_badges ub JOIN badges b ON b.id = ub.badge_id WHERE b.requires_admin_verification = TRUE AND ub.verified_at IS NULL"),
      query("SELECT COUNT(*) FROM applications WHERE submitted_at >= CURRENT_DATE"),
      query("SELECT COUNT(*) FROM users WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'"),
      query("SELECT COUNT(*) FROM event_attendance WHERE checked_in = TRUE AND checked_in_at >= CURRENT_DATE - INTERVAL '7 days'"),
    ]);

    return success(res, {
      totalUsers:               parseInt(users.rows[0].count),
      activeJobs:               parseInt(activeJobs.rows[0].count),
      pendingJobs:              parseInt(pendingJobs.rows[0].count),
      totalEvents:              parseInt(events.rows[0].count),
      pendingEvents:            parseInt(pendingEvents.rows[0].count),
      pendingBadgeVerifications:parseInt(pendingBadges.rows[0].count),
      jobApplicationsToday:     parseInt(appsToday.rows[0].count),
      newUsersThisWeek:         parseInt(newUsers.rows[0].count),
      checkInsThisWeek:         parseInt(checkIns.rows[0].count),
    });
  } catch (err) {
    next(err);
  }
}

async function listAllJobs(req, res, next) {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    let idx = 1;

    if (status) { conditions.push(`jp.status = $${idx++}`); params.push(status); }
    if (search) { conditions.push(`jp.title ILIKE $${idx++}`); params.push(`%${search}%`); }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const total = await query(`SELECT COUNT(*) FROM job_postings jp ${where}`, params);

    const { rows } = await query(
      `SELECT jp.id, jp.title, jp.status, ep.company_name, jc.name AS category,
              jp.budget_min, jp.budget_max, jp.contact_email, jp.admin_notes,
              jp.created_at, jp.reviewed_at
       FROM job_postings jp
       LEFT JOIN employer_profiles ep ON ep.user_id = jp.employer_id
       LEFT JOIN job_categories jc ON jc.id = jp.category_id
       ${where}
       ORDER BY jp.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    );

    return paginated(res, rows, parseInt(total.rows[0].count), page, limit);
  } catch (err) {
    next(err);
  }
}

async function getPendingJobs(req, res, next) {
  try {
    const { rows } = await query(
      `SELECT jp.id, jp.title, ep.company_name, jc.name AS category,
              jp.budget_min, jp.budget_max, jp.contact_email, jp.created_at
       FROM job_postings jp
       LEFT JOIN employer_profiles ep ON ep.user_id = jp.employer_id
       LEFT JOIN job_categories jc ON jc.id = jp.category_id
       WHERE jp.status = 'pending_review'
       ORDER BY jp.created_at ASC`
    );
    return success(res, rows);
  } catch (err) {
    next(err);
  }
}

async function approveJob(req, res, next) {
  try {
    const { id } = req.params;
    const { rows } = await query(
      `UPDATE job_postings
       SET status = 'active', reviewed_by = $1, reviewed_at = NOW(), updated_at = NOW()
       WHERE id = $2 AND status = 'pending_review'
       RETURNING *`,
      [req.user.id, id]
    );
    if (!rows[0]) return notFound(res, "Job not found or already reviewed");

    await query(
      `INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
       VALUES ($1, 'job_approved', 'Lowongan Disetujui', $2, $3, 'job')`,
      [rows[0].employer_id, `Lowongan "${rows[0].title}" telah disetujui dan dipublikasikan`, id]
    );

    await sendJobMatchNotifications({ id, company_name: rows[0].contact_email });

    return success(res, rows[0], "Job approved and published");
  } catch (err) {
    next(err);
  }
}

async function rejectJob(req, res, next) {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const { rows } = await query(
      `UPDATE job_postings
       SET status = 'rejected', admin_notes = $1, reviewed_by = $2, reviewed_at = NOW(), updated_at = NOW()
       WHERE id = $3 AND status = 'pending_review'
       RETURNING *, employer_id`,
      [reason, req.user.id, id]
    );
    if (!rows[0]) return notFound(res, "Job not found or already reviewed");

    await query(
      `INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
       VALUES ($1, 'job_rejected', 'Lowongan Ditolak', $2, $3, 'job')`,
      [rows[0].employer_id, reason || "Lowongan tidak memenuhi standar platform", id]
    );

    return success(res, null, "Job rejected");
  } catch (err) {
    next(err);
  }
}

async function listAllEvents(req, res, next) {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    let idx = 1;

    if (status) { conditions.push(`e.status = $${idx++}`); params.push(status); }
    if (search) { conditions.push(`e.title ILIKE $${idx++}`); params.push(`%${search}%`); }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const total = await query(`SELECT COUNT(*) FROM events e ${where}`, params);

    const { rows } = await query(
      `SELECT e.id, e.title, e.type, e.status, e.event_date, e.event_time,
              e.organizer_name, e.location_name, e.admin_notes,
              e.created_at, e.reviewed_at,
              u.email AS organizer_email
       FROM events e
       LEFT JOIN users u ON u.id = e.organizer_id
       ${where}
       ORDER BY e.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    );

    return paginated(res, rows, parseInt(total.rows[0].count), page, limit);
  } catch (err) {
    next(err);
  }
}

async function getPendingEvents(req, res, next) {
  try {
    const { rows } = await query(
      `SELECT e.id, e.title, e.type, e.event_date, e.event_time,
              e.organizer_name, e.location_name, e.created_at,
              u.email AS organizer_email
       FROM events e
       LEFT JOIN users u ON u.id = e.organizer_id
       WHERE e.status = 'pending_review'
       ORDER BY e.created_at ASC`
    );
    return success(res, rows);
  } catch (err) {
    next(err);
  }
}

async function approveEvent(req, res, next) {
  try {
    const { id } = req.params;
    const { rows } = await query(
      `UPDATE events
       SET status = 'active', reviewed_by = $1, reviewed_at = NOW(), updated_at = NOW()
       WHERE id = $2 AND status = 'pending_review'
       RETURNING *`,
      [req.user.id, id]
    );
    if (!rows[0]) return notFound(res, "Event not found or already reviewed");

    if (rows[0].organizer_id) {
      await query(
        `INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
         VALUES ($1, 'event_approved', 'Event Disetujui', $2, $3, 'event')`,
        [rows[0].organizer_id, `Event "${rows[0].title}" telah disetujui dan dipublikasikan`, id]
      );
    }

    return success(res, rows[0], "Event approved and published");
  } catch (err) {
    next(err);
  }
}

async function rejectEvent(req, res, next) {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const { rows } = await query(
      `UPDATE events
       SET status = 'rejected', admin_notes = $1, reviewed_by = $2, reviewed_at = NOW(), updated_at = NOW()
       WHERE id = $3 AND status = 'pending_review'
       RETURNING *, organizer_id`,
      [reason, req.user.id, id]
    );
    if (!rows[0]) return notFound(res, "Event not found or already reviewed");

    if (rows[0].organizer_id) {
      await query(
        `INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
         VALUES ($1, 'event_rejected', 'Event Ditolak', $2, $3, 'event')`,
        [rows[0].organizer_id, reason || "Event tidak memenuhi standar platform", id]
      );
    }

    return success(res, null, "Event rejected");
  } catch (err) {
    next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    let idx = 1;

    if (role) { conditions.push(`u.role = $${idx++}`); params.push(role); }
    if (search) {
      conditions.push(`(u.full_name ILIKE $${idx} OR u.email ILIKE $${idx})`);
      params.push(`%${search}%`);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const total = await query(`SELECT COUNT(*) FROM users u ${where}`, params);

    const { rows } = await query(
      `SELECT u.id, u.email, u.full_name, u.role, u.city, u.is_verified, u.created_at, u.last_login
       FROM users u
       ${where}
       ORDER BY u.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    );

    return success(res, { rows, total: parseInt(total.rows[0].count) });
  } catch (err) {
    next(err);
  }
}

async function verifyUserBadge(req, res, next) {
  try {
    const { userBadgeId } = req.params;
    const result = await verifyBadge(userBadgeId, req.user.id);
    if (!result) return notFound(res, "User badge not found");
    return success(res, result, "Badge verified");
  } catch (err) {
    next(err);
  }
}

async function getPendingBadges(req, res, next) {
  try {
    const { rows } = await query(
      `SELECT ub.id AS user_badge_id, ub.earned_at,
              u.id AS user_id, u.full_name, u.email,
              b.name AS badge_name, b.icon, b.rarity,
              ea.event_id, e.title AS event_title
       FROM user_badges ub
       JOIN badges b ON b.id = ub.badge_id
       JOIN users u ON u.id = ub.user_id
       LEFT JOIN event_attendance ea ON ea.user_id = ub.user_id AND ea.badge_awarded = TRUE
       LEFT JOIN events e ON e.id = ea.event_id
       WHERE b.requires_admin_verification = TRUE AND ub.verified_at IS NULL
       ORDER BY ub.earned_at ASC`
    );
    return success(res, rows);
  } catch (err) {
    next(err);
  }
}

async function listCategories(req, res, next) {
  try {
    const { rows } = await query(
      `SELECT jc.id, jc.name, jc.icon, jc.created_at,
              COUNT(jp.id) AS job_count
       FROM job_categories jc
       LEFT JOIN job_postings jp ON jp.category_id = jc.id
       GROUP BY jc.id
       ORDER BY jc.name ASC`
    );
    return success(res, rows);
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const { name, icon } = req.body;
    if (!name) return badRequest(res, "Name is required");
    const { rows } = await query(
      "INSERT INTO job_categories (name, icon) VALUES ($1, $2) RETURNING *",
      [name, icon || null]
    );
    return created(res, rows[0], "Category created");
  } catch (err) {
    if (err.code === "23505") return badRequest(res, "Category already exists");
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name, icon } = req.body;
    const { rows } = await query(
      "UPDATE job_categories SET name = COALESCE($1, name), icon = COALESCE($2, icon) WHERE id = $3 RETURNING *",
      [name, icon, id]
    );
    if (!rows[0]) return notFound(res, "Category not found");
    return success(res, rows[0], "Category updated");
  } catch (err) {
    if (err.code === "23505") return badRequest(res, "Category already exists");
    next(err);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { rowCount } = await query("DELETE FROM job_categories WHERE id = $1", [id]);
    if (!rowCount) return notFound(res, "Category not found");
    return success(res, null, "Category deleted");
  } catch (err) {
    next(err);
  }
}

async function listSkills(req, res, next) {
  try {
    const { rows } = await query(
      `SELECT s.id, s.name, s.category, s.created_at,
              COUNT(DISTINCT js.job_id) AS job_count
       FROM skills s
       LEFT JOIN job_skills js ON js.skill_id = s.id
       GROUP BY s.id
       ORDER BY s.category ASC, s.name ASC`
    );
    return success(res, rows);
  } catch (err) {
    next(err);
  }
}

async function createSkill(req, res, next) {
  try {
    const { name, category } = req.body;
    if (!name) return badRequest(res, "Name is required");
    const { rows } = await query(
      "INSERT INTO skills (name, category) VALUES ($1, $2) RETURNING *",
      [name, category || null]
    );
    return created(res, rows[0], "Skill created");
  } catch (err) {
    if (err.code === "23505") return badRequest(res, "Skill already exists");
    next(err);
  }
}

async function updateSkill(req, res, next) {
  try {
    const { id } = req.params;
    const { name, category } = req.body;
    const { rows } = await query(
      "UPDATE skills SET name = COALESCE($1, name), category = COALESCE($2, category) WHERE id = $3 RETURNING *",
      [name, category, id]
    );
    if (!rows[0]) return notFound(res, "Skill not found");
    return success(res, rows[0], "Skill updated");
  } catch (err) {
    if (err.code === "23505") return badRequest(res, "Skill already exists");
    next(err);
  }
}

async function deleteSkill(req, res, next) {
  try {
    const { id } = req.params;
    const { rowCount } = await query("DELETE FROM skills WHERE id = $1", [id]);
    if (!rowCount) return notFound(res, "Skill not found");
    return success(res, null, "Skill deleted");
  } catch (err) {
    next(err);
  }
}

async function getAnalyticsDetail(req, res, next) {
  try {
    const [jobsByCategory, eventsByType, userGrowth, applicationsTrend, topSkills, topCities] = await Promise.all([
      query(
        `SELECT COALESCE(jc.name, 'Tanpa Kategori') AS category, COUNT(*) AS count
         FROM job_postings jp
         LEFT JOIN job_categories jc ON jc.id = jp.category_id
         WHERE jp.status = 'active'
         GROUP BY jc.name ORDER BY count DESC`
      ),
      query(
        `SELECT type, COUNT(*) AS count FROM events
         WHERE status = 'active' GROUP BY type ORDER BY count DESC`
      ),
      query(
        `SELECT TO_CHAR(d.day, 'YYYY-MM-DD') AS date, COUNT(u.id) AS count
         FROM generate_series(CURRENT_DATE - INTERVAL '29 days', CURRENT_DATE, INTERVAL '1 day') d(day)
         LEFT JOIN users u ON u.created_at::date = d.day
         GROUP BY d.day ORDER BY d.day ASC`
      ),
      query(
        `SELECT TO_CHAR(d.day, 'YYYY-MM-DD') AS date, COUNT(a.id) AS count
         FROM generate_series(CURRENT_DATE - INTERVAL '13 days', CURRENT_DATE, INTERVAL '1 day') d(day)
         LEFT JOIN applications a ON a.submitted_at::date = d.day
         GROUP BY d.day ORDER BY d.day ASC`
      ),
      query(
        `SELECT name, SUM(usage_count) AS count FROM (
           SELECT s.name, COUNT(*) AS usage_count FROM job_skills js JOIN skills s ON s.id = js.skill_id GROUP BY s.name
           UNION ALL
           SELECT s.name, COUNT(*) AS usage_count FROM event_skills es JOIN skills s ON s.id = es.skill_id GROUP BY s.name
         ) combined
         GROUP BY name ORDER BY count DESC LIMIT 10`
      ),
      query(
        `SELECT city, COUNT(*) AS count FROM users
         WHERE city IS NOT NULL GROUP BY city ORDER BY count DESC LIMIT 5`
      ),
    ]);

    return success(res, {
      jobsByCategory: jobsByCategory.rows.map((r) => ({ category: r.category, count: parseInt(r.count) })),
      eventsByType: eventsByType.rows.map((r) => ({ type: r.type, count: parseInt(r.count) })),
      userGrowth: userGrowth.rows.map((r) => ({ date: r.date, count: parseInt(r.count) })),
      applicationsTrend: applicationsTrend.rows.map((r) => ({ date: r.date, count: parseInt(r.count) })),
      topSkills: topSkills.rows.map((r) => ({ name: r.name, count: parseInt(r.count) })),
      topCities: topCities.rows.map((r) => ({ city: r.city, count: parseInt(r.count) })),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboardAnalytics, getAnalyticsDetail,
  listAllJobs, getPendingJobs, approveJob, rejectJob,
  listAllEvents, getPendingEvents, approveEvent, rejectEvent,
  listUsers, verifyUserBadge, getPendingBadges,
  listCategories, createCategory, updateCategory, deleteCategory,
  listSkills, createSkill, updateSkill, deleteSkill,
};
