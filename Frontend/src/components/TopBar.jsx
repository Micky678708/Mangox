import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "/public/MangoX.png;"
export default function Navbar() {
  return (
    <div className="flex items-center gap-2">
      <img src={logo} alt="MangoX" className="w-8 h-8 rounded-xl" />
      <h1 className="text-xl font-bold">MangoX</h1>
    </div>
  );
}
export default function TopBar() {
  const loc = useLocation();

  return (
    <header className="topBar">
      <div className="topBarInner">
        <Link to="/" className="brandMini">Mango</Link>

        <div className="topBarRight">
          <Link to="/search" className={`chip ${loc.pathname === "/search" ? "chipOn" : ""}`}>Search</Link>
          <Link to="/upload" className={`chip ${loc.pathname === "/upload" ? "chipOn" : ""}`}>+ Upload</Link>
          <Link to="/profile" className={`avatarBtn ${loc.pathname.startsWith("/profile") ? "avatarBtnOn" : ""}`}>
            <span className="avatarDot" />
          </Link>
        </div>
      </div>
    </header>
  );
}
