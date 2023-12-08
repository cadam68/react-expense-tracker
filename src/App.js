import { useEffect } from "react";
import { useDebugContext } from "./DebugContext";
import { log, LogLevel } from "./logService";

const App = () => {
  const { debug, toggleDebug, setLogLevel } = useDebugContext();

  useEffect(() => {
    window.toggleDebug = toggleDebug;
    window.setLogLevel = setLogLevel;
  }, []);

  useEffect(() => {
    log(`debug is ${debug ? "on" : "off"}`);
  }, [debug]);

  return (
    <div className={"main" + (debug ? " debug" : "")}>
      <p>
        <button
          onClick={() => {
            log("Test of the LogLevel.DEBUG", LogLevel.DEBUG);
            log("Test of the LogLevel.INFO", LogLevel.INFO);
            log("Test of the LogLevel.WARNING", LogLevel.WARNING);
            log("Test of the LogLevel.ERROR", LogLevel.ERROR);
            log("Test of message");
          }}
        >
          Test LogLevel
        </button>
      </p>
    </div>
  );
};

export default App;
