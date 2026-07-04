-- ============================================================
-- SEED DATA: Jogja Freelance Passport
-- Run AFTER schema.sql
-- ============================================================

-- ============================================================
-- ADMIN
-- ============================================================
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

-- ============================================================
-- EMPLOYERS (pembuat lowongan)
-- password: Test@12345 untuk semua
-- ============================================================

-- Employer 1: Batik Digital Studio
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
INSERT INTO employer_profiles (user_id, company_name, industry, company_description, location, total_jobs_posted, total_hired)
SELECT id,
  'Batik Digital Studio',
  'Desain & Kreatif',
  'Studio desain digital yang mengkhususkan diri pada branding UMKM dan motif batik modern.',
  'Kotagede, Yogyakarta',
  4, 7
FROM emp;

-- Employer 2: Warung Tech
WITH emp AS (
  INSERT INTO users (id, email, password_hash, full_name, city, role, is_email_verified)
  VALUES (
    uuid_generate_v4(),
    'warungtech@example.com',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Siti Rahayu',
    'Yogyakarta',
    'employer',
    TRUE
  )
  RETURNING id
)
INSERT INTO employer_profiles (user_id, company_name, industry, company_description, location, total_jobs_posted, total_hired)
SELECT id,
  'Warung Tech',
  'Teknologi & Startup',
  'Startup teknologi lokal Jogja yang membangun produk digital untuk UMKM.',
  'Seturan, Sleman',
  6, 12
FROM emp;

-- Employer 3: Jogja Content House
WITH emp AS (
  INSERT INTO users (id, email, password_hash, full_name, city, role, is_email_verified)
  VALUES (
    uuid_generate_v4(),
    'jogjacontenthouse@example.com',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Reza Firmansyah',
    'Yogyakarta',
    'employer',
    TRUE
  )
  RETURNING id
)
INSERT INTO employer_profiles (user_id, company_name, industry, company_description, location, total_jobs_posted, total_hired)
SELECT id,
  'Jogja Content House',
  'Media & Konten Digital',
  'Agensi konten digital spesialis video, copywriting, dan social media management.',
  'Mlati, Sleman',
  3, 5
FROM emp;

-- Employer 4: Matahari App Studio
WITH emp AS (
  INSERT INTO users (id, email, password_hash, full_name, city, role, is_email_verified)
  VALUES (
    uuid_generate_v4(),
    'matahariapp@example.com',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Dian Pratiwi',
    'Yogyakarta',
    'employer',
    TRUE
  )
  RETURNING id
)
INSERT INTO employer_profiles (user_id, company_name, industry, company_description, location, total_jobs_posted, total_hired)
SELECT id,
  'Matahari App Studio',
  'Mobile Development',
  'Studio aplikasi mobile berfokus pada solusi pemesanan dan marketplace lokal.',
  'Condongcatur, Sleman',
  5, 9
FROM emp;

-- ============================================================
-- EVENT ORGANIZER
-- ============================================================
INSERT INTO users (id, email, password_hash, full_name, city, role, is_email_verified)
VALUES (
  uuid_generate_v4(),
  'komunitas.jogja@example.com',
  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Hendra Kusuma',
  'Yogyakarta',
  'event_organizer',
  TRUE
);

-- ============================================================
-- FREELANCERS
-- ============================================================

-- Freelancer 1: Andi Nugroho (React Dev)
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
    'Silver', 4.8, 12, 15
  FROM fl
  RETURNING user_id
)
INSERT INTO passport_progress (user_id, current_day) SELECT user_id, 18 FROM fp;

WITH fl AS (SELECT id FROM users WHERE email = 'andi@example.com')
INSERT INTO user_skills (user_id, skill_id)
SELECT fl.id, s.id FROM fl, skills s
WHERE s.name IN ('React', 'TypeScript', 'Next.js', 'Node.js');

-- Freelancer 2: Maya Sari (UI/UX Designer)
WITH fl AS (
  INSERT INTO users (id, email, password_hash, full_name, city, role, is_email_verified)
  VALUES (
    uuid_generate_v4(),
    'maya@example.com',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Maya Sari',
    'Yogyakarta',
    'freelancer',
    TRUE
  )
  RETURNING id
),
fp AS (
  INSERT INTO freelancer_profiles (user_id, bio, portfolio_url, level, rating, review_count, completed_projects)
  SELECT id,
    'UI/UX designer berpengalaman 4 tahun. Ahli Figma dan design system untuk produk digital.',
    'https://behance.net/mayasari',
    'Gold', 4.9, 20, 28
  FROM fl
  RETURNING user_id
)
INSERT INTO passport_progress (user_id, current_day) SELECT user_id, 25 FROM fp;

