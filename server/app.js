import express from "express";
import cors from "cors";
import router from "./routes.js";

const app = express();

// ── Standard middleware ───────────────────────────────────────────────────────
app.use(cors({
  origin: [
    "https://www.digireachnow.com",
    "https://digireachnow.com",
    "https://digi-reach.vercel.app",
    "http://localhost:5173",
    "http://localhost:4173",
  ],
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