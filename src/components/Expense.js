import { useDebugContext } from "../contexts/DebugContext";
import { format } from "date-fns";
import Button from "./Button";
import PropTypes from "prop-types";
import Category from "./Category";
import { sprintf } from "sprintf-js";
import S from "string";

const Expense = ({ expense, onDelete, num }) => {
  const { debug } = useDebugContext();

  return (
    <li className={debug ? " debug" : ""}>
      <div className={"expense"}>
        <span className={"running-number"}>{num ? sprintf("%02d", num) : ""}</span>
        <span>{format(expense.date, "dd MMM")}</span>
        <span>{S(expense.description).capitalize().s}</span>
        <span className={"expense-amount " + (expense.amount >= 30 ? "amount-high" : "")}>{sprintf("%02.2f", expense.amount)} €</span>
        <Button className="button-shadow" onClick={() => onDelete(expense)}>
          <span>🗑</span>
        </Button>
      </div>
    </li>
  );
};

Expense.propTypes = {
  expense: PropTypes.node.isRequired,
  onDelete: PropTypes.func,
  num: PropTypes.number,
};

Category.defaultProps = {
  onDelete: () => {},
  num: null,
};

export default Expense;
