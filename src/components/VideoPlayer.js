import React from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

function VideoPlayer() {
  const { videoId } = useParams();
  const {
    basicDataService: { downloadUrls },
    isLoading,
  } = useAppContext();

  return (
    <div>
      <h2>Now Playing: {videoId}</h2>
      {!isLoading && (
        <video src={downloadUrls[0].downloadUrl} controls width="100%">
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}

export default VideoPlayer;
