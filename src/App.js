import { useEffect } from "react";
import { useDebugContext } from "./contexts/DebugContext";
import Logo from "./components/Logo";
import Footer from "./components/Footer";
import { useSettingsContext } from "./contexts/SettingsContext";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import { useAppContext } from "./contexts/AppContext";
import ChartsPage from "./pages/ChartsPage";
import ExpensesPage from "./pages/ExpensesPage";
import { setLogLevel, setLogOn } from "./services/LogService";

const App = () => {
  const { debug, toggleDebug, toggleAdmin } = useDebugContext();
  const { firstTime, showCharts } = useSettingsContext();
  const {
    confirmService: { requestConfirm, ConfirmModalComponent },
  } = useAppContext();

  useEffect(() => {
    window.toggleDebug = toggleDebug;
    window.toggleAdmin = toggleAdmin;
    window.setLogLevel = setLogLevel;
    window.setLogOn = setLogOn;
    console.clear();
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
  }, [firstTime]);

  return (
    <BrowserRouter>
      <div className={"container" + (debug ? " debug" : "")}>
        {ConfirmModalComponent}
        <Logo />
        <div className={"page-content" + (debug ? " debug" : "")}>
          <Routes>
            <Route path={"/app"} element={<HomePage />}>
              <Route index element={<Navigate replace to={showCharts ? "charts" : "expenses"} />} />
              <Route path={"expenses"} element={<ExpensesPage />} />
              <Route path={"charts"} element={<ChartsPage />} />
            </Route>
            <Route path={"about"} element={<AboutPage />} />
            <Route path="*" replace element={<Navigate to="/app" />} />
          </Routes>
        </div>
        <Footer className={debug ? " debug" : ""} />
      </div>
    </BrowserRouter>
  );
};

export default App;
