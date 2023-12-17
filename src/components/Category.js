import { useDebugContext } from "../contexts/DebugContext";
import Button from "./Button";

const Category = ({ category, onSelection, onDeletion, onUpdate, selectedCategory }) => {
  const { debug } = useDebugContext();
  const isSelected = selectedCategory?.id === category.id;

  return (
    <li className={(isSelected ? "selected" : "") + (debug ? " debug" : "")}>
      <div>
        <h3>{category.name}</h3>
        {category.budget && <p>budget: {category.budget}</p>}
        <p>
          totalExpenses:
          <span className={category.totalExpenses > category.budget ? "red" : "green"}>{category.totalExpenses}</span>
        </p>
      </div>
      {category.totalExpenses ? <Button onClick={() => onSelection(category)}>{isSelected ? "Close" : "Select"}</Button> : null}
      <Button onClick={() => onUpdate(category)}>Update</Button>
      <Button onClick={() => onDeletion(category)}>Delete</Button>
    </li>
  );
};

export default Category;
