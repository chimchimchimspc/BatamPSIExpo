export interface PendingJob {
  id: string;
  title: string;
  company: string;
  category: string;
  budget: number;
  submittedAt: string;
  contactEmail: string;
}

export interface AdminAnalytics {
  totalUsers: number;
  activeJobs: number;
  pendingJobs: number;
  totalEvents: number;
  pendingBadgeVerifications: number;
  jobApplicationsToday: number;
  newUsersThisWeek: number;
  checkInsThisWeek: number;
}

export interface RecentActivity {
  id: string;
  type: "job_submitted" | "user_registered" | "badge_earned" | "event_checkin" | "job_approved";
  message: string;
  time: string;
  icon: string;
}

export const MOCK_PENDING_JOBS: PendingJob[] = [
  {
    id: "pj-1",
    title: "WordPress Developer untuk E-Commerce",
    company: "Toko Batik Jogja",
    category: "Web Development",
    budget: 4000000,
    submittedAt: "2026-06-16 08:30",
    contactEmail: "admin@tokobatikjogja.com",
  },
  {
    id: "pj-2",
    title: "Animator Video Explainer",
    company: "EdTech Startup Jogja",
    category: "Video Editing",
    budget: 6000000,
    submittedAt: "2026-06-16 10:15",
    contactEmail: "hr@edtechjogja.id",
  },
  {
    id: "pj-3",
    title: "Data Entry & Rekap Laporan",
    company: "Koperasi Tani Makmur",
    category: "Data Entry",
    budget: 800000,
    submittedAt: "2026-06-15 14:00",
    contactEmail: "ops@koperasitani.co.id",
  },
  {
    id: "pj-4",
    title: "Jasa Foto Produk UMKM",
    company: "Oleh-Oleh Khas Jogja",
    category: "Photography",
    budget: 1500000,
    submittedAt: "2026-06-15 16:45",
    contactEmail: "owner@oleholeh.id",
  },
];

export const MOCK_ANALYTICS: AdminAnalytics = {
  totalUsers: 523,
  activeJobs: 8,
  pendingJobs: 4,
  totalEvents: 6,
  pendingBadgeVerifications: 7,
  jobApplicationsToday: 12,
  newUsersThisWeek: 38,
  checkInsThisWeek: 15,
};

export const MOCK_RECENT_ACTIVITY: RecentActivity[] = [
  { id: "a1", type: "user_registered",  icon: "👤", message: "Pengguna baru: Budi Santoso mendaftar", time: "5 menit lalu" },
  { id: "a2", type: "job_submitted",    icon: "💼", message: "Lowongan baru menunggu review: WordPress Developer", time: "22 menit lalu" },
  { id: "a3", type: "badge_earned",     icon: "🎤", message: "Check-in terverifikasi: 3 peserta Event React Workshop", time: "1 jam lalu" },
  { id: "a4", type: "job_approved",     icon: "✓",  message: "Lowongan disetujui: React Frontend Developer", time: "2 jam lalu" },
  { id: "a5", type: "event_checkin",    icon: "📅", message: "14 check-in masuk dari Freelancer Networking Hangout", time: "3 jam lalu" },
  { id: "a6", type: "user_registered",  icon: "👤", message: "Pengguna baru: Sari Dewi mendaftar", time: "4 jam lalu" },
  { id: "a7", type: "job_submitted",    icon: "💼", message: "Lowongan baru: Animator Video Explainer", time: "6 jam lalu" },
];

export function formatBudget(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}
