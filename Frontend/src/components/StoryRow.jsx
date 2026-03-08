import React from "react";
export default function StoryRow() {
  const stories = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    name: `user${i + 1}`,
  }));

  return (
    <div className="storyRowWrap">
      <div className="storyRow">
        {stories.map((s) => (
          <button key={s.id} className="storyItem" type="button">
            <div className="storyRing">
              <div className="storyAvatar" />
            </div>
            <div className="storyName">{s.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}