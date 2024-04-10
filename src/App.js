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
import { useBasicDataContext } from "./contexts/BasicDataContext";
import ExpensesChart from "./components/ExpensesChart";
import useConfirm from "./hooks/useConfirm";
import styles from "./App.module.css";
import { format, parse, startOfDay } from "date-fns";
import { getLastExpenseDate } from "./services/Helper";
import CryptoJS from "crypto-js";

const App = () => {
  const { debug, toggleDebug, setLogLevel, toggleAdmin } = useDebugContext();
  const {
    expenses,
    setExpenses,
    addExpense,
    updateExpensesByCategory,
    removeExpense,
    removeExpensesByCategory,
    clearExpenses,
    assignExpenseCategory,
  } = ExpensesService(UseLocalStorageState("expense-tracker-expenses", initialExpenses));
  const { categories, setCategories, addCategory, updateCategory, removeCategory, clearCategories } = CategoriesService(
    UseLocalStorageState("expense-tracker-categories", initialCategories),
  );
  const [openFormCategory, setOpenFormCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatedCategory, setUpdatedCategory] = useState(null);
  const [showCharts, setShowCharts] = UseLocalStorageState("expense-tracker-view", false);
  const { firstTime } = useBasicDataContext();
  const { requestConfirm, ConfirmModalComponent, handleResponse } = useConfirm(styles);

  useEffect(() => {
    window.toggleDebug = toggleDebug;
    window.setLogLevel = setLogLevel;
    window.toggleAdmin = toggleAdmin;
    console.log("Thanks for using my webapp :)\n\nLooking for a Full Stack Developer ?\nFell free to contact me!\n\ncyril.adam@yahoo.fr");

    if (firstTime)
      (async () => {
        await requestConfirm(
          <div>
            <h2>Welcome to ExpensesTracker!</h2>
            <p>This is your first visit. Enjoy exploring...</p>
          </div>,
          [{ label: "Close", value: true }],
        );
      })();
  }, []);

  /*
  useEffect(() => {
    log(`debug is ${debug ? "on" : "off"}`);
  }, [debug]);
   */

  useEffect(() => {
    // expenses.forEach((expense, i) => console.log(`expense[${i}]` + JSON.stringify(expense)));
    setCategories(
      categories.map((category) => ({
        ...category,
        totalExpenses: expenses.filter((expense) => expense.category === category.name).reduce((acc, el) => acc + el.amount, 0),
      })),
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

  const handleDeleteCategory = async (category) => {
    if (
      await requestConfirm(
        <p>
          Do you want to <strong>delete</strong> category '{category.name}' and all related expenses ?
        </p>,
      )
    ) {
      log(JSON.stringify(category) + " is deleted", LogLevel.DEBUG);
      removeCategory(category.id);
      removeExpensesByCategory(category.name);
      setSelectedCategory(null);
    }
  };

  const handleUpdateCategory = (category) => {
    setUpdatedCategory(category);
    setOpenFormCategory(true);
    setSelectedCategory(null); /* optional */
  };

  const handleDeleteExpense = (expense) => {
    removeExpense(expense);
  };

  const handleCloseCategory = () => {
    setOpenFormCategory(false);
  };

  const handleExpenseDrop = (expenseId, categoryName) => {
    assignExpenseCategory(expenseId, categoryName);
  };

  const toogleShowCharts = () => {
    setShowCharts((value) => !value);
  };

  const handlerClearExpenses = async () => {
    let dateRef = format(getLastExpenseDate(expenses, false), "MMM yyyy");
    if (
      await requestConfirm(
        <p>
          Do you want to <strong>delete all expenses</strong> from <strong>{dateRef}</strong> ?
        </p>,
      )
    )
      clearExpenses();
  };

  const handleExportData = () => {
    const data = {
      expenses: expenses.map((item) => ({
        id: item.id,
        date: format(item.date, "MM-dd-yyyy"),
        category: item.category,
        description: item.description,
        amount: item.amount,
      })),
      categories: categories.map((item) => ({ id: item.id, name: item.name, budget: item.budget, color: item.color })),
      date: format(new Date(), "MM-dd-yyyy hh:mm"),
    };
    const jsonData = JSON.stringify(data);
    const encryptedData = CryptoJS.AES.encrypt(jsonData, settings.passphrase).toString();
    const blob = new Blob([encryptedData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `expense-tracker_data_${format(new Date(), "yyyyMMdd")}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportData = async (encryptedData) => {
    try {
      const decryptedData = CryptoJS.AES.decrypt(encryptedData, settings.passphrase).toString(CryptoJS.enc.Utf8); // Decrypt the data
      const data = JSON.parse(decryptedData);

      data.date = parse(data.date, "MM-dd-yyyy hh:mm", new Date());
      if (data.date === undefined || !data.expenses?.length || !data.categories?.length) throw new Error();
      if (
        await requestConfirm(
          <p>
            Do you want to load the {data.expenses.length} expense(s) from <strong>{format(data.date, "dd MMM yyyy")}</strong> ?
          </p>,
        )
      ) {
        log("loading data...", LogLevel.DEBUG);
        const updateExpenses = data.expenses.map((item) => ({
          id: item.id,
          date: startOfDay(parse(item.date, "MM-dd-yyyy", new Date())),
          category: item.category,
          description: item.description,
          amount: +item.amount,
        }));
        const updatedCategories = data.categories.map((item) => ({
          id: item.id,
          name: item.name,
          budget: +item.budget,
          totalExpenses: updateExpenses.filter((expense) => expense.category === item.name).reduce((acc, el) => acc + el.amount, 0),
          color: item.color,
        }));
        setCategories(updatedCategories);
        setExpenses(updateExpenses);
        await requestConfirm(<p>{updateExpenses.length} expense(s) imported 👍</p>, [{ label: "Ok" }]);
      }
    } catch (error) {
      await requestConfirm(
        <p style={{ color: "red", display: "inline-flex", alignItems: "center" }}>
          <span style={{ fontSize: "2.5rem" }}>⚠️</span>️ Invalid or corrupted file !
        </p>,
        [{ label: "Ok" }],
      );
    }
  };

  const handleClearCategories = async () => {
    if (
      await requestConfirm(
        <p style={{ color: "red" }}>
          Do you <strong>really </strong> want to <strong>delete all categories & expenses</strong> data ?
        </p>,
      )
    )
      clearCategories();
  };

  return (
    <div className={"container" + (debug ? " debug" : "")}>
      {ConfirmModalComponent}
      <Logo />
      <Header
        categories={categories}
        expenses={expenses}
        clearExpenses={handlerClearExpenses}
        clearCategories={handleClearCategories}
        setSelectedCategory={setSelectedCategory}
        toogleShowCharts={toogleShowCharts}
        showCharts={showCharts}
        importData={handleImportData}
        exportData={handleExportData}
      />
      <FormAddExpense onAdd={addExpense} categories={categories} />
      {showCharts ? (
        <section className={"main-box" + (debug ? " debug" : "")}>
          <ExpensesChart expenses={expenses} categories={categories} />
        </section>
      ) : (
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
      )}
      <Footer />
    </div>
  );
};

export default App;
