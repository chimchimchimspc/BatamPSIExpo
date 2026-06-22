-- ============================================================
-- JOGJA FREELANCE PASSPORT â€” PostgreSQL Schema
-- Version: 1.0
-- Engine: PostgreSQL 15+
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE user_role AS ENUM ('freelancer', 'employer', 'admin');

CREATE TYPE user_level AS ENUM ('Bronze', 'Silver', 'Gold', 'Platinum');

CREATE TYPE job_status AS ENUM ('draft', 'pending_review', 'active', 'closed', 'rejected');

CREATE TYPE budget_type AS ENUM ('fixed', 'hourly');

CREATE TYPE location_type AS ENUM ('Remote', 'Onsite', 'Hybrid');

CREATE TYPE experience_level AS ENUM ('Junior', 'Mid', 'Senior');

CREATE TYPE application_status AS ENUM ('pending', 'reviewed', 'accepted', 'rejected', 'expired');

CREATE TYPE passport_phase AS ENUM ('Onboarding', 'Eksplorasi', 'Action', 'Wrap-up');

CREATE TYPE badge_rarity AS ENUM ('common', 'uncommon', 'rare', 'legendary');

CREATE TYPE badge_trigger_condition AS ENUM (
  'profile_complete',
  'first_application',
  'event_attended',
  'day_5_milestone',
  'day_15_milestone',
  'day_30_complete',
  'job_completed',
  'community_helper'
);

CREATE TYPE event_type AS ENUM ('workshop', 'meetup', 'coffee_chat', 'networking');

CREATE TYPE notification_type AS ENUM (
  'job_match',
  'application_update',
  'badge_earned',
  'event_reminder',
  'daily_task',
  'job_approved',
  'job_rejected'
);


-- ============================================================
-- USERS (Core â€” freelancer, employer, admin)
-- ============================================================

CREATE TABLE users (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email                     VARCHAR(255) UNIQUE NOT NULL,
  password_hash             VARCHAR(255),
  full_name                 VARCHAR(255) NOT NULL,
  phone                     VARCHAR(20),
  city                      VARCHAR(100) DEFAULT 'Yogyakarta',
  role                      user_role NOT NULL DEFAULT 'freelancer',
  is_verified               BOOLEAN DEFAULT FALSE,
  is_email_verified         BOOLEAN DEFAULT FALSE,
  email_verification_token  VARCHAR(255),
  password_reset_token      VARCHAR(255),
  password_reset_expires    TIMESTAMP,
  last_login                TIMESTAMP,
  created_at                TIMESTAMP DEFAULT NOW(),
  updated_at                TIMESTAMP DEFAULT NOW()
);


-- ============================================================
-- FREELANCER PROFILES (Extended data for freelancers)
-- ============================================================

CREATE TABLE freelancer_profiles (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio                    TEXT,
  profile_picture_url    TEXT,
  portfolio_url          TEXT,
  level                  user_level DEFAULT 'Bronze',
  rating                 DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  review_count           INT DEFAULT 0,
  completed_projects     INT DEFAULT 0,
  total_earnings         BIGINT DEFAULT 0,
  passport_days_completed INT DEFAULT 0,
  passport_start_date    DATE,
  created_at             TIMESTAMP DEFAULT NOW(),
  updated_at             TIMESTAMP DEFAULT NOW()
);


-- ============================================================
-- EMPLOYER PROFILES (Extended data for employers/companies)
-- ============================================================

CREATE TABLE employer_profiles (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name         VARCHAR(255) NOT NULL,
  industry             VARCHAR(100),
  company_description  TEXT,
  company_logo_url     TEXT,
  website_url          TEXT,
  location             VARCHAR(255),
  total_jobs_posted    INT DEFAULT 0,
  total_hired          INT DEFAULT 0,
  created_at           TIMESTAMP DEFAULT NOW(),
  updated_at           TIMESTAMP DEFAULT NOW()
);


