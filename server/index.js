import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

const PORT = process.env.PORT || 4242;

app.listen(PORT, () => console.log(`Stripe server running on port ${PORT}`));

