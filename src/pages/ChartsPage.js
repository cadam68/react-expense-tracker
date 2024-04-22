import ExpensesChart from "../components/ExpensesChart";
import { useDebugContext } from "../contexts/DebugContext";

const ChartsPage = () => {
  const { debug } = useDebugContext();

  return (
    <section className={debug ? " debug" : ""}>
      <ExpensesChart />
    </section>
  );
};

export default ChartsPage;
