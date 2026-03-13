import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

import "./styles/index.css";

import { setupInterceptors } from "./api/setupInterceptors";

setupInterceptors();

/* ---------- SYSTEM THEME AUTO ---------- */

const applyTheme = () => {

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    document.documentElement.dataset.theme = savedTheme;
    return;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  document.documentElement.dataset.theme =
    prefersDark ? "dark" : "light";
};

/* initial load */
applyTheme();

/* system theme change */
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", applyTheme);
/* ---------------- REACT APP ---------------- */

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);