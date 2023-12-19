import { log, LogLevel } from "./LogService";
import { startOfDay, subDays } from "date-fns";

const currentDate = new Date();
const initialExpenses = [
  { id: crypto.randomUUID(), date: startOfDay(currentDate), category: "food", description: "supermarket", amount: 10 },
  { id: crypto.randomUUID(), date: startOfDay(currentDate), category: "food", description: "mac donald", amount: 20 },
  { id: crypto.randomUUID(), date: subDays(startOfDay(currentDate), 1), category: "food", description: "other", amount: 30 },
  { id: crypto.randomUUID(), date: startOfDay(currentDate), category: "divers", description: "udemy", amount: 10 },
  { id: crypto.randomUUID(), date: subDays(startOfDay(currentDate), 2), category: "divers", description: "udemy", amount: 20 },
  { id: crypto.randomUUID(), date: startOfDay(currentDate), category: "food", description: "mac donald", amount: 20 },
  { id: crypto.randomUUID(), date: startOfDay(currentDate), category: "food", description: "mac donald", amount: 20 },
  { id: crypto.randomUUID(), date: startOfDay(currentDate), category: "food", description: "mac donald", amount: 20 },
  { id: crypto.randomUUID(), date: startOfDay(currentDate), category: "food", description: "mac donald", amount: 20 },
  { id: crypto.randomUUID(), date: startOfDay(currentDate), category: "food", description: "mac donald", amount: 20 },
  { id: crypto.randomUUID(), date: startOfDay(currentDate), category: "food", description: "mac donald", amount: 20 },
  { id: crypto.randomUUID(), date: startOfDay(currentDate), category: "food", description: "mac donald", amount: 20 },
  { id: crypto.randomUUID(), date: startOfDay(currentDate), category: "food", description: "mac donald", amount: 20 },
  { id: crypto.randomUUID(), date: startOfDay(currentDate), category: "food", description: "mac donald", amount: 20 },
  { id: crypto.randomUUID(), date: startOfDay(currentDate), category: "food", description: "mac donald", amount: 20 },
  { id: crypto.randomUUID(), date: startOfDay(currentDate), category: "food", description: "mac donald", amount: 20 },
  { id: crypto.randomUUID(), date: startOfDay(currentDate), category: "food", description: "mac donald", amount: 20 },
  { id: crypto.randomUUID(), date: startOfDay(currentDate), category: "food", description: "mac donald", amount: 20 },
  { id: crypto.randomUUID(), date: startOfDay(currentDate), category: "food", description: "mac donald", amount: 20 },
  { id: crypto.randomUUID(), date: startOfDay(currentDate), category: "food", description: "mac donald", amount: 20 },
];

const ExpensesService = (useState) => {
  const [expenses, setExpenses] = useState;

  const createExpense = (date, category, description, amount) => {
    return { id: crypto.randomUUID(), date: date === null ? startOfDay(new Date()) : date, category, description, amount };
  };

  const addExpense = (date, category, description, amount) => {
    const newExpense = createExpense(date, category, description, amount);
    log(`add newExpense : ${JSON.stringify(newExpense)}`, LogLevel.DEBUG);
    setExpenses([...expenses, newExpense]);
  };

  const updateExpensesByCategory = (prevCategoryName, newCategoryName) => {
    const updatedExpenses = expenses.map((expense) =>
      expense.category === prevCategoryName ? { ...expense, category: newCategoryName } : expense
    );
    setExpenses(updatedExpenses);
  };

  const removeExpense = ({ id }) => {
    const updatedExpenses = [...expenses].filter((expense) => expense.id !== id);
    setExpenses(updatedExpenses);
  };

  const removeExpensesByCategory = (categoryName) => {
    const updatedExpenses = [...expenses].filter((expense) => expense.category !== categoryName);
    setExpenses(updatedExpenses);
  };

  const clearExpenses = () => {
    setExpenses([]);
  };

  return { expenses: expenses, addExpense, updateExpensesByCategory, removeExpense, removeExpensesByCategory, clearExpenses };
};

const sortExpensesBy = (expenses, orderBy) => {
  if (orderBy === "description")
    return expenses.slice().sort((a, b) => {
      if (a.description.localeCompare(b.description) !== 0) return a.description.localeCompare(b.description);
      return a.date < b.date ? 1 : -1;
    });
  if (orderBy === "amount")
    return expenses.slice().sort((a, b) => {
      if (a.amount !== b.amount) return b.amount - a.amount;
      return a.date < b.date ? 1 : -1;
    });
  if (orderBy === "date")
    return expenses.slice().sort((a, b) => {
      if (a.date > b.date) return -1;
      if (a.date < b.date) return 1;
      return a.description.localeCompare(b.description);
    });
  if (orderBy === "date-category")
    return expenses.slice().sort((a, b) => {
      if (a.date > b.date) return -1;
      if (a.date < b.date) return 1;
      if (a.category.localeCompare(b.category) !== 0) return a.category.localeCompare(b.category);
      return a.description.localeCompare(b.description);
    });
  return expenses.slice().sort((a, b) => a.id.localeCompare(b.id));
};

export { initialExpenses, ExpensesService, sortExpensesBy };
