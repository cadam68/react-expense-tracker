import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./common.css";
import App from "./App";
import { DebugContextProvider } from "./contexts/DebugContext";
import { BasicDataContextProvider } from "./contexts/BasicDataContext";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BasicDataContextProvider>
      <DebugContextProvider>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </DebugContextProvider>
    </BasicDataContextProvider>
  </React.StrictMode>
);
