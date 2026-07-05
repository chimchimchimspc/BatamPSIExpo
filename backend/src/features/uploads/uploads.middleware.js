const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Files land in backend/uploads/<sub> and are served statically by app.js at /uploads
const UPLOAD_ROOT = path.join(__dirname, "..", "..", "..", "uploads");
const MAX_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB) || 5;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
ensureDir(path.join(UPLOAD_ROOT, "avatars"));
ensureDir(path.join(UPLOAD_ROOT, "portfolios"));

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const sub = file.fieldname === "avatar" ? "avatars" : "portfolios";
    const dir = path.join(UPLOAD_ROOT, sub);
    ensureDir(dir);
    cb(null, dir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  },
});

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const DOC_TYPES = ["application/pdf"];

function fileFilter(req, file, cb) {
  const allowed = file.fieldname === "avatar" ? IMAGE_TYPES : [...IMAGE_TYPES, ...DOC_TYPES];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  const err = new Error(
    file.fieldname === "avatar"
      ? "Only image files are allowed (jpeg, png, webp, gif)"
      : "Only image or PDF files are allowed"
  );
  err.statusCode = 400;
  cb(err);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
});

// Wrap multer so its errors (too large / wrong type) return a clean 400 instead of a 500.
function handleUpload(field) {
  const single = upload.single(field);
  return (req, res, next) =>
    single(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError || err.statusCode === 400) {
          return res.status(400).json({ success: false, message: err.message });
        }
        return next(err);
      }
      next();
    });
}

module.exports = { handleUpload, UPLOAD_ROOT };
