import { sprintf } from "sprintf-js";
import { useDebugContext } from "../contexts/DebugContext";
import { LogLevel, setLogLevel } from "../services/LogService";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Button from "./Button";
import ExpensesPdfDocument from "./ExpensesPdfDocument";

const Stats = ({ categories, clearExpenses, clearCategories, expenses }) => {
  const { debug, toggleDebug } = useDebugContext();

  const totalExpenses = categories.reduce((acc, el) => acc + el.totalExpenses, 0);
  const totalBudget = categories.reduce((acc, el) => acc + (el.budget ? el.budget : el.totalExpenses), 0);

  const text = sprintf(
    "You spend %.2f euros (%d%% budget) (%d expense%s)",
    totalExpenses,
    (totalExpenses * 100) / totalBudget,
    expenses.length,
    expenses.length === 0 ? "" : "s"
  );

  return (
    <footer className={"stats" + (debug ? " debug" : "")}>
      <span>{text}</span>
      <PDFDownloadLink document={<ExpensesPdfDocument expenses={expenses} />} fileName="expenses.pdf">
        {({ blob, url, loading, error }) => (loading ? "Loading document..." : <button> Download</button>)}
      </PDFDownloadLink>
      <Button
        onClick={() => {
          toggleDebug();
          setLogLevel(LogLevel.DEBUG);
        }}
      >
        set debug {debug ? "off" : "on"}{" "}
      </Button>
      <Button onClick={clearExpenses}>clear expenses</Button>
      <Button onClick={clearCategories}>clear categories</Button>
    </footer>
  );
};

export default Stats;
