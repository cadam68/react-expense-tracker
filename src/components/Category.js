import Button from "./Button";
import PropTypes from "prop-types";
import S from "string";
import { sprintf } from "sprintf-js";
import Hover from "./Hover";

const Category = ({ num, category, onSelection, onDelete, onUpdate, selectedCategory }) => {
  const isSelected = selectedCategory?.id === category.id;
  const currentDate = new Date();
  const budgetPeriod = Math.round(
    (category.budget / new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()) * currentDate.getDate()
  );

  return (
    <li>
      <div
        className={"category" + (isSelected ? " selected" : "") + (category.totalExpenses ? " enable" : "")}
        onClick={() => {
          if (category.totalExpenses) onSelection(category);
        }}
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
  selectedCategory: PropTypes.shape({}),
  num: PropTypes.number,
};

Category.defaultProps = {
  onSelection: () => {},
  onDelete: () => {},
  onUpdate: () => {},
  selectedCategory: null,
  num: null,
};

export default Category;
