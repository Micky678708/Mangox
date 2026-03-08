import api from "./client";

export async function getChatsApi() {
  const { data } = await api.get("/api/chat");
  return data?.data || [];
}

export async function getChatMessagesApi(chatId) {
  const { data } = await api.get(`/api/chat/${chatId}`);
  return data?.data || { chat: null, messages: [] };
}

export async function sendMessageApi(chatId, payload) {
  const { data } = await api.post(`/api/chat/${chatId}/message`, payload);
  return data?.data || null;
}
export async function sendMediaMessageApi(chatId, file) {
  const fd = new FormData();
  fd.append("media", file);

  const { data } = await api.post(`/api/chat/${chatId}/media`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data?.data || null;
}