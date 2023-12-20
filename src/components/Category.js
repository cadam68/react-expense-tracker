import Button from "./Button";
import PropTypes from "prop-types";
import S from "string";
import { sprintf } from "sprintf-js";

const Category = ({ category, onSelection, onDelete, onUpdate, selectedCategory }) => {
  const isSelected = selectedCategory?.id === category.id;

  return (
    <li>
      <div
        className={"category" + (isSelected ? " selected" : "") + (category.totalExpenses ? " enable" : "")}
        onClick={() => {
          if (category.totalExpenses) onSelection(category);
        }}
      >
        <span>{S(category.name).capitalize().s}</span>
        <span className={"expense-amount " + (category.budget && category.totalExpenses > category.budget ? "amount-high" : "")}>
          {sprintf("%.2f €", category.totalExpenses)} {category.budget ? sprintf("/ %.2f €", category.budget) : ""}
        </span>
        <span>
          <Button
            className="button-shadow"
            onClick={(e) => {
              e.stopPropagation();
              onUpdate(category);
            }}
          >
            <span>✏️</span>
          </Button>
          <Button
            className="button-shadow"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(category);
            }}
          >
            <span>🗑</span>
          </Button>
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
  selectedCategory: PropTypes.func,
};

Category.defaultProps = {
  onSelection: () => {},
  onDelete: () => {},
  onUpdate: () => {},
  selectedCategory: null,
};

export default Category;
