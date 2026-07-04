# Feature: Session (server-side, per-feature)

Session server-side dengan **express-session** yang disimpan di PostgreSQL
(tabel `user_sessions` dibuat otomatis via `connect-pg-simple`). Melengkapi JWT —
JWT tetap dipakai untuk autentikasi API, session ini untuk **menyimpan state per fitur per user**.

Data tiap fitur dinamespace di `req.session.data.<fitur>`, mis. `applications`, `chat`, `jobs`.

## Cara kerja
- Cookie sesi: `jfp.sid` (httpOnly). Frontend harus fetch dengan `credentials: "include"`.
- Saat login/register, backend mengisi `req.session.user`.
- Tiap fitur bisa menyimpan/membaca datanya sendiri lewat endpoint di bawah.

## Endpoints (base: `/api/v1/session`)

| Method | Path         | Aksi |
|--------|--------------|------|
| GET    | `/`          | Seluruh session: `{ authenticated, user, data }` |
| GET    | `/:feature`  | Ambil data satu fitur (mis. `/applications`) |
| PUT    | `/:feature`  | Simpan data fitur (objek → di-merge; array/primitif → di-replace) |
| DELETE | `/:feature`  | Hapus data satu fitur |
| POST   | `/logout`    | Hancurkan session (logout) |

## Contoh

```bash
# simpan draft lamaran ke session (fitur "applications")
curl -X PUT http://localhost:5000/api/v1/session/applications \
  -H "Content-Type: application/json" --cookie-jar cj.txt --cookie cj.txt \
  -d '{"draftCoverLetter":"Halo, saya tertarik...","lastJobId":"..."}'

# baca lagi
curl http://localhost:5000/api/v1/session/applications --cookie cj.txt
```

## Konfigurasi
- `SESSION_SECRET` di `.env` (fallback ke `JWT_SECRET`).
- Tabel session: `user_sessions`.
