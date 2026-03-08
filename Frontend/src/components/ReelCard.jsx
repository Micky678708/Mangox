import React, { useMemo, useRef, useState } from "react";
import { likeReel, saveReel, unsaveReel, commentReel } from "../api/reelsApi";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

function toAbsUrl(url = "") {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

export default function ReelCard({ reel }) {
  const id = reel?._id;
  const videoRef = useRef(null);

  const videoSrc = useMemo(() => {
    return toAbsUrl(reel?.videoUrl || reel?.videoURL || reel?.url || "");
  }, [reel]);

  const username = reel?.user?.username || reel?.user?.name || "user";
  const caption = reel?.caption || "";

  const [isLiked, setIsLiked] = useState(!!reel?.isLiked);
  const [isSaved, setIsSaved] = useState(!!reel?.isSaved);
  const [likesCount, setLikesCount] = useState(reel?.likesCount ?? 0);
  const [commentsCount, setCommentsCount] = useState(reel?.commentsCount ?? 0);

  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [playing, setPlaying] = useState(false);

  const togglePlay = async () => {
    try {
      if (!videoRef.current) return;
      if (videoRef.current.paused) {
        await videoRef.current.play();
        setPlaying(true);
      } else {
        videoRef.current.pause();
        setPlaying(false);
      }
    } catch (e) {
      console.log("Play error:", e);
    }
  };

  const onLike = async () => {
    if (!id) return;

    const next = !isLiked;
    setIsLiked(next);
    setLikesCount((c) => (next ? c + 1 : Math.max(0, c - 1)));

    try {
      await likeReel(id);
    } catch {
      setIsLiked(!next);
      setLikesCount((c) => (next ? Math.max(0, c - 1) : c + 1));
    }
  };

  const onSave = async () => {
    if (!id) return;

    const next = !isSaved;
    setIsSaved(next);

    try {
      if (next) await saveReel(id);
      else await unsaveReel(id);
    } catch {
      setIsSaved(!next);
    }
  };

  const onSendComment = async () => {
    const text = commentText.trim();
    if (!id || !text) return;

    setCommentText("");
    setCommentsCount((c) => c + 1);

    try {
      await commentReel(id, text);
      setCommentOpen(false);
    } catch (e) {
      setCommentsCount((c) => Math.max(0, c - 1));
      alert(e?.response?.data?.message || "Comment failed");
    }
  };

  return (
    <article style={styles.card}>
      <div style={styles.header}>
        <div style={styles.userRow}>
          <div style={styles.avatar} />
          <div style={styles.username}>{username}</div>
        </div>
      </div>

      <div style={styles.mediaWrap} onClick={togglePlay}>
        {videoSrc ? (
          <video
  ref={videoRef}
  src={videoSrc}
  playsInline
  loop
  muted
  preload="metadata"
  style={styles.video}
  onPlay={() => setPlaying(true)}
  onPause={() => setPlaying(false)}
/>
        ) : (
          <div style={styles.noVideo}>Video missing</div>
        )}

        {!playing && videoSrc ? <div style={styles.playBadge}>▶</div> : null}
      </div>

      <div style={styles.actions}>
        <button style={styles.actionBtn} onClick={onLike}>
          {isLiked ? "❤️" : "🤍"} <span style={styles.count}>{likesCount}</span>
        </button>

        <button style={styles.actionBtn} onClick={() => setCommentOpen((v) => !v)}>
          💬 <span style={styles.count}>{commentsCount}</span>
        </button>

        <div style={{ flex: 1 }} />

        <button style={styles.actionBtn} onClick={onSave}>
          {isSaved ? "🔖" : "📑"}
        </button>
      </div>

      <div style={styles.caption}>
        <b>{username}</b> {caption}
      </div>

      {commentOpen ? (
        <div style={styles.commentBox}>
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            style={styles.commentInput}
          />
          <button style={styles.sendBtn} onClick={onSendComment}>
            Send
          </button>
        </div>
      ) : null}
    </article>
  );
}

const styles = {
  card: {
    background: "var(--bg)",
    color: "var(--text)",
    borderBottom: "1px solid var(--line)",
    marginBottom: 14,
  },
  header: {
    padding: "12px 12px 10px",
  },
  userRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#feda75,#d62976,#4f5bd5)",
  },
  username: {
    fontWeight: 700,
    fontSize: 15,
    color: "var(--text)",
  },
  mediaWrap: {
  position: "relative",
  width: "100%",
  maxHeight: "78vh",
  minHeight: 320,
  background: "#000",
  cursor: "pointer",
  overflow: "hidden",
  display: "grid",
  placeItems: "center",
  borderRadius: 0,
},
video: {
  width: "100%",
  maxHeight: "78vh",
  height: "auto",
  objectFit: "contain",
  display: "block",
  background: "#000",

  },
  noVideo: {
    width: "100%",
    height: "100%",
    display: "grid",
    placeItems: "center",
    color: "var(--muted)",
  },
  playBadge: {
    position: "absolute",
    inset: 0,
    display: "grid",
    placeItems: "center",
    fontSize: 54,
    color: "rgba(255,255,255,0.88)",
    textShadow: "0 8px 30px rgba(0,0,0,.65)",
    pointerEvents: "none",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "12px 12px 6px",
  },
  actionBtn: {
    border: 0,
    background: "transparent",
    color: "var(--text)",
    cursor: "pointer",
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: 0,
  },
  count: {
    fontSize: 14,
    color: "var(--text)",
  },
  caption: {
    padding: "0 12px 12px",
    fontSize: 14,
    lineHeight: 1.4,
    color: "var(--text)",
  },
  commentBox: {
    display: "flex",
    gap: 10,
    padding: "0 12px 14px",
  },
  commentInput: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid var(--line)",
    background: "var(--bg-soft)",
    color: "var(--text)",
    outline: "none",
  },
  sendBtn: {
    border: 0,
    borderRadius: 999,
    padding: "10px 14px",
    background: "#ff2d55",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
};