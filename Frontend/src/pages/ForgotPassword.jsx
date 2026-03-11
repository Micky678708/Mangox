import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requestOtpApi, verifyOtpApi, resetPasswordOtpApi } from "../api/authApi";

export default function ForgotPassword() {
  const nav = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const requestOtp = async (e) => {
    e.preventDefault();
    setErr(""); setMsg(""); setLoading(true);
    try {
      await requestOtpApi({ identifier, purpose: "forgot_password" });
      setMsg("OTP sent ✅");
      setStep(2);
    } catch (e2) {
      setErr(e2?.response?.data?.message || "OTP request failed");
    } finally {
      setLoading(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setErr(""); setMsg(""); setLoading(true);
    try {
      await verifyOtpApi({ identifier, otp, purpose: "forgot_password" });
      setMsg("OTP verified ✅");
      setStep(3);
    } catch (e2) {
      setErr(e2?.response?.data?.message || "OTP verify failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = async (e) => {
    e.preventDefault();
    setErr(""); setMsg(""); setLoading(true);
    try {
      await resetPasswordOtpApi({
        identifier,
        otp,
        newPassword,
        purpose: "forgot_password",
      });
      setMsg("Password updated ✅ अब Login करो");
      setTimeout(() => nav("/login"), 600);
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.h2}>Forgot Password</h2>
        <p style={styles.sub}>Email / phoneEnter your email or phone.
        We will send an OTP to reset your password..</p>

        {err ? <div style={styles.err}>{err}</div> : null}
        {msg ? <div style={styles.ok}>{msg}</div> : null}

        {step === 1 && (
          <form onSubmit={requestOtp} style={styles.form}>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="email / phone / username"
              style={styles.input}
            />
            <button disabled={loading} style={styles.btn}>
              {loading ? "Sending..." : "Request OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={verify} style={styles.form}>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              style={styles.input}
            />
            <button disabled={loading} style={styles.btn}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              disabled={loading}
              style={styles.btnGhost}
              onClick={() => setStep(1)}
            >
              Change Email/Phone
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={reset} style={styles.form}>
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              type="password"
              style={styles.input}
            />
            <button disabled={loading} style={styles.btn}>
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        )}

        <div style={styles.footer}>
          <Link to="/login" style={styles.link}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 56px)",
    display: "grid",
    placeItems: "center",
    padding: 16,
    background: "#0b0b0f",
  },
  card: {
    width: "min(420px, 100%)",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 18,
    padding: 18,
    color: "#fff",
    boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
  },
  h2: { margin: 0, fontSize: 22, fontWeight: 800 },
  sub: { margin: "6px 0 14px", opacity: 0.75, fontSize: 13 },
  err: {
    background: "rgba(255,0,80,0.12)",
    border: "1px solid rgba(255,0,80,0.35)",
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    color: "#ffd6e2",
    fontSize: 13,
  },
  ok: {
    background: "rgba(0,255,140,0.10)",
    border: "1px solid rgba(0,255,140,0.25)",
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    color: "#d6ffe8",
    fontSize: 13,
  },
  form: { display: "grid", gap: 10 },
  input: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    outline: "none",
  },
  btn: {
    padding: 12,
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(90deg,#ff4d6d,#7c3aed)",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },
  btnGhost: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
    opacity: 0.9,
  },
  footer: { marginTop: 14, fontSize: 13 },
  link: { color: "#c7c7ff", textDecoration: "none" },
};