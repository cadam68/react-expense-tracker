import ExpensesChart from "../components/expense/ExpensesChart";
import { useDebugContext } from "../contexts/DebugContext";
import { Helmet } from "react-helmet";
import useComponentTranslation from "../hooks/useComponentTranslation";

const ChartsPage = () => {
  const { debug } = useDebugContext();
  const { t } = useComponentTranslation("ChartsPage");

  return (
    <section className={debug ? " debug" : ""}>
      <Helmet>
        <title>Expense Tracker - {t("title")}</title>
        <meta
          name="description"
          content="View and analyze your expenses with our interactive charts. Gain insights into your spending habits and make informed financial decisions with ease."
        />
        <meta name="keywords" content="expense tracker, track expenses, personal finance, finance management, visualize expenses, financial graphs, spending analysis" />
      </Helmet>
      <ExpensesChart />
    </section>
  );
};

export default ChartsPage;
