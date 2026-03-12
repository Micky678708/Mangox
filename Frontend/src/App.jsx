import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout/Layout";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import FindProfile from "./pages/FindProfile";

import ReelsFeed from "./pages/ReelsFeed";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import ChatRoom from "./pages/ChatRoom";
import Chats from "./pages/Chats";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import UploadReel from "./pages/UploadReel";

import { useAuth } from "./context/AuthContext";

function Protected({ children }) {
  const auth = useAuth?.();
  const booted = auth?.booted ?? true;
  const isAuthed = auth?.isAuthed ?? !!localStorage.getItem("token");

  if (!booted) return null;
  return isAuthed ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem("themeMode") || "dark"; // system | light | dark
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const finalMode =
        themeMode === "system" ? (systemDark ? "dark" : "light") : themeMode;

      root.setAttribute("data-theme", finalMode);
    };

    applyTheme();
    localStorage.setItem("themeMode", themeMode);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (themeMode === "system") applyTheme();
    };

    if (media.addEventListener) media.addEventListener("change", handler);
    else media.addListener(handler);

    return () => {
      if (media.removeEventListener) media.removeEventListener("change", handler);
      else media.removeListener(handler);
    };
  }, [themeMode]);

  return (
    <Routes>
      <Route
        element={
          <Layout
            themeMode={themeMode}
            setThemeMode={setThemeMode}
          />
        }
      >
        {/* Public */}
        <Route path="/chat/:id" element={<ChatRoom/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upload-reel" element={<UploadReel />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/find-id" element={<FindProfile />} />

        {/* Protected */}
        <Route
          path="/home"
          element={
            <Protected>
              <Home />
            </Protected>
          }
        />
        <Route
          path="/reels"
          element={
            <Protected>
              <ReelsFeed />
            </Protected>
          }
        />
        <Route
          path="/explore"
          element={
            <Protected>
              <Explore />
            </Protected>
          }
        />
        <Route
          path="/chats"
          element={
            <Protected>
              <Chats />
            </Protected>
          }
          />
          <Route
            path="/chat/:id"
            element={
              <Protected>
              <ChatRoom />
            </Protected>
          }
        />
        <Route
          path="/notifications"
          element={
            <Protected>
              <Notifications />
            </Protected>
          }
        />
        <Route
          path="/profile"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />

        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}