import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import VideoPlayer from "./components/VideoPlayer";
import SpinnerFullPage from "./components/SpinnerFullPage";
import { useAppContext } from "./contexts/AppContext";

const AppVidePlayer = () => {
  const { isLoading } = useAppContext();

  return (
    <BrowserRouter>
      {isLoading ? (
        <SpinnerFullPage />
      ) : (
        <Routes>
          <Route path="/video/:lg/:videoId?" element={<VideoPlayer />} />
          <Route path="*" element={<Navigate to="/video" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default AppVidePlayer;
