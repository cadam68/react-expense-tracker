import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Portfolio from "./components/Portfolio";
import SpinnerFullPage from "./components/SpinnerFullPage";
import { useAppContext } from "./contexts/AppContext";
import ToastContainer from "./components/ToastContainer";
import { useDebugContext } from "./contexts/DebugContext";
import RotationMessage from "./components/RotationMessage";
import PortfolioHome from "./components/PortfolioHome";
import AboutUs from "./components/portfolio/AboutUs";
import ContactUs from "./components/portfolio/ContactUs";
import Home from "./components/portfolio/Home";

const AppPortfolio = () => {
  const { debug } = useDebugContext();
  const { isReady } = useAppContext();

  return (
    <BrowserRouter>
      <div className={"portfolio-container" + (debug ? " debug" : "")}>
        <ToastContainer />
        <RotationMessage />
        {!isReady ? (
          <SpinnerFullPage />
        ) : (
          <Routes>
            <Route path="/portfolio" element={<PortfolioHome />}>
              <Route index element={<Navigate replace to="home" />} />
              <Route path={"home"} element={<Home />} />
              <Route path={"aboutUs"} element={<AboutUs />} />
              <Route path={"contactUs"} element={<ContactUs />} />
            </Route>
            <Route path="/portfolio/:userId/:lg?/:itemId?" element={<Portfolio key={window.location.pathname} />} />
            <Route path="*" element={<Navigate to="/portfolio" />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
};

export default AppPortfolio;
