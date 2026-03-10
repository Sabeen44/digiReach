import express from "express";
import cors from "cors";
import router from "./routes.js";

const app = express();

// ── Standard middleware ───────────────────────────────────────────────────────
app.use(cors());

// ── Webhook needs raw body before express.json() ─────────────────────────────
app.use("/webhook", express.raw({ type: "application/json" }));

// ── JSON parsing for all other routes ────────────────────────────────────────
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use(router);

export default app;