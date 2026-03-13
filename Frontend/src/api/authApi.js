import client from "./client";

export async function loginApi(payload) {
  const { data } = await client.post("/api/auth/login", payload);
  return data;
}

export async function signupApi(payload) {
  const { data } = await client.post("/api/auth/signup", payload);
  return data;
}

export async function requestOtpApi(payload) {
  const { data } = await client.post("/api/auth/request-otp", payload);
  return data;
}

export async function verifyOtpApi(payload) {
  const { data } = await client.post("/api/auth/verify-otp", payload);
  return data;
}

export async function resetPasswordOtpApi(payload) {
  const { data } = await client.post("/api/auth/reset-password-otp", payload);
  return data;
}

export async function findIdApi() {
  const { data } = await client.get("/api/auth/find-id");
  return data;
}