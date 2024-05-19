import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./common.css";
import App from "./App";
import AppVideoPlayer from "./AppVideoPlayer";
import { DebugContextProvider } from "./contexts/DebugContext";
import { SettingsContextProvider } from "./contexts/SettingsContext";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { AppContextProvider } from "./contexts/AppContext";
import { ToastProvider } from "./contexts/ToastContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

const AppRouter = () => {
  const currentPath = window.location.pathname;
  if (currentPath.startsWith("/video")) return <AppVideoPlayer />;
  else return <App />;
};

root.render(
  <DebugContextProvider>
    <SettingsContextProvider>
      <AppContextProvider>
        <ToastProvider>
          <DndProvider backend={HTML5Backend}>
            <AppRouter />
          </DndProvider>
        </ToastProvider>
      </AppContextProvider>
    </SettingsContextProvider>
  </DebugContextProvider>
);
