import { sendEmailOtp } from "./email.service.js";
import { sendSmsOtp } from "./sms.service.js";

function isEmail(x) {
  return String(x || "").includes("@");
}

export async function sendOtpToIdentifier({ identifier, otp, email, phone }) {
  const id = String(identifier || "").trim();

  const targets = {
    email: email || (isEmail(id) ? id : null),
    phone: phone || (!isEmail(id) ? id : null),
  };

  const sent = { email: null, sms: null };
  const errors = [];

  // 1) try email first (stable)
  if (targets.email) {
    try {
      sent.email = await sendEmailOtp({ to: targets.email, otp });
    } catch (e) {
      errors.push({ channel: "email", message: e?.message || String(e) });
    }
  }

  // 2) try sms
  if (targets.phone) {
    try {
      sent.sms = await sendSmsOtp({ to: targets.phone, otp });
    } catch (e) {
      errors.push({ channel: "sms", message: e?.message || String(e) });
    }
  }

  // If nothing sent, throw
  if (!sent.email && !sent.sms) {
    const msg = errors.map((x) => `${x.channel}: ${x.message}`).join(" | ");
    throw new Error(msg || "OTP send failed");
  }

  return { sent, targets, errors };
}