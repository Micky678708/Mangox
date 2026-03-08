import { Outlet } from "react-router-dom";
import AppHeader from "../components/AppHeader.jsx";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <AppHeader to="/login" title="MangoX" />
      <Outlet />
    </div>
  );
}