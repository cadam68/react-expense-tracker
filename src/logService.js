// logService.js
import { format } from "date-fns";

const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARNING: 2,
  ERROR: 3,
};

let currentLogLevel = LogLevel.INFO; // Default log level
let isLogOn = false;

const getLogLevelText = (levelValue) => {
  const foundLevel = Object.keys(LogLevel).reduce((found, key) => {
    if (LogLevel[key] === levelValue) return key;
    return found;
  }, null);
  return foundLevel;
};

const setLogLevel = (level) => {
  currentLogLevel = level > LogLevel.ERROR ? LogLevel.ERROR : level;
  log(`logLevel changed to ${getLogLevelText(currentLogLevel)}`);
};

const setLogOn = (status) => {
  isLogOn = status;
  log(
    `logLevel is ${
      isLogOn
        ? `enabled on ${getLogLevelText(currentLogLevel)} level`
        : "disabled"
    }`
  );
};

const log = (message, level = -1) => {
  if ((isLogOn && level >= currentLogLevel) || level === -1) {
    const currentTime = format(new Date(), "HH:mm:ss");
    if (currentTime) {
      switch (level) {
        case LogLevel.DEBUG:
          console.info(`[${currentTime}][D] ${message}`);
          break;
        case LogLevel.INFO:
          console.info(`[${currentTime}][I] ${message}`);
          break;
        case LogLevel.WARNING:
          console.warn(`[${currentTime}][W] ${message}`);
          break;
        case LogLevel.ERROR:
          console.error(`[${currentTime}][E] ${message}`);
          break;
        default:
          console.log(`[${currentTime}] ${message}`);
          break;
      }
    }
  }
};

export { log, LogLevel, setLogLevel, setLogOn };
