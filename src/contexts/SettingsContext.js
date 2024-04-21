import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import useLocalStorageReducer from "../hooks/UseLocalStorageReducer";
import PropTypes from "prop-types";

const SettingsContext = createContext({
  firstTime: true,
  resetBasicData: () => {},
  themeId: 0,
  setThemeId: () => {},
  showCharts: false,
  toogleShowCharts: () => {},
});

const initialState = { firstTime: true, themeId: 0, showCharts: false };

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "firstTime/false":
      return { ...state, firstTime: false };
    case "themeId/set": {
      const { themeId } = payload;
      return { ...state, themeId };
    }
    case "reset":
      return initialState;
    case "showCharts/toggle":
      return { ...state, showCharts: !state.showCharts };
    default:
      throw new Error(`Unknown action ${type}`);
  }
};

const SettingsContextProvider = ({ children }) => {
  const [{ firstTime, themeId, showCharts }, dispatch] = useLocalStorageReducer("expense-tracker-settings", initialState, reducer);
  const firstTimeRef = useRef(firstTime);

  useEffect(() => {
    if (firstTime) dispatch({ type: "firstTime/false" });
  }, [firstTime]);

  const resetBasicData = () => {
    dispatch({ type: "reset" });
  };

  const setThemeId = (themeId) => {
    dispatch({ type: "themeId/set", payload: { themeId } });
  };

  const toogleShowCharts = () => {
    dispatch({ type: "showCharts/toggle" });
  };

  const contextValues = useMemo(() => ({ firstTime: firstTimeRef.current, resetBasicData, themeId, setThemeId, showCharts, toogleShowCharts }), [firstTime, themeId, showCharts]);
  return <SettingsContext.Provider value={contextValues}>{children}</SettingsContext.Provider>;
};

// Custom hook to consume the SettingsContext
const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettingsContext must be used within a SettingsContextProvider");
  }
  return context;
};

SettingsContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { SettingsContextProvider, useSettingsContext };
