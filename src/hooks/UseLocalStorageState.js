import { useState, useEffect } from "react";
import { log, LogLevel } from "../services/LogService";
import { settings } from "../Settings";

const loadData = (key, initialValue) => () => {
  // if (key !== "expense-tracker-firstTime") localStorage.removeItem(key); // iici - comment to persist all values -

  let parsedObj;
  let storedValue = localStorage.getItem(key);
  log(`load ${key} from localStorage : ${storedValue}`, LogLevel.DEBUG);

  //!\ dates are converted to strings because JSON doesn't have a native date type. //!\
  if (storedValue) {
    parsedObj = JSON.parse(storedValue);
    switch (key) {
      case "expense-tracker-expenses":
        parsedObj.forEach((item) => {
          if (item.date && !isNaN(Date.parse(item.date))) item.date = new Date(item.date);
        });
        break;

      case "expense-tracker-categories":
        const missingColors = parsedObj.some((item) => !item.color);
        if (missingColors) {
          parsedObj.forEach((item, i) => {
            if (!item.color) item.color = settings.palette[i];
          });
        }
        break;
    }
  }

  return storedValue ? parsedObj : initialValue;
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
