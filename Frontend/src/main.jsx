import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

import "./styles/index.css";

import { setupInterceptors } from "./api/setupInterceptors";

setupInterceptors();

/* -------- THEME SYSTEM (STABLE) -------- */

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

function applyTheme() {

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    document.documentElement.dataset.theme = savedTheme;
    return;
  }

  document.documentElement.dataset.theme =
    mediaQuery.matches ? "dark" : "light";
}

/* initial load */
applyTheme();

/* system change listener */
mediaQuery.addEventListener("change", () => {
  applyTheme();
});
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