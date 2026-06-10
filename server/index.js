process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Only load .env in development
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: join(__dirname, ".env") });
}

try {
  const { default: app } = await import("./app.js");
  const PORT = process.env.PORT || 4242;
  console.log("ENV PORT:", process.env.PORT);
  console.log("Using PORT:", PORT);
  app.listen(PORT, "0.0.0.0", () => console.log(`Stripe server running on port ${PORT}`));
} catch (err) {
  console.error("Failed to start server:", err);
  process.exit(1);
}