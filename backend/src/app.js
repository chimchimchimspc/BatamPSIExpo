require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { globalLimiter } = require("./middleware/rateLimiter.middleware");
const { errorHandler } = require("./middleware/error.middleware");
const { sessionMiddleware } = require("./features/session/session.config");
const routes = require("./routes/index");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000").split(",");
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Allow uploaded images to be embedded by the frontend on another origin.
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(globalLimiter);

// Server-side session (PostgreSQL-backed). Enables per-feature session storage.
app.set("trust proxy", 1);
app.use(sessionMiddleware);

// Serve uploaded files (avatars, portfolios) from backend/uploads at /uploads
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api/v1", routes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

module.exports = app;
