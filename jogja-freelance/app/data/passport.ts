export type Phase = "Onboarding" | "Eksplorasi" | "Action" | "Wrap-up";

export interface DayEntry {
  day: number;
  phase: Phase;
  task: string;
  description: string;
  estimatedTime: string;
  tips: string[];
  badgeUnlock?: string;
  badgeIcon?: string;
  resources?: { label: string; url: string }[];
}

export interface PassportProgress {
  currentDay: number;
  completedDays: number[];
  startDate: string;
  level: "Bronze" | "Silver" | "Gold" | "Platinum";
  earnedBadges: string[];
}

export const PHASE_COLORS: Record<Phase, { bg: string; text: string; border: string }> = {
  Onboarding: { bg: "bg-blue-50",   text: "text-[#146EB4]",   border: "border-[#146EB4]" },
  Eksplorasi: { bg: "bg-green-50",  text: "text-[#12A54D]",   border: "border-[#12A54D]" },
  Action:     { bg: "bg-orange-50", text: "text-[#EC7211]",   border: "border-[#EC7211]" },
  "Wrap-up":  { bg: "bg-purple-50", text: "text-purple-700",  border: "border-purple-400" },
};

export const PASSPORT_DAYS: DayEntry[] = [
  {
    day: 1, phase: "Onboarding",
    task: "Lengkapi profil dasar",
    description: "Upload foto profil, tulis bio singkat, dan tambahkan 3 skill utama kamu. Profil yang lengkap meningkatkan peluang dilihat employer.",
    estimatedTime: "30 menit",
    badgeUnlock: "Profile Complete", badgeIcon: "✓",
    tips: ["Gunakan foto profesional dengan background bersih", "Bio singkat tapi informatif — sebutkan spesialisasi kamu", "Pilih skill yang benar-benar kamu kuasai"],
  },
  {
    day: 2, phase: "Onboarding",
    task: "Jelajahi Job Board",
    description: "Buka halaman Lowongan dan browse setidaknya 10 job. Perhatikan format deskripsi, budget range, dan skill yang paling sering dicari.",
    estimatedTime: "20 menit",
    tips: ["Gunakan filter kategori untuk menyaring yang relevan", "Perhatikan budget range di skill kamu", "Simpan mental note untuk job yang menarik"],
  },
  {
    day: 3, phase: "Onboarding",
    task: "Tambah portfolio & resume",
    description: "Link GitHub, Behance, atau website portfolio kamu. Kalau belum punya, buat satu halaman sederhana di Notion atau Linktree.",
    estimatedTime: "1 jam",
    tips: ["GitHub profile yang aktif sangat dilihat untuk dev", "Behance/Dribbble wajib untuk designer", "Notion bisa jadi portfolio minimal yang cepat dibuat"],
  },
  {
    day: 4, phase: "Onboarding",
    task: "Riset rate & market Jogja",
    description: "Cari tahu berapa rate wajar freelancer di bidang kamu di Jogja. Compare dengan job yang sudah kamu lihat kemarin.",
    estimatedTime: "45 menit",
    tips: ["Rate di Jogja biasanya 20-30% lebih rendah dari Jakarta", "Hitung minimum rate = biaya hidup bulanan ÷ jam kerja", "Jangan under-price diri sendiri di awal"],
  },
  {
    day: 5, phase: "Onboarding",
    task: "Selesaikan profil 100%",
    description: "Pastikan semua field profil terisi: foto, bio, skill, portfolio, kota. Ini trigger untuk badge pertama kamu!",
    estimatedTime: "30 menit",
    badgeUnlock: "Day 5 Milestone", badgeIcon: "📅",
    tips: ["Profil lengkap mendapat prioritas di rekomendasi employer", "Bio 150-300 karakter adalah sweet spot", "Tambahkan sosial media profesional kalau ada"],
  },
  {
    day: 6, phase: "Onboarding",
    task: "Buat template cover letter",
    description: "Siapkan 2-3 template cover letter untuk skill utama kamu. Ini akan mempercepat proses apply nantinya.",
    estimatedTime: "1 jam",
    tips: ["Template bukan copy-paste — tetap personalisasi per job", "Struktur: hook → pengalaman relevan → CTA", "Maksimal 300 karakter di platform ini"],
  },
  {
    day: 7, phase: "Eksplorasi",
    task: "Ikuti 1 event atau meetup di Jogja",
    description: "Cek tab Events dan cari workshop, meetup, atau coffee session terdekat. Kehadiran langsung jauh lebih impactful dari networking online.",
    estimatedTime: "2-3 jam",
    badgeUnlock: "Event Attendee", badgeIcon: "🎤",
    tips: ["Bawa kartu nama atau share kontak WA langsung", "Datang lebih awal untuk networking sebelum acara mulai", "Follow-up via LinkedIn atau WA dalam 24 jam setelah event"],
  },
  {
    day: 8, phase: "Eksplorasi",
    task: "Kunjungi 1 coworking space Jogja",
    description: "Coba kerja sehari dari coworking space. Rekomendasi: KORIDOR Coworking, Ruang Kolektif, atau Workcraft Jogja.",
    estimatedTime: "3-5 jam",
    tips: ["Banyak coworking kasih free trial 1 hari", "Kesempatan ketemu freelancer lain organik banget di sini", "Evaluasi: apakah worth untuk berlangganan?"],
  },
  {
    day: 9, phase: "Eksplorasi",
    task: "Join komunitas online freelancer Jogja",
    description: "Bergabung dengan grup Facebook, Telegram, atau Discord freelancer Yogyakarta. Banyak job informal tersebar di sini.",
    estimatedTime: "30 menit",
    tips: ["Search 'Freelancer Jogja' atau 'Web Dev Yogyakarta' di FB Groups", "Aktif berkomentar sebelum promosi diri", "Jangan spam — bangun reputasi dulu"],
  },
  {
    day: 10, phase: "Eksplorasi",
    task: "Connect dengan 5 freelancer lain",
    description: "Gunakan fitur networking untuk menemukan freelancer dengan skill serupa atau komplementer. Kolaborasi sering lebih menguntungkan dari kompetisi.",
    estimatedTime: "1 jam",
    tips: ["Kirim pesan personal, bukan generic", "Tawarkan value dulu sebelum minta sesuatu", "Freelancer yang sudah lebih berpengalaman bisa jadi mentor"],
  },
  {
    day: 11, phase: "Eksplorasi",
    task: "Riset 3 cafe/workspace favorit",
    description: "Temukan tempat-tempat produktif untuk kerja. Yogyakarta punya banyak cafe dengan WiFi kencang dan suasana yang nyaman.",
    estimatedTime: "Sepanjang hari",
    tips: ["Tes kecepatan WiFi dengan Speedtest", "Perhatikan tingkat kebisingan dan pencahayaan", "Catat budget: kopi + makan untuk work day"],
  },
  {
    day: 12, phase: "Eksplorasi",
    task: "Pelajari kontrak freelance dasar",
    description: "Pahami elemen penting dalam kontrak: scope of work, milestone, payment terms, dan revision policy. Penting sebelum dapat project pertama.",
    estimatedTime: "1.5 jam",
    tips: ["Selalu pakai kontrak, apapun ukuran projectnya", "Minta DP 50% sebelum mulai kerja", "Tentukan jumlah revisi yang termasuk di harga"],
  },
  {
    day: 13, phase: "Eksplorasi",
    task: "Update dan rapikan portofolio",
    description: "Tambahkan minimal 2 karya terbaru ke portfolio. Kalau belum ada karya nyata, buat personal project atau redesign sebagai showcase.",
    estimatedTime: "2-3 jam",
    tips: ["Kualitas > kuantitas dalam portfolio", "Ceritakan proses, bukan hanya hasil akhir", "Sertakan context: client, brief, dan hasil yang dicapai"],
  },
  {
    day: 14, phase: "Eksplorasi",
    task: "Ikuti workshop atau webinar online",
    description: "Tingkatkan skill dengan mengikuti workshop online gratis atau berbayar. Platform: Skill Academy, Dicoding, atau YouTube tutorials.",
    estimatedTime: "2-4 jam",
    tips: ["Sertifikat dari kursus bisa ditambah ke profil", "Fokus pada skill yang paling dicari di job board", "Dokumentasikan apa yang dipelajari"],
  },
  {
    day: 15, phase: "Eksplorasi",
    task: "Review 2 minggu pertama",
    description: "Refleksi perjalanan 15 hari: apa yang sudah dicapai? Skill apa yang perlu ditingkatkan? Jaringan seperti apa yang sudah dibangun?",
    estimatedTime: "45 menit",
    badgeUnlock: "Day 15 Milestone", badgeIcon: "🌟",
    tips: ["Tulis di notes atau jurnal pribadi", "Identifikasi gap antara ekspektasi dan realita", "Rencanakan action items untuk 15 hari berikutnya"],
  },
  {
    day: 16, phase: "Action",
    task: "Identifikasi 5 job target",
    description: "Dari semua lowongan yang sudah kamu lihat, pilih 5 yang paling cocok dengan skill, rate, dan interest kamu. Ini target apply minggu ini.",
    estimatedTime: "30 menit",
    tips: ["Prioritaskan job dengan deskripsi yang jelas", "Perhatikan responsivitas employer di komentar", "Apply ke job yang deadline-nya masih > 7 hari"],
  },
  {
    day: 17, phase: "Action",
    task: "Siapkan cover letter yang dipersonalisasi",
    description: "Tulis cover letter spesifik untuk setiap job target. Referensikan detail dari deskripsi job yang menunjukkan kamu baca dengan teliti.",
    estimatedTime: "1.5 jam",
    tips: ["Sebutkan nama company atau project specific", "Hubungkan pengalaman kamu dengan kebutuhan mereka", "Akhiri dengan pertanyaan atau ajakan action"],
  },
  {
    day: 18, phase: "Action",
    task: "Submit lamaran pertama!",
    description: "Ini momen bersejarah — apply job pertama kamu! Jangan overthink, perfeksionisme adalah musuh freelancer pemula.",
    estimatedTime: "30 menit",
    badgeUnlock: "First Application", badgeIcon: "🎯",
    tips: ["Done is better than perfect", "Apply saat pagi hari — employer lebih aktif review", "Pantau status di halaman Lamaranku"],
  },
  {
    day: 19, phase: "Action",
    task: "Apply ke 2 job lainnya",
    description: "Jangan tunggu respons job pertama — terus apply! Volume aplikasi yang lebih tinggi = peluang lebih besar.",
    estimatedTime: "1 jam",
    tips: ["Targetkan minimal 2-3 apply per minggu", "Variasikan kategori job untuk memperluas peluang", "Catat semua aplikasi di spreadsheet atau di platform ini"],
  },
  {
    day: 20, phase: "Action",
    task: "Follow-up & networking aktif",
    description: "Hubungi koneksi yang sudah dibuat di minggu sebelumnya. Tanya apakah mereka tahu lowongan atau butuh kolaborasi.",
    estimatedTime: "1 jam",
    tips: ["Follow-up via WA lebih personal dari email", "Bawa value — share artikel menarik atau info event", "Jangan terlalu sering follow-up — 1 kali per minggu cukup"],
  },
  {
    day: 21, phase: "Action",
    task: "Tingkatkan profil berdasarkan feedback",
    description: "Kalau sudah ada respons dari employer (diterima atau ditolak), gunakan feedback untuk perbaiki profil dan cover letter.",
    estimatedTime: "1 jam",
    tips: ["Rejection adalah data, bukan kegagalan", "Tanya employer mengapa kamu tidak dipilih (kalau berani)", "Perbaiki 1 hal di profil setiap minggu"],
  },
  {
    day: 22, phase: "Action",
    task: "Apply ke 3 job yang matching",
    description: "Tingkatkan volume — target 3 aplikasi hari ini. Pilih job dengan skill match ≥80% dari profil kamu.",
    estimatedTime: "1.5 jam",
    tips: ["Skill match 80% cukup — yang 20% bisa dipelajari", "Jangan terlalu selektif di awal karir", "Prioritaskan employer yang responsif di platform"],
  },
  {
    day: 23, phase: "Action",
    task: "Bangun kehadiran online",
    description: "Update LinkedIn, tambahkan project terbaru di GitHub/Behance, atau tulis artikel pendek tentang pengalaman freelance di Jogja.",
    estimatedTime: "2 jam",
    tips: ["LinkedIn sering dicek employer sebelum interview", "1 artikel di blog = SEO + personal branding", "Engage dengan konten di komunitas freelancer"],
  },
  {
    day: 24, phase: "Action",
    task: "Minta referral atau rekomendasi",
    description: "Hubungi dosen, senior, atau teman yang bisa merekomendasikan kamu ke network mereka. Referral adalah cara tercepat dapat project.",
    estimatedTime: "30 menit",
    tips: ["Spesifik dalam permintaan — 'Butuh intro ke startup tech di Jogja'", "Tawarkan komisi jika dapat project dari referral", "Jaga hubungan baik dengan semua kenalan"],
  },
  {
    day: 25, phase: "Action",
    task: "Jadwalkan interview atau call",
    description: "Kalau ada respons positif dari employer, segera jadwalkan sesi diskusi. Persiapkan diri dengan riset tentang mereka.",
    estimatedTime: "1 jam setup",
    tips: ["Riset company: website, sosmed, produk mereka", "Siapkan pertanyaan untuk employer juga", "Konfirmasi jadwal H-1 untuk menunjukkan profesionalisme"],
  },
  {
    day: 26, phase: "Wrap-up",
    task: "Evaluasi pipeline lamaran",
    description: "Review semua lamaran: mana yang masih pending, mana yang perlu follow-up, mana yang bisa dianggap closed.",
    estimatedTime: "30 menit",
    tips: ["Archive lamaran yang sudah expired", "Follow-up lamaran yang sudah > 7 hari tanpa respons", "Identifikasi pola: kategori atau skill apa yang paling banyak respons"],
  },
  {
    day: 27, phase: "Wrap-up",
    task: "Perkuat koneksi terbaik",
    description: "Dari semua orang yang ditemui selama 30 hari, pilih 5-10 koneksi terpenting untuk dijaga long-term.",
    estimatedTime: "1 jam",
    tips: ["Kualitas network > kuantitas", "Jadwalkan coffee chat atau catch-up bulanan", "Tawarkan bantuan sebelum minta bantuan"],
  },
  {
    day: 28, phase: "Wrap-up",
    task: "Dokumentasi pengalaman & lessons learned",
    description: "Tulis refleksi perjalanan 30 hari: apa yang berhasil, apa yang tidak, dan apa yang akan dilakukan berbeda.",
    estimatedTime: "45 menit",
    tips: ["Tulis jujur — ini untuk diri sendiri, bukan orang lain", "Catat nomor konkret: berapa apply, berapa respons, berapa interview", "Lessons learned akan sangat berguna 6 bulan ke depan"],
  },
  {
    day: 29, phase: "Wrap-up",
    task: "Rencanakan bulan kedua",
    description: "Buat roadmap freelance untuk bulan depan berdasarkan insights dari 30 hari pertama. Set target yang realistis.",
    estimatedTime: "1 jam",
    tips: ["Target SMART: Specific, Measurable, Achievable, Relevant, Time-bound", "Fokus pada 1-2 hal saja, jangan terlalu banyak goals", "Bagikan rencana ke mentor atau teman untuk akuntabilitas"],
  },
  {
    day: 30, phase: "Wrap-up",
    task: "Rayakan & share pencapaian!",
    description: "Selamat telah menyelesaikan 30 hari Jogja Passport! Share pencapaian kamu ke komunitas dan inspire freelancer lain yang baru mulai.",
    estimatedTime: "1 jam",
    badgeUnlock: "30-Day Passport Finisher", badgeIcon: "🏆",
    tips: ["Share cerita di sosial media dengan hashtag #JogjaFreelancePassport", "Rekrut teman untuk mulai journey mereka", "Kamu sekarang bukan pemula lagi!"],
  },
];

export const MOCK_PROGRESS: PassportProgress = {
  currentDay: 1,
  completedDays: [],
  startDate: "2026-06-19",
  level: "Bronze",
  earnedBadges: [],
};

export function getPhaseForDay(day: number): Phase {
  if (day <= 6)  return "Onboarding";
  if (day <= 15) return "Eksplorasi";
  if (day <= 25) return "Action";
  return "Wrap-up";
}

export function getMilestoneDay(day: number): DayEntry | undefined {
  return PASSPORT_DAYS.find((d) => d.day === day);
}

export const BADGE_MILESTONES = [5, 7, 15, 18, 30];
