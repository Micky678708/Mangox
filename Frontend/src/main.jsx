import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

import "./styles/index.css";

import { setupInterceptors } from "./api/setupInterceptors";

setupInterceptors();

/* ---------------- SYSTEM THEME AUTO ---------------- */

const setTheme = () => {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  document.documentElement.setAttribute(
    "data-theme",
    isDark ? "dark" : "light"
  );
};

/* initial load */
setTheme();

/* listen system change */
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", setTheme);

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