WITH fl AS (SELECT id FROM users WHERE email = 'maya@example.com')
INSERT INTO user_skills (user_id, skill_id)
SELECT fl.id, s.id FROM fl, skills s
WHERE s.name IN ('Figma', 'UI Design', 'UX Design', 'Prototyping', 'Design System');

-- Freelancer 3: Rizky Pratama (Flutter Dev)
WITH fl AS (
  INSERT INTO users (id, email, password_hash, full_name, city, role, is_email_verified)
  VALUES (
    uuid_generate_v4(),
    'rizky@example.com',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Rizky Pratama',
    'Yogyakarta',
    'freelancer',
    TRUE
  )
  RETURNING id
),
fp AS (
  INSERT INTO freelancer_profiles (user_id, bio, portfolio_url, level, rating, review_count, completed_projects)
  SELECT id,
    'Mobile developer spesialis Flutter. Sudah publish 5 aplikasi di Play Store dan App Store.',
    'https://github.com/rizkypratama',
    'Silver', 4.7, 8, 10
  FROM fl
  RETURNING user_id
)
INSERT INTO passport_progress (user_id, current_day) SELECT user_id, 12 FROM fp;

WITH fl AS (SELECT id FROM users WHERE email = 'rizky@example.com')
INSERT INTO user_skills (user_id, skill_id)
SELECT fl.id, s.id FROM fl, skills s
WHERE s.name IN ('Flutter', 'React Native', 'Figma');

-- Freelancer 4: Nadia Putri (Content Writer)
WITH fl AS (
  INSERT INTO users (id, email, password_hash, full_name, city, role, is_email_verified)
  VALUES (
    uuid_generate_v4(),
    'nadia@example.com',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Nadia Putri',
    'Yogyakarta',
    'freelancer',
    TRUE
  )
  RETURNING id
),
fp AS (
  INSERT INTO freelancer_profiles (user_id, bio, portfolio_url, level, rating, review_count, completed_projects)
  SELECT id,
    'Content writer & copywriter dengan pengalaman di berbagai industri. SEO-savvy.',
    'https://medium.com/@nadiaputri',
    'Bronze', 4.5, 5, 7
  FROM fl
  RETURNING user_id
)
INSERT INTO passport_progress (user_id, current_day) SELECT user_id, 6 FROM fp;

WITH fl AS (SELECT id FROM users WHERE email = 'nadia@example.com')
INSERT INTO user_skills (user_id, skill_id)
SELECT fl.id, s.id FROM fl, skills s
WHERE s.name IN ('SEO Writing', 'Copywriting', 'Bahasa Indonesia', 'Content Strategy');

-- ============================================================
-- JOB POSTINGS (lowongan dengan relasi ke employer)
-- ============================================================

-- Lowongan dari Batik Digital Studio
WITH emp AS (SELECT id FROM users WHERE email = 'batikstudio@example.com'),
     cat AS (SELECT id FROM job_categories WHERE name = 'UI/UX Design')
INSERT INTO job_postings (
  employer_id, title, category_id, description,
  budget_min, budget_max, budget_type,
  deadline_days, location_type, experience_level,
  contact_whatsapp, status
)
SELECT emp.id, 'UI/UX Designer untuk Rebranding UMKM Batik', cat.id,
  'Kami mencari UI/UX designer berpengalaman untuk merancang ulang identitas visual dan website toko batik online kami. Output: design system, wireframe, dan prototype interaktif.',
  1500000, 3500000, 'fixed',
  21, 'Hybrid', 'Mid',
  '081234567890', 'active'
FROM emp, cat;

WITH jp AS (SELECT id FROM job_postings WHERE title = 'UI/UX Designer untuk Rebranding UMKM Batik')
INSERT INTO job_skills (job_id, skill_id)
SELECT jp.id, s.id FROM jp, skills s WHERE s.name IN ('Figma', 'UI Design', 'UX Design', 'Prototyping');

