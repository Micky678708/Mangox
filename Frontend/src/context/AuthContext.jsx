import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    // small boot to avoid flicker
    setBooting(false);
  }, []);

  const login = ({ token: t, user: u }) => {
    localStorage.setItem("token", t);
    if (u) localStorage.setItem("user", JSON.stringify(u));
    setToken(t);
    setUser(u || null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, isAuthed: !!token, booting, login, logout }),
    [token, user, booting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}