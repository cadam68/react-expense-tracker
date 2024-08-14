import React, { useEffect, useReducer, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { Log } from "../services/LogService";
import { useToast } from "../contexts/ToastContext";
import styles from "./Portfolio.module.css";
import ReactPlayer from "react-player";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { Helmet } from "react-helmet";
import useComponentTranslation from "../hooks/useComponentTranslation";
import S from "string";
import Button from "./Button";
import { FetchService } from "../services/FetchService";
import MarkdownDisplay from "./MarkdownDisplay";
import UseLocalStorageState from "../hooks/UseLocalStorageState";
import Carousel from "./Carousel";
import { changeTheme } from "../services/Helper";

const logger = Log("Portfolio");

const Portfolio = () => {
  const navigate = useNavigate();
  const { i18n, t } = useComponentTranslation("Portfolio");
  const { userId, lg: param_lg, itemId: param_itemId } = useParams();

  const {
    basicDataService: { downloadUrls },
    portfolioService,
    isLoading,
  } = useAppContext();
  const { Toast } = useToast();

  const [videoUrl, setVideoUrl] = useState();
  const [cardUrl, setCardUrl] = useState();
  const [carousel, setCarousel] = useState();
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const playerRef = useRef(null);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [settings, setSettings] = UseLocalStorageState("video-player-settings", { firstTime: true });

  const renderItemsTypes = ["video", "card", "carousel"];

  const initialState = { lg: null, itemId: null, items: null };
  const reducer = (state, { type, payload }) => {
    // console.log(`reducer type=${type} + state=${JSON.stringify(state)} + payload=${JSON.stringify(payload)}`);
    switch (type) {
      case "init": {
        let { param_lg, param_itemId } = payload;
        let lg = param_itemId ? param_lg : i18n.resolvedLanguage;
        let itemId = param_itemId ? param_itemId : param_lg;
        const uniqueIds = [...new Set(downloadUrls.map((item) => item.id))];
        let items = uniqueIds.map((id) => {
          const entries = downloadUrls.filter((item) => item.id === id);
          // return entries.find((item) => item.lg === lg) || entries[0];
          let entry = entries.find((item) => item.lg === lg) || entries[0];
          entry.label = i18n.t(`title_${entry.id}`, { lng: lg, defaultValue: S(entry.id.replace(/[^a-zA-Z0-9]/g, " ")).titleCase().s });
          return entry;
        });

        if (settings.firstTime) itemId = "[firstime]";
        if (!uniqueIds.includes(itemId) || !items.find((item) => item.id === itemId && renderItemsTypes.includes(item.type)))
          itemId = items.find((item) => renderItemsTypes.includes(item.type))?.id;
        return { ...initialState, lg, itemId, items };
      }

      default:
        throw new Error(`Unknown action ${type}`);
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    portfolioService.setPortfolioId(userId);
  }, [userId]);

  useEffect(() => {
    if (!downloadUrls) {
      // window.location.replace("/app/expenses");
      // navigate("/app/expenses", { replace: true });  // http://localhost:3000/portfolio/lagomez/de/welcome
      navigate("/portfolio", { replace: true });
      return;
    }
    if (!downloadUrls?.length) return;
    dispatch({ type: "init", payload: { param_lg, param_itemId } });
    changeTheme();
    // changeTheme({ colorLightest: "white", colorLight: "#f0f0f0", colorMedium: "blue", colorDark: "gray"});
  }, [downloadUrls, param_lg, param_itemId]);

  useEffect(() => {
    if (!state.lg) return;
    // console.log(`changeLanguage to ${state.lg}`);
    i18n.changeLanguage(state.lg);
  }, [state.lg]);

  useEffect(() => {
    if (!state.items) return;
    const selectedItem = state.items.find((item) => item.id === state.itemId);
    setVideoUrl(selectedItem?.type === "video" ? selectedItem.url : null);
    setCardUrl(selectedItem?.type === "card" ? selectedItem.url : null);
    setCarousel(selectedItem?.type === "carousel" ? selectedItem.data : null);
  }, [state.itemId, state.lg]);

  useEffect(() => {
    // console.log(`i18n.resolvedLanguage=${i18n.resolvedLanguage}`, state);
    if (!state.lg) return;
    navigate(`/portfolio/${userId}/${i18n.resolvedLanguage}/${param_itemId ? param_itemId : state.itemId}`, { replace: true });
  }, [i18n.resolvedLanguage]);

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
      await FetchService().downloadFile(fileUrl, fileName);
      Toast.info(`The file ${fileName} is downloaded`);
    } catch (error) {
      Toast.error(`The file ${fileName} is not available yet!`);
    }
  };

  if (!state.items) return;
  if (settings.firstTime) setSettings({ ...settings, firstTime: false });

  return (
    <>
      <section className={styles.navigation}>
        {state.items
          .filter((item) => item.type && !/^\[.*\]$/.test(item.id))
          .map((item) => (
            <Button
              className={`button-outline button-small ${state.itemId === item.id ? "disabled" : ""}`}
              key={item.id}
              onClick={() => {
                if (renderItemsTypes.includes(item.type)) {
                  if (/^\[.*\]$/.test(state.itemId)) dispatch({ type: "init", payload: { param_lg, param_itemId: item.id } });
                  else navigate(`/portfolio/${userId}/${state.lg}/${item.id}`, { replace: true });
                } else if (item.type === "file") {
                  // window.location.href = `${settings.baseApiUrl}/firebase/download?url=${encodeURIComponent(item.url)}`;
                  downloadFileHandler(item.url, item.target.split("/").pop());
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
        <h2>{state.items.find((item) => item.id === state.itemId)?.label}</h2>
        {videoUrl && (
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
        )}
        {cardUrl && <MarkdownDisplay filePath={cardUrl} />}
        {carousel && <Carousel images={carousel} showButtons={false} speed={3} />}
      </section>
    </>
  );
};

export default Portfolio;