WITH jp AS (SELECT id FROM job_postings WHERE title = 'UI/UX Designer untuk Rebranding UMKM Batik')
INSERT INTO job_requirements (job_id, requirement, order_index) VALUES
  ((SELECT id FROM jp), 'Portfolio desain UI/UX minimal 3 project', 0),
  ((SELECT id FROM jp), 'Pengalaman dengan Figma dan design token', 1),
  ((SELECT id FROM jp), 'Mampu buat design system yang konsisten', 2);

-- Lowongan dari Batik Digital Studio - 2
WITH emp AS (SELECT id FROM users WHERE email = 'batikstudio@example.com'),
     cat AS (SELECT id FROM job_categories WHERE name = 'Logo Design')
INSERT INTO job_postings (
  employer_id, title, category_id, description,
  budget_min, budget_max, budget_type,
  deadline_days, location_type, experience_level,
  contact_whatsapp, status
)
SELECT emp.id, 'Desainer Logo & Brand Identity', cat.id,
  'Butuh desainer logo dan brand identity untuk 5 UMKM batik binaan kami. Setiap brand butuh logo, warna, dan panduan identitas visual.',
  800000, 2000000, 'fixed',
  14, 'Remote', 'Junior',
  '081234567890', 'active'
FROM emp, cat;

WITH jp AS (SELECT id FROM job_postings WHERE title = 'Desainer Logo & Brand Identity')
INSERT INTO job_skills (job_id, skill_id)
SELECT jp.id, s.id FROM jp, skills s WHERE s.name IN ('Illustrator', 'Photoshop', 'Canva');

-- Lowongan dari Warung Tech
WITH emp AS (SELECT id FROM users WHERE email = 'warungtech@example.com'),
     cat AS (SELECT id FROM job_categories WHERE name = 'Web Development')
INSERT INTO job_postings (
  employer_id, title, category_id, description,
  budget_min, budget_max, budget_type,
  deadline_days, location_type, experience_level,
  contact_whatsapp, status
)
SELECT emp.id, 'Full Stack Developer Next.js + Laravel', cat.id,
  'Warung Tech sedang membangun platform marketplace untuk UMKM kuliner Jogja. Kami butuh developer yang bisa handle frontend Next.js dan backend Laravel. Sistem pembayaran, manajemen produk, dan dashboard admin.',
  3000000, 6000000, 'fixed',
  30, 'Hybrid', 'Mid',
  '082345678901', 'active'
FROM emp, cat;

WITH jp AS (SELECT id FROM job_postings WHERE title = 'Full Stack Developer Next.js + Laravel')
INSERT INTO job_skills (job_id, skill_id)
SELECT jp.id, s.id FROM jp, skills s WHERE s.name IN ('Next.js', 'Laravel', 'TypeScript', 'PHP');

WITH jp AS (SELECT id FROM job_postings WHERE title = 'Full Stack Developer Next.js + Laravel')
INSERT INTO job_requirements (job_id, requirement, order_index) VALUES
  ((SELECT id FROM jp), 'Pengalaman Next.js dan Laravel minimal 2 tahun', 0),
  ((SELECT id FROM jp), 'Familiar dengan REST API dan PostgreSQL', 1),
  ((SELECT id FROM jp), 'Bisa join call mingguan (remote friendly)', 2),
  ((SELECT id FROM jp), 'Portfolio project marketplace/e-commerce menjadi nilai plus', 3);

-- Lowongan dari Warung Tech - 2
WITH emp AS (SELECT id FROM users WHERE email = 'warungtech@example.com'),
     cat AS (SELECT id FROM job_categories WHERE name = 'UI/UX Design')
INSERT INTO job_postings (
  employer_id, title, category_id, description,
  budget_min, budget_max, budget_type,
  deadline_days, location_type, experience_level,
  contact_whatsapp, status
)
SELECT emp.id, 'Product Designer Mobile App', cat.id,
  'Desain aplikasi mobile untuk pemesanan kuliner UMKM. Perlu UX research, wireframe, dan UI kit lengkap. Kolaborasi langsung dengan developer Flutter.',
  2000000, 4000000, 'fixed',
  21, 'Remote', 'Mid',
  '082345678901', 'active'
FROM emp, cat;

WITH jp AS (SELECT id FROM job_postings WHERE title = 'Product Designer Mobile App')
INSERT INTO job_skills (job_id, skill_id)
SELECT jp.id, s.id FROM jp, skills s WHERE s.name IN ('Figma', 'Prototyping', 'User Research', 'Design System');

