import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = String(process.env.SMTP_SECURE || "true") === "true";

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error("SMTP creds missing: SMTP_USER + SMTP_PASS");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function sendEmailOtp({ to, otp }) {
  const transporter = getTransporter();

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  const info = await transporter.sendMail({
    from: `MangoX <${from}>`,
    to,
    subject: "Your MangoX OTP",
    text: `Your MangoX OTP is: ${otp}. It is valid for 5 minutes.`,
    html: `
      <div style="font-family:Arial,sans-serif">
        <h2>MangoX OTP</h2>
        <p>Your OTP is:</p>
        <div style="font-size:24px;font-weight:700;letter-spacing:2px">${otp}</div>
        <p>Valid for 5 minutes.</p>
      </div>
    `,
  });

  return { messageId: info.messageId, to };
}