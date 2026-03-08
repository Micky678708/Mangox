import dotenv from "dotenv";
dotenv.config()
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always load .env from Backend/.env (one level up from src)
dotenv.config({ path: path.join(__dirname, "../.env") });

import app from "./app.js";
import { connectDB } from "./config/db.js";

// ---- env quick check (Twilio) ----
const hasMongo = !!process.env.MONGO_URI;
const hasSid = !!process.env.TWILIO_ACCOUNT_SID;
const hasToken = !!process.env.TWILIO_AUTH_TOKEN;
const hasFrom = !!process.env.TWILIO_FROM;

console.log("ENV CHECK:", { hasMongo, hasSid, hasToken, hasFrom });
if (hasSid) console.log("TWILIO SID prefix:", String(process.env.TWILIO_ACCOUNT_SID).slice(0, 2));
if (!hasSid || !hasToken || !hasFrom) {
  console.log("⚠️ Twilio not ready. SMS OTP will be skipped, Email OTP will still work.");
}

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error("❌ DB connect failed:", e.message);
    process.exit(1);
  });