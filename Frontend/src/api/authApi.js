import client from "./client";
import { API_URL } from "../utils/url"

export const loginApi = async (payload) => {

const res = await fetch(`${API_URL}/auth/login`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(payload)
})

const text = await res.text()

const data = text ? JSON.parse(text) : {}

return data

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