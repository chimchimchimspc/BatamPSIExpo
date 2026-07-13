/**
 * Clears all existing job postings & events, then seeds fresh active
 * listings tied to a new set of "mitra" (partner) accounts.
 *
 *   node database/seed_mitra.js
 *
 * Idempotent-ish: re-running clears again and re-seeds from scratch.
 */
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { getClient, pool } = require("../src/config/database");

const MITRA_PASSWORD = "Mitra@2026";

const EMPLOYERS = [
  {
    email: "mitra.batiknusantara@jogjafreelance.id",
    full_name: "Sri Wulandari",
    company_name: "Batik Nusantara Digital",
    industry: "Fashion & E-commerce",
    company_description: "Brand fashion batik modern yang menjual produk secara online ke seluruh Indonesia.",
    location: "Kotagede, Yogyakarta",
  },
  {
    email: "mitra.kopikita@jogjafreelance.id",
    full_name: "Rangga Prasetyo",
    company_name: "Kopi Kita Coffee & Media",
    industry: "F&B & Media Konten",
    company_description: "Jaringan kedai kopi lokal dengan divisi konten kreatif untuk media sosial.",
    location: "Sleman, Yogyakarta",
  },
  {
    email: "mitra.edutechjogja@jogjafreelance.id",
    full_name: "Dewi Anggraini",
    company_name: "EduTech Jogja",
    industry: "Education Technology",
    company_description: "Startup edtech yang membangun platform belajar online untuk siswa SMA/SMK.",
    location: "Jl. Kaliurang, Yogyakarta",
  },
  {
    email: "mitra.greentech@jogjafreelance.id",
    full_name: "Fajar Nugroho",
    company_name: "GreenTech Solutions",
    industry: "Sustainability & IoT",
    company_description: "Startup teknologi yang mengembangkan solusi IoT untuk monitoring energi dan lingkungan.",
    location: "Jogja Digital Valley, Yogyakarta",
  },
  {
    email: "mitra.tanikonek@jogjafreelance.id",
    full_name: "Slamet Riyadi",
    company_name: "TaniConnect",
    industry: "AgriTech",
    company_description: "Platform digital yang menghubungkan petani lokal Jogja langsung dengan pembeli dan UMKM olahan pangan.",
    location: "Bantul, Yogyakarta",
  },
  {
    email: "mitra.jogjaprint@jogjafreelance.id",
    full_name: "Nita Kusumawati",
    company_name: "Jogja Print & Merch",
    industry: "Percetakan & Merchandise",
    company_description: "Usaha percetakan dan merchandise custom untuk komunitas, event, dan brand lokal di Yogyakarta.",
    location: "Gamping, Yogyakarta",
  },
  // Catatan: role "event_organizer" tidak dipakai — di frontend, employer dan
  // event_organizer diperlakukan identik (nav, dashboard, izin bikin event sama
  // persis), dan form registrasi cuma menawarkan "employer". Jadi semua mitra
  // pembuat event di bawah ini didaftarkan sebagai employer biasa juga, supaya
  // konsisten dengan satu jenis akun mitra saja.
  {
    email: "mitra.creativehub@jogjafreelance.id",
    full_name: "Anisa Putri",
    company_name: "Jogja Creative Hub",
    industry: "Komunitas & Event Kreatif",
    company_description: "Komunitas dan penyelenggara event untuk desainer, content creator, dan pelaku industri kreatif di Yogyakarta.",
    location: "Yogyakarta",
  },
  {
    email: "mitra.devcommunity@jogjafreelance.id",
    full_name: "Bimo Aditya",
    company_name: "Jogja Developer Community",
    industry: "Komunitas Teknologi",
    company_description: "Komunitas developer Yogyakarta yang rutin mengadakan meetup, workshop, dan coffee chat seputar teknologi.",
    location: "Yogyakarta",
  },
  {
    email: "mitra.startupweekend@jogjafreelance.id",
    full_name: "Galih Pratama",
    company_name: "Startup Weekend Jogja",
    industry: "Komunitas Startup",
    company_description: "Penyelenggara acara dan networking untuk founder, builder, dan calon wirausaha digital di Yogyakarta.",
    location: "Yogyakarta",
  },
];

