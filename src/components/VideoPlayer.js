import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { Log } from "../services/LogService";
import { useToast } from "../contexts/ToastContext";
import styles from "./VideoPlayer.module.css";
import ReactPlayer from "react-player";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { Helmet } from "react-helmet";
import useComponentTranslation from "../hooks/useComponentTranslation";

const logger = Log("VideoPlayer");

const VideoPlayer = () => {
  const navigate = useNavigate();
  const { i18n, t } = useComponentTranslation("VideoPlayer");
  const { lg: param_lg, videoId: param_videoId } = useParams();
  const [lg, setLg] = useState();
  const [videoId, setVideoId] = useState();
  const {
    basicDataService: { downloadUrls },
  } = useAppContext();
  const { Toast } = useToast();
  const [videoUrl, setVideoUrl] = useState();
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const playerRef = useRef(null);
  const [controlsVisible, setControlsVisible] = useState(true);

  useEffect(() => {
    if (!param_lg || !param_videoId) return;
    // console.log("iici-1", param_lg, param_videoId);
    setLg(param_videoId ? param_lg : i18n.resolvedLanguage);
    setVideoId(param_videoId ? param_videoId : param_lg);
  }, [param_lg, param_videoId]);

  useEffect(() => {
    if (!lg || !videoId) return;
    // console.log("iici-2", lg, videoId);
    let url = downloadUrls.find((item) => item.id === videoId && item.lg === lg)?.url;
    if (!url) url = downloadUrls.find((item) => item.id === videoId)?.url; // find first matching
    if (!url) navigate(`/video/${lg}/${downloadUrls.find((item) => item.type === "video")?.id}`); // find first video
    i18n.changeLanguage(lg);
    setVideoUrl(url);
  }, [lg, videoId]);

  useEffect(() => {
    if (!lg || !i18n.resolvedLanguage || i18n.resolvedLanguage === lg) return;
    // console.log("iici-3", i18n.resolvedLanguage, lg);
    if (i18n.resolvedLanguage !== lg) {
      // console.log(`navigate to ${i18n.resolvedLanguage}`);
      navigate(`/video/${i18n.resolvedLanguage}/${videoId}`);
    }
  }, [i18n.resolvedLanguage, lg]);

  const videoHandler = (control, state) => {
    if (control === "PlayPause") {
      if (!playing) setControlsVisible(false);
      setPlaying(!playing);
    } else if (control === "SeekChange") {
      setPlayed(parseFloat(state.target.value));
      playerRef.current.seekTo(parseFloat(state.target.value));
    } else if (control === "Mute") {
      setMuted(!muted);
    } else if (control === "VolumeChange") {
      setVolume(parseFloat(state.target.value));
    } else if (control === "ShowControls") {
      setControlsVisible(true);
    } else if (control === "HideControls") {
      if (playing) setControlsVisible(false);
    } else if (control === "handleProgress") {
      setPlayed(state.played);
    } else if (control === "changeVideo") {
      setPlaying(false);
      setControlsVisible(true);
      setVideoUrl(state);
    }
  };

  if (!videoUrl) return;
  // logger.console(`initialisation settings : video(id=[${videoId}]).url=[${videoUrl}]`);

  return (
    <section className={styles.container}>
      <Helmet>
        <title>Cyril Adam - Professional Portfolio</title>
        <meta
          name="description"
          content="Learn more about the creator of this expense tracker and support the development of this application. Buy me a coffee to keep this project going!"
        />
        <meta name="keywords" content="expense tracker, track expenses, personal finance, finance management" />
      </Helmet>
      <h2>{i18n.t(`title_${videoId}`, { defaultValue: "" })}</h2>
      <div className={styles.videoWrapper} onMouseEnter={videoHandler.bind(this, "ShowControls")} onMouseLeave={videoHandler.bind(this, "HideControls")}>
        <ReactPlayer
          ref={playerRef}
          url={`${videoUrl}#t=0`}
          playing={playing}
          muted={muted}
          volume={volume}
          onProgress={videoHandler.bind(this, "handleProgress")}
          width="100%"
          height="calc(100% + 4px)"
          controls={false} // Hide default controls
          style={{ marginTop: "-2px", minHeight: "370px" }}
        />
        <div className={`${styles.controls} ${!controlsVisible && styles.hidden}`}>
          <button onClick={videoHandler.bind(this, "PlayPause")}>{playing ? <FaPause /> : <FaPlay />}</button>
          <input className={styles.slider} type="range" min={0} max={1} step="any" value={played} onChange={videoHandler.bind(this, "SeekChange")} style={{ width: "80%" }} />
          <button onClick={videoHandler.bind(this, "Mute")}>{muted ? <FaVolumeMute /> : <FaVolumeUp />}</button>
          <input className={styles.slider} type="range" min={0} max={1} step="any" value={volume} onChange={videoHandler.bind(this, "VolumeChange")} style={{ width: "10%" }} />
        </div>
      </div>
    </section>
  );
};

export default VideoPlayer;
