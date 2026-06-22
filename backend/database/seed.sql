-- ============================================================
-- SEED DATA: Jogja Freelance Passport
-- Run AFTER schema.sql
-- ============================================================

-- Admin user (password: Admin@12345)
INSERT INTO users (id, email, password_hash, full_name, city, role, is_email_verified, is_verified)
VALUES (
  uuid_generate_v4(),
  'admin@jogjafreelance.id',
  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Admin Jogja Freelance',
  'Yogyakarta',
  'admin',
  TRUE,
  TRUE
);

-- Sample employer (password: Test@12345)
WITH emp AS (
  INSERT INTO users (id, email, password_hash, full_name, city, role, is_email_verified)
  VALUES (
    uuid_generate_v4(),
    'batikstudio@example.com',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Budi Santoso',
    'Yogyakarta',
    'employer',
    TRUE
  )
  RETURNING id
)
INSERT INTO employer_profiles (user_id, company_name, industry, location, total_jobs_posted, total_hired)
SELECT id, 'Batik Digital Studio', 'Desain & Kreatif', 'Kotagede, Yogyakarta', 4, 7
FROM emp;

-- Sample freelancer (password: Test@12345)
WITH fl AS (
  INSERT INTO users (id, email, password_hash, full_name, city, role, is_email_verified)
  VALUES (
    uuid_generate_v4(),
    'andi@example.com',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Andi Nugroho',
    'Yogyakarta',
    'freelancer',
    TRUE
  )
  RETURNING id
),
fp AS (
  INSERT INTO freelancer_profiles (user_id, bio, portfolio_url, level, rating, review_count, completed_projects)
  SELECT id,
    'React developer dengan 3 tahun pengalaman. Spesialisasi: frontend development, UI/UX implementation.',
    'https://github.com/andinugroho',
    'Bronze', 4.8, 3, 5
  FROM fl
  RETURNING user_id
)
INSERT INTO passport_progress (user_id) SELECT user_id FROM fp;

-- Add skills to sample freelancer
WITH fl AS (SELECT id FROM users WHERE email = 'andi@example.com')
INSERT INTO user_skills (user_id, skill_id)
SELECT fl.id, s.id FROM fl, skills s
WHERE s.name IN ('React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js');

-- Sample events (organizer = employer)
WITH org AS (SELECT id FROM users WHERE email = 'batikstudio@example.com')
INSERT INTO events (
  title, description, type, event_date, event_time, duration_minutes,
  location_name, location_address, latitude, longitude,
  organizer_id, organizer_name, is_free, check_in_code, attendee_limit
) VALUES
(
  'React Advanced Patterns Workshop',
  'Belajar advanced React patterns: render props, custom hooks, context optimization.',
  'workshop', '2026-06-20', '10:00', 120,
  'KORIDOR Coworking', 'Jl. Sosrowijayan, Yogyakarta', -7.797068, 110.370529,
  (SELECT id FROM org), 'Komunitas Frontend Jogja',
  TRUE, 'REACT2026', 30
),
(
  'Freelancer Networking Hangout',
  'Casual coffee hangout untuk para freelancer Jogja. Networking, share pengalaman.',
  'coffee_chat', '2026-06-21', '14:00', 90,
  'Kopi Pendakian', 'Jl. Malioboro, Yogyakarta', -7.796368, 110.370123,
  (SELECT id FROM org), 'Jogja Freelancer Community',
  TRUE, 'NETWORK21', 50
),
(
  'UI/UX Design Bootcamp',
  '3-hari intensive bootcamp UI/UX dari 0: design thinking, wireframing, prototyping.',
  'workshop', '2026-06-23', '09:00', 480,
  'Ruang Kolektif', 'Jl. Diponegoro, Yogyakarta', -7.805434, 110.372856,
  (SELECT id FROM org), 'Design Academy Jogja',
  FALSE, 'UIUX2026', 20
);

-- ============================================================
-- END SEED
-- ============================================================
