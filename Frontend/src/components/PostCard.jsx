import React, { useState } from "react";

export default function PostCard({ username = "user_01", caption = "First post ✨" }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="postCard">
      <div className="postHeader">
        <div className="postUser">
          <div className="miniAvatar" />
          <div style={{ fontWeight: 950 }}>{username}</div>
        </div>
        <button className="iconBtnSm" type="button" title="More">
          ⋯
        </button>
      </div>

      <div className="postMedia" />

      <div className="postActions">
        <button className="iconBtnSm" type="button" onClick={() => setLiked((v) => !v)}>
          {liked ? "❤️" : "🤍"}
        </button>
        <button className="iconBtnSm" type="button">💬</button>
        <button className="iconBtnSm" type="button">📤</button>
        <div style={{ marginLeft: "auto" }}>
          <button className="iconBtnSm" type="button">🔖</button>
        </div>
      </div>

      <div className="muted" style={{ padding: "0 14px 14px" }}>
        <span style={{ fontWeight: 900, color: "var(--text)" }}>{username}</span>{" "}
        {caption}
      </div>
    </div>
  );
}
