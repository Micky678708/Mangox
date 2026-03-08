import React, { useEffect, useMemo, useState } from "react";
import { getReels } from "../api/reelsApi";
import "./reels.css";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

function toAbsUrl(url = "") {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

export default function ReelsFeed() {
  const [reels, setReels] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        const list = await getReels();
        setReels(Array.isArray(list) ? list : []);
      } catch (e) {
        setErr(e?.response?.data?.message || e?.message || "Reels error");
      }
    })();
  }, []);

  const shuffled = useMemo(() => {
    const arr = [...reels];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [reels]);

  if (err) return <div style={{ padding: 16, color: "#fff" }}>{err}</div>;
  if (!shuffled.length) return <div style={{ padding: 16, color: "#fff" }}>No reels</div>;

  return (
    <div className="reelsPage">
      {shuffled.map((reel) => (
        <section key={reel._id} className="reelScreen">
          <video
            className="reelVideo"
            src={toAbsUrl(reel.videoUrl)}
            autoPlay
            loop
            muted
            playsInline
            controls
          />
          <div className="reelOverlay">
            <div className="reelMeta">
              <div className="reelUser">@{reel?.user?.username || "user"}</div>
              <div className="reelCaption">{reel?.caption || ""}</div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}