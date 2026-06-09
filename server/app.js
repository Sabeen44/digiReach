import express from "express";
import cors from "cors";
import router from "./routes.js";

const app = express();

// ── Standard middleware ───────────────────────────────────────────────────────
const allowedOrigins = new Set([
  "https://www.digireachnow.com",
  "https://digireachnow.com",
  "https://digi-reach.vercel.app",
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.CLIENT_URL,
].filter(Boolean).map(o => o.trim().replace(/\/$/, "")));

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.has(origin.replace(/\/$/, ""))) return cb(null, true);
    cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

// ── Health check (Railway uses this to confirm the service is up) ─────────────
app.get("/health", (_req, res) => res.json({ ok: true }));

// ── Webhook needs raw body before express.json() ─────────────────────────────
app.use("/webhook", express.raw({ type: "application/json" }));

// ── JSON parsing for all other routes ────────────────────────────────────────
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use(router);

export default app;