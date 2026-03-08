import { useEffect, useState } from "react";
import client from "../api/client";

const mock = Array.from({ length: 6 }).map((_, i) => ({
  _id: String(i + 1),
  caption: `Reel #${i + 1}`,
  videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  user: { username: `creator_${i + 1}` },
  likesCount: 1200 + i * 31,
  commentsCount: 30 + i * 2,
}));

export default function useReels() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReels = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await client.get("/api/reels");
      const payload = res.data?.data;
      setReels(Array.isArray(payload) ? payload : mock);
    } catch (e) {
      setReels(mock);
      setError(e?.response?.data?.message || e.message || "Failed to load reels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  return { reels, loading, error, refetch: fetchReels };
}
// ✅ Named export: useReelById
export function useReelById(id) {
  const [reel, setReel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await client.get(`/api/reels/${id}`);
        const payload = res.data?.data ?? res.data;
        // backend could return {reel} or reel directly
        setReel(payload?.reel ?? payload);
      } catch (e) {
        setError(e?.response?.data?.message || e.message || "Failed to load reel");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id]);

  return { reel, loading, error };
}