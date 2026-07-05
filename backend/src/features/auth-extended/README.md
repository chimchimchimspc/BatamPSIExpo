# Feature: Auth Extended

Melengkapi autentikasi inti (`/auth`) dengan: lupa/reset password, verifikasi email,
dan refresh token. Semua kolom yang dibutuhkan sudah ada di tabel `users`
(`password_reset_token`, `password_reset_expires`, `email_verification_token`, `is_email_verified`).

> Belum ada SMTP: token untuk reset/verifikasi **dicetak ke console** backend, dan pada
> `NODE_ENV=development` juga dikembalikan di response agar mudah diuji. Untuk produksi,
> ganti fungsi `deliver()` di service dengan pengiriman email sungguhan (mis. SendGrid).

## Endpoints (base: `/api/v1/auth`)

| Method | Path                 | Auth  | Body | Aksi |
|--------|----------------------|-------|------|------|
| POST   | `/forgot-password`   | -     | `email` | Buat token reset (1 jam) |
| POST   | `/reset-password`    | -     | `token`, `password` | Ganti password via token |
| POST   | `/verify-email`      | -     | `token` | Tandai email terverifikasi |
| POST   | `/send-verification` | login | -    | Kirim ulang token verifikasi email |
| POST   | `/refresh-token`     | -     | `refreshToken` | Tukar refresh token → access token baru |

`refreshToken` didapat saat login (`POST /auth/login` mengembalikan `token` + `refreshToken`).

## Contoh

```bash
curl -X POST http://localhost:5000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" -d '{"email":"user@example.com"}'
# → dev mengembalikan { resetToken }

curl -X POST http://localhost:5000/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"<resetToken>","password":"passwordBaru123"}'
```
