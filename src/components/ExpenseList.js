import Expense from "./Expense";
import { useEffect, useState } from "react";
import { sortExpensesBy } from "../services/ExpensesService";

const ExpenseList = ({ expenses, onDelete }) => {
  const [expenseList, setExpenseList] = useState(expenses);
  const [orderBy, setOrderBy] = useState();

  useEffect(() => {
    setExpenseList(sortExpensesBy(expenses, orderBy));
  }, [expenses]);

  return (
    <div>
      <h3>Expenses List</h3>
      <ul>
        <li>
          <button onClick={() => setExpenseList((expenseList) => sortExpensesBy(expenseList, "date"))}>Date</button>
          <button onClick={() => setExpenseList((expenseList) => sortExpensesBy(expenseList, "description"))}>Description</button>
          <button onClick={() => setExpenseList((expenseList) => sortExpensesBy(expenseList, "amount"))}>Amount</button>
        </li>
        {expenseList.map((expense) => (
          <Expense expense={expense} onDelete={onDelete} key={expense.id} />
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;
