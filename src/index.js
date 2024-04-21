import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./common.css";
import App from "./App";
import { DebugContextProvider } from "./contexts/DebugContext";
import { SettingsContextProvider } from "./contexts/SettingsContext";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { AppContextProvider } from "./contexts/AppContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <DebugContextProvider>
    <SettingsContextProvider>
      <AppContextProvider>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </AppContextProvider>
    </SettingsContextProvider>
  </DebugContextProvider>
);
