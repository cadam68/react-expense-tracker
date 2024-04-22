import { useState } from "react";
import { useDebugContext } from "../contexts/DebugContext";
import { log, LogLevel } from "../services/LogService";

import FormAddExpense from "../components/FormAddExpense";
import Header from "../components/Header";
import CategoryList from "../components/CategoryList";
import Button from "../components/Button";
import ExpenseList from "../components/ExpenseList";
import FormAddCategory from "../components/FormAddCategory";
import Hover from "../components/Hover";
import { settings } from "../Settings";
import { useSettingsContext } from "../contexts/SettingsContext";
import ExpensesChart from "../components/ExpensesChart";
import { useAppContext } from "../contexts/AppContext";

const HomePage = () => {
  const { debug, toggleDebug, setLogLevel, toggleAdmin } = useDebugContext();
  const {
    categoriesService: { categories, delCategory, addCategory, updateCategory },
    expensesService: { assignExpense },
    confirmService: { requestConfirm, ConfirmModalComponent },
  } = useAppContext();

  const [openFormCategory, setOpenFormCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatedCategory, setUpdatedCategory] = useState(null);
  const { firstTime, showCharts } = useSettingsContext();

  const handleOpenFormCategory = () => {
    if (selectedCategory && !openFormCategory) setSelectedCategory(null); // close the selection form
    setOpenFormCategory((showAddCategory) => !showAddCategory);
    setUpdatedCategory(null);
  };

  const handleAddCategory = (id, name, budget) => {
    if (id == null) addCategory(name, budget);
    else if (updatedCategory.name !== name || updatedCategory.budget !== budget) {
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
    <div className={"main-box" + (debug ? " debug" : "")}>
      <Header setSelectedCategory={setSelectedCategory} />
      <FormAddExpense />
      {showCharts ? (
        <section className={debug ? " debug" : ""}>
          <ExpensesChart />
        </section>
      ) : (
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
      )}
    </div>
  );
};

export default HomePage;
