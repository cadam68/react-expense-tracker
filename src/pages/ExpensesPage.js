import Hover from "../components/Hover";
import Button from "../components/Button";
import CategoryList from "../components/CategoryList";
import FormAddCategory from "../components/FormAddCategory";
import ExpenseList from "../components/ExpenseList";
import { useDebugContext } from "../contexts/DebugContext";
import { settings } from "../Settings";
import { useState } from "react";
import { log, LogLevel } from "../services/LogService";
import { useAppContext } from "../contexts/AppContext";
import { useOutletContext } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";

const ExpensesPage = () => {
  const { selectedCategory, setSelectedCategory } = useOutletContext(); // <-- access context value
  const { addToast } = useToast();

  const { debug } = useDebugContext();
  const {
    categoriesService: { categories, delCategory, addCategory, updateCategory },
    expensesService: { assignExpense },
    confirmService: { requestConfirm },
  } = useAppContext();

  const [openFormCategory, setOpenFormCategory] = useState(false);
  const [updatedCategory, setUpdatedCategory] = useState(null);

  const handleOpenFormCategory = () => {
    if (selectedCategory && !openFormCategory) setSelectedCategory(null); // close the selection form
    setOpenFormCategory((showAddCategory) => !showAddCategory);
    setUpdatedCategory(null);
  };

  const handleAddCategory = (id, name, budget) => {
    if (id == null) {
      addToast({ type: "info", message: `New category ${name} added` });
      addCategory(name, budget);
    } else if (updatedCategory.name !== name || updatedCategory.budget !== budget) {
      const res = updateCategory(updatedCategory.id, name, budget);
      if (selectedCategory) setSelectedCategory(res);
    }
    setOpenFormCategory(false);
  };

  const handleSelectCategory = (category) => {
    log(JSON.stringify(category) + " is selected", LogLevel.DEBUG);
    setSelectedCategory((selectedCategory) => (selectedCategory?.id === category.id ? null : category));
    setOpenFormCategory(false); // close the add friend form
  };

  const handleDeleteCategory = async (category) => {
    if (
      await requestConfirm(
        <p>
          Do you want to <strong>delete</strong> category '{category.name}' and all related expenses ?
        </p>
      )
    ) {
      log(JSON.stringify(category) + " is deleted", LogLevel.DEBUG);
      addToast({ type: "warning", message: `Category ${category.name} deleted` });
      delCategory(category);
      setSelectedCategory(null);
    }
  };

  const handleUpdateCategory = (category) => {
    setUpdatedCategory(category);
    setOpenFormCategory(true);
    setSelectedCategory(null); /* optional */
  };

  const handleCloseCategory = () => {
    setOpenFormCategory(false);
  };

  const handleExpenseDrop = (expense, category) => {
    assignExpense(expense, category);
  };

  return (
    <section className={"sidebar" + (debug ? " debug" : "")}>
      <div className={"category-list" + (debug ? " debug" : "")}>
        <p className={"space-between"}>
          <span>Categories</span>
          <Hover caption={`Add up to ${settings.maxCategories} categories`}>
            <Button className={"button button-small" + (openFormCategory || categories.length >= settings.maxCategories ? " disabled" : "")} onClick={handleOpenFormCategory}>
              Add Category
            </Button>
          </Hover>
        </p>
        <CategoryList
          onSelection={handleSelectCategory}
          onUpdate={handleUpdateCategory}
          onDelete={handleDeleteCategory}
          onExpenseDrop={handleExpenseDrop}
          selectedCategory={selectedCategory}
        />
        <div>
          {openFormCategory && (
            <>
              <p>{updatedCategory ? `Update Category ${updatedCategory.name}` : "New Category"}</p>
              <FormAddCategory
                key={updatedCategory?.id} // <-----/!\ force reset state for every new key value
                onAdd={handleAddCategory}
                onClose={handleCloseCategory}
                category={updatedCategory}
              />
            </>
          )}
        </div>
      </div>
      {selectedCategory && <ExpenseList selectedCategory={selectedCategory} />}
    </section>
  );
};
export default ExpensesPage;
