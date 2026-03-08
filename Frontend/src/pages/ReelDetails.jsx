import React from "react";
import { useParams } from "react-router-dom";
import { useReelById } from "../hooks/useReels.js";

export default function ReelDetails() {
  const { id } = useParams();
  const { loading, reel } = useReelById(id);

  if (loading) {
    return (
      <div className="pagePad">
        <div className="card">Loading…</div>
      </div>
    );
  }

  return (
    <div className="pagePad">
      <div className="card spread">
        <div>
          <div className="h1">{reel?.title || `Reel ${id}`}</div>
          <div className="muted small">@{reel?.user?.username || "creator"}</div>
        </div>
        <div className="pill">Reel</div>
      </div>

      <div className="reelDetailsPlayer">
        <div className="reelVideoMock big">
          <div className="reelBadge">9:16</div>
          <div className="reelTitle">{reel?.title || `Reel ${id}`}</div>
        </div>
      </div>
    </div>
  );
}
