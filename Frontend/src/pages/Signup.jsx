import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import { signupApi} from "../api/authApi";

export default function Signup() {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setMsg("");
    setLoading(true);
    try {
      const res = await signupApi({ name, username, email, phone, password });
      const data = res?.data?.data ?? res?.data;
      setMsg(res?.data?.message || "Signup success");
      // signup ke baad login page
      nav("/login");
      return data;
    } catch (e2) {
      setErr(e2?.response?.data?.message || e2?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppHeader to="/" title="MangoX" showBack />

      <div style={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
        <form
          onSubmit={onSubmit}
          style={{
            width: 360,
            display: "grid",
            gap: 10,
            background: "#111",
            padding: 18,
            borderRadius: 12,
            color: "#fff",
          }}
        >
          <div className="text-center mb-2">
            <img src="/logo.png" className="w-16 mx-auto mb-2 rounded-2xl" alt="MangoX" />
            <h2 className="text-2xl font-bold">Create MangoX account</h2>
          </div>

          {err ? <div style={{ color: "#ff6b6b" }}>{err}</div> : null}
          {msg ? <div style={{ color: "#7CFC98" }}>{msg}</div> : null}

          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="name" style={inp} />
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" style={inp} />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" style={inp} />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="phone" style={inp} />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" style={inp} />

          <button disabled={loading} type="submit" style={btn}>
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <div style={{ fontSize: 13, color: "#bbb" }}>
            Already have account? <Link to="/login" style={{ color: "#fff" }}>Login</Link>
          </div>
        </form>
      </div>
    </>
  );
}

const inp = { padding: 10, borderRadius: 10 };
const btn = { padding: 10, borderRadius: 10, cursor: "pointer" };