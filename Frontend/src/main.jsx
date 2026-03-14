import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

import "./styles/index.css";

import { setupInterceptors } from "./api/setupInterceptors";

setupInterceptors();

/* -------- THEME SYSTEM (STABLE) -------- */

const media = window.matchMedia("(prefers-color-scheme: dark)");

media.addEventListener("change", (e) => {
const newTheme = e.matches ? "dark" : "light";
document.documentElement.dataset.theme = newTheme;
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