const JOBS = [
  {
    employerEmail: "mitra.batiknusantara@jogjafreelance.id",
    title: "Desainer UI/UX Aplikasi E-Commerce Batik",
    category: "UI/UX Design",
    description: "Redesign UI/UX aplikasi mobile e-commerce kami agar lebih modern dan mudah digunakan. Cakupan: user research singkat, wireframe, hingga high-fidelity prototype di Figma untuk alur belanja dan checkout.",
    requirements: ["Portfolio Figma wajib dilampirkan", "Pengalaman desain e-commerce/marketplace", "Bisa deliver dalam 3 minggu", "Familiar dengan design system"],
    skills: ["Figma", "UI Design", "UX Design", "Prototyping"],
    budget_min: 3000000, budget_max: 6000000, budget_type: "fixed", deadline_days: 21,
    location: "Kotagede, Yogyakarta", location_type: "Hybrid", experience_level: "Mid",
    contact_email: "hr@batiknusantara.id", contact_whatsapp: "+6281234500001",
  },
  {
    employerEmail: "mitra.batiknusantara@jogjafreelance.id",
    title: "Content Writer Produk Batik untuk Marketplace",
    category: "Content Writing",
    description: "Tulis deskripsi produk yang menarik dan SEO-friendly untuk 50+ listing batik di Shopee/Tokopedia. Perlu riset kata kunci ringan dan gaya bahasa yang menjual namun tetap informatif.",
    requirements: ["Pengalaman menulis copy produk/marketplace", "Familiar dasar SEO", "Bahasa Indonesia yang baik dan baku", "Bisa deliver 10 produk per minggu"],
    skills: ["SEO Writing", "Copywriting", "Bahasa Indonesia"],
    budget_min: 1500000, budget_max: 3000000, budget_type: "fixed", deadline_days: 14,
    location: "Remote", location_type: "Remote", experience_level: "Junior",
    contact_email: "hr@batiknusantara.id", contact_whatsapp: null,
  },
  {
    employerEmail: "mitra.batiknusantara@jogjafreelance.id",
    title: "Desain Logo & Brand Kit Lini Produk Baru",
    category: "Logo Design",
    description: "Buat logo dan brand kit (warna, tipografi, template packaging) untuk lini produk batik anak muda yang akan diluncurkan bulan depan.",
    requirements: ["Portfolio logo/brand identity", "Deliver format AI, EPS, PNG, SVG", "Revisi hingga 3 kali", "Proses 7-10 hari kerja"],
    skills: ["Illustrator", "Photoshop"],
    budget_min: 1500000, budget_max: 3000000, budget_type: "fixed", deadline_days: 10,
    location: "Remote", location_type: "Remote", experience_level: "Junior",
    contact_email: "hr@batiknusantara.id", contact_whatsapp: null,
  },
  {
    employerEmail: "mitra.kopikita@jogjafreelance.id",
    title: "Social Media Specialist Kopi Kita",
    category: "Social Media",
    description: "Kelola akun Instagram & TikTok Kopi Kita (8 cabang). Tugas: content calendar, posting harian, balas komentar/DM, dan laporan engagement mingguan. Part-time 3-4 jam per hari.",
    requirements: ["Pengalaman kelola akun bisnis F&B", "Bisa bikin caption menarik", "Familiar Canva & scheduling tools", "Responsif dan aktif"],
    skills: ["Instagram", "TikTok", "Facebook Ads"],
    budget_min: 2000000, budget_max: 3500000, budget_type: "fixed", deadline_days: 30,
    location: "Sleman, Yogyakarta", location_type: "Hybrid", experience_level: "Junior",
    contact_email: "media@kopikita.id", contact_whatsapp: "+6281234500002",
  },
  {
    employerEmail: "mitra.kopikita@jogjafreelance.id",
    title: "Video Editor Konten Reels & TikTok",
    category: "Video Editing",
    description: "Edit video pendek (30-60 detik) untuk konten Reels/TikTok Kopi Kita. Format vertical, trendy, dengan caption dan efek transisi. Kebutuhan 8 video per bulan, material disediakan.",
    requirements: ["Familiar Premiere Pro/CapCut", "Mengerti tren konten short video 2026", "Portfolio Reels/TikTok", "Delivery 2 hari per video"],
    skills: ["Premiere Pro", "After Effects", "Color Grading"],
    budget_min: 2500000, budget_max: 5000000, budget_type: "fixed", deadline_days: 7,
    location: "Remote", location_type: "Remote", experience_level: "Mid",
    contact_email: "media@kopikita.id", contact_whatsapp: null,
  },
  {
    employerEmail: "mitra.edutechjogja@jogjafreelance.id",
    title: "Frontend Developer React untuk Platform Belajar",
    category: "Web Development",
    description: "Bangun antarmuka platform belajar online kami menggunakan React & Next.js. Fitur: dashboard siswa, player video interaktif, dan sistem kuis. Kolaborasi dengan tim backend via REST API.",
    requirements: ["Minimal 1 tahun pengalaman React", "Familiar TypeScript & Next.js", "Pernah integrasi REST API", "Portfolio/GitHub aktif"],
    skills: ["React", "TypeScript", "Next.js"],
    budget_min: 5000000, budget_max: 9000000, budget_type: "fixed", deadline_days: 30,
    location: "Remote", location_type: "Remote", experience_level: "Mid",
    contact_email: "tech@edutechjogja.id", contact_whatsapp: "+6281234500003",
  },
  {
    employerEmail: "mitra.edutechjogja@jogjafreelance.id",
    title: "Mobile Developer Flutter — Aplikasi Belajar Siswa",
    category: "Mobile Development",
    description: "Kembangkan aplikasi mobile Flutter untuk siswa SMA/SMK: materi offline-first, progress tracking, dan notifikasi belajar harian. Proyek jangka panjang, potensi lanjut kontrak.",
    requirements: ["Minimal 1 tahun pengalaman Flutter", "Pernah bikin app offline-first", "Familiar SQLite/Hive", "Komunikasi rutin via WhatsApp"],
    skills: ["Flutter"],
    budget_min: 6000000, budget_max: 10000000, budget_type: "fixed", deadline_days: 45,
    location: "Jl. Kaliurang, Yogyakarta", location_type: "Hybrid", experience_level: "Senior",
    contact_email: "tech@edutechjogja.id", contact_whatsapp: "+6281234500003",
  },
  {
    employerEmail: "mitra.edutechjogja@jogjafreelance.id",
    title: "Data Entry & Riset Konten Kurikulum",
    category: "Data Entry",
    description: "Bantu riset dan input soal-soal latihan sesuai kurikulum terbaru ke dalam sistem kami. Perlu ketelitian tinggi dan kemampuan riset materi pelajaran SMA.",
    requirements: ["Teliti dan terstruktur", "Familiar Google Sheets/Excel", "Riset materi SMA/SMK", "Bisa kerja part-time konsisten"],
    skills: ["Research", "Bahasa Indonesia"],
    budget_min: 1000000, budget_max: 2000000, budget_type: "hourly", deadline_days: 20,
    location: "Remote", location_type: "Remote", experience_level: "Junior",
    contact_email: "tech@edutechjogja.id", contact_whatsapp: null,
  },
  {
    employerEmail: "mitra.greentech@jogjafreelance.id",
    title: "Backend Developer Node.js Platform IoT",
    category: "Web Development",
    description: "Bangun API backend untuk platform monitoring energi berbasis IoT. Cakupan: ingest data sensor real-time, dashboard API, dan integrasi database time-series.",
    requirements: ["Minimal 2 tahun pengalaman Node.js", "Familiar MongoDB/database time-series", "Paham arsitektur REST API", "Bisa kerja async dengan tim kecil"],
    skills: ["Node.js", "JavaScript", "MongoDB"],
    budget_min: 6000000, budget_max: 12000000, budget_type: "fixed", deadline_days: 40,
    location: "Remote", location_type: "Remote", experience_level: "Senior",
    contact_email: "careers@greentech.id", contact_whatsapp: "+6281234500004",
  },
  {
    employerEmail: "mitra.greentech@jogjafreelance.id",
    title: "UI Designer Dashboard Monitoring Energi",
    category: "UI/UX Design",
    description: "Desain dashboard web untuk monitoring konsumsi energi real-time. Perlu visualisasi data yang jelas (grafik, gauge, alert) dan konsisten dengan design system kami.",
    requirements: ["Portfolio dashboard/data visualization", "Familiar Figma & design system", "Paham prinsip UI untuk data-heavy app", "Bisa deliver dalam 2-3 minggu"],
    skills: ["Figma", "UI Design", "Design System"],
    budget_min: 3500000, budget_max: 6000000, budget_type: "fixed", deadline_days: 21,
    location: "Jogja Digital Valley, Yogyakarta", location_type: "Hybrid", experience_level: "Mid",
    contact_email: "careers@greentech.id", contact_whatsapp: null,
  },
  {
    employerEmail: "mitra.greentech@jogjafreelance.id",
    title: "Fotografer Produk untuk Materi Marketing",
    category: "Photography",
    description: "Ambil foto produk perangkat IoT kami (sensor, dashboard fisik) untuk kebutuhan website dan materi pitch investor. Sesi foto di kantor kami.",
    requirements: ["Portfolio foto produk/tech", "Bawa peralatan sendiri", "Hasil edit siap pakai (RAW + JPEG)", "Sesi 1 hari, revisi 1x"],
    skills: ["Photoshop", "Canva"],
    budget_min: 1500000, budget_max: 2500000, budget_type: "fixed", deadline_days: 14,
    location: "Jogja Digital Valley, Yogyakarta", location_type: "Onsite", experience_level: "Junior",
    contact_email: "careers@greentech.id", contact_whatsapp: null,
  },
  {
    employerEmail: "mitra.greentech@jogjafreelance.id",
    title: "Video Editor Dokumentasi Produk & Company Profile",
    category: "Video Editing",
    description: "Edit footage dokumentasi produk IoT dan wawancara tim menjadi video company profile berdurasi 3-5 menit untuk kebutuhan pitch investor dan website.",
    requirements: ["Portfolio video company profile/corporate", "Familiar Premiere Pro & color grading", "Bisa kerja dari raw footage tanpa storyboard detail", "Deliver dalam 2 minggu"],
    skills: ["Premiere Pro", "After Effects", "Color Grading"],
    budget_min: 3000000, budget_max: 5500000, budget_type: "fixed", deadline_days: 14,
    location: "Remote", location_type: "Remote", experience_level: "Mid",
    contact_email: "careers@greentech.id", contact_whatsapp: null,
  },
  {
    employerEmail: "mitra.batiknusantara@jogjafreelance.id",
    title: "Mobile Developer React Native — App Loyalty Pelanggan",
    category: "Mobile Development",
    description: "Bangun aplikasi mobile loyalty program untuk pelanggan setia Batik Nusantara: poin reward, katalog produk, dan notifikasi promo. Target rilis Android & iOS.",
    requirements: ["Minimal 1 tahun pengalaman React Native", "Pernah publish app ke Play Store/App Store", "Familiar push notification & REST API", "Bisa kerja mandiri dengan progress mingguan"],
    skills: ["React Native", "JavaScript"],
    budget_min: 5000000, budget_max: 8500000, budget_type: "fixed", deadline_days: 35,
    location: "Remote", location_type: "Remote", experience_level: "Mid",
    contact_email: "hr@batiknusantara.id", contact_whatsapp: "+6281234500001",
  },
  {
    employerEmail: "mitra.kopikita@jogjafreelance.id",
    title: "Copywriter Menu & Promo Musiman",
    category: "Content Writing",
    description: "Tulis copy menu baru dan campaign promo musiman (kemerdekaan, tahun baru, dsb) untuk digunakan di media sosial dan papan menu 8 cabang Kopi Kita.",
    requirements: ["Portfolio copywriting F&B/lifestyle", "Bisa menulis dengan tone playful dan ringan", "Deliver 5-8 copy per batch", "Familiar tren campaign musiman lokal"],
    skills: ["Copywriting", "Bahasa Indonesia"],
    budget_min: 1200000, budget_max: 2500000, budget_type: "fixed", deadline_days: 10,
    location: "Remote", location_type: "Remote", experience_level: "Junior",
    contact_email: "media@kopikita.id", contact_whatsapp: null,
  },
  {
    employerEmail: "mitra.edutechjogja@jogjafreelance.id",
    title: "UI/UX Designer Landing Page Kursus Baru",
    category: "UI/UX Design",
    description: "Desain landing page untuk peluncuran kursus baru EduTech Jogja: hero section, showcase materi, testimoni, dan CTA pendaftaran yang conversion-friendly.",
    requirements: ["Portfolio landing page/marketing site", "Familiar Figma & prinsip conversion design", "Paham dasar copywriting untuk CTA", "Bisa deliver dalam 1-2 minggu"],
    skills: ["Figma", "UI Design", "Prototyping"],
    budget_min: 2000000, budget_max: 4000000, budget_type: "fixed", deadline_days: 14,
    location: "Remote", location_type: "Remote", experience_level: "Junior",
    contact_email: "tech@edutechjogja.id", contact_whatsapp: null,
  },
  {
    employerEmail: "mitra.tanikonek@jogjafreelance.id",
    title: "Backend Developer Laravel untuk Platform Petani",
    category: "Web Development",
    description: "Bangun modul backend Laravel untuk platform marketplace hasil tani: manajemen produk, pesanan, dan pembayaran. Perlu paham relasi database yang cukup kompleks.",
    requirements: ["Minimal 1.5 tahun pengalaman Laravel", "Familiar MySQL & query optimization", "Pernah integrasi payment gateway", "Bisa dokumentasi API dengan jelas"],
    skills: ["Laravel", "PHP"],
    budget_min: 5500000, budget_max: 9500000, budget_type: "fixed", deadline_days: 35,
    location: "Bantul, Yogyakarta", location_type: "Hybrid", experience_level: "Mid",
    contact_email: "tech@taniconnect.id", contact_whatsapp: "+6281234500005",
  },
  {
    employerEmail: "mitra.tanikonek@jogjafreelance.id",
    title: "UI/UX Designer Aplikasi Marketplace Hasil Tani",
    category: "UI/UX Design",
    description: "Desain ulang alur transaksi aplikasi marketplace hasil tani agar lebih mudah dipakai petani dengan literasi digital terbatas. Fokus pada kesederhanaan dan aksesibilitas.",
    requirements: ["Pengalaman desain untuk pengguna non-teknis", "Portfolio user research/usability", "Familiar Figma", "Bisa lakukan uji coba dengan pengguna nyata"],
    skills: ["Figma", "UI Design", "User Research"],
    budget_min: 3000000, budget_max: 5500000, budget_type: "fixed", deadline_days: 21,
    location: "Bantul, Yogyakarta", location_type: "Hybrid", experience_level: "Mid",
    contact_email: "tech@taniconnect.id", contact_whatsapp: null,
  },
  {
    employerEmail: "mitra.tanikonek@jogjafreelance.id",
    title: "Content Writer Edukasi Pertanian Digital",
    category: "Content Writing",
    description: "Tulis artikel edukasi seputar pertanian modern, digitalisasi UMKM tani, dan tips jual hasil panen online untuk blog TaniConnect.",
    requirements: ["Suka riset topik pertanian/agribisnis", "Familiar dasar SEO", "Bahasa Indonesia yang mudah dipahami petani", "Deliver 2 artikel per minggu"],
    skills: ["SEO Writing", "Bahasa Indonesia"],
    budget_min: 1300000, budget_max: 2500000, budget_type: "fixed", deadline_days: 14,
    location: "Remote", location_type: "Remote", experience_level: "Junior",
    contact_email: "tech@taniconnect.id", contact_whatsapp: null,
  },
  {
    employerEmail: "mitra.jogjaprint@jogjafreelance.id",
    title: "Graphic Designer Merchandise & Packaging",
    category: "Logo Design",
    description: "Desain motif dan layout untuk lini merchandise baru (kaos, totebag, stiker) serta kemasan produk custom pelanggan. Perlu variasi desain yang mudah dicetak.",
    requirements: ["Portfolio desain merchandise/print", "Familiar Illustrator & spesifikasi cetak (CMYK, bleed)", "Deliver file siap cetak", "Revisi hingga 2 kali"],
    skills: ["Illustrator", "Photoshop"],
    budget_min: 1800000, budget_max: 3200000, budget_type: "fixed", deadline_days: 14,
    location: "Gamping, Yogyakarta", location_type: "Hybrid", experience_level: "Junior",
    contact_email: "order@jogjaprint.id", contact_whatsapp: "+6281234500006",
  },
  {
    employerEmail: "mitra.jogjaprint@jogjafreelance.id",
    title: "Fotografer Produk Merchandise",
    category: "Photography",
    description: "Foto katalog produk merchandise (kaos, mug, totebag) untuk kebutuhan katalog online dan media sosial. Sesi foto di studio kami.",
    requirements: ["Portfolio foto produk katalog", "Familiar lighting produk sederhana", "Hasil edit rapi dan konsisten", "Sesi 1-2 hari"],
    skills: ["Photoshop", "Canva"],
    budget_min: 1200000, budget_max: 2200000, budget_type: "fixed", deadline_days: 7,
    location: "Gamping, Yogyakarta", location_type: "Onsite", experience_level: "Junior",
    contact_email: "order@jogjaprint.id", contact_whatsapp: null,
  },
  {
    employerEmail: "mitra.jogjaprint@jogjafreelance.id",
    title: "Social Media Ads Specialist",
    category: "Social Media",
    description: "Kelola iklan Instagram & Facebook Ads untuk promosi jasa cetak dan merchandise custom. Target: leads dari komunitas/event organizer.",
    requirements: ["Pengalaman menjalankan Facebook/Instagram Ads", "Bisa bikin laporan performa sederhana", "Paham dasar targeting audience lokal", "Budget iklan disediakan terpisah"],
    skills: ["Facebook Ads", "Instagram"],
    budget_min: 1800000, budget_max: 3000000, budget_type: "fixed", deadline_days: 30,
    location: "Remote", location_type: "Remote", experience_level: "Mid",
    contact_email: "order@jogjaprint.id", contact_whatsapp: null,
  },
  {
    employerEmail: "mitra.jogjaprint@jogjafreelance.id",
    title: "Data Entry Riset Kompetitor Marketplace",
    category: "Data Entry",
    description: "Riset dan input data harga & katalog kompetitor jasa cetak/merchandise dari berbagai marketplace ke spreadsheet untuk kebutuhan analisis harga.",
    requirements: ["Teliti dan sistematis", "Familiar Google Sheets/Excel", "Bisa kerja dengan deadline mingguan", "Tidak perlu pengalaman khusus"],
    skills: ["Research"],
    budget_min: 800000, budget_max: 1500000, budget_type: "hourly", deadline_days: 14,
    location: "Remote", location_type: "Remote", experience_level: "Junior",
    contact_email: "order@jogjaprint.id", contact_whatsapp: null,
  },
];

