import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import VideoPlayer from "./components/VideoPlayer";

const AppVidePlayer = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/video/:videoId?" element={<VideoPlayer />} />
        <Route path="*" element={<Navigate to="/video" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppVidePlayer;
