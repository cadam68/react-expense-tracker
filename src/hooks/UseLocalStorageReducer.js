import { useEffect, useReducer } from "react";
import { log, LogLevel } from "../services/LogService";

const loadInitialState = (key, converter) => (initialValue) => {
  let parsedObj;
  let storedValue = localStorage.getItem(key);
  log(`load ${key} from localStorage : ${storedValue}`, LogLevel.DEBUG);

  if (storedValue) parsedObj = converter(JSON.parse(storedValue));
  return storedValue ? parsedObj : initialValue;
};

const UseLocalStorageReducer = (key, initialValue, reducer, converter = (id) => id) => {
  const [state, dispatch] = useReducer(reducer, initialValue, loadInitialState(key, converter));

  useEffect(() => {
    log(`save ${key} in localStorage :  ${JSON.stringify(state)}`, LogLevel.DEBUG);
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, dispatch];
};

export default UseLocalStorageReducer;
