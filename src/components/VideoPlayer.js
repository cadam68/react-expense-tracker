import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

const VideoPlayer = () => {
  const { lg: param_lg, videoId: param_videoId } = useParams();
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);
  const {
    basicDataService: { downloadUrls },
  } = useAppContext();
  const [lg, setLg] = useState(() => (param_videoId ? param_lg : null));
  const [videoId, setVideoId] = useState(() => (param_videoId ? param_videoId : param_lg));
  const [videoUrl, setVideoUrl] = useState(() => downloadUrls.find((item) => item.id === (lg ? `${videoId}-${lg}` : videoId))?.url);

  // console.log(downloadUrls, param_lg, param_videoId, videoId, videoUrl);

  const videoHandler = (control) => {
    if (control === "play") {
      videoRef.current.play();
      setPlaying(true);
    } else if (control === "pause") {
      videoRef.current.pause();
      setPlaying(false);
    } else if (control === "toggleSound") {
      videoRef.current.muted = !muted;
      setMuted((prevState) => !prevState);
    } else if (control === "soundOn") {
      videoRef.current.muted = false;
      setMuted(true);
    } else if (control === "togglePlay") {
      if (playing) videoRef.current.pause();
      else videoRef.current.play();
      setPlaying((prevState) => !prevState);
    }
  };

  if (!videoUrl) return <h1>Sorry, Video {videoId} not available</h1>;

  return (
    <section>
      <h2>Now Playing: {videoId}</h2>
      <div>
        <video ref={videoRef} src={`${videoUrl}#t=0`} playsInline controls={true} preload="metadata" width="80%">
          Your browser does not support the video tag.
        </video>
      </div>
      <div>
        <button
          onClick={() => {
            videoHandler("togglePlay");
          }}
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>
    </section>
  );
};

export default VideoPlayer;
