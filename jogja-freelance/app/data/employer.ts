export interface EmployerJob {
  id: string;
  title: string;
  category: string;
  budget: { min: number; max: number };
  deadlineDays: number;
  postedAt: string;
  status: "active" | "closed" | "draft";
  applicantCount: number;
  shortlistedCount: number;
  skills: string[];
  description: string;
  locationType: "Remote" | "Onsite" | "Hybrid";
  experienceLevel: "Junior" | "Mid" | "Senior";
}

export interface Applicant {
  id: string;
  jobId: string;
  name: string;
  level: "Bronze" | "Silver" | "Gold" | "Platinum";
  badgeCount: number;
  skills: string[];
  rating: number;
  completedProjects: number;
  appliedAt: string;
  status: "pending" | "shortlisted" | "rejected";
  coverNote: string;
  passportDays: number;
}

export const MOCK_EMPLOYER_PROFILE = {
  id: "e1",
  companyName: "Batik Digital Studio",
  industry: "Desain & Kreatif",
  location: "Kotagede, Yogyakarta",
  joinedAt: "Januari 2026",
  totalJobsPosted: 4,
  totalHired: 7,
};

export const MOCK_EMPLOYER_JOBS: EmployerJob[] = [
  {
    id: "ej1",
    title: "React Developer (Freelance)",
    category: "Web Development",
    budget: { min: 3000000, max: 5000000 },
    deadlineDays: 12,
    postedAt: "10 Jun 2026",
    status: "active",
    applicantCount: 3,
    shortlistedCount: 1,
    skills: ["React", "TypeScript", "Tailwind CSS"],
    description:
      "Kami mencari React developer untuk membangun landing page interaktif untuk klien UMKM kami. Estimasi 2–3 minggu kerja.",
    locationType: "Remote",
    experienceLevel: "Mid",
  },
  {
    id: "ej2",
    title: "UI/UX Designer — App Mobile",
    category: "UI/UX Design",
    budget: { min: 2000000, max: 4000000 },
    deadlineDays: 7,
    postedAt: "8 Jun 2026",
    status: "active",
    applicantCount: 5,
    shortlistedCount: 2,
    skills: ["Figma", "Prototyping", "User Research"],
    description:
      "Dibutuhkan desainer untuk membuat UI kit dan prototype aplikasi pemesanan batik. Target selesai dalam 3 minggu.",
    locationType: "Hybrid",
    experienceLevel: "Mid",
  },
  {
    id: "ej3",
    title: "Content Writer (Blog & SEO)",
    category: "Content Writing",
    budget: { min: 500000, max: 1500000 },
    deadlineDays: 20,
    postedAt: "12 Jun 2026",
    status: "active",
    applicantCount: 2,
    shortlistedCount: 0,
    skills: ["SEO Writing", "Copywriting", "WordPress"],
    description:
      "Butuh penulis konten untuk 10 artikel SEO tentang batik dan kerajinan Yogyakarta. Per artikel Rp 150rb.",
    locationType: "Remote",
    experienceLevel: "Junior",
  },
  {
    id: "ej4",
    title: "Video Editor — Product Showcase",
    category: "Video Editing",
    budget: { min: 1500000, max: 2500000 },
    deadlineDays: 0,
    postedAt: "20 Mei 2026",
    status: "closed",
    applicantCount: 4,
    shortlistedCount: 1,
    skills: ["Premiere Pro", "After Effects", "Color Grading"],
    description:
      "Edit 5 video produk dengan durasi 60–90 detik. Project sudah selesai.",
    locationType: "Remote",
    experienceLevel: "Mid",
  },
];