const EVENTS = [
  {
    organizerEmail: "mitra.creativehub@jogjafreelance.id",
    title: "Workshop Portfolio Design untuk Freelancer Pemula",
    description: "Belajar menyusun portfolio Figma yang menjual dari mentor desainer berpengalaman. Cocok untuk freelancer baru yang ingin dapat klien pertama.",
    type: "workshop", daysFromNow: 10, event_time: "10:00", duration_minutes: 150,
    location_name: "Impact Hub Jogja", location_address: "Jl. Suryodiningratan, Yogyakarta",
    latitude: -7.808333, longitude: 110.357778, is_free: true, price: null, attendee_limit: 40,
    skills: ["Figma", "UI Design", "Prototyping"],
  },
  {
    organizerEmail: "mitra.creativehub@jogjafreelance.id",
    title: "Coffee Chat: Ngobrol Santai Freelance vs Kerja Kantoran",
    description: "Sesi ngobrol santai bareng freelancer & karyawan full-time membahas plus-minus masing-masing jalur karier.",
    type: "coffee_chat", daysFromNow: 5, event_time: "16:00", duration_minutes: 90,
    location_name: "Epilog Coffee", location_address: "Jl. Petung, Papringan, Yogyakarta",
    latitude: -7.769349, longitude: 110.393890, is_free: true, price: null, attendee_limit: 25,
    skills: [],
  },
  {
    organizerEmail: "mitra.creativehub@jogjafreelance.id",
    title: "Creative Mixer: Desainer & Content Creator Jogja",
    description: "Networking santai antar desainer, content creator, dan brand lokal Jogja. Ada sesi lightning pitch untuk yang ingin memperkenalkan portofolio.",
    type: "networking", daysFromNow: 20, event_time: "18:00", duration_minutes: 180,
    location_name: "Ruang Kolektif", location_address: "Jl. Kaliurang KM 5, Yogyakarta",
    latitude: -7.755000, longitude: 110.377000, is_free: false, price: 25000, attendee_limit: 60,
    skills: [],
  },
  {
    organizerEmail: "mitra.devcommunity@jogjafreelance.id",
    title: "Meetup Developer Jogja: AI & Web",
    description: "Meetup bulanan komunitas developer Jogja. Sesi sharing tentang integrasi AI di aplikasi web, lightning talk, dan networking santai.",
    type: "meetup", daysFromNow: 14, event_time: "18:30", duration_minutes: 120,
    location_name: "Jogja Digital Valley", location_address: "Jl. Ring Road Utara, Yogyakarta",
    latitude: -7.759768, longitude: 110.377529, is_free: true, price: null, attendee_limit: 100,
    skills: [],
  },
  {
    organizerEmail: "mitra.devcommunity@jogjafreelance.id",
    title: "Workshop Next.js untuk Pemula",
    description: "Belajar dasar-dasar Next.js: routing, server components, dan deployment. Bawa laptop sendiri, hands-on coding session.",
    type: "workshop", daysFromNow: 7, event_time: "09:00", duration_minutes: 240,
    location_name: "Hack4ID Space", location_address: "Jl. Kaliurang KM 7, Yogyakarta",
    latitude: -7.745000, longitude: 110.379000, is_free: false, price: 50000, attendee_limit: 30,
    skills: ["React", "Next.js", "TypeScript"],
  },
  {
    organizerEmail: "mitra.devcommunity@jogjafreelance.id",
    title: "Coffee Chat: Karier di Startup Teknologi",
    description: "Ngobrol bareng engineer dan founder startup lokal seputar tips membangun karier di dunia startup teknologi.",
    type: "coffee_chat", daysFromNow: 12, event_time: "14:00", duration_minutes: 90,
    location_name: "Kopi Klotok", location_address: "Jl. Kaliurang KM 16, Yogyakarta",
    latitude: -7.665000, longitude: 110.407000, is_free: true, price: null, attendee_limit: 20,
    skills: [],
  },
  {
    organizerEmail: "mitra.edutechjogja@jogjafreelance.id",
    title: "Workshop Membuat Konten Belajar Interaktif",
    description: "Belajar menyusun materi belajar interaktif (kuis, video pendek, infografis) yang efektif untuk siswa SMA/SMK, dibawakan tim EduTech Jogja.",
    type: "workshop", daysFromNow: 16, event_time: "13:00", duration_minutes: 150,
    location_name: "EduTech Jogja Office", location_address: "Jl. Kaliurang, Yogyakarta",
    latitude: -7.750000, longitude: 110.378000, is_free: true, price: null, attendee_limit: 35,
    skills: ["Content Strategy", "Canva"],
  },
  {
    organizerEmail: "mitra.greentech@jogjafreelance.id",
    title: "GreenTech Meetup: Teknologi untuk Keberlanjutan",
    description: "Diskusi panel dan networking seputar peran teknologi (IoT, data) dalam mendukung keberlanjutan lingkungan, menghadirkan praktisi startup green-tech.",
    type: "networking", daysFromNow: 25, event_time: "17:00", duration_minutes: 150,
    location_name: "Jogja Digital Valley", location_address: "Jl. Ring Road Utara, Yogyakarta",
    latitude: -7.759768, longitude: 110.377529, is_free: false, price: 30000, attendee_limit: 50,
    skills: [],
  },
  {
    organizerEmail: "mitra.tanikonek@jogjafreelance.id",
    title: "Workshop Digitalisasi UMKM Pertanian",
    description: "Belajar cara UMKM olahan pangan dan petani lokal mulai berjualan online: foto produk sederhana, jualan di marketplace, dan dasar promosi digital.",
    type: "workshop", daysFromNow: 18, event_time: "09:00", duration_minutes: 180,
    location_name: "Balai Desa Digital Bantul", location_address: "Jl. Parangtritis, Bantul, Yogyakarta",
    latitude: -7.883000, longitude: 110.354000, is_free: true, price: null, attendee_limit: 45,
    skills: ["Canva"],
  },
  {
    organizerEmail: "mitra.jogjaprint@jogjafreelance.id",
    title: "Coffee Chat: Ngobrol Bisnis Merchandise & Cetak",
    description: "Ngobrol santai bareng pelaku usaha percetakan dan merchandise lokal seputar tren desain, supplier, dan strategi harga.",
    type: "coffee_chat", daysFromNow: 9, event_time: "15:30", duration_minutes: 90,
    location_name: "Selasar Kopi Gamping", location_address: "Jl. Wates, Gamping, Yogyakarta",
    latitude: -7.792000, longitude: 110.322000, is_free: true, price: null, attendee_limit: 20,
    skills: [],
  },
  {
    organizerEmail: "mitra.startupweekend@jogjafreelance.id",
    title: "Startup Weekend Jogja: Demo Day",
    description: "Puncak acara Startup Weekend Jogja — tim-tim peserta mempresentasikan produk hasil 54 jam membangun startup di depan panel juri dan investor lokal.",
    type: "networking", daysFromNow: 30, event_time: "13:00", duration_minutes: 240,
    location_name: "Auditorium UGM Fisipol", location_address: "Bulaksumur, Yogyakarta",
    latitude: -7.771000, longitude: 110.377000, is_free: false, price: 75000, attendee_limit: 150,
    skills: [],
  },
  {
    organizerEmail: "mitra.startupweekend@jogjafreelance.id",
    title: "Meetup Founder & Builder Jogja",
    description: "Meetup santai untuk founder startup, indie hacker, dan builder produk digital di Jogja. Sharing progress, cari co-founder, dan diskusi seputar early-stage startup.",
    type: "meetup", daysFromNow: 22, event_time: "18:00", duration_minutes: 120,
    location_name: "Impact Hub Jogja", location_address: "Jl. Suryodiningratan, Yogyakarta",
    latitude: -7.808333, longitude: 110.357778, is_free: true, price: null, attendee_limit: 60,
    skills: [],
  },
  {
    organizerEmail: "mitra.creativehub@jogjafreelance.id",
    title: "Meetup Ilustrator & Motion Designer Jogja",
    description: "Kumpul komunitas ilustrator dan motion designer Jogja: sharing proses kerja, showcase karya, dan diskusi peluang project bareng brand lokal.",
    type: "meetup", daysFromNow: 27, event_time: "16:00", duration_minutes: 120,
    location_name: "Ruang Kolektif", location_address: "Jl. Kaliurang KM 5, Yogyakarta",
    latitude: -7.755000, longitude: 110.377000, is_free: true, price: null, attendee_limit: 40,
    skills: ["Motion Design", "Illustrator"],
  },
  {
    organizerEmail: "mitra.devcommunity@jogjafreelance.id",
    title: "Workshop Flutter Lanjutan: State Management",
    description: "Workshop lanjutan untuk yang sudah paham dasar Flutter — fokus pada state management (Provider/Riverpod) dan arsitektur aplikasi skala menengah.",
    type: "workshop", daysFromNow: 33, event_time: "09:00", duration_minutes: 240,
    location_name: "Hack4ID Space", location_address: "Jl. Kaliurang KM 7, Yogyakarta",
    latitude: -7.745000, longitude: 110.379000, is_free: false, price: 60000, attendee_limit: 25,
    skills: ["Flutter"],
  },
];

