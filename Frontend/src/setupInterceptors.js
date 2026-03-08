import axios from "axios";

// Bas global safety interceptor (crash nahi hone dega)
export default function setupInterceptors() {
  axios.interceptors.response.use(
    (res) => res,
    (err) => {
      // optional: console.log for debug
      // console.error("API Error:", err?.response?.data || err.message);
      return Promise.reject(err);
    }
  );
}
export * from "./api/setupInterceptors";