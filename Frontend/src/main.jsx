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


mediaQuery.addEventListener("change", () => {
  const systemDark = mediaQuery.matches;
  document.documentElement.dataset.theme = systemDark ? "dark" : "light";
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