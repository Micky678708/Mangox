import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { isAuthed, user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="topbar">
      <div className="brand" onClick={() => nav("/")}>Mango</div>

      <div className="navlinks">
        {isAuthed ? (
          <>
            <NavLink to="/" className="nav">Home</NavLink>
            <NavLink to="/reels" className="nav">Reels</NavLink>
            <NavLink to="/upload" className="nav">Upload</NavLink>
            <NavLink to="/chats" className="nav">Chats</NavLink>
            <NavLink to="/profile" className="nav">Profile</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav">Login</NavLink>
            <NavLink to="/signup" className="nav">Signup</NavLink>
          </>
        )}
      </div>

      <div className="right">
        {isAuthed ? (
          <>
            <div className="chip">@{user?.username || "user"}</div>
            <button className="btn btnGhost" onClick={logout}>Logout</button>
          </>
        ) : (
          <button className="btn btnPrimary" onClick={() => nav("/login")}>Start</button>
        )}
      </div>
    </div>
  );
}
