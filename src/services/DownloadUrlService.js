import { Log } from "./LogService";
import { settings } from "../Settings";

const logger = Log("DownloadUrlService");

const DownloadUrlService = () => {
  const fetchDownloadUrl = async (ref, abortCtrl = new AbortController()) => {
    const signal = abortCtrl.signal;
    try {
      const res = await fetch(`${settings.baseApiUrl}/firebase/downloadUrl?ref=${ref}`, { signal: signal });
      if (!res.ok) throw new Error(`Something went wrong with fetching dowloadUrl data`);
      const data = await res.json();
      logger.debug(`downloadUrls : ${JSON.stringify(data)}`);
      return data;
    } catch (err) {
      if (err.name !== "AbortError") throw err;
    }
  };

  return { fetchDownloadUrl };
};

export { DownloadUrlService };
