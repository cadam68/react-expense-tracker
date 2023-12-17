import PropTypes from "prop-types";
import Expense from "./Expense";
import { useEffect, useState } from "react";
import { sortExpensesBy } from "../services/ExpensesService";
import Button from "./Button";

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
          <Button onClick={() => setOrderBy("date")}>Date</Button>
          <Button onClick={() => setOrderBy("description")}>Description</Button>
          <Button onClick={() => setOrderBy("amount")}>Amount</Button>
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