-- Lowongan dari Warung Tech - 3
WITH emp AS (SELECT id FROM users WHERE email = 'warungtech@example.com'),
     cat AS (SELECT id FROM job_categories WHERE name = 'Web Development')
INSERT INTO job_postings (
  employer_id, title, category_id, description,
  budget_min, budget_max, budget_type,
  deadline_days, location_type, experience_level,
  contact_email, status
)
SELECT emp.id, 'React Developer Landing Page', cat.id,
  'Butuh React developer untuk membangun landing page produk baru kami. Design sudah ada dari tim designer, tinggal implementasi. Responsive, animasi halus, performa tinggi.',
  1200000, 2500000, 'fixed',
  10, 'Remote', 'Junior',
  'warungtech@example.com', 'active'
FROM emp, cat;

WITH jp AS (SELECT id FROM job_postings WHERE title = 'React Developer Landing Page')
INSERT INTO job_skills (job_id, skill_id)
SELECT jp.id, s.id FROM jp, skills s WHERE s.name IN ('React', 'TypeScript', 'CSS');

-- Lowongan dari Jogja Content House
WITH emp AS (SELECT id FROM users WHERE email = 'jogjacontenthouse@example.com'),
     cat AS (SELECT id FROM job_categories WHERE name = 'Content Writing')
INSERT INTO job_postings (
  employer_id, title, category_id, description,
  budget_min, budget_max, budget_type,
  deadline_days, location_type, experience_level,
  contact_whatsapp, status
)
SELECT emp.id, 'Content Writer SEO – Blog Wisata Kuliner Jogja', cat.id,
  'Kami butuh content writer yang bisa tulis artikel SEO tentang wisata kuliner Yogyakarta. 10 artikel per bulan, masing-masing 1000–1500 kata. Topik disiapkan oleh tim kami.',
  1000000, 2000000, 'fixed',
  30, 'Remote', 'Junior',
  '083456789012', 'active'
FROM emp, cat;

WITH jp AS (SELECT id FROM job_postings WHERE title = 'Content Writer SEO – Blog Wisata Kuliner Jogja')
INSERT INTO job_skills (job_id, skill_id)
SELECT jp.id, s.id FROM jp, skills s WHERE s.name IN ('SEO Writing', 'Bahasa Indonesia', 'Copywriting');

WITH jp AS (SELECT id FROM job_postings WHERE title = 'Content Writer SEO – Blog Wisata Kuliner Jogja')
INSERT INTO job_requirements (job_id, requirement, order_index) VALUES
  ((SELECT id FROM jp), 'Pengalaman nulis artikel SEO minimal 6 bulan', 0),
  ((SELECT id FROM jp), 'Pahami dasar on-page SEO (keyword, heading, meta)', 1),
  ((SELECT id FROM jp), 'Bisa kirim draft dalam 3 hari kerja per artikel', 2);

-- Lowongan dari Jogja Content House - 2
WITH emp AS (SELECT id FROM users WHERE email = 'jogjacontenthouse@example.com'),
     cat AS (SELECT id FROM job_categories WHERE name = 'Video Editing')
INSERT INTO job_postings (
  employer_id, title, category_id, description,
  budget_min, budget_max, budget_type,
  deadline_days, location_type, experience_level,
  contact_whatsapp, status
)
SELECT emp.id, 'Video Editor Konten Instagram & TikTok', cat.id,
  'Dibutuhkan video editor untuk konten reels Instagram dan TikTok klien kami di bidang kuliner dan lifestyle. 20 video per bulan. Footage sudah tersedia, perlu editing, caption, dan color grading.',
  1500000, 3000000, 'fixed',
  14, 'Remote', 'Mid',
  '083456789012', 'active'
FROM emp, cat;

WITH jp AS (SELECT id FROM job_postings WHERE title = 'Video Editor Konten Instagram & TikTok')
INSERT INTO job_skills (job_id, skill_id)
SELECT jp.id, s.id FROM jp, skills s WHERE s.name IN ('Premiere Pro', 'After Effects', 'Color Grading');

-- Lowongan dari Jogja Content House - 3
WITH emp AS (SELECT id FROM users WHERE email = 'jogjacontenthouse@example.com'),
     cat AS (SELECT id FROM job_categories WHERE name = 'Social Media')
