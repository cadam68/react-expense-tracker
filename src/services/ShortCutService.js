import { Log } from "./LogService";
import { useEffect, useReducer } from "react";

const logger = Log("ShortCutService");

const shortcutPrefix = "Ctrl+Shift";

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

const ShortcutService = () => {
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

  return { shortcuts, addShortcut, delShortcut, updateShortcut, getShortcut };
};

export { ShortcutService };
