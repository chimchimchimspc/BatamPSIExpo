const passportService = require("../services/passport.service");
const { success, badRequest } = require("../utils/response.util");

const PASSPORT_DAYS = [
  { day: 1,  phase: "Onboarding",  task: "Lengkapi profil dasar",               estimatedTime: "30 menit",    badgeUnlock: "Profile Complete", badgeIcon: "✓" },
  { day: 2,  phase: "Onboarding",  task: "Jelajahi Job Board",                   estimatedTime: "20 menit" },
  { day: 3,  phase: "Onboarding",  task: "Tambah portfolio & resume",             estimatedTime: "1 jam" },
  { day: 4,  phase: "Onboarding",  task: "Riset rate & market Jogja",             estimatedTime: "45 menit" },
  { day: 5,  phase: "Onboarding",  task: "Selesaikan profil 100%",               estimatedTime: "30 menit",    badgeUnlock: "Day 5 Milestone",  badgeIcon: "📅" },
  { day: 6,  phase: "Onboarding",  task: "Buat template cover letter",            estimatedTime: "1 jam" },
  { day: 7,  phase: "Eksplorasi",  task: "Ikuti 1 event atau meetup di Jogja",   estimatedTime: "2-3 jam",     badgeUnlock: "Event Attendee",   badgeIcon: "🎤" },
  { day: 8,  phase: "Eksplorasi",  task: "Kunjungi 1 coworking space Jogja",     estimatedTime: "3-5 jam" },
  { day: 9,  phase: "Eksplorasi",  task: "Join komunitas online freelancer Jogja",estimatedTime: "30 menit" },
  { day: 10, phase: "Eksplorasi",  task: "Connect dengan 5 freelancer lain",     estimatedTime: "1 jam" },
  { day: 11, phase: "Eksplorasi",  task: "Riset 3 cafe/workspace favorit",       estimatedTime: "Sepanjang hari" },
  { day: 12, phase: "Eksplorasi",  task: "Pelajari kontrak freelance dasar",     estimatedTime: "1.5 jam" },
  { day: 13, phase: "Eksplorasi",  task: "Update dan rapikan portofolio",        estimatedTime: "2-3 jam" },
  { day: 14, phase: "Eksplorasi",  task: "Ikuti workshop atau webinar online",   estimatedTime: "2-4 jam" },
  { day: 15, phase: "Eksplorasi",  task: "Review 2 minggu pertama",             estimatedTime: "45 menit",    badgeUnlock: "Day 15 Milestone", badgeIcon: "🌟" },
  { day: 16, phase: "Action",      task: "Identifikasi 5 job target",            estimatedTime: "30 menit" },
  { day: 17, phase: "Action",      task: "Siapkan cover letter yang dipersonalisasi", estimatedTime: "1.5 jam" },
  { day: 18, phase: "Action",      task: "Submit lamaran pertama!",              estimatedTime: "30 menit",    badgeUnlock: "First Application", badgeIcon: "🎯" },
  { day: 19, phase: "Action",      task: "Apply ke 2 job lainnya",               estimatedTime: "1 jam" },
  { day: 20, phase: "Action",      task: "Follow-up & networking aktif",         estimatedTime: "1 jam" },
  { day: 21, phase: "Action",      task: "Tingkatkan profil berdasarkan feedback",estimatedTime: "1 jam" },
  { day: 22, phase: "Action",      task: "Apply ke 3 job yang matching",         estimatedTime: "1.5 jam" },
  { day: 23, phase: "Action",      task: "Bangun kehadiran online",              estimatedTime: "2 jam" },
  { day: 24, phase: "Action",      task: "Minta referral atau rekomendasi",      estimatedTime: "30 menit" },
  { day: 25, phase: "Action",      task: "Jadwalkan interview atau call",         estimatedTime: "1 jam setup" },
  { day: 26, phase: "Wrap-up",     task: "Evaluasi pipeline lamaran",            estimatedTime: "30 menit" },
  { day: 27, phase: "Wrap-up",     task: "Perkuat koneksi terbaik",              estimatedTime: "1 jam" },
  { day: 28, phase: "Wrap-up",     task: "Dokumentasi pengalaman & lessons learned", estimatedTime: "45 menit" },
  { day: 29, phase: "Wrap-up",     task: "Rencanakan bulan kedua",               estimatedTime: "1 jam" },
  { day: 30, phase: "Wrap-up",     task: "Rayakan & share pencapaian!",          estimatedTime: "1 jam",       badgeUnlock: "30-Day Passport Finisher", badgeIcon: "🏆" },
];

async function getJourney(req, res, next) {
  try {
    const progress = await passportService.getProgress(req.user.id);
    return success(res, { journey: PASSPORT_DAYS, progress });
  } catch (err) {
    next(err);
  }
}

async function getTodayTask(req, res, next) {
  try {
    const progress = await passportService.getProgress(req.user.id);
    if (!progress) return success(res, null, "No passport progress found");
    const dayEntry = PASSPORT_DAYS.find((d) => d.day === progress.current_day);
    return success(res, { ...dayEntry, progress });
  } catch (err) {
    next(err);
  }
}

async function getDayDetail(req, res, next) {
  try {
    const dayNumber = parseInt(req.params.dayNumber);
    if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 30) {
      return badRequest(res, "Day number must be between 1 and 30");
    }
    const dayEntry = PASSPORT_DAYS.find((d) => d.day === dayNumber);
    return success(res, dayEntry);
  } catch (err) {
    next(err);
  }
}

async function markComplete(req, res, next) {
  try {
    const dayNumber = parseInt(req.params.dayNumber);
    if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 30) {
      return badRequest(res, "Day number must be between 1 and 30");
    }
    const result = await passportService.markDayComplete(req.user.id, dayNumber);
    return success(res, result, `Day ${dayNumber} marked complete!`);
  } catch (err) {
    next(err);
  }
}

async function getProgress(req, res, next) {
  try {
    const progress = await passportService.getProgress(req.user.id);
    return success(res, progress);
  } catch (err) {
    next(err);
  }
}

module.exports = { getJourney, getTodayTask, getDayDetail, markComplete, getProgress };
