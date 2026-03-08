import React from "react";

const notifs = [
  { id: 1, text: "user1 liked your post ❤️" },
  { id: 2, text: "user3 started following you" },
  { id: 3, text: "user7 commented: Nice 🔥" },
];

export default function Notifications() {
  return (
    <div className="pagePad">
      <div className="card">
        <div className="h1">Notifications</div>
        <div className="muted">Realtime socket later</div>
      </div>

      <div className="list">
        {notifs.map((n) => (
          <div key={n.id} className="listRow plain">
            <div className="avatarDot" />
            <div className="listBody">
              <div className="b">{n.text}</div>
              <div className="muted small">Just now</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
