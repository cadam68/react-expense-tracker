import { settings } from "../Settings";
import { Log } from "./LogService";

const logger = Log("FetchService");

const FetchService = () => {
  const downloadFile = async (fileUrl, fileName) => {
    const response = await fetch(`${settings.baseApiUrl}/firebase/download?url=${encodeURIComponent(fileUrl)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/octet-stream",
        "X-API-Key": settings.apiKey,
      },
    });

    if (!response.ok) throw new Error(`Could not retrieve the ${fileName} file`);

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const fetchDownloadUrl = async (ref, abortCtrl = new AbortController()) => {
    const signal = abortCtrl.signal;
    try {
      const res = await fetch(`${settings.baseApiUrl}/firebase/downloadUrl?ref=${ref}`, {
        signal: signal,
        method: "GET",
        headers: {
          "X-API-Key": settings.apiKey,
        },
      });
      if (!res.ok) throw new Error(`Something went wrong with fetching downloadUrl data`);
      const data = await res.json();
      logger.debug(`downloadUrls : ${JSON.stringify(data)}`);
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

  const fetchMarkdownFile = async (filePath) => {
    let fileUrl = `${settings.baseApiUrl}/firebase/download?url=${encodeURIComponent(filePath)}`;

    const response = await fetch(fileUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/octet-stream",
        "X-API-Key": settings.apiKey,
      },
    });

    if (!response.ok) throw new Error(`Could not retrieve the file`);
    const text = await response.text();
    return text;
  };

  const fetchSupporters = async (abortCtrl) => {
    const signal = abortCtrl.signal;
    const res = await fetch(`${settings.baseApiUrl}/supporters`, { signal: signal });
    if (!res.ok) throw new Error("Something went wrong with fetching supporters");
    const data = await res.json();
    return data;
  };

  return { downloadFile, fetchDownloadUrl, fetchDownloadJson, fetchMarkdownFile, fetchSupporters };
};

export { FetchService };