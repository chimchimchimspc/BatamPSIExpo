# Feature: Chat / Pesan

Pesan 1-lawan-1 antar pengguna (mis. employer ↔ freelancer). Fitur ini **menambah 2 tabel baru**
(`conversations`, `messages`) — jalankan migrasinya sekali sebelum dipakai.

## Migrasi (WAJIB sekali)

```bash
psql -U postgres -d jogja_freelance_db -f src/features/chat/chat.schema.sql
```

## Endpoints (base: `/api/v1/chat`) — semua butuh login

| Method | Path                              | Aksi |
|--------|-----------------------------------|------|
| GET    | `/conversations`                  | Daftar percakapan saya + pesan terakhir + jumlah belum dibaca |
| POST   | `/conversations`                  | Mulai/ambil percakapan. Body: `user_id` (lawan bicara) |
| GET    | `/conversations/:id/messages`     | Semua pesan (otomatis menandai pesan masuk sebagai dibaca) |
| POST   | `/conversations/:id/messages`     | Kirim pesan. Body: `body` (1-2000 karakter) |

- Percakapan unik per pasangan (urutan pembuat tidak masalah).
- Hanya peserta percakapan yang bisa membaca/mengirim.

## Contoh

```bash
# mulai percakapan
curl -X POST http://localhost:5000/api/v1/chat/conversations \
  -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{"user_id":"<UUID_lawan>"}'

# kirim pesan
curl -X POST http://localhost:5000/api/v1/chat/conversations/<CONV_ID>/messages \
  -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{"body":"Halo!"}'
```
