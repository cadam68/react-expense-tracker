import { useEffect, useState } from "react";
import { useDebugContext } from "./contexts/DebugContext";
import { log, LogLevel } from "./services/LogService";
import { initialExpenses, ExpensesService } from "./services/ExpensesService";
import { initialCategories, CategoriesService } from "./services/CategoriesService";

import Logo from "./components/Logo";
import FormAddExpense from "./components/FormAddExpense";
import UseLocalStorageState from "./hooks/UseLocalStorageState";
import Header from "./components/Header";
import CategoryList from "./components/CategoryList";
import Button from "./components/Button";
import ExpenseList from "./components/ExpenseList";
import FormAddCategory from "./components/FormAddCategory";
import Footer from "./components/Footer";
import Hover from "./components/Hover";
import { settings } from "./Settings";

const App = () => {
  const { debug, toggleDebug, setLogLevel } = useDebugContext();
  const { expenses, addExpense, updateExpensesByCategory, removeExpense, removeExpensesByCategory, clearExpenses } = ExpensesService(
    UseLocalStorageState("expense-tracker-expenses", initialExpenses)
  );
  const { categories, setCategories, addCategory, updateCategory, removeCategory, clearCategories } = CategoriesService(
    UseLocalStorageState("expense-tracker-categories", initialCategories)
  );
  const [openFormCategory, setOpenFormCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatedCategory, setUpdatedCategory] = useState(null);

  useEffect(() => {
    window.toggleDebug = toggleDebug;
    window.setLogLevel = setLogLevel;
  }, []);

  useEffect(() => {
    log(`debug is ${debug ? "on" : "off"}`);
  }, [debug]);

  useEffect(() => {
    // expenses.forEach((expense, i) => console.log(`expense[${i}]` + JSON.stringify(expense)));
    setCategories(
      categories.map((category) => ({
        ...category,
        totalExpenses: expenses.filter((expense) => expense.category === category.name).reduce((acc, el) => acc + el.amount, 0),
      }))
    );
  }, [expenses]);

  useEffect(() => {
    // categories.forEach((category, i) => console.log(`category[${i}]` + JSON.stringify(category)));
  }, [categories]);

  const handleOpenFormCategory = () => {
    if (selectedCategory && !openFormCategory) setSelectedCategory(null); // close the selection form
    setOpenFormCategory((showAddCategory) => !showAddCategory);
    setUpdatedCategory(null);
  };

  const handleAddCategory = (id, name, budget) => {
    if (id == null) addCategory(name, budget);
    else if (updatedCategory.name !== name || updatedCategory.budget !== budget) {
      updateExpensesByCategory(updatedCategory.name, name);
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

  const handleDeleteCategory = (category) => {
    log(JSON.stringify(category) + " is deleted", LogLevel.DEBUG);
    removeCategory(category.id);
    removeExpensesByCategory(category.name);
    setSelectedCategory(null);
  };

  const handleUpdateCategory = (category) => {
    setUpdatedCategory(category);
    setOpenFormCategory(true);
    setSelectedCategory(null); /* optional */
  };

  const handleDeleteExpense = (expense) => {
    console.log(expense);
    removeExpense(expense);
  };

  const handleCloseCategory = () => {
    setOpenFormCategory(false);
  };

  return (
    <div className={"container" + (debug ? " debug" : "")}>
      <Logo />
      <Header
        categories={categories}
        expenses={expenses}
        clearExpenses={clearExpenses}
        clearCategories={clearCategories}
        setSelectedCategory={setSelectedCategory}
      />
      <FormAddExpense onAdd={addExpense} categories={categories} />
      <section className={"main" + (debug ? " debug" : "")}>
        <div className={"category-list" + (debug ? " debug" : "")}>
          <p className={"space-between"}>
            <span>Categories</span>
            <Hover caption={`Add up to ${settings.maxCategories} categories`}>
              <Button
                className={"button button-small" + (openFormCategory || categories.length >= settings.maxCategories ? " disabled" : "")}
                onClick={handleOpenFormCategory}
              >
                Add Category
              </Button>
            </Hover>
          </p>
          <CategoryList
            categories={categories}
            onSelection={handleSelectCategory}
            onUpdate={handleUpdateCategory}
            onDelete={handleDeleteCategory}
            selectedCategory={selectedCategory}
          />
          <div>
            {openFormCategory && (
              <>
                <p>{updatedCategory ? `Update Category ${updatedCategory.name}` : "New Category"}</p>
                <FormAddCategory
                  onAdd={handleAddCategory}
                  categories={categories}
                  onClose={handleCloseCategory}
                  category={updatedCategory}
                />
              </>
            )}
          </div>
        </div>
        {selectedCategory && (
          <ExpenseList
            category={selectedCategory.name}
            expenses={expenses.filter((expense) => selectedCategory.name === "*" || expense.category === selectedCategory.name)}
            onDelete={handleDeleteExpense}
          />
        )}
      </section>
      <Footer />
    </div>
  );
};

export default App;
