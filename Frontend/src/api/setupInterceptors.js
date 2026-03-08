import client from "./client";

export function setupInterceptors() {
  // request -> token attach
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // response -> 401 handle
  client.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error?.response?.status === 401) {
        // token invalid / expired
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      return Promise.reject(error);
    }
  );
}