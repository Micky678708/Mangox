import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

import "./styles/index.css";
// import "./styles/auth.css";

import { setupInterceptors } from "./api/setupInterceptors";

setupInterceptors();

/* SYSTEM THEME AUTO */

const applySystemTheme = () => {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  document.documentElement.dataset.theme = isDark ? "dark" : "light";
};

applySystemTheme();

/* LISTEN SYSTEM THEME CHANGE */

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", applySystemTheme);

/* REACT APP */

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);