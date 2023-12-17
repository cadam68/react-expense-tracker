import PropTypes from "prop-types";
import Expense from "./Expense";
import { useEffect, useState } from "react";
import { sortExpensesBy } from "../services/ExpensesService";

const ExpenseList = ({ expenses, onDelete }) => {
  const [expenseList, setExpenseList] = useState(expenses);
  const [orderBy, setOrderBy] = useState("date");

  useEffect(() => {
    setExpenseList(sortExpensesBy(expenses, orderBy));
  }, [expenses]);

  useEffect(() => {
    setExpenseList((expenseList) => sortExpensesBy(expenseList, orderBy));
  }, [orderBy]);

  return (
    <div>
      <h3>Expenses List</h3>
      <ul>
        <li>
          <button onClick={() => setOrderBy("date")}>Date</button>
          <button onClick={() => setOrderBy("description")}>Description</button>
          <button onClick={() => setOrderBy("amount")}>Amount</button>
        </li>
        {expenseList.map((expense) => (
          <Expense expense={expense} onDelete={onDelete} key={expense.id} />
        ))}
      </ul>
    </div>
  );
};

ExpenseList.propTypes = {
  expenses: PropTypes.array.isRequired,
  onDelete: PropTypes.func,
};

ExpenseList.defaultProps = {
  onDelete: () => {},
};

export default ExpenseList;
