import { useState, useEffect } from "react";
import { log, LogLevel } from "../services/LogService";

const loadData = (key, initialValue) => () => {
  if (key !== "expense-tracker-firstTime") localStorage.removeItem(key); // iici - to remove to persist all values -
  let storedValue = localStorage.getItem(key);
  log(`load ${key} from localStorage : ${storedValue}`, LogLevel.DEBUG);
  return storedValue ? JSON.parse(storedValue) : initialValue;
};

const UseLocalStorageState = (key, initialValue) => {
  const [state, setState] = useState(loadData(key, initialValue)); // <--- loadData returns a function :)

  useEffect(() => {
    // Update localStorage when 'items' state changes
    log(`save ${key} in localStorage :  ${JSON.stringify(state)}`, LogLevel.DEBUG);
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

export default UseLocalStorageState;
