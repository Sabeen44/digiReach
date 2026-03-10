import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the same folder as index.js
dotenv.config({ path: join(__dirname, ".env") });

// TEMP: verify env loaded
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SERVICE_ROLE:", process.env.SUPABASE_SERVICE_ROLE_KEY);

// Import app AFTER env loads
const { default: app } = await import("./app.js");

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Stripe server running on port ${PORT}`));


