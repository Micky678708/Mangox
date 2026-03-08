import React, { useEffect, useRef } from "react";

export default function ReelCard({ reel, active }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (active) {
      const p = v.play();
      if (p?.catch) p.catch(() => {});
    } else {
      v.pause();
    }
  }, [active]);

  const videoUrl = reel?.videoUrl || reel?.video || reel?.url;

  return (
    <div style={{ height: "100dvh", width: "100%", position: "relative", background: "#000" }}>
      <video
        ref={videoRef}
        src={videoUrl}
        muted
        loop
        playsInline
        style={{ height: "100%", width: "100%", objectFit: "cover" }}
      />

      <div style={{ position: "absolute", left: 12, bottom: 70, right: 90, color: "#fff" }}>
        <div style={{ fontWeight: 700 }}>@{reel?.user?.username || "creator"}</div>
        <div style={{ marginTop: 6 }}>{reel?.caption || reel?.title || ""}</div>
      </div>
    </div>
  );
}