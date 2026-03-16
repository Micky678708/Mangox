import jwt from "jsonwebtoken";

export function signAccessToken(payload) {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function signRefreshToken(payload) {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "30d" }
  );
}

export function verifyRefreshToken(token) {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET
  );
}
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("JWT_REFRESH_SECRET:", process.env.JWT_REFRESH_SECRET);