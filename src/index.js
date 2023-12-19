import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./common.css";
import App from "./App";
import { DebugContextProvider } from "./contexts/DebugContext";
import { BasicDataContextProvider } from "./contexts/BasicDataContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BasicDataContextProvider>
      <DebugContextProvider>
        <App />
      </DebugContextProvider>
    </BasicDataContextProvider>
  </React.StrictMode>
);
