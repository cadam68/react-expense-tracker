import { sprintf } from "sprintf-js";
import { useDebugContext } from "../contexts/DebugContext";
import { LogLevel, setLogLevel } from "../services/LogService";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Button from "./Button";
import ExpensesPdfDocument from "./ExpensesPdfDocument";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Hover from "./Hover";
import { useBasicDataContext } from "../contexts/BasicDataContext";

const Stats = ({ categories, clearExpenses, clearCategories, expenses, setSelectedCategory }) => {
  const { debug, toggleDebug } = useDebugContext();
  const { resetBasicData } = useBasicDataContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef([
    new Audio("/sounds/AlanisMorissetteKingofPain.mp3"),
    new Audio("/sounds/CountingCrowsMrJones.mp3"),
    new Audio("/sounds/4NonBlondesWhatsUp.mp3"),
  ]);

  const totalExpenses = categories.reduce((acc, el) => acc + el.totalExpenses, 0);
  const totalBudget = categories.reduce((acc, el) => acc + (el.budget ? el.budget : el.totalExpenses), 0);

  useEffect(() => {
    [...Array(audioRef.current.length).keys()].forEach((i) => (audioRef.current[i].onended = () => setIsPlaying(false)));
  }, []);

  const text = sprintf(
    "You spend %.2f euros (%d%% budget) (%d expense%s)",
    totalExpenses,
    (totalExpenses * 100) / totalBudget,
    expenses.length,
    expenses.length === 0 ? "" : "s"
  );

  const playAudio = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      audioRef.current[Math.floor(Math.random() * audioRef.current.length)]
        .play()
        .catch((error) => console.error("Audio playback failed", error));
    }
  };

  return (
    <nav className={"nav" + (debug ? " debug" : "")}>
      <p>
        <Hover caption={"List all expenses"}>
          <Button
            onClick={() => {
              setSelectedCategory({ name: "*" });
            }}
            className="button-shadow"
          >
            {text}
          </Button>
        </Hover>
      </p>
      <p>
        <Hover caption={"Generate a pdf report of all expenses"}>
          <PDFDownloadLink className={"button button-small"} document={<ExpensesPdfDocument expenses={expenses} />} fileName="expenses.pdf">
            {({ blob, url, loading, error }) => (loading ? "Loading document..." : <Button className={"button-small"}>Print</Button>)}
          </PDFDownloadLink>
        </Hover>
        <Button
          className={"button-outline button-small"}
          onClick={() => {
            resetBasicData();
            toggleDebug();
            setLogLevel(LogLevel.DEBUG);
          }}
        >
          Debug {debug ? "OFF" : "ON"}{" "}
        </Button>
        <Hover caption={"Delete all expenses"}>
          <Button className={"button-outline button-small"} onClick={clearExpenses}>
            Clear Expenses
          </Button>
        </Hover>
        <Hover caption={"Delete all categories"}>
          <Button className={"button-outline button-small"} onClick={clearCategories}>
            Clear Categories
          </Button>
        </Hover>
        <Hover caption={"Would you like to listen some music ?"}>
          <Button className={"button-outline button-small" + (isPlaying ? " line-through" : "")} onClick={playAudio}>
            <span>🎵</span>
          </Button>
        </Hover>
      </p>
    </nav>
  );
};

Stats.propTypes = {
  categories: PropTypes.array.isRequired,
  clearExpenses: PropTypes.func,
  clearCategories: PropTypes.func,
  setSelectedCategory: PropTypes.func,
  expenses: PropTypes.array.isRequired,
};

Stats.defaultProps = {
  clearExpenses: () => {},
  clearCategories: () => {},
  setSelectedCategory: () => {},
};

export default Stats;
