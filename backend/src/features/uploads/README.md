# Feature: Uploads

Upload file untuk foto profil & portofolio/CV freelancer. Pakai `multer` (disk storage).
File disimpan di `backend/uploads/{avatars,portfolios}/` dan disajikan lewat `GET /uploads/...`.

## Endpoints (base: `/api/v1/uploads`)

| Method | Path         | Auth              | Field (multipart) | Aksi |
|--------|--------------|-------------------|-------------------|------|
| POST   | `/avatar`    | freelancer        | `avatar` (gambar) | Simpan foto profil → `freelancer_profiles.profile_picture_url` |
| POST   | `/portfolio` | freelancer        | `portfolio` (gambar/PDF) | Simpan portofolio/CV → `freelancer_profiles.portfolio_url` |

- Batas ukuran: `MAX_FILE_SIZE_MB` (default 5 MB).
- Avatar: hanya gambar (jpeg/png/webp/gif). Portofolio: gambar atau PDF.

## Contoh

```bash
curl -X POST http://localhost:5000/api/v1/uploads/avatar \
  -H "Authorization: Bearer <TOKEN>" \
  -F "avatar=@foto.jpg"
```