-- ============================================================
-- SKILLS (Master list)
-- ============================================================

CREATE TABLE skills (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100) UNIQUE NOT NULL,
  category    VARCHAR(100),
  created_at  TIMESTAMP DEFAULT NOW()
);


-- ============================================================
-- USER SKILLS (Junction: user â†” skill)
-- ============================================================

CREATE TABLE user_skills (
  user_id   UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_id  UUID REFERENCES skills(id) ON DELETE CASCADE,
  added_at  TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, skill_id)
);


-- ============================================================
-- JOB CATEGORIES
-- ============================================================

CREATE TABLE job_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100) UNIQUE NOT NULL,
  icon        VARCHAR(10),
  created_at  TIMESTAMP DEFAULT NOW()
);


-- ============================================================
-- JOB POSTINGS
-- ============================================================

CREATE TABLE job_postings (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title             VARCHAR(255) NOT NULL,
  category_id       UUID REFERENCES job_categories(id) ON DELETE SET NULL,
  description       TEXT NOT NULL,
  budget_min        DECIMAL(12,2),
  budget_max        DECIMAL(12,2),
  budget_type       budget_type DEFAULT 'fixed',
  deadline_days     INT,
  deadline_date     DATE,
  location          VARCHAR(255),
  location_type     location_type DEFAULT 'Remote',
  experience_level  experience_level DEFAULT 'Junior',
  contact_whatsapp  VARCHAR(20),
  contact_email     VARCHAR(255),
  status            job_status DEFAULT 'pending_review',
  view_count        INT DEFAULT 0,
  application_count INT DEFAULT 0,
  admin_notes       TEXT,
  reviewed_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at       TIMESTAMP,
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW(),

  CONSTRAINT valid_budget CHECK (budget_min IS NULL OR budget_max IS NULL OR budget_min <= budget_max)
);


-- ============================================================
-- JOB SKILLS (Junction: job â†” skill)
-- ============================================================

CREATE TABLE job_skills (
  job_id    UUID REFERENCES job_postings(id) ON DELETE CASCADE,
  skill_id  UUID REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (job_id, skill_id)
);


-- ============================================================
-- JOB REQUIREMENTS (Free-text requirements list per job)
-- ============================================================

CREATE TABLE job_requirements (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id       UUID NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
  requirement  TEXT NOT NULL,
  order_index  INT DEFAULT 0
);


-- ============================================================
-- APPLICATIONS
-- ============================================================

CREATE TABLE applications (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id         UUID NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
  freelancer_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cover_letter   TEXT NOT NULL CHECK (char_length(cover_letter) <= 300),
  status         application_status DEFAULT 'pending',
  submitted_at   TIMESTAMP DEFAULT NOW(),
  reviewed_at    TIMESTAMP,
  expires_at     TIMESTAMP DEFAULT (NOW() + INTERVAL '14 days'),
  UNIQUE(job_id, freelancer_id)
);


-- ============================================================
-- BADGES (Master definitions)
-- ============================================================

CREATE TABLE badges (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                      VARCHAR(100) UNIQUE NOT NULL,
  icon                      VARCHAR(10),
  description               TEXT,
  rarity                    badge_rarity DEFAULT 'common',
  trigger_condition         badge_trigger_condition NOT NULL,
  requires_admin_verification BOOLEAN DEFAULT FALSE,
  created_at                TIMESTAMP DEFAULT NOW()
);


-- ============================================================
-- USER BADGES (Earned badges)
-- ============================================================

CREATE TABLE user_badges (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id     UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at    TIMESTAMP DEFAULT NOW(),
  verified_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  verified_at  TIMESTAMP,
  is_active    BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id, badge_id)
);


-- ============================================================
-- PASSPORT PROGRESS (Per-user 30-day journey state)
-- ============================================================

CREATE TABLE passport_progress (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_day   INT DEFAULT 1 CHECK (current_day BETWEEN 1 AND 30),
  start_date    DATE DEFAULT CURRENT_DATE,
  completed_at  TIMESTAMP,
  level         user_level DEFAULT 'Bronze',
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);


