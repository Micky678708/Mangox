import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "../components/BottomNav";

export default function Layout() {
  const location = useLocation();

  const hideNav =
    location.pathname.startsWith("/chat/") ||
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/find-id";

  return (
    <>
      <Outlet />
      {!hideNav && <BottomNav />}
    </>
  );
}