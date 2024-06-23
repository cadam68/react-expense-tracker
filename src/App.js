import { lazy, Suspense, useEffect } from "react";
import { useDebugContext } from "./contexts/DebugContext";
import { useSettingsContext } from "./contexts/SettingsContext";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAppContext } from "./contexts/AppContext";
import { setLogLevel, setLogOn } from "./services/LogService";
import SpinnerFullPage from "./components/SpinnerFullPage";
import ExpensesPage from "./pages/ExpensesPage";
import ChartsPage from "./pages/ChartsPage";
import Footer from "./components/Footer";
import Logo from "./components/Logo";
import HomePage from "./pages/HomePage";
import ToastContainer from "./components/ToastContainer";
import useComponentTranslation from "./hooks/useComponentTranslation";
// import BuyMeACafePage from "./pages/BuyMeACafePage";

const App = () => {
  const { i18n, t } = useComponentTranslation("App");
  const { debug, toggleDebug, toggleAdmin } = useDebugContext();
  const { firstTime, showCharts } = useSettingsContext();
  const {
    confirmService: { requestConfirm, ConfirmModalComponent },
    basicDataService,
    isLoading,
  } = useAppContext();

  const BuyMeACafePage = lazy(() => import("./pages/BuyMeACafePage.js"));

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
          <div className={"popup"}>
            <h2>{t("text_welcome")}</h2>
            <div>{t("text_firstVisit")}</div>
          </div>,
          [{ label: i18n.t("Close"), value: true }]
        );
      })();
  }, [firstTime]);

  return (
    <BrowserRouter>
      <Suspense fallback={<SpinnerFullPage />}>
        <div className={"container" + (debug ? " debug" : "")}>
          {ConfirmModalComponent}
          <ToastContainer />
          <Logo />
          {isLoading ? (
            <SpinnerFullPage />
          ) : (
            <div className={"page-content" + (debug ? " debug" : "")}>
              <Routes>
                <Route path={"/app"} element={<HomePage />}>
                  <Route index element={<Navigate replace to={showCharts ? "charts" : "expenses"} />} />
                  <Route path={"expenses"} element={<ExpensesPage />} />
                  <Route path={"charts"} element={<ChartsPage />} />
                </Route>
                <Route path={"buyMeACafe"} element={<BuyMeACafePage />} />
                <Route path="*" replace element={<Navigate to="/app" />} />
              </Routes>
            </div>
          )}
          <Footer className={debug ? " debug" : ""} />
        </div>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
