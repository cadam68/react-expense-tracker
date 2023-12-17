import React, { createContext, useState, useContext, useEffect } from "react";
import { setLogLevel as setLogServiceLogLevel, setLogOn } from "../services/LogService";
import PropTypes from "prop-types";

// Create a context with initial value false for 'debug'
const DebugContext = createContext({
  debug: false,
  toggleDebug: () => {},
  setLogLevel: () => {},
});

const DebugContextProvider = ({ children }) => {
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    setLogOn(debug);
  }, [debug]);

  const toggleDebug = () => {
    setDebug((debug) => !debug);
  };

  const setLogLevel = (level) => {
    setLogServiceLogLevel(level);
  };

  return <DebugContext.Provider value={{ debug, toggleDebug, setLogLevel }}>{children}</DebugContext.Provider>;
};

DebugContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to consume the DebugContext
const useDebugContext = () => {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error("useDebugContext must be used within a DebugContextProvider");
  }
  return context;
};

export { DebugContextProvider, useDebugContext };
