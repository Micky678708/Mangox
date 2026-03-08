import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { loginApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();
  const loc = useLocation();
  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    const payload = {
      identifier: String(identifier).trim().toLowerCase(),
      password: String(password).trim(),
    };

    if (!payload.identifier || !payload.password) {
      setErr("Email/Username aur password dono bhar.");
      return;
    }

    try {
      setLoading(true);

      const res = await loginApi(payload);

      if (!res?.success) {
        setErr(res?.message || "Login failed");
        return;
      }

      const token = res?.data?.accessToken || res?.data?.token;
      const user = res?.data?.user || null;

      if (!token) {
        setErr("Token missing from response");
        return;
      }

      login({ token, user });

      const to = loc.state?.from || "/home";
      nav(to, { replace: true });
    } catch (e2) {
      setErr(e2?.response?.data?.message || e2?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="authShell">
        <div className="authShowcase">
          <div className="authShowcaseInner">
            <img className="authPhoneLogo" src="/MangoX.png" alt="MangoX" />
            <div className="authShowTitle">MangoX</div>
            <div className="authShowText">
              Reels, chats, stories aur profile — sab ek clean social app experience me.
            </div>
          </div>
        </div>

        <div className="authPanel">
          <div className="authCard">
            <div className="brandRow">
              <img className="brandLogo" src="/MangoX.png" alt="MangoX" />
              <div className="brandText">
                <div className="brandName">MangoX</div>
                <div className="brandSub">Login karke app continue karo</div>
              </div>
            </div>

            {err ? <div className="authErr">{err}</div> : null}

            <form onSubmit={onSubmit} className="authForm">
              <label className="authLabel">Phone, username, or email</label>
              <input
                className="authInput"
                placeholder="Enter username or email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
              />

              <label className="authLabel">Password</label>
              <input
                className="authInput"
                placeholder="Enter password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <button className="authBtn" disabled={loading}>
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>

            <div className="authDivider">
              <span />
              <p>or</p>
              <span />
            </div>

            <div className="authLinks authLinksStack">
              <Link to="/forgot-password">Forgot password?</Link>
              <Link to="/find-id">Find profile / ID</Link>
            </div>
          </div>

          <div className="authCard authMiniCard">
            <span className="muted">Don’t have an account?</span>
            <Link to="/signup" className="authInlineLink">
              Create new account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}