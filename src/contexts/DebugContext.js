import React, { createContext, useState, useContext, useEffect } from "react";
import { log, setLogLevel as setLogServiceLogLevel, setLogOn } from "../services/LogService";
import PropTypes from "prop-types";
import { settings } from "../Settings";

// Create a context with initial value false for 'debug'
const DebugContext = createContext({
  debug: false,
  toggleDebug: () => {},
  setLogLevel: () => {},
  admin: false,
  toggleAdmin: () => {},
});

const DebugContextProvider = ({ children }) => {
  const [debug, setDebug] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    setLogOn(debug);
  }, [debug]);

  const toggleDebug = () => {
    setDebug((debug) => !debug);
  };

  const setLogLevel = (level) => {
    setLogServiceLogLevel(level);
  };

  const toggleAdmin = (credential) => {
    if (credential === settings.passphrase) {
      setAdmin((admin) => {
        log(`admin changed to ${!admin}`);
        return !admin;
      });
    }
  };

  return <DebugContext.Provider value={{ debug, toggleDebug, setLogLevel, admin, toggleAdmin }}>{children}</DebugContext.Provider>;
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
