// Create a context with initial value false for 'debug'
import { createContext, useContext, useEffect, useRef, useState } from "react";
import UseLocalStorageState from "../hooks/UseLocalStorageState";

const BasicDataContext = createContext({
  firstTime: true,
  resetBasicData: () => {},
});

const BasicDataContextProvider = ({ children }) => {
  const [firstTime, setFirstTime] = UseLocalStorageState("expense-tracker-firstTime", true);
  const firstTimeRef = useRef(firstTime);

  useEffect(() => {
    if (firstTime) setFirstTime(false);
  }, [firstTime]);

  const resetBasicData = () => {
    localStorage.removeItem("expense-tracker-firstTime");
  };

  return <BasicDataContext.Provider value={{ firstTime: firstTimeRef.current, resetBasicData }}>{children}</BasicDataContext.Provider>;
};

// Custom hook to consume the BasicDataContext
const useBasicDataContext = () => {
  const context = useContext(BasicDataContext);
  if (!context) {
    throw new Error("useBasicDataContext must be used within a BasicDataContextProvider");
  }
  return context;
};

export { BasicDataContextProvider, useBasicDataContext };
