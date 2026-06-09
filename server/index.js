import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the same folder as index.js
dotenv.config({ path: join(__dirname, ".env") });

// Import app AFTER env loads
const { default: app } = await import("./app.js");

const PORT = process.env.PORT || 4242;
app.listen(PORT, "0.0.0.0", () => console.log(`Stripe server running on port ${PORT}`));


