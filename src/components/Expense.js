import { useDebugContext } from "../contexts/DebugContext";
import { format } from "date-fns";
import Button from "./Button";
import PropTypes from "prop-types";
import Category from "./Category";

const Expense = ({ expense, onDelete }) => {
  const { debug } = useDebugContext();

  return (
    <li className={debug ? " debug" : ""}>
      <div>
        <p>Date : {format(expense.date, "dd-MM-yyyy")}</p>
        <p>Category : {expense.category}</p>
        <p>Description : {expense.description}</p>
        <p>Amount : {expense.amount}</p>
        <Button onClick={() => onDelete(expense)}>Delete</Button>
      </div>
    </li>
  );
};

Expense.propTypes = {
  expense: PropTypes.node.isRequired,
  onDelete: PropTypes.func,
};

Category.defaultProps = {
  onDelete: () => {},
};

export default Expense;
