import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import Otp from "../models/Otp.js"; // ✅ make sure this model exists
import { sendOtpToIdentifier } from "../services/otpSender.service.js";
import { ok, fail } from "../utils/apiResponse.js";

// token service (as per your screenshot)
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../services/token.service.js";

// -----------------------------
// helpers
// -----------------------------
function pickUser(u) {
  return {
    id: u._id,
    username: u.username,
    name: u.name,
    email: u.email,
    phone: u.phone,
  };
}

function normalizeIdentifier(identifier) {
  const id = String(identifier || "").trim();
  if (!id) return "";
  // email normalize
  if (id.includes("@")) return id.toLowerCase();
  return id;
}

async function findUserByIdentifier(identifier) {
  const id = normalizeIdentifier(identifier);
  if (!id) return null;

  return User.findOne({
    $or: [{ email: id }, { phone: id }, { username: id }],
  });
}

function hashOtp(otp) {
  return crypto.createHash("sha256").update(String(otp)).digest("hex");
}

function genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 digit
}

// -----------------------------
// SIGNUP
// -----------------------------
export async function signup(req, res) {
  try {
    const { username, name, email, phone, password } = req.body;

    if (!password) return fail(res, "Password required", 400);
    if (!email && !phone && !username)
      return fail(res, "Email/Phone/Username required", 400);

    const uEmail = email ? String(email).toLowerCase().trim() : undefined;
    const uPhone = phone ? String(phone).trim() : undefined;
    const uUsername = username ? String(username).trim() : undefined;

    // check duplicates
    if (uEmail) {
      const ex = await User.findOne({ email: uEmail });
      if (ex) return fail(res, "Email already exists", 409);
    }
    if (uPhone) {
      const ex = await User.findOne({ phone: uPhone });
      if (ex) return fail(res, "Phone already exists", 409);
    }
    if (uUsername) {
      const ex = await User.findOne({ username: uUsername });
      if (ex) return fail(res, "Username already exists", 409);
    }

    const user = new User({
      username: uUsername,
      name: name ? String(name).trim() : "",
      email: uEmail,
      phone: uPhone,
      password, // ✅ User model pre("save") will hash
    });

    await user.save();

    const accessToken = signAccessToken({ userId: user._id });
    const refreshToken = signRefreshToken({ userId: user._id });

    user.refreshToken = refreshToken;
    await user.save();

    return ok(res, "Signup success", {
      user: pickUser(user),
      accessToken,
      refreshToken,
    });
  } catch (e) {
    return fail(res, e?.message || "Signup failed", 500);
  }
}

// -----------------------------
// LOGIN
// -----------------------------
export async function login(req, res) {
  try {
    const raw =
      req.body.identifier ??
      req.body.email ??
      req.body.username ??
      req.body.phone ??
      "";

    const identifier = String(raw).trim().toLowerCase();
    const password = String(req.body.password ?? "").trim();

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: "Missing credentials" });
    }

    // email vs username/phone
    const query = identifier.includes("@")
      ? { email: identifier }
      : { $or: [{ username: identifier }, { phone: identifier }] };

    const user = await User.findOne(query);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login success",
      data: { accessToken, user },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}
// -----------------------------
// REFRESH
// -----------------------------
export async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return fail(res, "refreshToken required", 400);

    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.userId);
    if (!user) return fail(res, "Invalid refresh token", 401);

    // optional: match stored token
    if (user.refreshToken !== refreshToken)
      return fail(res, "Refresh token revoked", 401);

    const newAccessToken = signAccessToken({ userId: user._id });
    const newRefreshToken = signRefreshToken({ userId: user._id });

    user.refreshToken = newRefreshToken;
    await user.save();

    return ok(res, "OK", {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (e) {
    return fail(res, "Invalid refresh token", 401);
  }
}

// -----------------------------
// LOGOUT
// -----------------------------
export async function logout(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return ok(res, "OK", { message: "Logged out" });

    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.userId);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    return ok(res, "OK", { message: "Logged out" });
  } catch (e) {
    // even if token is bad, treat as logged out
    return ok(res, "OK", { message: "Logged out" });
  }
}

