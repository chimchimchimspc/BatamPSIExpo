/**
 * Seed 8 active job postings with FIXED UUIDs that mirror the frontend mock jobs.
 * Idempotent — safe to run multiple times (upserts by fixed id).
 *
 *   node database/seed_jobs.js
 */
require("dotenv").config();
const { getClient, pool } = require("../src/config/database");

const JOBS = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    title: "React Frontend Developer",
    company: "Startup Jogja Tech",
    category: "Web Development",
    description:
      "Kami mencari React developer berpengalaman untuk membangun dashboard analytics skala startup. Proyek mencakup integrasi API, visualisasi data dengan chart, dan state management. Remote friendly.",
    requirements: [
      "Minimal 1 tahun pengalaman React",
      "Familiar dengan TypeScript dan Tailwind CSS",
      "Pernah mengintegrasikan REST API",
      "Portfolio atau GitHub yang aktif",
    ],
    skills: ["React", "TypeScript", "Next.js"],
    budget: 5000000,
    budgetType: "fixed",
    deadline: 30,
    location: "Remote (Yogyakarta)",
    contactEmail: "jobs@jogjatechstartup.com",
    contactWhatsapp: "+6281234567890",
    views: 142,
    applicationCount: 8,
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    title: "UI/UX Designer Mobile App",
    company: "UMKM Digital Jogja",
    category: "UI/UX Design",
    description:
      "Desain ulang aplikasi mobile UMKM kami dari awal. Perlu melakukan user research, wireframe, dan high-fidelity prototype. Kami ingin tampilan modern yang friendly untuk pengguna 40+ tahun.",
    requirements: [
      "Portfolio Figma wajib dilampirkan",
      "Pengalaman desain mobile app",
      "Memahami prinsip UX untuk pengguna non-teknis",
      "Bisa deliver dalam 3 minggu",
    ],
    skills: ["Figma", "Adobe XD", "Illustrator"],
    budget: 3500000,
    budgetType: "fixed",
    deadline: 21,
    location: "Onsite (Sleman, Yogyakarta)",
    contactEmail: "hr@umkmdigitaljogja.id",
    contactWhatsapp: null,
    views: 89,
    applicationCount: 12,
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    title: "Content Writer Blog Pariwisata",
    company: "Visit Jogja Agency",
    category: "Content Writing",
    description:
      "Tulis 10 artikel pariwisata Jogja untuk blog dan media sosial kami. Topik meliputi destinasi wisata baru, kuliner, budaya, dan itinerary. SEO-friendly dan menarik untuk pembaca 25-40 tahun.",
    requirements: [
      "Pengalaman menulis artikel wisata atau lifestyle",
      "Familiar dengan teknik dasar SEO",
      "Bisa deliver 2 artikel per minggu",
      "Bahasa Indonesia yang baik dan baku",
    ],
    skills: ["SEO Writing", "Copywriting", "Bahasa Indonesia"],
    budget: 1500000,
    budgetType: "fixed",
    deadline: 14,
    location: "Remote",
    contactEmail: "content@visitjogja.co.id",
    contactWhatsapp: null,
    views: 203,
    applicationCount: 24,
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    title: "Video Editor Konten TikTok",
    company: "Brand Local Jogja",
    category: "Video Editing",
    description:
      "Edit video pendek (30-60 detik) untuk konten TikTok brand kuliner lokal kami. Format vertical, trendy, dengan caption dan efek. Dibutuhkan 8 video per bulan. Remote, material disediakan.",
    requirements: [
      "Familiar dengan Premiere Pro atau CapCut",
      "Mengerti tren konten TikTok 2026",
      "Portfolio video TikTok/Reels",
      "Delivery 2 hari per video",
    ],
    skills: ["Premiere Pro", "After Effects"],
    budget: 2000000,
    budgetType: "fixed",
    deadline: 7,
    location: "Remote",
    contactEmail: "marketing@brandlocaljogja.com",
    contactWhatsapp: null,
    views: 317,
    applicationCount: 19,
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    title: "Flutter Developer Aplikasi UMKM",
    company: "Komunitas Teknologi Jogja",
    category: "Mobile Development",
    description:
      "Kembangkan aplikasi Flutter untuk manajemen stok UMKM sederhana. Fitur: input produk, tracking stok, laporan harian, dan export PDF. Harus bisa berjalan offline-first.",
    requirements: [
      "Minimal 6 bulan pengalaman Flutter",
      "Pernah membuat aplikasi offline-first",
      "Familiar dengan SQLite atau Hive",
      "Bisa komunikasi rutin via WhatsApp",
    ],
    skills: ["Flutter", "React Native"],
    budget: 7500000,
    budgetType: "fixed",
    deadline: 45,
    location: "Hybrid (Yogyakarta)",
    contactEmail: "project@teknologijogja.org",
    contactWhatsapp: "+6287654321098",
    views: 56,
    applicationCount: 5,
  },
  {
    id: "00000000-0000-0000-0000-000000000006",
    title: "Social Media Manager Instagram",
    company: "Butik Fashion Malioboro",
    category: "Social Media",
    description:
      "Kelola akun Instagram @butikmalioboro (15K followers). Tugas: buat konten schedule, posting 1x sehari, balas komentar, laporan engagement mingguan. Part-time, 3-4 jam per hari.",
    requirements: [
      "Pengalaman kelola akun Instagram bisnis",
      "Bisa membuat caption menarik",
      "Familiar dengan tools: Canva, Later, atau Buffer",
      "Responsif dan aktif di media sosial",
    ],
    skills: ["Instagram", "TikTok", "Facebook Ads"],
    budget: 1200000,
    budgetType: "fixed",
    deadline: 30,
    location: "Remote + Onsite sesekali (Malioboro)",
    contactEmail: "admin@butikmalioboro.com",
    contactWhatsapp: null,
    views: 445,
    applicationCount: 31,
  },
  {
    id: "00000000-0000-0000-0000-000000000007",
    title: "Desain Logo Restoran Baru",
    company: "Warung Nusantara Jogja",
    category: "Logo Design",
    description:
      "Desain logo dan brand identity untuk warung makan Nusantara yang akan grand opening bulan depan. Perlu logo, warna brand, dan template untuk menu dan spanduk.",
    requirements: [
      "Portfolio logo/brand identity",
      "Deliver dalam format AI, EPS, PNG, SVG",
      "Revisi hingga 3 kali",
      "Proses 7-10 hari kerja",
    ],
    skills: ["Illustrator", "Photoshop", "Figma"],
    budget: 2500000,
    budgetType: "fixed",
    deadline: 10,
    location: "Remote",
    contactEmail: "owner@warungnusantara.id",
    contactWhatsapp: null,
    views: 128,
    applicationCount: 16,
  },
  {
    id: "00000000-0000-0000-0000-000000000008",
    title: "Laravel Backend Developer",
    company: "Koperasi Digital Jogja",
    category: "Web Development",
    description:
      "Bangun sistem manajemen koperasi berbasis web dengan Laravel. Fitur: manajemen anggota, simpanan, pinjaman, angsuran, dan laporan keuangan. Proyek besar, bisa jadi long-term.",
    requirements: [
      "Minimal 2 tahun pengalaman Laravel",
      "Familiar dengan MySQL dan relasi database",
      "Bisa buat dokumentasi API",
      "Tersedia untuk meeting mingguan",
    ],
    skills: ["Laravel", "PHP", "Node.js"],
    budget: 12000000,
    budgetType: "fixed",
    deadline: 60,
    location: "Hybrid (Yogyakarta)",
    contactEmail: "it@koperasijogja.co.id",
    contactWhatsapp: null,
    views: 74,
    applicationCount: 7,
  },
];

