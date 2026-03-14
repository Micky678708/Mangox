import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

import "./styles/index.css";

import { setupInterceptors } from "./api/setupInterceptors";

setupInterceptors();

/* -------- SYSTEM THEME AUTO (STABLE) -------- */

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

function setSystemTheme() {
  const isDark = mediaQuery.matches;

  document.documentElement.setAttribute(
    "data-theme",
    isDark ? "dark" : "light"
  );
}

/* first load */
setSystemTheme();

/* listen system change */
mediaQuery.addEventListener("change", setSystemTheme);
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