-- ============================================================
-- PASSPORT DAY COMPLETIONS (Which days user has finished)
-- ============================================================

CREATE TABLE passport_day_completions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_number   INT NOT NULL CHECK (day_number BETWEEN 1 AND 30),
  completed_at TIMESTAMP DEFAULT NOW(),
  notes        TEXT,
  UNIQUE(user_id, day_number)
);


-- ============================================================
-- EVENTS (Community events in Yogyakarta)
-- ============================================================

CREATE TABLE events (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title             VARCHAR(255) NOT NULL,
  description       TEXT,
  type              event_type NOT NULL,
  event_date        DATE NOT NULL,
  event_time        TIME NOT NULL,
  duration_minutes  INT DEFAULT 60 CHECK (duration_minutes > 0),
  location_name     VARCHAR(255),
  location_address  TEXT,
  latitude          DECIMAL(10,8),
  longitude         DECIMAL(11,8),
  organizer_id      UUID REFERENCES users(id) ON DELETE SET NULL,
  organizer_name    VARCHAR(255),
  image_url         TEXT,
  attendee_limit    INT CHECK (attendee_limit > 0),
  attendee_count    INT DEFAULT 0,
  check_in_code     VARCHAR(20) UNIQUE,
  is_free           BOOLEAN DEFAULT TRUE,
  price             DECIMAL(10,2),
  registration_url  TEXT,
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);


-- ============================================================
-- EVENT SKILLS (Junction: event â†” relevant skill)
-- ============================================================

CREATE TABLE event_skills (
  event_id  UUID REFERENCES events(id) ON DELETE CASCADE,
  skill_id  UUID REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, skill_id)
);


-- ============================================================
-- EVENT ATTENDANCE (RSVP + QR check-in)
-- ============================================================

CREATE TABLE event_attendance (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id       UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rsvp_at        TIMESTAMP DEFAULT NOW(),
  checked_in     BOOLEAN DEFAULT FALSE,
  checked_in_at  TIMESTAMP,
  badge_awarded  BOOLEAN DEFAULT FALSE,
  UNIQUE(event_id, user_id)
);


-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type          notification_type NOT NULL,
  title         VARCHAR(255) NOT NULL,
  message       TEXT NOT NULL,
  is_read       BOOLEAN DEFAULT FALSE,
  related_id    UUID,
  related_type  VARCHAR(50),
  created_at    TIMESTAMP DEFAULT NOW()
);


-- ============================================================
-- REVIEWS (Peer reviews of freelancers after job completion)
-- ============================================================

CREATE TABLE reviews (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id       UUID REFERENCES job_postings(id) ON DELETE SET NULL,
  rating       INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT,
  created_at   TIMESTAMP DEFAULT NOW(),
  UNIQUE(reviewer_id, reviewee_id, job_id)
);


-- ============================================================
-- INDEXES
-- ============================================================

-- Users
CREATE INDEX idx_users_email       ON users(email);
CREATE INDEX idx_users_role        ON users(role);
CREATE INDEX idx_users_created_at  ON users(created_at DESC);

-- Freelancer profiles
CREATE INDEX idx_freelancer_profiles_user    ON freelancer_profiles(user_id);
CREATE INDEX idx_freelancer_profiles_rating  ON freelancer_profiles(rating DESC);
CREATE INDEX idx_freelancer_profiles_level   ON freelancer_profiles(level);

-- Job postings
CREATE INDEX idx_job_postings_status        ON job_postings(status);
CREATE INDEX idx_job_postings_employer      ON job_postings(employer_id);
CREATE INDEX idx_job_postings_category      ON job_postings(category_id);
CREATE INDEX idx_job_postings_created       ON job_postings(created_at DESC);
CREATE INDEX idx_job_postings_deadline      ON job_postings(deadline_date);
CREATE INDEX idx_job_postings_budget        ON job_postings(budget_max DESC);
CREATE INDEX idx_job_postings_location_type ON job_postings(location_type);

