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
import { sortExpensesBy } from "../services/ExpensesService";
import { format } from "date-fns";
import { changeTheme, themes } from "../services/Helper";
import S from "string";
import UseLocalStorageState from "../hooks/UseLocalStorageState";

const Header = ({ categories, clearExpenses, clearCategories, expenses, setSelectedCategory }) => {
  const { debug, toggleDebug } = useDebugContext();
  const { resetBasicData } = useBasicDataContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef([
    new Audio("/sounds/AlanisMorissetteKingofPain.mp3"),
    new Audio("/sounds/CountingCrowsMrJones.mp3"),
    new Audio("/sounds/4NonBlondesWhatsUp.mp3"),
    new Audio("/sounds/CalviSaveTonight.mp3"),
  ]);
  const [themeId, setThemeId] = UseLocalStorageState("expense-tracker-theme", 0);

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

  const handleChangeTheme = () => {
    const nextThemeId = (themeId + 1) % Object.keys(themes).length;
    changeTheme(themes[Object.keys(themes)[nextThemeId]]);
    setThemeId(nextThemeId);
  };

  return (
    <nav className={"nav" + (debug ? " debug" : "")}>
      <p>
        <Hover caption={"List all expenses"}>
          <Button
            onClick={() => {
              setSelectedCategory((selectedCategory) => (selectedCategory?.name === "*" ? null : { name: "*" }));
            }}
            className="button-shadow"
          >
            {text}
          </Button>
        </Hover>
      </p>
      <p>
        <Hover caption={"Generate a pdf report of all expenses"}>
          <PDFDownloadLink
            className={"button button-small"}
            document={<ExpensesPdfDocument categories={categories} expenses={sortExpensesBy(expenses, "date-category")} />}
            fileName={`expenses-${format(new Date(), "yyyymmdd")}.pdf`}
          >
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
        <Hover caption={`Change theme to ${S(Object.keys(themes)[(themeId + 1) % Object.keys(themes).length]).capitalize().s}`}>
          <Button className={"button-outline button-small"} onClick={handleChangeTheme}>
            {S(Object.keys(themes)[themeId]).capitalize().s}
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

Header.propTypes = {
  categories: PropTypes.array.isRequired,
  clearExpenses: PropTypes.func,
  clearCategories: PropTypes.func,
  setSelectedCategory: PropTypes.func,
  expenses: PropTypes.array.isRequired,
};

Header.defaultProps = {
  clearExpenses: () => {},
  clearCategories: () => {},
  setSelectedCategory: () => {},
};

export default Header;
