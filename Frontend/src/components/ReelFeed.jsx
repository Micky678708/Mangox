import { useEffect, useMemo, useRef, useState } from "react";
import useReelSwipe from "./useReelSwipe";

export default function ReelFeed({ reels = [] }) {
  const safeReels = useMemo(() => reels || [], [reels]);
  const count = safeReels.length;

  const { active, onWheel, onTouchStart, onTouchMove, onTouchEnd } =
    useReelSwipe(count);

  // ✅ Global mute (UI polish)
  const [muted, setMuted] = useState(true);

  if (!count) {
    return (
      <div style={{ height: "100dvh", background: "#000", color: "#fff", display: "grid", placeItems: "center" }}>
        No reels yet
      </div>
    );
  }

  return (
    <div
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        height: "100dvh",
        width: "100%",
        overflow: "hidden",
        position: "relative",
        background: "#000",
        touchAction: "pan-y",
      }}
    >
      <div
        style={{
          height: "100%",
          transform: `translateY(-${active * 100}%)`,
          transition: "transform 420ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        {safeReels.map((reel, idx) => (
          <div key={reel._id || reel.id || idx} style={{ height: "100dvh" }}>
            <ReelSlide
              reel={reel}
              isActive={idx === active}
              muted={muted}
              onToggleMute={() => setMuted((m) => !m)}
            />
          </div>
        ))}
      </div>

      {/* Gradients */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 120,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,.55), rgba(0,0,0,0))",
        }}
      />
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 180,
          background:
            "linear-gradient(to top, rgba(0,0,0,.65), rgba(0,0,0,0))",
        }}
      />
    </div>
  );
}

function ReelSlide({ reel, isActive, muted, onToggleMute }) {
  // ✅ supports both keys
  const src = reel?.videoUrl || reel?.video || "";

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <ReelVideo src={src} isActive={isActive} muted={muted} />

      {/* Mute Toggle */}
      <button
        onClick={onToggleMute}
        style={{
          position: "absolute",
          top: 60,
          right: 14,
          width: 44,
          height: 44,
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,.18)",
          background: "rgba(0,0,0,.25)",
          color: "#fff",
          cursor: "pointer",
          backdropFilter: "blur(10px)",
        }}
        aria-label="Toggle mute"
      >
        {muted ? "🔇" : "🔊"}
      </button>

      {/* Bottom Info */}
      <div style={{ position: "absolute", left: 12, right: 72, bottom: 18, color: "#fff" }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>
          @{reel.user?.username || reel.username || "user"}
        </div>
        <div style={{ fontSize: 14, opacity: 0.95 }}>
          {reel.caption || reel.description || ""}
        </div>
      </div>
    </div>
  );
}

function ReelVideo({ src, isActive, muted }) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = muted;
  }, [muted]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    if (isActive) {
      const p = v.play();
      if (p?.catch) p.catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
      setProgress(0);
    }
  }, [isActive]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const onTime = () => {
      if (!v.duration) return;
      setProgress((v.currentTime / v.duration) * 100);
    };

    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, []);

  return (
    <>
      <video
        ref={ref}
        src={src}
        playsInline
        loop
        preload="metadata"
        style={{
          height: "100%",
          width: "100%",
          objectFit: "cover",
          background: "#000",
        }}
      />

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          right: 12,
          height: 3,
          borderRadius: 999,
          background: "rgba(255,255,255,.18)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "rgba(255,255,255,.85)",
            transition: "width 120ms linear",
          }}
        />
      </div>
    </>
  );
}