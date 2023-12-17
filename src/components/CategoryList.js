import Category from "./Category";
import PropTypes from "prop-types";

const CategoryList = ({ categories, onSelection, onDeletion, onUpdate, selectedCategory }) => {
  return (
    <ul>
      {categories.map((category) => (
        <Category
          category={category}
          key={category.id}
          onSelection={onSelection}
          onUpdate={onUpdate}
          onDeletion={onDeletion}
          selectedCategory={selectedCategory}
        />
      ))}
    </ul>
  );
};

CategoryList.propTypes = {
  categories: PropTypes.array.isRequired,
  onSelection: PropTypes.func,
  onDeletion: PropTypes.func,
  onUpdate: PropTypes.func,
  selectedCategory: PropTypes.func,
};

CategoryList.defaultProps = {
  onSelection: () => {},
  onDeletion: () => {},
  onUpdate: () => {},
  selectedCategory: null,
};

export default CategoryList;
