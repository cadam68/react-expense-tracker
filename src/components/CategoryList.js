import Category from "./Category";
import PropTypes from "prop-types";

const CategoryList = ({ categories, onSelection, onDelete, onUpdate, selectedCategory }) => {
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
            selectedCategory={selectedCategory}
          />
        ))}
    </ul>
  );
};

CategoryList.propTypes = {
  categories: PropTypes.array.isRequired,
  onSelection: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  selectedCategory: PropTypes.shape({}),
};

CategoryList.defaultProps = {
  onSelection: () => {},
  onDelete: () => {},
  onUpdate: () => {},
  selectedCategory: null,
};

export default CategoryList;
