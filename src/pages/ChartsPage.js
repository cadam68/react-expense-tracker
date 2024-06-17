import ExpensesChart from "../components/ExpensesChart";
import { useDebugContext } from "../contexts/DebugContext";
import { Helmet } from "react-helmet";

const ChartsPage = () => {
  const { debug } = useDebugContext();

  return (
    <section className={debug ? " debug" : ""}>
      <Helmet>
        <title>Expense Tracker - Visualize Your Expenses with Graphs</title>
        <meta
          name="description"
          content="View and analyze your expenses with our interactive charts. Gain insights into your spending habits and make informed financial decisions with ease."
        />
        <meta name="keywords" content="expense tracker, expense charts, visualize expenses, financial graphs, spending analysis" />
      </Helmet>
      <ExpensesChart />
    </section>
  );
};

export default ChartsPage;