-- Applications
CREATE INDEX idx_applications_job          ON applications(job_id);
CREATE INDEX idx_applications_freelancer   ON applications(freelancer_id);
CREATE INDEX idx_applications_status       ON applications(status);
CREATE INDEX idx_applications_submitted    ON applications(submitted_at DESC);

-- Passport
CREATE INDEX idx_passport_progress_user        ON passport_progress(user_id);
CREATE INDEX idx_passport_day_completions_user ON passport_day_completions(user_id);

-- Events
CREATE INDEX idx_events_date         ON events(event_date);
CREATE INDEX idx_events_type         ON events(type);
CREATE INDEX idx_events_organizer    ON events(organizer_id);

-- Event attendance
CREATE INDEX idx_event_attendance_event ON event_attendance(event_id);
CREATE INDEX idx_event_attendance_user  ON event_attendance(user_id);

-- Notifications
CREATE INDEX idx_notifications_user      ON notifications(user_id);
CREATE INDEX idx_notifications_unread    ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created   ON notifications(created_at DESC);

-- Badges
CREATE INDEX idx_user_badges_user     ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge    ON user_badges(badge_id);

-- Skills
CREATE INDEX idx_user_skills_user  ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill ON user_skills(skill_id);
CREATE INDEX idx_job_skills_job    ON job_skills(job_id);
CREATE INDEX idx_job_skills_skill  ON job_skills(skill_id);

-- Reviews
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);


-- ============================================================
-- TRIGGERS: Auto-update updated_at columns
-- ============================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_freelancer_profiles_updated_at
  BEFORE UPDATE ON freelancer_profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_employer_profiles_updated_at
  BEFORE UPDATE ON employer_profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_job_postings_updated_at
  BEFORE UPDATE ON job_postings
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_passport_progress_updated_at
  BEFORE UPDATE ON passport_progress
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- ============================================================
-- TRIGGER: Auto-expire applications after 14 days
-- ============================================================

CREATE OR REPLACE FUNCTION expire_stale_applications()
RETURNS void AS $$
BEGIN
  UPDATE applications
  SET status = 'expired'
  WHERE status = 'pending'
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- TRIGGER: Increment application_count on job when application inserted
-- ============================================================

CREATE OR REPLACE FUNCTION increment_job_application_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE job_postings
  SET application_count = application_count + 1
  WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_increment_application_count
  AFTER INSERT ON applications
  FOR EACH ROW EXECUTE FUNCTION increment_job_application_count();


-- ============================================================
-- TRIGGER: Sync freelancer_profiles.passport_days_completed
-- ============================================================

CREATE OR REPLACE FUNCTION sync_passport_days_completed()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE freelancer_profiles
  SET passport_days_completed = (
    SELECT COUNT(*) FROM passport_day_completions
    WHERE user_id = NEW.user_id
  )
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_passport_days
  AFTER INSERT OR DELETE ON passport_day_completions
  FOR EACH ROW EXECUTE FUNCTION sync_passport_days_completed();


-- ============================================================
-- TRIGGER: Sync attendee_count on events
-- ============================================================

CREATE OR REPLACE FUNCTION sync_event_attendee_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE events SET attendee_count = attendee_count + 1 WHERE id = NEW.event_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE events SET attendee_count = GREATEST(attendee_count - 1, 0) WHERE id = OLD.event_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_event_attendee_count
  AFTER INSERT OR DELETE ON event_attendance
  FOR EACH ROW EXECUTE FUNCTION sync_event_attendee_count();


-- ============================================================
-- SEED: Job Categories
-- ============================================================

