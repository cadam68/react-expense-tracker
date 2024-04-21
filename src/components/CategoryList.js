import Category from "./Category";
import PropTypes from "prop-types";
import { useAppContext } from "../contexts/AppContext";

const CategoryList = ({ onSelection, onDelete, onUpdate, onExpenseDrop, selectedCategory }) => {
  const {
    categoriesService: { categories },
  } = useAppContext();
  return (
    <ul>
      {categories
        .slice()
        .sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))
        .map((category, i) => (
          <Category
            num={i + 1}
            category={category}
            key={category.id}
            onSelection={onSelection}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onExpenseDrop={onExpenseDrop}
            selectedCategory={selectedCategory}
          />
        ))}
    </ul>
  );
};

CategoryList.propTypes = {
  onSelection: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  onExpenseDrop: PropTypes.func,
  selectedCategory: PropTypes.shape({}),
};

CategoryList.defaultProps = {
  onSelection: () => {},
  onDelete: () => {},
  onUpdate: () => {},
  onExpenseDrop: () => {},
  selectedCategory: null,
};

export default CategoryList;
