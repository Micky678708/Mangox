import React from "react";
import { NavLink } from "react-router-dom";

export default function BottomNav() {
  const navClass = ({ isActive }) => `bottomNavItem ${isActive ? "active" : ""}`;

  return (
    <nav className="bottomNav">
      <NavLink to="/home" className={navClass}>
        <span>🏠</span>
        <small>Home</small>
      </NavLink>

      <NavLink to="/reels" className={navClass}>
        <span>🎬</span>
        <small>Reels</small>
      </NavLink>

      <NavLink to="/upload-reel" className={navClass}>
        <span>➕</span>
        <small>Upload</small>
      </NavLink>

      <NavLink to="/chats" className={navClass}>
        <span>💬</span>
        <small>Chats</small>
      </NavLink>

      <NavLink to="/profile" className={navClass}>
        <span>👤</span>
        <small>Profile</small>
      </NavLink>
    </nav>
  );
}