import client from "./client";

export async function getHomeFeedApi() {
  const { data } = await client.get("/api/home/feed");
  return data?.data || data || [];
}

export async function getMiniReelsApi() {
  const { data } = await client.get("/api/home/mini-reels");
  return data;
}

export async function getSuggestionsApi() {
  const { data } = await client.get("/api/home/suggestions");
  return data;
}

export async function getStoriesApi() {
  const { data } = await client.get("/api/home/stories");
  return data;
}