export const MOCK_APPLICANTS: Applicant[] = [
  // ej1 – React Developer
  {
    id: "a1", jobId: "ej1",
    name: "Rizky Pratama", level: "Silver", badgeCount: 4,
    skills: ["React", "TypeScript", "Next.js"],
    rating: 4.8, completedProjects: 12, appliedAt: "11 Jun 2026",
    status: "shortlisted",
    coverNote: "Punya 2 tahun pengalaman React, sudah bangun 3 landing page untuk klien UMKM. Bisa mulai minggu ini.",
    passportDays: 18,
  },
  {
    id: "a2", jobId: "ej1",
    name: "Hendra Wijaya", level: "Bronze", badgeCount: 2,
    skills: ["React", "JavaScript", "CSS"],
    rating: 4.2, completedProjects: 4, appliedAt: "12 Jun 2026",
    status: "pending",
    coverNote: "Fresh graduate tapi sudah aktif freelance 6 bulan. Portfolio di GitHub cukup aktif.",
    passportDays: 7,
  },
  {
    id: "a3", jobId: "ej1",
    name: "Sinta Dewi", level: "Gold", badgeCount: 6,
    skills: ["React", "TypeScript", "GraphQL", "Tailwind CSS"],
    rating: 4.9, completedProjects: 23, appliedAt: "10 Jun 2026",
    status: "pending",
    coverNote: "Senior developer spesialis React. Rate di kisaran budget yang diberikan. Bisa live demo dulu.",
    passportDays: 25,
  },
  // ej2 – UI/UX Designer
  {
    id: "a4", jobId: "ej2",
    name: "Aulia Rahma", level: "Gold", badgeCount: 7,
    skills: ["Figma", "Prototyping", "UI Design"],
    rating: 4.9, completedProjects: 18, appliedAt: "9 Jun 2026",
    status: "shortlisted",
    coverNote: "Spesialis UI mobile. Pernah buat app e-commerce dari scratch sampai handoff dev. Portfolio di Behance.",
    passportDays: 28,
  },
  {
    id: "a5", jobId: "ej2",
    name: "Bagas Santoso", level: "Silver", badgeCount: 3,
    skills: ["Figma", "Adobe XD", "User Research"],
    rating: 4.5, completedProjects: 8, appliedAt: "9 Jun 2026",
    status: "shortlisted",
    coverNote: "Background psikologi + desain — saya combine user research dengan visual. Bisa onsite di Jogja.",
    passportDays: 15,
  },
  {
    id: "a6", jobId: "ej2",
    name: "Lestari Putri", level: "Bronze", badgeCount: 1,
    skills: ["Figma", "Canva"],
    rating: 3.9, completedProjects: 2, appliedAt: "10 Jun 2026",
    status: "rejected",
    coverNote: "Baru mulai freelance. Masih belajar tapi semangat tinggi.",
    passportDays: 5,
  },
  {
    id: "a7", jobId: "ej2",
    name: "Dimas Arifin", level: "Silver", badgeCount: 4,
    skills: ["Figma", "Prototyping", "Motion Design"],
    rating: 4.7, completedProjects: 11, appliedAt: "8 Jun 2026",
    status: "pending",
    coverNote: "Juga bisa bikin micro-animation untuk onboarding flow. Rate fleksibel.",
    passportDays: 20,
  },
  {
    id: "a8", jobId: "ej2",
    name: "Nadia Kusuma", level: "Bronze", badgeCount: 2,
    skills: ["Figma", "Sketch", "UI Design"],
    rating: 4.1, completedProjects: 3, appliedAt: "11 Jun 2026",
    status: "pending",
    coverNote: "UI designer dengan fokus mobile-first. Pengalaman di startup lokal Jogja.",
    passportDays: 9,
  },
  // ej3 – Content Writer
  {
    id: "a9", jobId: "ej3",
    name: "Yudha Permana", level: "Bronze", badgeCount: 2,
    skills: ["SEO Writing", "WordPress", "Research"],
    rating: 4.3, completedProjects: 6, appliedAt: "13 Jun 2026",
    status: "pending",
    coverNote: "Biasa nulis artikel SEO di niche produk lokal. Bisa deliver 3 artikel per minggu.",
    passportDays: 8,
  },
  {
    id: "a10", jobId: "ej3",
    name: "Fitri Handayani", level: "Silver", badgeCount: 3,
    skills: ["Copywriting", "SEO Writing", "Content Strategy"],
    rating: 4.6, completedProjects: 14, appliedAt: "13 Jun 2026",
    status: "pending",
    coverNote: "Ex-jurnalis, fokus content marketing. Artikel rata-rata rank page 1 Google dalam 3 bulan.",
    passportDays: 16,
  },
];

export function getApplicantsByJob(jobId: string): Applicant[] {
  return MOCK_APPLICANTS.filter((a) => a.jobId === jobId);
}

export function getEmployerJobById(id: string): EmployerJob | undefined {
  return MOCK_EMPLOYER_JOBS.find((j) => j.id === id);
}

export function formatBudgetRange(min: number, max: number): string {
  return `Rp ${(min / 1000000).toFixed(0)}jt – ${(max / 1000000).toFixed(0)}jt`;
}
