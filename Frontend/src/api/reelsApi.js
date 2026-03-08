import client from "./client";
// import { getReels } from "../api/reelsApi";

export async function getReels() {
  const { data } = await client.get("/api/reels");
  return data?.data || data || [];
}

export async function likeReel(id) {
  const { data } = await client.post(`/api/reels/${id}/like`);
  return data;
}

export async function saveReel(id) {
  const { data } = await client.post(`/api/reels/${id}/save`);
  return data;
}

export async function unsaveReel(id) {
  const { data } = await client.post(`/api/reels/${id}/unsave`);
  return data;
}

export async function commentReel(id, text) {
  const { data } = await client.post(`/api/reels/${id}/comment`, { text });
  return data;
}

// ✅ NEW
export async function uploadReelApi({ file, caption }) {
  const formData = new FormData();
  formData.append("video", file);
  formData.append("caption", caption || "");

  const { data } = await client.post("/api/reels/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}