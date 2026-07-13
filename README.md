# Jogja Freelance Passport

Platform freelance lokal Yogyakarta yang menghubungkan **freelancer** dengan **pengelola (mitra/UMKM/komunitas)** — lengkap dengan lowongan pekerjaan, event & workshop, panduan karier 30 hari, sistem review hasil kerja, rating, chat, dan asisten karier AI.

🌐 **Live demo:** https://jogjafreelance.mlakumlaku.site

---

## Daftar Isi

- [Teknologi](#teknologi)
- [Struktur Project](#struktur-project)
- [Panduan Pengguna — Freelancer](#panduan-pengguna--freelancer)
- [Panduan Pengguna — Pengelola (Mitra)](#panduan-pengguna--pengelola-mitra)
- [Panduan Admin](#panduan-admin)
- [Cara Menjalankan (Development)](#cara-menjalankan-development)
- [Deploy ke Production (Cloudflare Tunnel)](#deploy-ke-production-cloudflare-tunnel)
- [Akun untuk Testing](#akun-untuk-testing)

---

## Teknologi

| Bagian | Stack |
|---|---|
| Frontend | Next.js 16 (App Router, Turbopack), React, TypeScript, Tailwind CSS |
| Backend | Node.js 22, Express, PostgreSQL 17 |
| Auth | JWT + session, Google OAuth (opsional) |
| AI Chat | Google Gemini API (streaming SSE) |
| Deploy | Cloudflare Tunnel → laptop/PC sebagai server |

## Struktur Project

```
BatamPSIExpo/
├── backend/              → API server (Express + PostgreSQL)
│   ├── src/              → controllers, routes, services, features
│   └── database/         → schema.sql, updates.sql, seed script
├── jogja-freelance/      → Frontend (Next.js)
│   └── app/              → halaman & komponen
├── AKUN_MITRA.txt        → kredensial akun mitra untuk testing
└── cloudflared-jogjafreelance.yml → konfigurasi tunnel deploy
```

---

## Panduan Pengguna — Freelancer

### 1. Daftar & Lengkapi Profil
1. Buka **Buat Akun Baru** → pilih peran **Freelancer**
2. Isi nama, email, password, kota, dan pilih **1–5 skill** (daftar skill diambil dari sistem, mis. React, Figma, Copywriting)
3. Setelah login, lengkapi profil: **foto, bio, dan minimal 3 skill** (ini juga misi Hari 1 passport)
4. Profil bisa diedit kapan saja lewat menu **Profil Saya → Edit Profil**

### 2. Cari & Lamar Lowongan
1. Buka menu **Lowongan** — filter berdasarkan kategori, tipe lokasi (Remote/Onsite/Hybrid), budget, atau skill
2. Klik lowongan → baca detail → klik **Lamar** dan tulis cover letter (maks 300 karakter)
3. Pantau semua lamaran di halaman **Lamaranku**:
   - **Menunggu** → belum ditinjau pengelola
   - **Diterima** → mulai kerjakan pekerjaannya!
   - **Ditolak / Kedaluwarsa** → coba lowongan lain

### 3. Selesaikan Pekerjaan (Alur Review Hasil Kerja)
1. Setelah lamaran **Diterima**, kerjakan pekerjaan sesuai kesepakatan
2. Selesai? Buka **Lamaranku** → klik **"Tandai Pekerjaan Selesai"** → lampirkan catatan/link hasil kerja (mis. Google Drive)
3. Tunggu keputusan pengelola:
   - ✅ **Disetujui** → pekerjaan resmi selesai, kamu dapat **rating & ulasan** di profil, dan hitungan "proyek selesai" bertambah
   - 🔄 **Revisi diminta** → baca catatan revisinya, perbaiki, lalu klik **"Kirim Ulang Setelah Revisi"**
   - ⛔ **Diberhentikan** → kerja sama dihentikan (alasan tampil di kartu lamaran)

### 4. Fitur Lain untuk Freelancer
- **Asisten Karier AI** (dashboard) — klik **"Diskusi Rekomendasi dengan AI"** untuk tanya rekomendasi lowongan, perbandingan kategori (jumlah lowongan & budget rata-rata), dan tips karier. Kuota 10 pesan/hari
- **Passport 30 Hari** — panduan misi harian membangun karier freelance, selesaikan untuk naik level (Bronze → Platinum) dan kumpulkan badge
- **Events & Workshop** — daftar event komunitas (workshop, meetup, coffee chat), check-in pakai kode di lokasi untuk dapat badge
- **Chat** — hubungi pengelola langsung dari platform
- **Notifikasi** — semua update lamaran, revisi, dan ulasan masuk ke lonceng notifikasi

---

## Panduan Pengguna — Pengelola (Mitra)

### 1. Daftar Akun Mitra
1. Buka **Buat Akun Baru** → pilih peran **"Pembuat Lowongan & Event"**
2. Isi nama, email, password, dan **nama perusahaan/komunitas**
3. Satu akun mitra bisa **pasang lowongan sekaligus membuat event** — tidak dipisah

### 2. Pasang Lowongan
1. Dari **Dashboard Employer** → **Pasang Lowongan**
2. Isi judul, kategori, deskripsi, requirements, skill yang dibutuhkan, budget, deadline, lokasi, dan kontak
3. Lowongan baru berstatus **pending review** — tunggu disetujui admin sebelum tampil publik

### 3. Kelola Pelamar
1. Buka **Pendaftar** (semua lowongan) atau klik lowongan tertentu → daftar pelamarnya
2. Setiap pelamar menampilkan: level, rating, jumlah proyek selesai, badge, skill, dan cover letter
3. Aksi untuk pelamar baru:
   - **Terima** → freelancer mulai bekerja
   - **Tolak** → lamaran ditolak
   - **Tandai Direview** → penanda sudah dibaca
   - **Chat** → diskusi dulu sebelum memutuskan

### 4. Review Hasil Kerja (setelah freelancer tandai selesai)
Saat freelancer menandai pekerjaan selesai, status berubah jadi **"Perlu Direview"** dengan catatan/link hasil kerjanya. Pilihan kamu:

| Aksi | Hasil |
|---|---|
| **Setujui & Beri Ulasan** | Muncul modal **rating bintang 1–5 + ulasan** → pekerjaan resmi selesai, rating masuk ke profil freelancer |
| **Tolak → Ajukan Revisi** | Wajib tulis catatan apa yang harus diperbaiki → freelancer kirim ulang → review lagi |
| **Tolak → Berhentikan Kerja Sama** | Final, kerja sama berhenti (alasan opsional dikirim ke freelancer) |

> "Berhentikan Kerja Sama" juga tersedia dari status Diterima/Revisi — untuk kasus freelancer menghilang, dsb.

### 5. Buat & Kelola Event
1. Dashboard → **Events** → **Buat Event** (workshop / meetup / coffee chat / networking)
2. Isi tanggal, waktu, lokasi (+ pin peta), kuota peserta, gratis/berbayar
3. Event juga perlu approval admin dulu
4. Saat event berlangsung, bagikan **kode check-in** ke peserta; setelah selesai, tandai event **Selesai**

---

## Panduan Admin

Login dengan akun admin → menu **Admin**:
- **Dashboard & Analytics** — statistik user, lowongan, event, lamaran
- **Kelola Lowongan / Events** — setujui, tolak (dengan alasan), atau **hapus** listing (bisa dihapus kapan pun, termasuk yang sudah aktif)
- **Kelola Users** — lihat semua pengguna & verifikasi badge
- **Settings** — kelola master kategori & skill

---

## Cara Menjalankan (Development)

### Prasyarat
- Node.js 18+ (disarankan 22)
- PostgreSQL 14+ (disarankan 17)

### 1. Clone & Install
```bash
git clone https://github.com/chimchimchimspc/BatamPSIExpo.git
cd BatamPSIExpo

cd backend && npm install
cd ../jogja-freelance && npm install
```

### 2. Siapkan Database
```bash
# buat database
psql -U postgres -c "CREATE DATABASE jogja_freelance_db"

# jalankan schema + update skema + seed
cd backend
psql -U postgres -d jogja_freelance_db -f database/schema.sql
psql -U postgres -d jogja_freelance_db -f database/seed.sql
psql -U postgres -d jogja_freelance_db -f database/updates.sql

# (opsional) isi 22 lowongan + 14 event contoh dengan 9 akun mitra
node database/seed_mitra.js
```

### 3. Konfigurasi Environment

**`backend/.env`** (salin dari `.env.example` bila ada):
```env
PORT=5000
NODE_ENV=development

PGHOST=localhost
PGPORT=5432
PGDATABASE=jogja_freelance_db
PGUSER=postgres
PGPASSWORD=password_postgres_kamu

JWT_SECRET=ganti_dengan_string_acak_min_32_karakter
JWT_EXPIRES_IN=24h

CORS_ORIGINS=http://localhost:3000

# Login Google (opsional) — dari Google Cloud Console → OAuth Client ID
GOOGLE_CLIENT_ID=

# Asisten AI (opsional) — dari https://aistudio.google.com/app/apikeys
GEMINI_API_KEY=
```

**`jogja-freelance/.env.local`**:
```env
# kosongkan / hapus baris ini untuk development (default: http://localhost:5000/api/v1)
# NEXT_PUBLIC_API_URL=

# Login Google (opsional, samakan dengan backend)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

### 4. Jalankan (2 terminal)
```bash
# Terminal 1 — backend (port 5000)
cd backend
npm run dev

# Terminal 2 — frontend (port 3000)
cd jogja-freelance
npm run dev
```

Buka **http://localhost:3000** 🎉

---

## Deploy ke Production (Cloudflare Tunnel)

Metode ini menjadikan laptop/PC kamu sebagai server, diekspos ke internet lewat domain sendiri via Cloudflare Tunnel — **tanpa port forwarding, gratis**.

### Prasyarat
- Domain yang sudah terhubung ke Cloudflare (nameserver domain diarahkan ke Cloudflare)
- [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/) terinstall
- Sudah login: `cloudflared tunnel login`

### 1. Buat Tunnel & Arahkan DNS
```bash
cloudflared tunnel create namaproject

# arahkan subdomain frontend & backend ke tunnel (pakai UUID dari output di atas)
cloudflared tunnel route dns <TUNNEL_UUID> app.domainkamu.com
cloudflared tunnel route dns <TUNNEL_UUID> api-app.domainkamu.com
```

### 2. Buat File Konfigurasi Tunnel
Contoh `cloudflared-jogjafreelance.yml` (sudah ada di repo, sesuaikan):
```yaml
tunnel: <TUNNEL_UUID>
credentials-file: C:\Users\<USER>\.cloudflared\<TUNNEL_UUID>.json

ingress:
  - hostname: app.domainkamu.com
    service: http://localhost:3000
  - hostname: api-app.domainkamu.com
    service: http://localhost:5000
  - service: http_status:404
```

### 3. Update Environment untuk Production
```env
# backend/.env — tambahkan domain frontend ke CORS
CORS_ORIGINS=http://localhost:3000,https://app.domainkamu.com

# jogja-freelance/.env.local — arahkan browser publik ke API via tunnel
NEXT_PUBLIC_API_URL=https://api-app.domainkamu.com/api/v1
```

### 4. Build Frontend Production
> ⚠️ **Wajib pakai production build.** Mode `npm run dev` akan bermasalah lewat tunnel (WebSocket hot-reload gagal → halaman reload terus & terasa lambat).

```bash
cd jogja-freelance
npm run build

# project ini memakai output "standalone", jadi salin aset statis:
# (PowerShell)
Copy-Item .next\static .next\standalone\.next\static -Recurse -Force
Copy-Item public .next\standalone\public -Recurse -Force
```

### 5. Jalankan Semua (3 proses)
```bash
# 1. Backend
cd backend && npm run dev          # atau: node src/server.js

# 2. Frontend production
cd jogja-freelance && node .next/standalone/server.js

# 3. Tunnel
cloudflared tunnel --config cloudflared-jogjafreelance.yml run namaproject
```

Situs live di `https://app.domainkamu.com` ✅

### Catatan Production
- **Login Google**: tambahkan `https://app.domainkamu.com` ke **Authorized JavaScript origins** di Google Cloud Console → Credentials → OAuth Client ID
- **Auto-start saat boot**: jalankan cloudflared sebagai Windows Service (`cloudflared service install <TOKEN>` dari dashboard Zero Trust), dan backend/frontend via Task Scheduler / NSSM / pm2
- Setiap ada perubahan kode frontend → ulangi langkah build (step 4) lalu restart server frontend
- Website hanya online selama laptop menyala & ketiga proses berjalan

---

## Akun untuk Testing

| Peran | Email | Password |
|---|---|---|
| Admin | `admin@jogjafreelance.id` | `Admin@12345` |
| Mitra (9 akun) | lihat `AKUN_MITRA.txt` | `Mitra@2026` |

Daftar lengkap 9 akun mitra beserta lowongan/event miliknya ada di [`AKUN_MITRA.txt`](AKUN_MITRA.txt).

---

## Dokumen Lain

- [`CARA_MENJALANKAN.md`](CARA_MENJALANKAN.md) — panduan menjalankan versi ringkas (Windows)
- [`jogja-freelance/FEATURES.md`](jogja-freelance/FEATURES.md) — daftar lengkap fitur frontend
- [`BACKEND_PRESENTATION.md`](BACKEND_PRESENTATION.md) — arsitektur backend
