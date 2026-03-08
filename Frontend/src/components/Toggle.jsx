import React from "react";

export default function Toggle({ on, onClick }) {
  return (
    <button className="toggle" type="button" onClick={onClick}>
      <span className="toggleIcon">♫</span>
      <span className="toggleText">{on ? "On" : "Off"}</span>
    </button>
  );
}
