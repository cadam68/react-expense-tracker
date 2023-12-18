import PropTypes from "prop-types";
import Expense from "./Expense";
import { useEffect, useState } from "react";
import { sortExpensesBy } from "../services/ExpensesService";
import Button from "./Button";
import expense from "./Expense";

const ExpenseList = ({ expenses, onDelete }) => {
  const [expenseList, setExpenseList] = useState(expenses);
  const [orderBy, setOrderBy] = useState("date");
  const [searchBy, setSearchBy] = useState("");

  useEffect(() => {
    setExpenseList(sortExpensesBy(expenses, orderBy));
  }, [expenses]);

  useEffect(() => {
    setExpenseList((expenseList) => sortExpensesBy(expenseList, orderBy));
  }, [orderBy]);

  const handleSearchBy = (e) => {
    const searchByValue = e.target.value.toUpperCase().replace(/[^A-Za-z ]/g, "");
    setSearchBy(searchByValue);
    setExpenseList(
      sortExpensesBy(
        expenses.filter((expense) => expense.description.toUpperCase().includes(searchByValue)),
        orderBy
      )
    );
  };

  const handleOrderBy = (e) => setOrderBy(e.target.value);

  return (
    <div className={"expense-list"}>
      <p>Expenses List</p>
      <p className={"card expense-list-searchbar"}>
        <span className="input-big">
          <input value={searchBy} type="text" placeholder="Search... " onChange={handleSearchBy} />
        </span>
        <select onChange={handleOrderBy} value={orderBy}>
          <option value="date">By Date</option>
          <option value="description">By Description</option>
          <option value="amount">By Amount</option>
        </select>
      </p>
      <p className={"card expense-list-items"}>
        <ul>
          {expenseList.map((expense, i) => (
            <Expense expense={expense} num={i + 1} onDelete={onDelete} key={expense.id} />
          ))}
        </ul>
      </p>
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
