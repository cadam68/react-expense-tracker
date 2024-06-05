import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { Log } from "../services/LogService";
import { useToast } from "../contexts/ToastContext";

const logger = Log("VideoPlayer");

const VideoPlayer = () => {
  const { lg: param_lg, videoId: param_videoId } = useParams();
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);
  const {
    basicDataService: { downloadUrls },
  } = useAppContext();
  const { Toast } = useToast();
  const [lg, setLg] = useState(() => (param_videoId ? param_lg : null));
  const [videoId, setVideoId] = useState(() => (param_videoId ? param_videoId : param_lg));
  const [videoUrl, setVideoUrl] = useState(() => {
    const ref = lg ? `${videoId}-${lg}` : videoId;
    let url = downloadUrls.find((item) => item.id === ref)?.url;
    if (!url) url = downloadUrls.find((item) => item.id.startsWith(videoId))?.url; // find first matching
    logger.console(`initialisation settings : video(id=[${ref}]).url=[${url}]`);
    if (!url) Toast.error(`video ${videoId} not available`);
    return url;
  });

  // console.log("iici", downloadUrls, param_lg, param_videoId, videoId, videoUrl);

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
      <h2>Playing {videoId}</h2>
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
