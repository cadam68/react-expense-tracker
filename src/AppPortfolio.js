import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Portfolio from "./components/Portfolio";
import SpinnerFullPage from "./components/SpinnerFullPage";
import { useAppContext } from "./contexts/AppContext";
import ToastContainer from "./components/ToastContainer";
import { useDebugContext } from "./contexts/DebugContext";
import Logo from "./components/LogoVideoPlayer";
import RotationMessage from "./components/RotationMessage";

const AppPortfolio = () => {
  const { debug } = useDebugContext();
  const { isLoading } = useAppContext();

  return (
    <BrowserRouter>
      <div className={"portfolio-container" + (debug ? " debug" : "")}>
        <ToastContainer />
        <RotationMessage />
        <Logo />
        {isLoading ? (
          <SpinnerFullPage />
        ) : (
          <Routes>
            <Route path="/portfolio/:userId/:lg?/:itemId?" element={<Portfolio key={window.location.pathname} />} />
            <Route path="*" element={<Navigate to="/portfolio" />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
};

export default AppPortfolio;
