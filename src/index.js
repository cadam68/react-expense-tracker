import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./uiFeedback.css";
import App from "./App";
import { DebugContextProvider } from "./contexts/DebugContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <DebugContextProvider>
      <App />
    </DebugContextProvider>
  </React.StrictMode>
);
