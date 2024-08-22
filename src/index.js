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
import { ToastProvider } from "./contexts/ToastContext";
import "./i18n";

const root = ReactDOM.createRoot(document.getElementById("root"));

// ### Example of Router implementation ###
// const AppRouter = () => {
//   const currentPath = window.location.pathname;
//   if (currentPath.startsWith("/portfolio")) return <AppPortfolio />;
//   else return <App />;
// };

root.render(
  <DebugContextProvider>
    <SettingsContextProvider>
      <AppContextProvider>
        <ToastProvider>
          <DndProvider backend={HTML5Backend}>
            <App />
          </DndProvider>
        </ToastProvider>
      </AppContextProvider>
    </SettingsContextProvider>
  </DebugContextProvider>
);
