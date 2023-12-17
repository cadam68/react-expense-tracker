import { useEffect, useState } from "react";
import { useDebugContext } from "./contexts/DebugContext";
import { log, LogLevel } from "./services/LogService";
import { initialExpenses, ExpensesService } from "./services/ExpensesService";
import { initialCategories, CategoriesService } from "./services/CategoriesService";

import Logo from "./components/Logo";
import FormAddExpense from "./components/FormAddExpense";
import UseLocalStorageState from "./hooks/UseLocalStorageState";
import Stats from "./components/Stats";
import CategoryList from "./components/CategoryList";
import Button from "./components/Button";
import ExpenseList from "./components/ExpenseList";
import FormAddCategory from "./components/FormAddCategory";

const App = () => {
  const { debug, toggleDebug, setLogLevel } = useDebugContext();
  const { expenses, addExpense, updateExpensesByCategory, removeExpense, removeExpensesByCategory, clearExpenses } = ExpensesService(
    UseLocalStorageState("expense-tracker-expenses", initialExpenses)
  );
  const { categories, setCategories, addCategory, updateCategory, removeCategory, clearCategories } = CategoriesService(
    UseLocalStorageState("expense-tracker-categories", initialCategories)
  );
  const [showAddCategory, setShowAddCategory] = useState(false);
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

  const handleShowAddCategory = () => {
    if (selectedCategory && !showAddCategory) setSelectedCategory(null); // close the selection form
    setShowAddCategory((showAddCategory) => !showAddCategory);
    setUpdatedCategory(null);
  };

  const handleAddCategory = (id, name, budget) => {
    if (id == null) addCategory(name, budget);
    else {
      if (updatedCategory.name !== name || updatedCategory.budget !== budget) {
        updateExpensesByCategory(updatedCategory.name, name);
        const res = updateCategory(updatedCategory.id, name, budget);
        if (selectedCategory) setSelectedCategory(res);
      }
    }
    setShowAddCategory(false);
  };

  const handleSelectCategory = (category) => {
    log(JSON.stringify(category) + " is selected", LogLevel.DEBUG);
    setSelectedCategory((selectedCategory) => (selectedCategory?.id === category.id ? null : category));
    setShowAddCategory(false); // close the add friend form
  };

  const handleDeleteCategory = (category) => {
    log(JSON.stringify(category) + " is deleted", LogLevel.DEBUG);
    removeCategory(category.id);
    removeExpensesByCategory(category.name);
    setSelectedCategory(null);
  };

  const handleUpdateCategory = (category) => {
    setUpdatedCategory(category);
    setShowAddCategory(true);
  };

  const handleDeleteExpense = (expense) => {
    console.log(expense);
    removeExpense(expense);
  };

  return (
    <div className={"container" + (debug ? " debug" : "")}>
      <Logo />
      <FormAddExpense onAdd={addExpense} categories={categories} />
      <div className={"main" + (debug ? " debug" : "")}>
        <div className={"sidebar" + (debug ? " debug" : "")}>
          <CategoryList
            categories={categories}
            onSelection={handleSelectCategory}
            onUpdate={handleUpdateCategory}
            onDeletion={handleDeleteCategory}
            selectedCategory={selectedCategory}
          />
          {showAddCategory && <FormAddCategory onAdd={handleAddCategory} categories={categories} category={updatedCategory} />}
          <Button onClick={handleShowAddCategory}>{showAddCategory ? "Close" : "Add"} Category</Button>
        </div>
        {selectedCategory && (
          <ExpenseList expenses={expenses.filter((expense) => expense.category === selectedCategory.name)} onDelete={handleDeleteExpense} />
        )}
      </div>
      <Stats categories={categories} expenses={expenses} clearExpenses={clearExpenses} clearCategories={clearCategories} />
    </div>
  );
};

export default App;