INSERT INTO job_postings (
  employer_id, title, category_id, description,
  budget_min, budget_max, budget_type,
  deadline_days, location_type, experience_level,
  contact_email, status
)
SELECT emp.id, 'Social Media Manager – Akun Brand F&B', cat.id,
  'Kelola akun Instagram dan TikTok brand F&B klien kami. Termasuk: strategi konten, jadwal posting, engagement, dan monthly report. Pengalaman brand food & beverage jadi nilai plus.',
  2000000, 3500000, 'fixed',
  30, 'Remote', 'Mid',
  'jogjacontenthouse@example.com', 'active'
FROM emp, cat;

WITH jp AS (SELECT id FROM job_postings WHERE title = 'Social Media Manager – Akun Brand F&B')
INSERT INTO job_skills (job_id, skill_id)
SELECT jp.id, s.id FROM jp, skills s WHERE s.name IN ('Instagram', 'TikTok', 'Copywriting', 'Facebook Ads');

-- Lowongan dari Matahari App Studio
WITH emp AS (SELECT id FROM users WHERE email = 'matahariapp@example.com'),
     cat AS (SELECT id FROM job_categories WHERE name = 'Mobile Development')
INSERT INTO job_postings (
  employer_id, title, category_id, description,
  budget_min, budget_max, budget_type,
  deadline_days, location_type, experience_level,
  contact_whatsapp, status
)
SELECT emp.id, 'Flutter Developer – Aplikasi Pemesanan Laundry', cat.id,
  'Matahari App Studio sedang develop aplikasi pemesanan laundry berbasis Flutter. Fitur: registrasi/login, pilih layanan, tracking status order, push notification, dan payment gateway.',
  4000000, 7000000, 'fixed',
  45, 'Remote', 'Mid',
  '084567890123', 'active'
FROM emp, cat;

WITH jp AS (SELECT id FROM job_postings WHERE title = 'Flutter Developer – Aplikasi Pemesanan Laundry')
INSERT INTO job_skills (job_id, skill_id)
SELECT jp.id, s.id FROM jp, skills s WHERE s.name IN ('Flutter', 'React Native');

WITH jp AS (SELECT id FROM job_postings WHERE title = 'Flutter Developer – Aplikasi Pemesanan Laundry')
INSERT INTO job_requirements (job_id, requirement, order_index) VALUES
  ((SELECT id FROM jp), 'Pengalaman Flutter minimal 1.5 tahun', 0),
  ((SELECT id FROM jp), 'Pernah integrasi payment gateway (Midtrans/Xendit)', 1),
  ((SELECT id FROM jp), 'Familiar dengan state management (Bloc/Provider/Riverpod)', 2),
  ((SELECT id FROM jp), 'Bisa deliver build APK dan IPA untuk testing', 3);

-- Lowongan dari Matahari App Studio - 2
WITH emp AS (SELECT id FROM users WHERE email = 'matahariapp@example.com'),
     cat AS (SELECT id FROM job_categories WHERE name = 'Web Development')
INSERT INTO job_postings (
  employer_id, title, category_id, description,
  budget_min, budget_max, budget_type,
  deadline_days, location_type, experience_level,
  contact_whatsapp, status
)
SELECT emp.id, 'Backend Developer Node.js – API Service', cat.id,
  'Butuh backend developer untuk membangun REST API service yang dipakai oleh aplikasi mobile kami. Stack: Node.js, Express, PostgreSQL. Fitur: auth, CRUD, push notif, dan admin dashboard.',
  3500000, 6000000, 'fixed',
  30, 'Hybrid', 'Senior',
  '084567890123', 'active'
FROM emp, cat;

WITH jp AS (SELECT id FROM job_postings WHERE title = 'Backend Developer Node.js – API Service')
INSERT INTO job_skills (job_id, skill_id)
SELECT jp.id, s.id FROM jp, skills s WHERE s.name IN ('Node.js', 'TypeScript', 'MongoDB', 'GraphQL');

-- Lowongan dari Matahari App Studio - 3 (draft)
WITH emp AS (SELECT id FROM users WHERE email = 'matahariapp@example.com'),
     cat AS (SELECT id FROM job_categories WHERE name = 'UI/UX Design')
