# Cara Menjalankan Project Jogja Freelance Passport

## Struktur Project

```
BatamPSIExpo/
├── backend/          → API Server (Node.js + Express + PostgreSQL)
└── jogja-freelance/  → Frontend (Next.js + React + TypeScript)
```

---

## PERSIAPAN AWAL (Hanya sekali)

### 1. Pastikan PostgreSQL sudah jalan

Buka CMD dan cek:

```cmd
& 'C:\Program Files\PostgreSQL\17\bin\psql.exe' -U postgres -d jogja_freelance_db -c "SELECT 1"
```

Jika muncul `?column? = 1`, database siap.

### 2. Pastikan file `.env` sudah ada di backend

```cmd
type D:\PSI\BATAM-PSI\BatamPSIExpo\backend\.env
```

Jika belum ada, buat dulu:

```cmd
copy D:\PSI\BATAM-PSI\BatamPSIExpo\backend\.env.example D:\PSI\BATAM-PSI\BatamPSIExpo\backend\.env
```

Lalu edit `.env` dan isi password PostgreSQL:

```
PGPASSWORD=password_postgres_kamu
```

---

## CARA MENJALANKAN

### Butuh 2 terminal (CMD/PowerShell) yang berjalan bersamaan

---

## TERMINAL 1 — Backend (Port 5000)

### Pakai CMD

```cmd
cd D:\PSI\BATAM-PSI\BatamPSIExpo\backend
npm run dev
```

### Pakai VS Code

1. Buka folder `D:\PSI\BATAM-PSI\BatamPSIExpo\backend` di VS Code
2. Tekan **Ctrl+` (backtick)** untuk buka terminal
3. Ketik:
   ```
   npm run dev
   ```

### Tanda Berhasil

```
PostgreSQL connected
Server running on http://localhost:5000
```

---

## TERMINAL 2 — Frontend (Port 3000)

### Install dependencies (hanya sekali)

```cmd
cd D:\PSI\BATAM-PSI\BatamPSIExpo\jogja-freelance
npm install
```

### Jalankan Frontend

```cmd
cd D:\PSI\BATAM-PSI\BatamPSIExpo\jogja-freelance
npm run dev
```

### Pakai VS Code

1. Buka folder `D:\PSI\BATAM-PSI\BatamPSIExpo\jogja-freelance` di VS Code
2. Tekan **Ctrl+` (backtick)** untuk buka terminal
3. Ketik:
   ```
   npm run dev
   ```

### Tanda Berhasil

```
▲ Next.js 16.2.9
- Local:   http://localhost:3000
- Ready in ...ms
```

---

## AKSES DI BROWSER

| Aplikasi | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |

---

## MENGHENTIKAN SERVER

Tekan **Ctrl+C** di terminal yang bersangkutan.

---

## TROUBLESHOOTING

### Backend error: "Failed to connect to database"
- Pastikan PostgreSQL service jalan
- Cek password di file `.env`

### Frontend error: "Cannot find module"
- Jalankan `npm install` dulu di folder `jogja-freelance`

### Port sudah dipakai
- Backend: ubah PORT di `.env` (default 5000)
- Frontend: jalankan `npm run dev -- -p 3001`

### npm tidak bisa dijalankan di PowerShell
- Gunakan **CMD** bukan PowerShell
- Atau jalankan di PowerShell: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`

---

## TIPS VS CODE

- Install extension **Thunder Client** untuk test API endpoint langsung di VS Code
- Install extension **PostgreSQL** (Chris Kolkman) untuk lihat database langsung di VS Code
- Gunakan **Split Terminal** di VS Code (klik ikon split di pojok kanan terminal) agar bisa jalankan backend dan frontend sekaligus dalam satu window