function locationType(loc) {
  if (/onsite/i.test(loc)) return "Onsite";
  if (/hybrid/i.test(loc)) return "Hybrid";
  return "Remote";
}

function slugEmail(company) {
  return (
    company.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/(^\.|\.$)/g, "") +
    "@seed.jogja"
  );
}

async function ensureEmployer(client, company) {
  const email = slugEmail(company);
  const u = await client.query(
    `INSERT INTO users (email, full_name, role)
     VALUES ($1, $2, 'employer')
     ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name
     RETURNING id`,
    [email, company]
  );
  const userId = u.rows[0].id;
  await client.query(
    `INSERT INTO employer_profiles (user_id, company_name)
     VALUES ($1, $2)
     ON CONFLICT (user_id) DO UPDATE SET company_name = EXCLUDED.company_name`,
    [userId, company]
  );
  return userId;
}

async function seed() {
  const client = await getClient();
  try {
    await client.query("BEGIN");
    for (const j of JOBS) {
      const employerId = await ensureEmployer(client, j.company);
      const cat = await client.query(
        "SELECT id FROM job_categories WHERE name = $1",
        [j.category]
      );
      const categoryId = cat.rows[0] ? cat.rows[0].id : null;

      await client.query(
        `INSERT INTO job_postings
           (id, employer_id, title, category_id, description, budget_min, budget_max, budget_type,
            deadline_days, deadline_date, location, location_type, experience_level,
            contact_whatsapp, contact_email, status, view_count, application_count)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, CURRENT_DATE + $9::int, $10,$11,'Mid',$12,$13,'active',$14,$15)
         ON CONFLICT (id) DO UPDATE SET
           employer_id=EXCLUDED.employer_id, title=EXCLUDED.title, category_id=EXCLUDED.category_id,
           description=EXCLUDED.description, budget_min=EXCLUDED.budget_min, budget_max=EXCLUDED.budget_max,
           budget_type=EXCLUDED.budget_type, deadline_days=EXCLUDED.deadline_days, deadline_date=EXCLUDED.deadline_date,
           location=EXCLUDED.location, location_type=EXCLUDED.location_type,
           contact_whatsapp=EXCLUDED.contact_whatsapp, contact_email=EXCLUDED.contact_email,
           status='active', view_count=EXCLUDED.view_count, application_count=EXCLUDED.application_count,
           updated_at=NOW()`,
        [
          j.id, employerId, j.title, categoryId, j.description, j.budget, j.budget,
          j.budgetType, j.deadline, j.location, locationType(j.location),
          j.contactWhatsapp, j.contactEmail, j.views, j.applicationCount,
        ]
      );

      await client.query("DELETE FROM job_skills WHERE job_id = $1", [j.id]);
      for (const s of j.skills) {
        const sk = await client.query("SELECT id FROM skills WHERE name ILIKE $1", [s]);
        if (sk.rows[0]) {
          await client.query(
            "INSERT INTO job_skills (job_id, skill_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
            [j.id, sk.rows[0].id]
          );
        }
      }

      await client.query("DELETE FROM job_requirements WHERE job_id = $1", [j.id]);
      for (let i = 0; i < j.requirements.length; i++) {
        await client.query(
          "INSERT INTO job_requirements (job_id, requirement, order_index) VALUES ($1,$2,$3)",
          [j.id, j.requirements[i], i]
        );
      }
      console.log(`  ✓ ${j.title}`);
    }
    await client.query("COMMIT");
    console.log(`Seeded ${JOBS.length} active jobs.`);
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("Seed failed:", e.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
