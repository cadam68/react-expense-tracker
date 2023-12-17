import { useDebugContext } from "../contexts/DebugContext";
import Button from "./Button";
import PropTypes from "prop-types";

const Category = ({ category, onSelection, onDeletion, onUpdate, selectedCategory }) => {
  const { debug } = useDebugContext();
  const isSelected = selectedCategory?.id === category.id;

  return (
    <li className={(isSelected ? "selected" : "") + (debug ? " debug" : "")}>
      <div>
        <h3>{category.name}</h3>
        {category.budget && <p>budget: {category.budget}</p>}
        <p>
          <span>totalExpenses:</span>
          <span className={category.totalExpenses > category.budget ? "red" : "green"}>{category.totalExpenses}</span>
        </p>
      </div>
      {category.totalExpenses ? <Button onClick={() => onSelection(category)}>{isSelected ? "Close" : "Select"}</Button> : null}
      <Button onClick={() => onUpdate(category)}>Update</Button>
      <Button className={"button-outline"} onClick={() => onDeletion(category)}>
        <span>🗑</span>️ Delete
      </Button>
    </li>
  );
};

Category.propTypes = {
  category: PropTypes.shape().isRequired,
  onSelection: PropTypes.func,
  onDeletion: PropTypes.func,
  onUpdate: PropTypes.func,
  selectedCategory: PropTypes.func,
};

Category.defaultProps = {
  onSelection: () => {},
  onDeletion: () => {},
  onUpdate: () => {},
  selectedCategory: null,
};

export default Category;
