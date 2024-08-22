import { useDebugContext } from "../../contexts/DebugContext";
import { format } from "date-fns";
import Button from "../divers/Button";
import PropTypes from "prop-types";
import Category from "../category/Category";
import { sprintf } from "sprintf-js";
import S from "string";
import { settings } from "../../Settings";
import { useDrag } from "react-dnd";
import { memo } from "react";

const Expense = ({ expense, onDelete, num }) => {
  const { debug } = useDebugContext();

  const [{ isDragging }, dragRef] = useDrag({
    type: "expense",
    item: { id: expense.id, category: expense.category },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <li className={debug ? " debug" : ""}>
      <div className={"expense dragging" + (isDragging ? " isDragging" : "")} ref={dragRef}>
        <span className={"running-number dragging"}>{num ? sprintf("%02d", num) : ""}</span>
        <span>{format(expense.date, "dd MMM")}</span>
        <span>{S(expense.description).capitalize().s}</span>
        <span className={"expense-amount " + (expense.amount >= settings.amountHigh ? "amount-high" : "")}>{sprintf("%02.2f", expense.amount)} €</span>
        <Button className="button-shadow" onClick={() => onDelete(expense)}>
          <span>🗑</span>
        </Button>
      </div>
    </li>
  );
};

Expense.propTypes = {
  expense: PropTypes.shape({}).isRequired,
  onDelete: PropTypes.func,
  num: PropTypes.number,
};

Category.defaultProps = {
  onDelete: () => {},
  num: null,
};

export default memo(Expense);
