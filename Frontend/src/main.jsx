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

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

function setTheme(e) {
  if (e.matches) {
    document.documentElement.dataset.theme = "dark";
  } else {
    document.documentElement.dataset.theme = "light";
  }
}

/* initial theme */
setTheme(mediaQuery);

/* listen system change */
mediaQuery.addEventListener("change", setTheme);
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