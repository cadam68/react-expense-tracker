import React, { createContext, useReducer, useContext, useEffect } from "react";
import { Log } from "../services/LogService";

const logger = Log("ShortcutContext");
const ShortcutContext = createContext();
const shortcutPrefix = "Ctrl+Shift";

// Reducer to manage shortcuts
const shortcutReducer = (state, { type, payload }) => {
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

// Helper function to find the next available shortcut
const findAvailableShortcut = (category, shortcuts) => {
  const potentialShortcuts = category
    .toUpperCase()
    .split("")
    .map((char) => `${shortcutPrefix}+${char.toUpperCase()}`)
    .filter((key) => !Object.keys(shortcuts).includes(key));
  return potentialShortcuts.length > 0 ? potentialShortcuts[0] : null;
};

// Context provider
export const ShortcutProvider = ({ children }) => {
  const [state, dispatch] = useReducer(shortcutReducer, { shortcuts: {} });

  useEffect(() => {
    logger.debug(`shortcuts=${JSON.stringify(state.shortcuts)}`);
  }, [state.shortcuts]);

  return <ShortcutContext.Provider value={{ state, dispatch }}>{children}</ShortcutContext.Provider>;
};

// Custom hook to use the shortcut context
export const useShortcuts = () => useContext(ShortcutContext);
