import React, { createContext, useContext, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { settings } from "../Settings";
import { format, startOfDay, subDays } from "date-fns";
import useLocalStorageReducer from "../hooks/UseLocalStorageReducer";
import useConfirm from "../hooks/useConfirm";
import styles from "../App.module.css";
import { Log, LogLevel } from "../services/LogService";

const logger = Log("AppContext");

const AppContext = createContext({
  expensesService: {
    expenses: [],
    clearExpensesByMonth: () => {},
    setExpensesCategories: () => {},
    addExpense: () => {},
    assignExpense: () => {},
    sortExpensesBy: () => {},
    delExpense: () => {},
  },
  categoriesService: { categories: [], clearCategories: () => {}, delCategory: () => {}, addCategory: () => {}, updateCategory: () => {}, sortCategoryBy: () => {} },
  confirmService: { requestConfirm: () => {}, ConfirmModalComponent: () => {} },
});

const initialCategories = [
  { id: crypto.randomUUID(), name: "Food", budget: 300, totalExpenses: 0, color: settings.palette[0] },
  { id: crypto.randomUUID(), name: "Shopping", budget: 200, totalExpenses: 0, color: settings.palette[1] },
  { id: crypto.randomUUID(), name: "Car", budget: 200, totalExpenses: 0, color: settings.palette[2] },
  { id: crypto.randomUUID(), name: "Divers", budget: null, totalExpenses: 0, color: settings.palette[3] },
];

const currentDate = new Date();
const initialExpenses = [
  { id: crypto.randomUUID(), date: startOfDay(currentDate), category: "Food", description: "Supermarket", amount: 10 },
  { id: crypto.randomUUID(), date: startOfDay(currentDate), category: "Food", description: "Fast food", amount: 20 },
  { id: crypto.randomUUID(), date: subDays(startOfDay(currentDate), 1), category: "Food", description: "Other", amount: 30 },
  { id: crypto.randomUUID(), date: startOfDay(currentDate), category: "Divers", description: "Amazon", amount: 10 },
  { id: crypto.randomUUID(), date: subDays(startOfDay(currentDate), 2), category: "Divers", description: "Gift", amount: 20 },
];

const initialState = { expenses: initialExpenses, categories: initialCategories };

const converter = (rawValues) => {
  //!\ dates are converted to strings because JSON doesn't have a native date type. //!\

  // expenses
  rawValues?.expenses.forEach((item) => {
    if (item.date && !isNaN(Date.parse(item.date))) item.date = startOfDay(new Date(item.date));
  });

  // categories
  const missingColors = rawValues?.categories.some((item) => !item.color);
  if (missingColors) {
    rawValues?.categories.forEach((item, i) => {
      if (!item.color) item.color = settings.palette[i];
    });
  }

  return rawValues;
};

const refreshCategories = (categories, expenses, categoryName) => {
  const updatedCategories = categories.map((category) =>
    !categoryName || (categoryName && category.name === categoryName)
      ? {
          ...category,
          totalExpenses: expenses.filter((expense) => expense.category === category.name).reduce((acc, el) => acc + el.amount, 0),
        }
      : category
  );
  return updatedCategories;
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "categories/refresh": {
      return { ...state, categories: refreshCategories(state.categories, state.expenses) };
    }

    case "categories/clearAll": {
      return { ...state, categories: [], expenses: [] };
    }

    case "categories/del": {
      const {
        category: { id: categoryId, name: categoryName },
      } = payload;
      logger.debug(`del category:name =[${categoryName}]`);
      const updatedCategories = state.categories.filter((category) => category.id !== categoryId);
      const updatedExpenses = state.expenses.filter((expense) => expense.category !== categoryName);
      return { ...state, categories: updatedCategories, expenses: updatedExpenses };
    }

    case "categories/add": {
      const { category } = payload;
      logger.debug(`add category:${JSON.stringify(category)}`);
      return { ...state, categories: [...state.categories, category] };
    }

    case "categories/update": {
      const { category, updatedCategory } = payload;
      logger.debug(`update category:${JSON.stringify(category)} to ${JSON.stringify(updatedCategory)}`);
      const updatedCategories = [...state.categories.filter((category) => category.id !== updatedCategory.id), updatedCategory];
      const updatedExpenses = state.expenses.map((expense) => (expense.category === category.name ? { ...expense, category: updatedCategory.name } : expense));
      return { ...state, categories: updatedCategories, expenses: updatedExpenses };
    }

    case "expenses/clearByMonth": {
      const { dateRef } = payload;
      const updatedExpenses = state.expenses.filter((expense) => format(expense.date, "MMM yyyy") !== dateRef);
      const updatedCategories = refreshCategories(state.categories, updatedExpenses);
      return { ...state, categories: updatedCategories, expenses: updatedExpenses };
    }

    case "expenses/add": {
      const { expense } = payload;
      logger.debug(`add expense : ${JSON.stringify(expense)}`);
      const updatedExpenses = [...state.expenses, expense];
      const updatedCategories = refreshCategories(state.categories, updatedExpenses, expense.category);
      return { ...state, categories: updatedCategories, expenses: updatedExpenses };
    }

    case "expenses/del": {
      const { expense } = payload;
      const { id: expenseId, category: expenseCategory } = expense;
      logger.debug(`del expense:${JSON.stringify(expense)}`);
      const updatedExpenses = state.expenses.filter((expense) => expense.id !== expenseId);
      const updatedCategories = refreshCategories(state.categories, updatedExpenses, expenseCategory);
      return { ...state, expenses: updatedExpenses, categories: updatedCategories };
    }

    case "expenses/assignToCategory": {
      const {
        expense: { id: expenseId, category: expenseCategoryName },
        category: { name: categoryName },
      } = payload;
      logger.debug(`assign expense:id=[${expenseId}] from category:name=[${expenseCategoryName}] to category:name=[${categoryName}]`);
      const updatedExpenses = state.expenses.map((expense) => (expense.id === expenseId ? { ...expense, category: categoryName } : expense));
      const updatedCategories = refreshCategories(state.categories, updatedExpenses);
      return { ...state, categories: updatedCategories, expenses: updatedExpenses };
    }

    case "expenses_categories/set": {
      const { categories, expenses } = payload;
      return { ...state, categories: categories, expenses: expenses };
    }

    default:
      throw new Error(`Unknown action ${type}`);
  }
};

