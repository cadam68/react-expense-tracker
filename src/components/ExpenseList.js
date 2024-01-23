import PropTypes from "prop-types";
import Expense from "./Expense";
import { useEffect, useState } from "react";
import { sortExpensesBy } from "../services/ExpensesService";
import S from "string";
import Hover from "./Hover";

const ExpenseList = ({ category, expenses, onDelete }) => {
  const [expenseList, setExpenseList] = useState(expenses);
  const [orderBy, setOrderBy] = useState("date");
  const [searchBy, setSearchBy] = useState("");
  const [totalExpenseList, setTotalExpenseList] = useState();

  useEffect(() => {
    if (searchBy && expenseList) setTotalExpenseList(expenseList.reduce((acc, expense) => acc + expense.amount, 0));
    else setTotalExpenseList(null);
  }, [searchBy, expenseList]);

  useEffect(() => {
    setExpenseList(sortExpensesBy(expenses, orderBy));
    setSearchBy("");
  }, [expenses]);

  useEffect(() => {
    setExpenseList((expenseList) => sortExpensesBy(expenseList, orderBy));
  }, [orderBy]);

  const handleSearchBy = (e) => {
    const searchByValue = e.target.value
      .toUpperCase()
      .replace(/[^A-Za-z ]/g, "")
      .substring(0, 10);
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
      <p style={{ marginBottom: "2rem" }}>
        {
          S(category)
            .replace(/[^A-Za-z ]/g, "")
            .capitalize().s
        }{" "}
        Expenses List {totalExpenseList > 0 && `( Total Selected : ${totalExpenseList} € )`}
      </p>
      <p className={"card expense-list-searchbar"}>
        <span className="input-big">
          <Hover caption={"Quick search in the expenses list"}>
            <input value={searchBy} type="text" placeholder="Search... " onChange={handleSearchBy} />
          </Hover>
        </span>
        <Hover caption={"Sort the expenses by date, description or amount"}>
          <select onChange={handleOrderBy} value={orderBy}>
            <option value="date">By Date</option>
            <option value="description">By Description</option>
            <option value="amount">By Amount</option>
          </select>
        </Hover>
      </p>
      <div className={"card expense-list-items"}>
        <ul>
          {expenseList.map((expense, i) => (
            <Expense expense={expense} num={i + 1} onDelete={onDelete} key={expense.id} />
          ))}
        </ul>
      </div>
    </div>
  );
};

ExpenseList.propTypes = {
  expenses: PropTypes.array.isRequired,
  onDelete: PropTypes.func,
  category: PropTypes.string,
};

ExpenseList.defaultProps = {
  onDelete: () => {},
};

export default ExpenseList;