INSERT INTO job_postings (
  employer_id, title, category_id, description,
  budget_min, budget_max, budget_type,
  deadline_days, location_type, experience_level,
  contact_email, status
)
SELECT emp.id, 'UX Researcher – Riset Pengguna Aplikasi', cat.id,
  'Kami perlu UX researcher untuk melakukan riset pengguna aplikasi laundry kami sebelum pengembangan fase 2. Output: user interview, affinity mapping, dan laporan insight.',
  2500000, 4500000, 'fixed',
  20, 'Onsite', 'Senior',
  'matahariapp@example.com', 'pending_review'
FROM emp, cat;

WITH jp AS (SELECT id FROM job_postings WHERE title = 'UX Researcher – Riset Pengguna Aplikasi')
INSERT INTO job_skills (job_id, skill_id)
SELECT jp.id, s.id FROM jp, skills s WHERE s.name IN ('UX Design', 'User Research', 'Figma');

-- ============================================================
-- APPLICATIONS (contoh lamaran freelancer ke lowongan)
-- ============================================================

-- Andi melamar ke Full Stack Developer
WITH fl AS (SELECT id FROM users WHERE email = 'andi@example.com'),
     jp AS (SELECT id FROM job_postings WHERE title = 'Full Stack Developer Next.js + Laravel')
INSERT INTO applications (job_id, freelancer_id, cover_letter, status)
SELECT jp.id, fl.id,
  'Halo, saya Andi dengan 3 tahun pengalaman Next.js dan pernah handle project marketplace UMKM sebelumnya.',
  'pending'
FROM fl, jp;

-- Andi melamar ke React Developer Landing Page
WITH fl AS (SELECT id FROM users WHERE email = 'andi@example.com'),
     jp AS (SELECT id FROM job_postings WHERE title = 'React Developer Landing Page')
INSERT INTO applications (job_id, freelancer_id, cover_letter, status)
SELECT jp.id, fl.id,
  'Saya spesialisasi React dan TypeScript. Pernah bangun 10+ landing page dengan performa Lighthouse 90+.',
  'reviewed'
FROM fl, jp;

-- Maya melamar ke UI/UX Designer
WITH fl AS (SELECT id FROM users WHERE email = 'maya@example.com'),
     jp AS (SELECT id FROM job_postings WHERE title = 'UI/UX Designer untuk Rebranding UMKM Batik')
INSERT INTO applications (job_id, freelancer_id, cover_letter, status)
SELECT jp.id, fl.id,
  'Saya maya, UI/UX designer dengan 4 tahun pengalaman. Pernah handle rebranding 3 brand UMKM lokal Jogja.',
  'accepted'
FROM fl, jp;

-- Maya melamar ke Product Designer
WITH fl AS (SELECT id FROM users WHERE email = 'maya@example.com'),
     jp AS (SELECT id FROM job_postings WHERE title = 'Product Designer Mobile App')
INSERT INTO applications (job_id, freelancer_id, cover_letter, status)
SELECT jp.id, fl.id,
  'Pengalaman saya dalam desain aplikasi mobile sangat relevan. Portfolio saya di Behance bisa dicek.',
  'pending'
FROM fl, jp;

-- Rizky melamar ke Flutter Developer
WITH fl AS (SELECT id FROM users WHERE email = 'rizky@example.com'),
     jp AS (SELECT id FROM job_postings WHERE title = 'Flutter Developer – Aplikasi Pemesanan Laundry')
INSERT INTO applications (job_id, freelancer_id, cover_letter, status)
SELECT jp.id, fl.id,
  'Saya Rizky, Flutter developer dengan 5 aplikasi di Play Store. Familiar dengan Bloc dan integrasi Midtrans.',
  'pending'
FROM fl, jp;

-- Nadia melamar ke Content Writer
WITH fl AS (SELECT id FROM users WHERE email = 'nadia@example.com'),
     jp AS (SELECT id FROM job_postings WHERE title = 'Content Writer SEO – Blog Wisata Kuliner Jogja')
INSERT INTO applications (job_id, freelancer_id, cover_letter, status)
SELECT jp.id, fl.id,
  'Saya Nadia, content writer dengan spesialisasi SEO kuliner. Pernah kelola blog yang dapat 50K monthly visitors.',
  'pending'
FROM fl, jp;