const AppContextProvider = ({ children }) => {
  const [{ expenses, categories }, dispatch] = useLocalStorageReducer("expense-tracker-data", initialState, reducer, converter);
  const { requestConfirm, ConfirmModalComponent } = useConfirm(styles);

  useEffect(() => {
    dispatch({ type: "categories/refresh" });
  }, [dispatch]);

  const clearExpensesByMonth = (dateRef) => {
    dispatch({ type: "expenses/clearByMonth", payload: { dateRef } });
  };

  const clearCategories = () => {
    dispatch({ type: "categories/clearAll" });
  };

  const setExpensesCategories = (expenses, categories) => {
    dispatch({ type: "expenses_categories/set", payload: { expenses, categories } });
  };

  const createExpense = (date, category, description, amount) => {
    if (!amount.between(0, 2000)) {
      logger.warn(`amount value are out of valid ranges!`);
      throw new Error(`Invalid expense submitted`);
    } //!\ bug for demo purpose
    return { id: crypto.randomUUID(), date: date === null ? startOfDay(new Date()) : date, category, description, amount };
  };

  const addExpense = (date, category, description, amount) => {
    const newExpense = createExpense(startOfDay(date), category, description, amount);
    dispatch({ type: "expenses/add", payload: { expense: newExpense } });
  };

  const delExpense = (expense) => {
    dispatch({ type: "expenses/del", payload: { expense } });
  };

  const delCategory = (category) => {
    dispatch({ type: "categories/del", payload: { category } });
  };

  const assignExpense = (expense, category) => {
    dispatch({ type: "expenses/assignToCategory", payload: { expense, category } });
  };

  const createCategory = (name, budget, id = crypto.randomUUID()) => {
    return { id, name, budget, totalExpenses: 0, color: settings.palette[categories?.length - 1] };
  };

  const addCategory = (name, budget) => {
    const category = createCategory(name, budget);
    dispatch({ type: "categories/add", payload: { category } });
  };

  const updateCategory = (id, name, budget) => {
    const category = categories.find((category) => category.id === id);
    if (!category || (category.name === name && category.budget === budget)) return null;
    const updatedCategory = { ...category, name: name, budget: budget };
    dispatch({ type: "categories/update", payload: { category, updatedCategory } });
    return updatedCategory;
  };

  const sortCategoryBy = (orderBy, categoryList = categories) => {
    logger.debug(`sort categories by ${orderBy}`);
    switch (orderBy) {
      case "name":
      default: {
        return categoryList.slice().sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      }
    }
  };

  const sortExpensesBy = (orderBy, expenseList = expenses) => {
    logger.debug(`sort expenses by ${orderBy}`);
    switch (orderBy) {
      case "description": {
        return expenseList.slice().sort((a, b) => {
          if (a.description.localeCompare(b.description) !== 0) return a.description.localeCompare(b.description);
          return a.date < b.date ? 1 : -1;
        });
      }
      case "amount": {
        return expenseList.slice().sort((a, b) => {
          if (a.amount !== b.amount) return b.amount - a.amount;
          return a.date < b.date ? 1 : -1;
        });
      }
      case "date": {
        return expenseList.slice().sort((a, b) => {
          if (a.date > b.date) return -1;
          if (a.date < b.date) return 1;
          return a.description.localeCompare(b.description);
        });
      }
      case "date-category": {
        return expenseList.slice().sort((a, b) => {
          if (a.date > b.date) return -1;
          if (a.date < b.date) return 1;
          if (a.category.localeCompare(b.category) !== 0) return a.category.localeCompare(b.category);
          return a.description.localeCompare(b.description);
        });
      }
      case "chart": {
        return expenseList.slice().sort((a, b) => {
          if (a.date > b.date) return 1;
          if (a.date < b.date) return -1;
          if (a.category.localeCompare(b.category) !== 0) return a.category.localeCompare(b.category);
          return a.description.localeCompare(b.description);
        });
      }
      default: {
        return expenseList.slice().sort((a, b) => a.id.localeCompare(b.id));
      }
    }
  };

  const contextValues = useMemo(
    () => ({
      expensesService: { expenses, clearExpensesByMonth, setExpensesCategories, addExpense, assignExpense, sortExpensesBy, delExpense },
      categoriesService: { categories, clearCategories, delCategory, addCategory, updateCategory, sortCategoryBy },
      confirmService: { requestConfirm, ConfirmModalComponent },
    }),
    [expenses, categories, ConfirmModalComponent]
  ); // value is cached by useMemo

  return <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>;
};

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return context;
};

export { AppContextProvider, useAppContext };