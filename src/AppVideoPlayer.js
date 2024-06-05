import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import VideoPlayer from "./components/VideoPlayer";
import SpinnerFullPage from "./components/SpinnerFullPage";
import { useAppContext } from "./contexts/AppContext";
import ToastContainer from "./components/ToastContainer";
import { useDebugContext } from "./contexts/DebugContext";

const AppVidePlayer = () => {
  const { debug } = useDebugContext();
  const { isLoading } = useAppContext();

  return (
    <BrowserRouter>
      <div className={"container" + (debug ? " debug" : "")}>
        <ToastContainer />
        {isLoading ? (
          <SpinnerFullPage />
        ) : (
          <Routes>
            <Route path="/video/:lg/:videoId?" element={<VideoPlayer />} />
            <Route path="*" element={<Navigate to="/video" />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
};

export default AppVidePlayer;
