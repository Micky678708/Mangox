import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const nav = useNavigate();
  const { user, isAuthed, booted, logout } = useAuth();

  // ✅ protect route
  useEffect(() => {
    if (!booted) return;
    if (!isAuthed) nav("/login", { replace: true });
  }, [booted, isAuthed, nav]);

  if (!booted) return null;

  return (
    <>
      {/* ⚠️ Same rule:
          Agar Layout me header hai, to yaha se REMOVE karo
      */}
      <AppHeader to="/" title="MangoX" />

      <div style={{ minHeight: "100vh", padding: 16, background: "#0b0b0b", color: "#fff" }}>
        <h2 style={{ marginTop: 10 }}>Profile</h2>

        <div
          style={{
            marginTop: 12,
            background: "#111",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: 14,
            borderRadius: 14,
            maxWidth: 520,
          }}
        >
          <div style={{ opacity: 0.85 }}>Logged in as</div>
          <div style={{ fontSize: 18, marginTop: 6, fontWeight: 700 }}>
            {user?.name || user?.username || user?.email || user?.phone || "User"}
          </div>

          <button
            onClick={logout}
            style={{
              marginTop: 14,
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "#0f0f10",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}