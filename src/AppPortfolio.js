import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Portfolio from "./components/Portfolio";
import SpinnerFullPage from "./components/SpinnerFullPage";
import { useAppContext } from "./contexts/AppContext";
import ToastContainer from "./components/ToastContainer";
import { useDebugContext } from "./contexts/DebugContext";
import HeaderPortfolio from "./components/HeaderPortfolio";
import RotationMessage from "./components/RotationMessage";
import PortfolioHome from "./components/PortfolioHome";

const AppPortfolio = () => {
  const { debug } = useDebugContext();
  const { isLoading } = useAppContext();

  return (
    <BrowserRouter>
      <div className={"portfolio-container" + (debug ? " debug" : "")}>
        <ToastContainer />
        <RotationMessage />
        <HeaderPortfolio />
        {isLoading ? (
          <SpinnerFullPage />
        ) : (
          <Routes>
            <Route path="/portfolio" element={<PortfolioHome />} />
            <Route path="/portfolio/:userId/:lg?/:itemId?" element={<Portfolio key={window.location.pathname} />} />
            <Route path="*" element={<Navigate to="/portfolio" />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
};

export default AppPortfolio;
