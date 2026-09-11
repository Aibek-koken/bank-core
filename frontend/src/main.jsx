import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ToastProvider } from "./components/toast";
import { LoggerProvider } from "./lib/logger";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoggerProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </LoggerProvider>
  </React.StrictMode>
);