async function ensureEmployer(client, e) {
  const hash = bcrypt.hashSync(MITRA_PASSWORD, 12);
  const u = await client.query(
    `INSERT INTO users (email, password_hash, full_name, city, role, is_email_verified, is_verified)
     VALUES ($1,$2,$3,'Yogyakarta','employer',TRUE,TRUE)
     ON CONFLICT (email) DO UPDATE SET
       password_hash = EXCLUDED.password_hash, full_name = EXCLUDED.full_name, role = 'employer'
     RETURNING id`,
    [e.email, hash, e.full_name]
  );
  const userId = u.rows[0].id;
  await client.query(
    `INSERT INTO employer_profiles (user_id, company_name, industry, company_description, location, total_jobs_posted, total_hired)
     VALUES ($1,$2,$3,$4,$5,0,0)
     ON CONFLICT (user_id) DO UPDATE SET
       company_name = EXCLUDED.company_name, industry = EXCLUDED.industry,
       company_description = EXCLUDED.company_description, location = EXCLUDED.location`,
    [userId, e.company_name, e.industry, e.company_description, e.location]
  );
  return userId;
}

async function run() {
  const client = await getClient();
  try {
    await client.query("BEGIN");

    console.log("Clearing existing job postings & events...");
    await client.query("DELETE FROM notifications WHERE related_type IN ('job', 'event')");
    await client.query("DELETE FROM job_postings");
    await client.query("DELETE FROM events");
    await client.query("UPDATE employer_profiles SET total_jobs_posted = 0, total_hired = 0");

    console.log("Creating mitra accounts...");
    const employerIds = {};
    for (const e of EMPLOYERS) {
      employerIds[e.email] = await ensureEmployer(client, e);
      console.log(`  employer: ${e.company_name} <${e.email}>`);
    }

    console.log("Seeding jobs...");
    const jobCountByEmployer = {};
    for (let i = 0; i < JOBS.length; i++) {
      const j = JOBS[i];
      const employerId = employerIds[j.employerEmail];
      const cat = await client.query("SELECT id FROM job_categories WHERE name = $1", [j.category]);
      const categoryId = cat.rows[0] ? cat.rows[0].id : null;

      const jobRes = await client.query(
        `INSERT INTO job_postings
           (employer_id, title, category_id, description, budget_min, budget_max, budget_type,
            deadline_days, deadline_date, location, location_type, experience_level,
            contact_whatsapp, contact_email, status, view_count, application_count,
            reviewed_at, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8, CURRENT_DATE + $8::int, $9,$10,$11,$12,$13,'active',$14,0,
                 NOW(), NOW() - ($15 || ' days')::interval)
         RETURNING id`,
        [
          employerId, j.title, categoryId, j.description, j.budget_min, j.budget_max,
          j.budget_type, j.deadline_days, j.location, j.location_type, j.experience_level,
          j.contact_whatsapp, j.contact_email, Math.floor(Math.random() * 300) + 20,
          i, // stagger created_at so newest-sort looks natural
        ]
      );
      const jobId = jobRes.rows[0].id;

      for (const s of j.skills) {
        const sk = await client.query("SELECT id FROM skills WHERE name ILIKE $1", [s]);
        if (sk.rows[0]) {
          await client.query("INSERT INTO job_skills (job_id, skill_id) VALUES ($1,$2) ON CONFLICT DO NOTHING", [jobId, sk.rows[0].id]);
        }
      }
      for (let r = 0; r < j.requirements.length; r++) {
        await client.query("INSERT INTO job_requirements (job_id, requirement, order_index) VALUES ($1,$2,$3)", [jobId, j.requirements[r], r]);
      }

      jobCountByEmployer[j.employerEmail] = (jobCountByEmployer[j.employerEmail] || 0) + 1;
      console.log(`  ✓ job: ${j.title}`);
    }

    for (const [email, count] of Object.entries(jobCountByEmployer)) {
      await client.query("UPDATE employer_profiles SET total_jobs_posted = $1 WHERE user_id = $2", [count, employerIds[email]]);
    }

    console.log("Seeding events...");
    for (const ev of EVENTS) {
      const organizerId = employerIds[ev.organizerEmail];
      const organizerName = EMPLOYERS.find((e) => e.email === ev.organizerEmail)?.company_name;
      const checkInCode = `EVT${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

      const evRes = await client.query(
        `INSERT INTO events
           (title, description, type, event_date, event_time, duration_minutes,
            location_name, location_address, latitude, longitude,
            organizer_id, organizer_name, is_free, price, check_in_code, attendee_limit,
            status, reviewed_at, created_at)
         VALUES ($1,$2,$3, CURRENT_DATE + $4::int, $5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,
                 'active', NOW(), NOW())
         RETURNING id`,
        [
          ev.title, ev.description, ev.type, ev.daysFromNow, ev.event_time, ev.duration_minutes,
          ev.location_name, ev.location_address, ev.latitude, ev.longitude,
          organizerId, organizerName, ev.is_free, ev.price, checkInCode, ev.attendee_limit,
        ]
      );
      const eventId = evRes.rows[0].id;

      for (const s of ev.skills) {
        const sk = await client.query("SELECT id FROM skills WHERE name ILIKE $1", [s]);
        if (sk.rows[0]) {
          await client.query("INSERT INTO event_skills (event_id, skill_id) VALUES ($1,$2) ON CONFLICT DO NOTHING", [eventId, sk.rows[0].id]);
        }
      }
      console.log(`  ✓ event: ${ev.title}`);
    }

    await client.query("COMMIT");
    console.log(`\nDone. Seeded ${JOBS.length} jobs and ${EVENTS.length} events across ${EMPLOYERS.length} mitra accounts.`);
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("Seed failed:", e);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();
