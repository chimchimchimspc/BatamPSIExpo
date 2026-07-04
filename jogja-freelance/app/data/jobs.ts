export type JobStatus = "active" | "closed" | "pending_review";
export type ApplicationStatus = "pending" | "reviewed" | "accepted" | "rejected" | "expired";

export interface Job {
  id: string;
  title: string;
  company: string;
  category: string;
  description: string;
  requirements: string[];
  skills: string[];
  budget: number;
  budgetType: "fixed" | "hourly";
  deadline: number; // days remaining
  location: string;
  contactWhatsapp?: string;
  contactEmail: string;
  status: JobStatus;
  views: number;
  applicationCount: number;
  postedAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  category: string;
  coverLetter: string;
  status: ApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  expiresAt: string;
  budget: number;
}

export const CATEGORIES = [
  "Semua Kategori",
  "Web Development",
  "UI/UX Design",
  "Mobile Development",
  "Content Writing",
  "Video Editing",
  "Social Media",
  "Logo Design",
  "Photography",
  "Data Entry",
];

export const SKILLS_LIST = [
  "React", "Vue.js", "Next.js", "TypeScript", "Node.js", "Laravel", "PHP",
  "Figma", "Adobe XD", "Illustrator", "Photoshop",
  "Flutter", "React Native",
  "SEO Writing", "Copywriting", "Bahasa Indonesia",
  "Premiere Pro", "After Effects",
  "Instagram", "TikTok", "Facebook Ads",
];

export const MOCK_JOBS: Job[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    title: "React Frontend Developer",
    company: "Startup Jogja Tech",
    category: "Web Development",
    description: "Kami mencari React developer berpengalaman untuk membangun dashboard analytics skala startup. Proyek mencakup integrasi API, visualisasi data dengan chart, dan state management. Remote friendly, bisa kerja dari mana saja di Jogja.",
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
    status: "active",
    views: 142,
    applicationCount: 8,
    postedAt: "2026-06-14",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    title: "UI/UX Designer Mobile App",
    company: "UMKM Digital Jogja",
    category: "UI/UX Design",
    description: "Desain ulang aplikasi mobile UMKM kami dari awal. Perlu melakukan user research, wireframe, dan high-fidelity prototype. Kami ingin tampilan modern yang friendly untuk pengguna 40+ tahun.",
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
    status: "active",
    views: 89,
    applicationCount: 12,
    postedAt: "2026-06-13",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    title: "Content Writer Blog Pariwisata",
    company: "Visit Jogja Agency",
    category: "Content Writing",
    description: "Tulis 10 artikel pariwisata Jogja untuk blog dan media sosial kami. Topik meliputi destinasi wisata baru, kuliner, budaya, dan itinerary. SEO-friendly dan menarik untuk pembaca 25-40 tahun.",
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
    status: "active",
    views: 203,
    applicationCount: 24,
    postedAt: "2026-06-15",
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    title: "Video Editor Konten TikTok",
    company: "Brand Local Jogja",
    category: "Video Editing",
    description: "Edit video pendek (30-60 detik) untuk konten TikTok brand kuliner lokal kami. Format vertical, trendy, dengan caption dan efek. Dibutuhkan 8 video per bulan. Remote, material disediakan.",
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
    status: "active",
    views: 317,
    applicationCount: 19,
    postedAt: "2026-06-16",
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    title: "Flutter Developer Aplikasi UMKM",
    company: "Komunitas Teknologi Jogja",
    category: "Mobile Development",
    description: "Kembangkan aplikasi Flutter untuk manajemen stok UMKM sederhana. Fitur: input produk, tracking stok, laporan harian, dan export PDF. Harus bisa berjalan offline-first.",
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
    status: "active",
    views: 56,
    applicationCount: 5,
    postedAt: "2026-06-12",
  },
  {
    id: "00000000-0000-0000-0000-000000000006",
    title: "Social Media Manager Instagram",
    company: "Butik Fashion Malioboro",
    category: "Social Media",
    description: "Kelola akun Instagram @butikmalioboro (15K followers). Tugas: buat konten schedule, posting 1x sehari, balas komentar, laporan engagement mingguan. Part-time, 3-4 jam per hari.",
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
    status: "active",
    views: 445,
    applicationCount: 31,
    postedAt: "2026-06-11",
  },
  {
    id: "00000000-0000-0000-0000-000000000007",
    title: "Desain Logo Restoran Baru",
    company: "Warung Nusantara Jogja",
    category: "Logo Design",
    description: "Desain logo dan brand identity untuk warung makan Nusantara yang akan grand opening bulan depan. Perlu logo, warna brand, dan template untuk menu dan spanduk.",
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
    status: "active",
    views: 128,
    applicationCount: 16,
    postedAt: "2026-06-14",
  },
  {
    id: "00000000-0000-0000-0000-000000000008",
    title: "Laravel Backend Developer",
    company: "Koperasi Digital Jogja",
    category: "Web Development",
    description: "Bangun sistem manajemen koperasi berbasis web dengan Laravel. Fitur: manajemen anggota, simpanan, pinjaman, angsuran, dan laporan keuangan. Proyek besar, bisa jadi long-term.",
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
    status: "active",
    views: 74,
    applicationCount: 7,
    postedAt: "2026-06-10",
  },
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: "app-1",
    jobId: "3",
    jobTitle: "Content Writer Blog Pariwisata",
    company: "Visit Jogja Agency",
    category: "Content Writing",
    coverLetter: "Saya memiliki pengalaman 2 tahun menulis konten pariwisata untuk beberapa platform. Portfolio saya mencakup artikel tentang wisata Jogja, Bali, dan Lombok.",
    status: "accepted",
    submittedAt: "2026-06-13",
    reviewedAt: "2026-06-14",
    expiresAt: "2026-06-27",
    budget: 1500000,
  },
  {
    id: "app-2",
    jobId: "1",
    jobTitle: "React Frontend Developer",
    company: "Startup Jogja Tech",
    category: "Web Development",
    coverLetter: "Saya adalah React developer dengan 2 tahun pengalaman. Familiar dengan TypeScript, Next.js, dan Tailwind CSS. Link GitHub saya: github.com/username",
    status: "pending",
    submittedAt: "2026-06-15",
    expiresAt: "2026-06-29",
    budget: 5000000,
  },
  {
    id: "app-3",
    jobId: "6",
    jobTitle: "Social Media Manager Instagram",
    company: "Butik Fashion Malioboro",
    category: "Social Media",
    coverLetter: "Saya pernah mengelola akun Instagram 3 brand fashion lokal dengan rata-rata engagement rate 5%. Siap bekerja part-time.",
    status: "rejected",
    submittedAt: "2026-06-12",
    reviewedAt: "2026-06-13",
    expiresAt: "2026-06-26",
    budget: 1200000,
  },
  {
    id: "app-4",
    jobId: "5",
    jobTitle: "Flutter Developer Aplikasi UMKM",
    company: "Komunitas Teknologi Jogja",
    category: "Mobile Development",
    coverLetter: "Saya berpengalaman dalam Flutter development dan sudah pernah membuat 3 aplikasi offline-first dengan SQLite.",
    status: "reviewed",
    submittedAt: "2026-06-14",
    expiresAt: "2026-06-28",
    budget: 7500000,
  },
];

export function formatBudget(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getJobById(id: string): Job | undefined {
  return MOCK_JOBS.find((j) => j.id === id);
}
