import api from "./axios.js";

export const meApi = () => api.get("/profile/me").then((r) => r.data);

export const findProfileApi = (q) =>
  api.get(`/profile/search?q=${encodeURIComponent(q)}`).then((r) => r.data);

export const updateMeApi = (payload) =>
  api.patch("/profile/me", payload).then((r) => r.data);
