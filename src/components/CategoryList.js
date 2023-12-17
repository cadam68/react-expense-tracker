import Category from "./Category";

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

export default CategoryList;
