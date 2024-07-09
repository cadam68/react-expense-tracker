import React, { useEffect, useReducer, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { Log } from "../services/LogService";
import { useToast } from "../contexts/ToastContext";
import styles from "./VideoPlayer.module.css";
import ReactPlayer from "react-player";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { Helmet } from "react-helmet";
import useComponentTranslation from "../hooks/useComponentTranslation";
import S from "string";
import Button from "./Button";
import { settings } from "../Settings";
import { downloadFile } from "../services/Helper";

const logger = Log("VideoPlayer");

const VideoPlayer = () => {
  const navigate = useNavigate();
  const { i18n, t } = useComponentTranslation("VideoPlayer");
  const { lg: param_lg, videoId: param_videoId } = useParams();

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

  const initialState = { lg: null, videoId: null, items: null };
  const reducer = (state, { type, payload }) => {
    console.log(`reducer type=${type} + state=${JSON.stringify(state)} + payload=${JSON.stringify(payload)}`);
    switch (type) {
      case "init": {
        let { param_lg, param_videoId } = payload;
        let lg = param_videoId ? param_lg : i18n.resolvedLanguage;
        let videoId = param_videoId ? param_videoId : param_lg;
        const uniqueIds = [...new Set(downloadUrls.map((item) => item.id))];
        let items = uniqueIds.map((id) => {
          const entries = downloadUrls.filter((item) => item.id === id);
          // return entries.find((item) => item.lg === lg) || entries[0];
          let entry = entries.find((item) => item.lg === lg) || entries[0];
          entry.label = i18n.t(`title_${entry.id}`, { defaultValue: S(entry.id.replace(/[^a-zA-Z0-9]/g, " ")).titleCase().s });
          return entry;
        });
        if (!uniqueIds.includes(videoId)) videoId = uniqueIds[0];
        return { ...initialState, lg, videoId, items };
      }

      default:
        throw new Error(`Unknown action ${type}`);
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: "init", payload: { param_lg, param_videoId } });
  }, [param_lg, param_videoId]);

  useEffect(() => {
    if (!state.lg) return;
    // console.log(`changeLanguage to ${state.lg}`);
    i18n.changeLanguage(state.lg);
  }, [state.lg]);

  useEffect(() => {
    console.log(`i18n.resolvedLanguage=${i18n.resolvedLanguage}`, state);
    if (!state.lg) return;
    navigate(`/video/${i18n.resolvedLanguage}/${state.videoId}`);
  }, [i18n.resolvedLanguage]);

  useEffect(() => {
    if (!state.items) return;
    setVideoUrl(state.items.find((item) => item.id === state.videoId)?.url);
  }, [state.items]);

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

  const downloadFileHandler = async (fileUrl, fileName) => {
    try {
      await downloadFile(fileUrl, fileName);
      Toast.info(`The file ${fileName} is downloaded`);
    } catch (error) {
      Toast.error(`The file ${fileName} is not available yet!`);
    }
  };

  if (!videoUrl) return;
  // console.log(state);

  return (
    <>
      <section className={styles.navigation}>
        {state.items.map((item) => (
          <Button
            className={`button-outline button-small ${state.videoId === item.id ? "disabled" : ""}`}
            key={item.id}
            onClick={() => {
              if (item.type === "video") navigate(`/video/${state.lg}/${item.id}`);
              else if (item.type === "file") {
                // window.location.href = `${settings.baseApiUrl}/firebase/download?url=${encodeURIComponent(item.url)}`;
                downloadFileHandler(`${settings.baseApiUrl}/firebase/download?url=${encodeURIComponent(item.url)}`, item.target.split("/").pop());
              } else if (item.type === "url") window.open(item.url, "_blank", "noopener,noreferrer");
            }}
          >
            {item.label}
          </Button>
        ))}
      </section>
      <section className={styles.container}>
        <Helmet>
          <title>Cyril Adam - Professional Portfolio</title>
          <meta name="description" content="Learn more about the creator of this expense tracker and support the development of this application." />
          <meta name="keywords" content="expense tracker, track expenses, personal finance, finance management" />
        </Helmet>
        <h2>{state.items.find((item) => item.id === state.videoId)?.label}</h2>
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
    </>
  );
};

export default VideoPlayer;
