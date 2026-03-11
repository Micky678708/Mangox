import axios from "axios";

const client = axios.create({
  baseURL: "https://your-backend.onrender.com",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

export default client;