import Button from "./Button";
import PropTypes from "prop-types";
import S from "string";
import { sprintf } from "sprintf-js";
import Hover from "./Hover";
import { useDrop } from "react-dnd";

const Category = ({ num, category, onSelection, onDelete, onUpdate, onExpenseDrop, selectedCategory }) => {
  const isSelected = selectedCategory?.id === category.id;
  const currentDate = new Date();
  const budgetPeriod = Math.round((category.budget / new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()) * currentDate.getDate());

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: "expense",
    drop: (item, monitor) => {
      onExpenseDrop(item, category);
    },
    canDrop: (item, monitor) => {
      return item.category !== category.name;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  return (
    <li>
      <div
        className={"category" + (isSelected ? " selected" : "") + (category.totalExpenses ? " enable" : "") + (isOver && canDrop ? " isDroppable" : "")}
        onClick={() => {
          if (category.totalExpenses) onSelection(category);
        }}
        ref={dropRef}
      >
        <div>
          <p>{S(category.name).capitalize().s}</p>
          <p className={"expense-amount " + (category.budget && category.totalExpenses > category.budget ? "amount-high" : "")}>
            Spent {sprintf("%.2f €", category.totalExpenses)} {category.budget ? sprintf("/ %.2f €", category.budget) : ""}
            <span className="expense-amount amount-high">{category.budget && category.totalExpenses > budgetPeriod ? " ⚠️" : ""}</span>
          </p>
        </div>
        <span>
          <Hover enable={num === 1} caption={"Update"}>
            <Button
              className="button-shadow"
              onClick={(e) => {
                e.stopPropagation();
                onUpdate(category);
              }}
            >
              <span>✏️</span>
            </Button>
          </Hover>
          &nbsp;
          <Hover enable={num === 1} caption={"Delete"}>
            <Button
              className="button-shadow"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(category);
              }}
            >
              <span>🗑</span>
            </Button>
          </Hover>
        </span>
      </div>
    </li>
  );
};

Category.propTypes = {
  category: PropTypes.shape().isRequired,
  onSelection: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  onExpenseDrop: PropTypes.func,
  selectedCategory: PropTypes.shape({}),
  num: PropTypes.number,
};

Category.defaultProps = {
  onSelection: () => {},
  onDelete: () => {},
  onUpdate: () => {},
  onExpenseDrop: () => {},
  selectedCategory: null,
  num: null,
};

export default Category;
