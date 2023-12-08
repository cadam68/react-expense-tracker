import { useState, useEffect } from "react";
import { log, LogLevel } from "./logService";

const loalData = (key, initialValue) => () => {
  // localStorage.removeItem(key);
  let storedValue = localStorage.getItem(key);
  log(`load ${key} from localStorage : ${storedValue}`, LogLevel.DEBUG);
  return storedValue ? JSON.parse(storedValue) : initialValue;
};

const UseLocalStorageState = (key, initialValue) => {
  const [state, setState] = useState(loalData(key, initialValue)); // <--- loadData returns a function :)

  useEffect(() => {
    // Update localStorage when 'items' state changes
    log(`save ${key} in localStorage : ${JSON.stringify(state)}`, LogLevel.DEBUG);
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

export default UseLocalStorageState;
