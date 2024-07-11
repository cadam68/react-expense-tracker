import React, { useEffect, useReducer, useRef, useState, useCallback, useMemo } from "react";
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
import { downloadFile } from "../services/Helper";
import MarkdownDisplay from "./MarkdownDisplay";
import UseLocalStorageState from "../hooks/UseLocalStorageState";

const logger = Log("VideoPlayer");

const renderItemsTypes = ["video", "card"];

const initialState = { lg: null, videoId: null, items: null };

const reducer = (state, { type, payload }) => {
  // logger.console(`reducer type=${type} state=${JSON.stringify(state)} payload=${JSON.stringify(payload)}`);
  switch (type) {
    case "init": {
      const { param_lg, param_videoId, i18n, downloadUrls, settings } = payload;
      const lg = param_videoId ? param_lg : i18n.resolvedLanguage;
      let videoId = param_videoId || param_lg;
      const uniqueIds = [...new Set(downloadUrls.map((item) => item.id))];
      const items = uniqueIds.map((id) => {
        const entries = downloadUrls.filter((item) => item.id === id);
        const entry = entries.find((item) => item.lg === lg) || entries[0];
        entry.label = i18n.t(`title_${entry.id}`, { defaultValue: S(entry.id.replace(/[^a-zA-Z0-9]/g, " ")).titleCase().s });
        return entry;
      });

      if (settings.firstTime) videoId = "[firstime]";
      if (!uniqueIds.includes(videoId) || !items.find((item) => item.id === videoId && renderItemsTypes.includes(item.type))) {
        videoId = items.find((item) => renderItemsTypes.includes(item.type))?.id;
      }
      return { lg, videoId, items };
    }
    default:
      throw new Error(`Unknown action ${type}`);
  }
};

const VideoPlayer = () => {
  const navigate = useNavigate();
  const { i18n, t } = useComponentTranslation("VideoPlayer");
  const { lg: param_lg, videoId: param_videoId } = useParams();

  const {
    basicDataService: { downloadUrls },
  } = useAppContext();
  const { Toast } = useToast();

  const [videoUrl, setVideoUrl] = useState(null);
  const [cardUrl, setCardUrl] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const playerRef = useRef(null);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [settings, setSettings] = UseLocalStorageState("video-player-settings", { firstTime: true });

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: "init", payload: { param_lg, param_videoId, i18n, downloadUrls, settings } });
  }, [param_lg, param_videoId, i18n, downloadUrls]);

  useEffect(() => {
    if (state.lg) {
      i18n.changeLanguage(state.lg);
    }
  }, [state.lg, i18n]);

  useEffect(() => {
    if (state.items) {
      const selectedItem = state.items.find((item) => item.id === state.videoId);
      setVideoUrl(selectedItem?.type === "video" ? selectedItem.url : null);
      setCardUrl(selectedItem?.type === "card" ? selectedItem.url : null);
    }
  }, [state.videoId, state.items]);

  useEffect(() => {
    if (state.lg) {
      navigate(`/video/${i18n.resolvedLanguage}/${param_videoId ? param_videoId : state.videoId}`, { replace: true });
    }
  }, [i18n.resolvedLanguage, state.lg, param_videoId, state.videoId, navigate]);

  const videoHandler = useCallback(
    (control, eventState) => {
      switch (control) {
        case "PlayPause":
          setPlaying((prev) => {
            if (!prev) setControlsVisible(false);
            return !prev;
          });
          break;
        case "SeekChange":
          const seekTo = parseFloat(eventState.target.value);
          setPlayed(seekTo);
          playerRef.current.seekTo(seekTo);
          break;
        case "Mute":
          setMuted((prev) => !prev);
          break;
        case "VolumeChange":
          setVolume(parseFloat(eventState.target.value));
          break;
        case "ShowControls":
          setControlsVisible(true);
          break;
        case "HideControls":
          if (playing) setControlsVisible(false);
          break;
        case "handleProgress":
          setPlayed(eventState.played);
          break;
        default:
          break;
      }
    },
    [playing]
  );

  const downloadFileHandler = useCallback(
    async (fileUrl, fileName) => {
      try {
        await downloadFile(fileUrl, fileName);
        Toast.info(`The file ${fileName} is downloaded`);
      } catch (error) {
        Toast.error(`The file ${fileName} is not available yet!`);
      }
    },
    [Toast]
  );

  useEffect(() => {
    if (state.items && settings.firstTime) {
      setSettings({ ...settings, firstTime: false });
    }
  }, [state.items, settings, setSettings]);

  const filteredItems = useMemo(() => state.items?.filter((item) => item.type && !/^\[.*\]$/.test(item.id)), [state.items]);

  return (
    <>
      <section className={styles.navigation}>
        {filteredItems?.map((item) => (
          <Button
            className={`button-outline button-small ${state.videoId === item.id ? "disabled" : ""}`}
            key={item.id}
            onClick={() => {
              if (renderItemsTypes.includes(item.type)) {
                if (/^\[.*\]$/.test(state.videoId)) {
                  dispatch({ type: "init", payload: { param_lg, param_videoId: item.id, i18n, downloadUrls, settings } });
                } else {
                  navigate(`/video/${state.lg}/${item.id}`, { replace: true });
                }
              } else if (item.type === "file") {
                downloadFileHandler(`${settings.baseApiUrl}/firebase/download?url=${encodeURIComponent(item.url)}`, item.target.split("/").pop());
              } else if (item.type === "url") {
                window.open(item.url, "_blank", "noopener,noreferrer");
              }
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
        <h2>{state.items?.find((item) => item.id === state.videoId)?.label}</h2>
        {videoUrl && (
          <div className={styles.videoWrapper} onMouseEnter={() => videoHandler("ShowControls")} onMouseLeave={() => videoHandler("HideControls")}>
            <ReactPlayer
              ref={playerRef}
              url={`${videoUrl}#t=0`}
              playing={playing}
              muted={muted}
              volume={volume}
              onProgress={(progress) => videoHandler("handleProgress", progress)}
              width="100%"
              height="calc(100% + 4px)"
              controls={false} // Hide default controls
              style={{ marginTop: "-2px", minHeight: "370px" }}
            />
            <div className={`${styles.controls} ${!controlsVisible && styles.hidden}`}>
              <button onClick={() => videoHandler("PlayPause")}>{playing ? <FaPause /> : <FaPlay />}</button>
              <input className={styles.slider} type="range" min={0} max={1} step="any" value={played} onChange={(e) => videoHandler("SeekChange", e)} style={{ width: "80%" }} />
              <button onClick={() => videoHandler("Mute")}>{muted ? <FaVolumeMute /> : <FaVolumeUp />}</button>
              <input className={styles.slider} type="range" min={0} max={1} step="any" value={volume} onChange={(e) => videoHandler("VolumeChange", e)} style={{ width: "10%" }} />
            </div>
          </div>
        )}
        {cardUrl && <MarkdownDisplay filePath={cardUrl} />}
      </section>
    </>
  );
};

export default VideoPlayer;
