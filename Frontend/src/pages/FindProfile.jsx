// Frontend/src/pages/FindProfile.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { findIdApi } from "../api/authApi";

export default function FindProfile() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const onFind = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    // Optional: backend supports session-based user? If not, we just show message.
    // If you want search by email/phone, backend me new endpoint banana padega.
    // Abhi existing endpoint: /api/auth/find-id
    try {
      setLoading(true);
      const res = await findIdApi();

      // res shape depends on backend; handle common
      const found =
        res?.message?.id ||
        res?.message?._id ||
        res?.data?.id ||
        res?.data?._id ||
        res?.id ||
        res?._id;

      if (!found) {
        setMsg("ID found response aaya, but id field match nahi ho rahi. Backend response check karna hoga.");
        return;
      }

      setMsg(`✅ Your User ID: ${found}`);
    } catch (e2) {
      setErr(e2?.response?.data?.message || e2?.message || "Find ID failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <h1 style={styles.title}>Find ID</h1>

        {err ? <div style={styles.errBox}>{err}</div> : null}
        {msg ? <div style={styles.okBox}>{msg}</div> : null}

        <form onSubmit={onFind} style={{ display: "grid", gap: 12 }}>
          <input
            style={styles.input}
            placeholder="email (optional - future)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="phone (optional - future)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button style={styles.btn} disabled={loading}>
            {loading ? "Finding..." : "Find My ID"}
          </button>
        </form>

        <div style={{ marginTop: 12 }}>
          <Link to="/login" style={styles.link}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "radial-gradient(1200px 600px at 50% 20%, #1f1f1f 0%, #0b0b0b 55%, #000 100%)",
    padding: 16,
  },
  card: {
    width: "min(560px, 100%)",
    background: "rgba(25,25,25,0.88)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 22,
    color: "#fff",
  },
  title: { margin: 0, marginBottom: 12, fontSize: 28, fontWeight: 800 },
  input: {
    height: 46,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    padding: "0 14px",
    outline: "none",
    fontSize: 14,
  },
  btn: {
    height: 48,
    border: "none",
    borderRadius: 16,
    cursor: "pointer",
    fontWeight: 800,
    color: "#fff",
    background: "linear-gradient(90deg, #ff3a7a, #7a3cff)",
  },
  link: { color: "#cfd4ff", textDecoration: "underline" },
  errBox: {
    background: "rgba(255,0,0,0.12)",
    border: "1px solid rgba(255,0,0,0.25)",
    padding: "10px 12px",
    borderRadius: 12,
    marginBottom: 12,
  },
  okBox: {
    background: "rgba(0,255,140,0.10)",
    border: "1px solid rgba(0,255,140,0.25)",
    padding: "10px 12px",
    borderRadius: 12,
    marginBottom: 12,
  },
};