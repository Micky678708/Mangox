import axios from "axios";

const client = axios.create({
  baseURL: "https://mangox-jhei.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 token automatically add karega
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default client;