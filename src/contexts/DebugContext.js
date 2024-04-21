import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { log, setLogLevel as setLogServiceLogLevel, setLogOn } from "../services/LogService";
import PropTypes from "prop-types";
import { settings } from "../Settings";

const DebugContext = createContext({
  debug: false,
  toggleDebug: () => {},
  setLogLevel: () => {},
  admin: false,
  toggleAdmin: () => {},
});

const initialState = { debug: false, admin: false };

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "debug/toggle": // nomenclature : "state/event*
      return { ...state, debug: !state.debug };
    case "debug/set":
      return { ...state, debug: payload };
    case "admin/toggle": {
      const { credential } = payload;
      if (credential !== settings.passphrase) return state;
      log(`admin changed to ${!state.admin}`);
      return { ...state, admin: !state.admin };
    }
    default:
      throw new Error(`Unknown action ${type}`);
  }
};

const DebugContextProvider = ({ children }) => {
  const [{ debug, admin }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    setLogOn(debug);
  }, [debug]);

  const toggleDebug = () => {
    dispatch({ type: "debug/toggle" });
  };

  const toggleAdmin = (credential) => {
    dispatch({ type: "admin/toggle", payload: { credential } });
  };

  const setLogLevel = (level) => {
    setLogServiceLogLevel(level);
  };

  const contextValues = useMemo(() => ({ debug, toggleDebug, setLogLevel, admin, toggleAdmin }), [debug, admin]); // value is cached by useMemo
  return <DebugContext.Provider value={contextValues}>{children}</DebugContext.Provider>;
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
