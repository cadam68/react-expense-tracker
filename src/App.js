import { useEffect, useState } from "react";
import { useDebugContext } from "./contexts/DebugContext";
import Logo from "./components/Logo";
import Footer from "./components/Footer";
import { useSettingsContext } from "./contexts/SettingsContext";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import { useAppContext } from "./contexts/AppContext";

const App = () => {
  const { debug, toggleDebug, setLogLevel, toggleAdmin } = useDebugContext();
  const { firstTime } = useSettingsContext();
  const {
    confirmService: { requestConfirm, ConfirmModalComponent },
  } = useAppContext();

  useEffect(() => {
    window.toggleDebug = toggleDebug;
    window.setLogLevel = setLogLevel;
    window.toggleAdmin = toggleAdmin;
    console.log("Thanks for using my webapp :)\n\nLooking for a Full Stack Developer ?\nFell free to contact me!\n\ncyril.adam@yahoo.fr");

    if (firstTime)
      (async () => {
        await requestConfirm(
          <div>
            <h2>Welcome to ExpensesTracker!</h2>
            <p>This is your first visit. Enjoy exploring...</p>
          </div>,
          [{ label: "Close", value: true }]
        );
      })();
  }, [firstTime, toggleDebug, setLogLevel, toggleAdmin, requestConfirm]);

  return (
    <BrowserRouter>
      <div className={"container" + (debug ? " debug" : "")}>
        {ConfirmModalComponent}
        <Logo />
        <div className={"page-content" + (debug ? " debug" : "")}>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path={"about"} element={<AboutPage />} />
          </Routes>
        </div>
        <Footer className={debug ? " debug" : ""} />
      </div>
    </BrowserRouter>
  );
};

export default App;
