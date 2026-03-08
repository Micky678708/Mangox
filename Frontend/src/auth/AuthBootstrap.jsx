import React, { useEffect, useRef } from "react";
import { useAuth } from "./AuthContext.jsx";
import { refreshApi, meApi } from "../api/authApi.js";
import { api } from "../api/axios.js";

export default function AuthBootstrap({ children }) {
  const { setAccessToken, setUser, setBootstrapped, logoutLocal } = useAuth();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        const token = await refreshApi(); // cookie se
        if (!token) throw new Error("No refresh cookie / token");
        setAccessToken(token);

        // next requests ke liye immediately attach
        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        const me = await meApi();
        setUser(me);
      } catch (e) {
        // ✅ yaha error spam nahi karna (fresh install me 401 normal hai)
        logoutLocal();
      } finally {
        setBootstrapped(true);
      }
    })();
  }, [logoutLocal, setAccessToken, setBootstrapped, setUser]);

  return children;
}
