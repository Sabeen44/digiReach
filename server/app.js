import express from "express";
import cors from "cors";
import router from "./routes.js";

const app = express();

// ── Standard middleware ───────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:4173",
].filter(Boolean).map(o => o.trim().replace(/\/$/, ""));

app.use(cors({
  origin: (origin, cb) => {
    // allow non-browser requests (curl, Stripe webhooks, etc.)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin.replace(/\/$/, ""))) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
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