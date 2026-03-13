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
const media = window.matchMedia("(prefers-color-scheme: dark)");

function applyTheme(){
document.documentElement.dataset.theme =
media.matches ? "dark" : "light";
}

applyTheme();

media.addEventListener("change", applyTheme);
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