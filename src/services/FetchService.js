import { settings } from "../Settings";
import { Log } from "./LogService";

const logger = Log("FetchService");

const FetchService = () => {
  const fetchDownloadUrl = async (ref, userid, abortCtrl = new AbortController()) => {
    const signal = abortCtrl.signal;
    try {
      const res = await fetch(`${settings.baseApiUrl}/firebase/downloadUrl?ref=${ref}&userid=${encodeURI(userid)}`, {
        signal: signal,
        method: "GET",
        headers: {
          "X-API-Key": settings.apiKey,
        },
      });
      if (!res.ok) throw new Error(`Something went wrong with fetching downloadUrl data`);
      const data = await res.json();
      logger.debug(`fetchDownloadUrl : ${JSON.stringify(data)}`);
      return data;
    } catch (err) {
      if (err.name !== "AbortError") throw err;
    }
  };

  const fetchDownloadJson = async (downloadUrl, abortCtrl = new AbortController()) => {
    const signal = abortCtrl.signal;
    try {
      const res = await fetch(`${settings.baseApiUrl}/firebase/downloadJson?url=${encodeURIComponent(downloadUrl)}`, {
        signal: signal,
        method: "GET",
        headers: {
          "X-API-Key": settings.apiKey,
        },
      });
      if (!res.ok) throw new Error(`Something went wrong with fetching fetchDownloadJson data`);
      const data = await res.json();
      logger.debug(`downloadUrls : ${JSON.stringify(data)}`);
      return data;
    } catch (err) {
      if (err.name !== "AbortError") throw err;
    }
  };

  const fetchSupporters = async (abortCtrl) => {
    const signal = abortCtrl.signal;
    const res = await fetch(`${settings.baseApiUrl}/supporters`, { signal: signal });
    if (!res.ok) throw new Error("Something went wrong with fetching supporters");
    const data = await res.json();
    return data;
  };

  return { fetchDownloadUrl, fetchDownloadJson, fetchSupporters };
};

export { FetchService };
