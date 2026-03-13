import client from "./client";

import { API_URL } from "../utils/url"

export const loginApi = async (payload) => {
  try {

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const text = await res.text()

    if (!text) {
      return {
        success: false,
        message: "Empty response from server",
      }
    }

    const data = JSON.parse(text)

    return data

  } catch (err) {
    return {
      success: false,
      message: err.message || "Network error",
    }
  }
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