INSERT INTO job_categories (name, icon) VALUES
  ('Web Development',    'ðŸ’»'),
  ('UI/UX Design',       'ðŸŽ¨'),
  ('Mobile Development', 'ðŸ“±'),
  ('Content Writing',    'âœï¸'),
  ('Video Editing',      'ðŸŽ¬'),
  ('Social Media',       'ðŸ“²'),
  ('Logo Design',        'ðŸ–¼ï¸'),
  ('Photography',        'ðŸ“·'),
  ('Data Entry',         'ðŸ“Š');


-- ============================================================
-- SEED: Skills
-- ============================================================

INSERT INTO skills (name, category) VALUES
  -- Web Development
  ('React',       'Web Development'),
  ('Vue.js',      'Web Development'),
  ('Next.js',     'Web Development'),
  ('TypeScript',  'Web Development'),
  ('JavaScript',  'Web Development'),
  ('Node.js',     'Web Development'),
  ('Laravel',     'Web Development'),
  ('PHP',         'Web Development'),
  ('WordPress',   'Web Development'),
  ('CSS',         'Web Development'),
  -- UI/UX Design
  ('Figma',       'UI/UX Design'),
  ('Adobe XD',    'UI/UX Design'),
  ('Illustrator', 'UI/UX Design'),
  ('Photoshop',   'UI/UX Design'),
  ('Sketch',      'UI/UX Design'),
  ('UI Design',   'UI/UX Design'),
  ('UX Design',   'UI/UX Design'),
  ('Prototyping', 'UI/UX Design'),
  ('User Research','UI/UX Design'),
  ('Design System','UI/UX Design'),
  -- Mobile
  ('Flutter',         'Mobile Development'),
  ('React Native',    'Mobile Development'),
  -- Content
  ('SEO Writing',     'Content Writing'),
  ('Copywriting',     'Content Writing'),
  ('Bahasa Indonesia','Content Writing'),
  ('Content Strategy','Content Writing'),
  -- Video
  ('Premiere Pro',    'Video Editing'),
  ('After Effects',   'Video Editing'),
  ('Color Grading',   'Video Editing'),
  -- Social Media
  ('Instagram',       'Social Media'),
  ('TikTok',          'Social Media'),
  ('Facebook Ads',    'Social Media'),
  -- Other
  ('MongoDB',         'Database'),
  ('GraphQL',         'Web Development'),
  ('Motion Design',   'UI/UX Design'),
  ('Canva',           'Design'),
  ('Research',        'Other');


-- ============================================================
-- SEED: Badges
-- ============================================================

INSERT INTO badges (name, icon, description, rarity, trigger_condition, requires_admin_verification) VALUES
  ('Profile Complete',         'âœ“',  'Lengkapi profil 100% â€” foto, bio, skill, dan portfolio',                 'common',    'profile_complete',    FALSE),
  ('Day 5 Milestone',          'ðŸ“…', 'Selesaikan 5 hari pertama perjalanan Passport',                          'uncommon',  'day_5_milestone',     FALSE),
  ('Event Attendee',           'ðŸŽ¤', 'Hadiri event atau meetup dan check-in via QR code',                      'common',    'event_attended',      TRUE),
  ('Day 15 Milestone',         'ðŸŒŸ', 'Selesaikan 15 hari fase Eksplorasi',                                     'rare',      'day_15_milestone',    FALSE),
  ('First Application',        'ðŸŽ¯', 'Submit lamaran pekerjaan pertama kamu',                                  'common',    'first_application',   FALSE),
  ('Job Completed',            'ðŸ’¼', 'Selesaikan project freelance pertama dengan sukses',                     'uncommon',  'job_completed',       FALSE),
  ('Community Helper',         'ðŸ¤', 'Bantu 3+ freelancer lain di komunitas',                                  'rare',      'community_helper',    FALSE),
  ('30-Day Passport Finisher', 'ðŸ†', 'Selesaikan seluruh 30 hari perjalanan Jogja Freelance Passport',        'legendary', 'day_30_complete',     FALSE);


-- ============================================================
-- END OF SCHEMA
-- ============================================================
