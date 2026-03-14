// import twilio from "twilio";

const ACCOUNT_SID =
  (process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_SID || "").trim();

const AUTH_TOKEN =
  (process.env.TWILIO_AUTH_TOKEN || process.env.TWILIO_TOKEN || "").trim();

const FROM =
  (process.env.TWILIO_FROM || "").replace(/\s+/g, ""); // remove spaces

if (!ACCOUNT_SID || !AUTH_TOKEN || !FROM) {
  console.error("❌ Twilio env missing:", {
    hasSid: !!ACCOUNT_SID,
    hasToken: !!AUTH_TOKEN,
    hasFrom: !!FROM,
  });
}
console.log("TWILIO SID prefix:", (process.env.TWILIO_ACCOUNT_SID || "").slice(0, 2));

console.log("TWILIO FROM:", process.env.TWILIO_FROM);

console.log("HAS TOKEN:", !!process.env.TWILIO_AUTH_TOKEN);

const client = null;

function toE164(phone) {
  let p = String(phone || "").trim();
  p = p.replace(/\s+/g, "");

  // already + format
  if (p.startsWith("+")) return p;

  // India default: 10 digit -> +91
  if (/^\d{10}$/.test(p)) return `+91${p}`;

  // if starts with 91 and 12 digits
  if (/^91\d{10}$/.test(p)) return `+${p}`;

  return p; // fallback
}

export async function sendSmsOtp({ to, otp }) {

  if (!client) {
    console.log("⚠️ Twilio disabled, skipping SMS OTP");
    return { sid: null, to };
  }

  const toNumber = toE164(to);

  const msg = await client.messages.create({
    from: FROM,
    to: toNumber,
    body: `MangoX OTP: ${otp} (valid 5 minutes)`,
  });

  return { sid: msg.sid, to: toNumber };
}