-- ============================================================
-- EVENTS
-- ============================================================
WITH org AS (SELECT id FROM users WHERE email = 'batikstudio@example.com')
INSERT INTO events (
  title, description, type, event_date, event_time, duration_minutes,
  location_name, location_address, latitude, longitude,
  organizer_id, organizer_name, is_free, check_in_code, attendee_limit
) VALUES
(
  'React Advanced Patterns Workshop',
  'Belajar advanced React patterns: render props, custom hooks, context optimization, dan performance tuning.',
  'workshop', '2026-07-15', '10:00', 120,
  'KORIDOR Coworking', 'Jl. Sosrowijayan No. 3, Yogyakarta', -7.797068, 110.370529,
  (SELECT id FROM org), 'Komunitas Frontend Jogja',
  TRUE, 'REACT2026', 30
),
(
  'Freelancer Networking Hangout',
  'Casual coffee hangout untuk para freelancer Jogja. Networking, share pengalaman, dan diskusi industri.',
  'coffee_chat', '2026-07-20', '14:00', 90,
  'Kopi Pendakian', 'Jl. Malioboro No. 18, Yogyakarta', -7.796368, 110.370123,
  (SELECT id FROM org), 'Jogja Freelancer Community',
  TRUE, 'NETWORK21', 50
),
(
  'UI/UX Design Bootcamp',
  '3-hari intensive bootcamp UI/UX dari 0: design thinking, wireframing, prototyping, hingga user testing.',
  'workshop', '2026-07-25', '09:00', 480,
  'Ruang Kolektif', 'Jl. Diponegoro No. 42, Yogyakarta', -7.805434, 110.372856,
  (SELECT id FROM org), 'Design Academy Jogja',
  FALSE, 'UIUX2026', 20
);

WITH org AS (SELECT id FROM users WHERE email = 'komunitas.jogja@example.com')
INSERT INTO events (
  title, description, type, event_date, event_time, duration_minutes,
  location_name, location_address, latitude, longitude,
  organizer_id, organizer_name, is_free, check_in_code, attendee_limit
) VALUES
(
  'Meetup Developer Jogja – Agustus 2026',
  'Meetup bulanan komunitas developer Jogja. Sesi sharing project, lightning talk, dan networking santai.',
  'meetup', '2026-08-05', '18:30', 120,
  'Jogja Digital Valley', 'Jl. Ring Road Utara, Yogyakarta', -7.759768, 110.377529,
  (SELECT id FROM org), 'Developer Jogja Community',
  TRUE, 'DEVJOG0826', 100
),
(
  'Workshop Flutter untuk Pemula',
  'Belajar membuat aplikasi mobile pertama dengan Flutter dari nol. Cocok untuk yang belum pernah coba Flutter.',
  'workshop', '2026-08-10', '09:00', 360,
  'Hack4ID Space', 'Jl. Gejayan No. 5, Yogyakarta', -7.784201, 110.388432,
  (SELECT id FROM org), 'Flutter Indonesia – Jogja Chapter',
  TRUE, 'FLUTTER826', 40
);

-- ============================================================
-- NOTIFICATIONS (contoh notifikasi)
-- ============================================================
WITH fl AS (SELECT id FROM users WHERE email = 'andi@example.com'),
     jp AS (SELECT id FROM job_postings WHERE title = 'Full Stack Developer Next.js + Laravel')
INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
SELECT fl.id, 'job_match',
  'Lowongan Baru Sesuai Skill Kamu!',
  'Full Stack Developer Next.js + Laravel oleh Warung Tech cocok dengan skill React & TypeScript kamu.',
  jp.id, 'job'
FROM fl, jp;

WITH fl AS (SELECT id FROM users WHERE email = 'maya@example.com'),
     jp AS (SELECT id FROM job_postings WHERE title = 'UI/UX Designer untuk Rebranding UMKM Batik')
INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
SELECT fl.id, 'application_update',
  'Lamaran Kamu Diterima! 🎉',
  'Selamat! Batik Digital Studio menerima lamaranmu untuk posisi UI/UX Designer Rebranding UMKM Batik.',
  jp.id, 'job'
FROM fl, jp;

WITH fl AS (SELECT id FROM users WHERE email = 'andi@example.com')
INSERT INTO notifications (user_id, type, title, message)
SELECT fl.id, 'badge_earned',
  'Badge Baru Diraih! 🏅',
  'Kamu mendapatkan badge "First Application" karena sudah submit lamaran pertamamu.'
FROM fl;

-- ============================================================
-- END SEED
-- ============================================================
