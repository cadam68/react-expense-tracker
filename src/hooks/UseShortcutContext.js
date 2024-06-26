import { useEffect } from "react";
import { Log } from "../services/LogService";
import { useAppContext } from "../contexts/AppContext";

const logger = Log("useShortcut");

const useShortcutContext = (callback) => {
  const {
    shortcutService: { shortcuts },
  } = useAppContext();

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!event.ctrlKey && !event.shiftKey) return; // Early exit if Ctrl or Shift is not pressed

      // Loop through each shortcut and check for a match with the event
      Object.entries(shortcuts).forEach(([shortcut, item]) => {
        const keys = shortcut.split("+"); // Split the shortcut into parts, e.g., ['Ctrl', 'Shift', 'F']
        const key = keys.pop(); // The actual key to be pressed, e.g., 'F'
        const modifiersMatch = keys.every((modifier) => {
          // Check each modifier (Ctrl, Shift, etc.)
          if (modifier === "Ctrl") return event.ctrlKey;
          if (modifier === "Shift") return event.shiftKey;
          if (modifier === "Alt") return event.altKey;
          return false;
        });

        if (modifiersMatch && event.key.toUpperCase() === key.toUpperCase()) {
          event.preventDefault();
          logger.debug(`find a matching shortcut=[${shortcut}] to the event`);
          callback(item); // Execute callback with the item stored in the shortcuts
          return;
        }
      });
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      // logger.debug(`removeEventListener("keydown")`);
    };
  }, [shortcuts, callback]); // Ensure effect updates when shortcuts or callback changes
};

export default useShortcutContext;
