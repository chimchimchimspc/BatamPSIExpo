# Feature: Reviews & Rating

Ulasan + rating antar pengguna (mis. employer menilai freelancer setelah proyek).
Memakai tabel `reviews` yang sudah ada di `schema.sql`. Setiap review baru otomatis
menghitung ulang `freelancer_profiles.rating` dan `review_count`.

## Endpoints (base: `/api/v1/reviews`)

| Method | Path        | Auth   | Aksi |
|--------|-------------|--------|------|
| POST   | `/`         | login  | Beri ulasan. Body: `reviewee_id`, `rating` (1-5), `job_id?`, `comment?` |
| GET    | `/me`       | login  | Ulasan yang saya terima + ringkasan (average, total) |
| GET    | `/:userId`  | publik | Ulasan seorang user + ringkasan |

- Tidak boleh mereview diri sendiri.
- Unik per `(reviewer_id, reviewee_id, job_id)` → review ganda ditolak (409).

## Contoh

```bash
curl -X POST http://localhost:5000/api/v1/reviews \
  -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{"reviewee_id":"<UUID>","rating":5,"comment":"Kerja bagus!"}'
```
