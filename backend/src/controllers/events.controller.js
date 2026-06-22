const { query, getClient } = require("../config/database");
const { success, created, notFound, badRequest, forbidden, paginated } = require("../utils/response.util");
const { checkAndAwardBadge } = require("../services/badge.service");

async function listEvents(req, res, next) {
  try {
    const { page = 1, limit = 20, type, upcoming, past } = req.query;
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    let idx = 1;

    if (type) { conditions.push(`e.type = $${idx++}`); params.push(type); }
    if (upcoming === "true") { conditions.push(`e.event_date >= CURRENT_DATE`); }
    if (past === "true") { conditions.push(`e.event_date < CURRENT_DATE`); }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const total = await query(`SELECT COUNT(*) FROM events e ${where}`, params);

    const { rows } = await query(
      `SELECT e.id, e.title, e.description, e.type,
              e.event_date, e.event_time, e.duration_minutes,
              e.location_name, e.latitude, e.longitude,
              e.organizer_name, e.image_url,
              e.attendee_limit, e.attendee_count,
              e.is_free, e.price, e.registration_url,
              COALESCE(json_agg(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL), '[]') AS skills
       FROM events e
       LEFT JOIN event_skills es ON es.event_id = e.id
       LEFT JOIN skills s ON s.id = es.skill_id
       ${where}
       GROUP BY e.id
       ORDER BY e.event_date ASC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    );

    return paginated(res, rows, parseInt(total.rows[0].count), page, limit);
  } catch (err) {
    next(err);
  }
}

async function getEvent(req, res, next) {
  try {
    const { id } = req.params;
    const { rows } = await query(
      `SELECT e.*, ep.company_name AS organizer_company,
              COALESCE(json_agg(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL), '[]') AS skills
       FROM events e
       LEFT JOIN employer_profiles ep ON ep.user_id = e.organizer_id
       LEFT JOIN event_skills es ON es.event_id = e.id
       LEFT JOIN skills s ON s.id = es.skill_id
       WHERE e.id = $1
       GROUP BY e.id, ep.company_name`,
      [id]
    );
    if (!rows[0]) return notFound(res, "Event not found");
    return success(res, rows[0]);
  } catch (err) {
    next(err);
  }
}

async function rsvpEvent(req, res, next) {
  try {
    const { id } = req.params;
    const event = await query(
      "SELECT id, attendee_limit, attendee_count, event_date FROM events WHERE id = $1", [id]
    );
    if (!event.rows[0]) return notFound(res, "Event not found");

    const ev = event.rows[0];
    if (ev.attendee_limit && ev.attendee_count >= ev.attendee_limit) {
      return badRequest(res, "Event is full");
    }
    if (new Date(ev.event_date) < new Date()) {
      return badRequest(res, "Cannot RSVP to past event");
    }

    const { rows } = await query(
      `INSERT INTO event_attendance (event_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (event_id, user_id) DO NOTHING
       RETURNING id, rsvp_at`,
      [id, req.user.id]
    );

    if (!rows[0]) return badRequest(res, "Already RSVPd to this event");
    return created(res, rows[0], "RSVP successful");
  } catch (err) {
    next(err);
  }
}

async function checkIn(req, res, next) {
  try {
    const { id } = req.params;
    const { check_in_code } = req.body;

    const event = await query(
      "SELECT id, check_in_code FROM events WHERE id = $1", [id]
    );
    if (!event.rows[0]) return notFound(res, "Event not found");
    if (event.rows[0].check_in_code !== check_in_code) {
      return badRequest(res, "Invalid check-in code");
    }

    const { rows } = await query(
      `UPDATE event_attendance
       SET checked_in = TRUE, checked_in_at = NOW()
       WHERE event_id = $1 AND user_id = $2 AND checked_in = FALSE
       RETURNING id, checked_in_at`,
      [id, req.user.id]
    );

    if (!rows[0]) return badRequest(res, "Not RSVPd to this event or already checked in");

    const awardedBadge = await checkAndAwardBadge(req.user.id, "event_attended");

    await query(
      "UPDATE event_attendance SET badge_awarded = TRUE WHERE event_id = $1 AND user_id = $2",
      [id, req.user.id]
    );

    return success(res, { ...rows[0], awardedBadge }, "Check-in successful!");
  } catch (err) {
    next(err);
  }
}

async function createEvent(req, res, next) {
  try {
    const {
      title, description, type,
      event_date, event_time, duration_minutes,
      location_name, location_address, latitude, longitude,
      organizer_name, image_url,
      attendee_limit, check_in_code,
      is_free, price, registration_url,
      skills = [],
    } = req.body;

    const client = await getClient();
    try {
      await client.query("BEGIN");
      const { rows } = await client.query(
        `INSERT INTO events
           (title, description, type, event_date, event_time, duration_minutes,
            location_name, location_address, latitude, longitude,
            organizer_id, organizer_name, image_url, attendee_limit,
            check_in_code, is_free, price, registration_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
         RETURNING *`,
        [title, description, type, event_date, event_time, duration_minutes,
         location_name, location_address, latitude, longitude,
         req.user.id, organizer_name, image_url, attendee_limit,
         check_in_code, is_free, price, registration_url]
      );
      const ev = rows[0];

      for (const skillName of skills) {
        const skillRes = await client.query("SELECT id FROM skills WHERE name ILIKE $1", [skillName]);
        if (skillRes.rowCount > 0) {
          await client.query(
            "INSERT INTO event_skills (event_id, skill_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [ev.id, skillRes.rows[0].id]
          );
        }
      }

      await client.query("COMMIT");
      return created(res, ev, "Event created");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { listEvents, getEvent, rsvpEvent, checkIn, createEvent };