// -----------------------------
// OTP: REQUEST
// body: { identifier, purpose: "forgot_password" }
// -----------------------------
export async function requestOtp(req, res) {
  try {
    const { identifier, purpose } = req.body;
    if (!identifier) return fail(res, "identifier required", 400);

    // ✅ standardize purpose
    const p = String(purpose || "forgot_password").trim();

    // allow only these (match your Otp model enum)
    const allowed = ["forgot_password"];
    if (!allowed.includes(p)) {
      return fail(res, `purpose must be one of: ${allowed.join(", ")}`, 400);
    }

    const user = await findUserByIdentifier(identifier);
    if (!user) return fail(res, "User not found", 404);

    // create otp
    const otp = genOtp();
    const otpHash = hashOtp(otp);
const results = await sendOtpToIdentifier({
  identifier,
  otp,
  email: user.email,   // ✅ DB email
  phone: user.phone,   // ✅ DB phone
});
    // remove old otp for same user/purpose
    await Otp.deleteMany({ userId: user._id, purpose: p });

    await Otp.create({
      userId: user._id,
      purpose: p,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
      verified: false,
    });

    // ✅ Testing mode: show otp in response if not production
    const data =
  process.env.NODE_ENV === "production"
    ? { message: "OTP sent", purpose: p }
    : { message: "OTP sent", purpose: p, otp, sent: results };

return ok(res, "OK", data);
  } catch (e) {
    return fail(res, e?.message || "requestOtp failed", 500);
  }
}

// -----------------------------
// OTP: VERIFY
// body: { identifier, purpose, otp }
// -----------------------------
export async function verifyOtp(req, res) {
  try {
    const { identifier, purpose, otp } = req.body;
    if (!identifier || !otp) return fail(res, "identifier & otp required", 400);

    const p = String(purpose || "forgot_password").trim();
    const user = await findUserByIdentifier(identifier);
    if (!user) return fail(res, "User not found", 404);

    const row = await Otp.findOne({ userId: user._id, purpose: p });
    if (!row) return fail(res, "OTP not found", 404);

    if (row.expiresAt && row.expiresAt.getTime() < Date.now())
      return fail(res, "OTP expired", 400);

    if (row.otpHash !== hashOtp(otp)) return fail(res, "Invalid OTP", 400);

    row.verified = true;
    await row.save();

    return ok(res, "OK", { message: "OTP verified", purpose: p });
  } catch (e) {
    return fail(res, e?.message || "verifyOtp failed", 500);
  }
}

// -----------------------------
// OTP: RESET PASSWORD
// body: { identifier, purpose, otp, newPassword }
// -----------------------------
export async function resetPasswordOtp(req, res) {
  try {
    const { identifier, purpose, otp, newPassword } = req.body;
    if (!identifier || !otp || !newPassword)
      return fail(res, "identifier, otp, newPassword required", 400);

    const p = String(purpose || "forgot_password").trim();
    const user = await findUserByIdentifier(identifier);
    if (!user) return fail(res, "User not found", 404);

    const row = await Otp.findOne({ userId: user._id, purpose: p });
    if (!row) return fail(res, "OTP not found", 404);

    if (row.expiresAt && row.expiresAt.getTime() < Date.now())
      return fail(res, "OTP expired", 400);

    if (row.otpHash !== hashOtp(otp)) return fail(res, "Invalid OTP", 400);

    // ✅ IMPORTANT FIX:
    // password update MUST go through user.save() so pre("save") hashes it
    user.password = String(newPassword);
    await user.save();

    await Otp.deleteMany({ userId: user._id, purpose: p });

    return ok(res, "OK", { message: "Password updated" });
  } catch (e) {
    return fail(res, e?.message || "resetPasswordOtp failed", 500);
  }
}

// -----------------------------
// FIND ID
// GET /api/auth/find-id?query=...
// -----------------------------
export async function findId(req, res) {
  try {
    const q = String(req.query.query || "").trim();
    if (!q) return fail(res, "query required", 400);

    const user = await User.findOne({
      $or: [{ email: q.toLowerCase() }, { phone: q }, { username: q }],
    });

    if (!user) return fail(res, "User not found", 404);
    return ok(res, "OK", { user: pickUser(user) });
  } catch (e) {
    return fail(res, e?.message || "findId failed", 500);
  }
}