import React, { createContext, useReducer, useContext, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { Log } from "../services/LogService";

const logger = Log("ShortcutContext");

const shortcutPrefix = "Ctrl+Shift";
const ShortcutContext = createContext({
  shortcuts: {},
  addShortcut: () => {},
  delShortcut: () => {},
  updateShortcut: () => {},
  getShortcut: () => {},
});
const initialState = { shortcuts: {} };

// Helper function to find the next available shortcut
const findAvailableShortcut = (category, shortcuts) => {
  const potentialShortcuts = category
    .toUpperCase()
    .split("")
    .map((char) => `${shortcutPrefix}+${char.toUpperCase()}`)
    .filter((key) => !Object.keys(shortcuts).includes(key));
  return potentialShortcuts.length > 0 ? potentialShortcuts[0] : null;
};

// Reducer to manage shortcuts
const reducer = (state, { type, payload }) => {
  switch (type) {
    case "shortcut/add": {
      const { category } = payload;
      const shortcut = findAvailableShortcut(category.name, state.shortcuts);
      logger.debug(`add shortcut=[${shortcut}] for category.id=[${category.id}]`);
      return { ...state, shortcuts: { ...state.shortcuts, [shortcut]: category } };
    }

    case "shortcut/del": {
      const { category } = payload;
      const shortcut = Object.entries(state.shortcuts).find(([key, item]) => item.id === category.id);
      if (!shortcut) return state;
      logger.debug(`del shortcut=[${shortcut}] for category.id=[${category.id}]`);
      const { [shortcut[0]]: removed, ...remainingShortcuts } = state.shortcuts;
      return { ...state, shortcuts: remainingShortcuts };
    }

    case "shortcut/update": {
      const { category } = payload;
      let shortcut = Object.entries(state.shortcuts).find(([key, item]) => item.id === category.id);
      if (!shortcut) return state;
      const { [shortcut[0]]: removed, ...remainingShortcuts } = state.shortcuts;
      shortcut = findAvailableShortcut(category.name, remainingShortcuts);
      if (!shortcut) return state;
      logger.debug(`update shortcut=[${shortcut}] for category.id=[${category.id}]`);
      return { ...state, shortcuts: { ...remainingShortcuts, [shortcut]: category } };
    }

    default:
      throw new Error(`Unknown action ${type}`);
  }
};

const ShortcutContextProvider = ({ children }) => {
  const [{ shortcuts }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    logger.debug(`shortcuts=${JSON.stringify(shortcuts)}`);
  }, [shortcuts]);

  const addShortcut = (category) => {
    dispatch({ type: "shortcut/add", payload: { category } });
  };

  const delShortcut = (category) => {
    dispatch({ type: "shortcut/del", payload: { category } });
  };

  const updateShortcut = (category) => {
    dispatch({ type: "shortcut/update", payload: { category } });
  };

  const getShortcut = (objectId) => {
    const entry = Object.entries(shortcuts).find(([key, item]) => item.id === objectId);
    const key = entry ? entry[0] : undefined;
    return key;
  };

  const contextValues = useMemo(() => ({ shortcuts, addShortcut, delShortcut, updateShortcut, getShortcut }), [shortcuts]); // value is cached by useMemo
  return <ShortcutContext.Provider value={contextValues}>{children}</ShortcutContext.Provider>;
};

ShortcutContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useShortcutContext = () => {
  const context = useContext(ShortcutContext);
  if (!context) {
    throw new Error("useShortcutContext must be used within a ShortcutContextProvider");
  }
  return context;
};

export { ShortcutContextProvider, useShortcutContext };
