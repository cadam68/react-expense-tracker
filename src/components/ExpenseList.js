import PropTypes from "prop-types";
import Expense from "./Expense";
import { memo, useEffect, useState } from "react";
import S from "string";
import Hover from "./Hover";
import { useAppContext } from "../contexts/AppContext";

const ExpenseList = ({ selectedCategory }) => {
  const {
    expensesService: { expenses, delExpense, sortExpensesBy },
  } = useAppContext();
  const [expenseList, setExpenseList] = useState([]);
  const [orderBy, setOrderBy] = useState("date");
  const [searchBy, setSearchBy] = useState("");
  const [totalExpenseList, setTotalExpenseList] = useState();

  // compute setTotalExpenseList
  useEffect(() => {
    const updatedExpenseList = expenses.filter(
      (expense) => (selectedCategory.name === "*" || expense.category === selectedCategory.name) && expense.description.toUpperCase().includes(searchBy)
    );
    if (searchBy) setTotalExpenseList(updatedExpenseList.reduce((acc, expense) => acc + expense.amount, 0).toFixed(2));
    else setTotalExpenseList(null);
    setExpenseList(sortExpensesBy(orderBy, updatedExpenseList));
  }, [searchBy, selectedCategory, expenses, orderBy, sortExpensesBy]);

  useEffect(() => {
    setSearchBy("");
  }, [expenses]);

  // sort the expenseList
  useEffect(() => {
    setExpenseList((expenseList) => sortExpensesBy(orderBy, expenseList));
  }, [orderBy, sortExpensesBy]);

  const handleSearchBy = (e) => {
    const searchByValue = e.target.value
      .toUpperCase()
      .replace(/[^A-Za-z ]/g, "")
      .substring(0, 10);
    setSearchBy(searchByValue);
  };

  const handleOrderBy = (e) => setOrderBy(e.target.value);
  const handleDelete = (expense) => {
    delExpense(expense);
  };

  return (
    <div className={"expense-list"}>
      <p style={{ marginBottom: "2rem" }}>
        {
          S(selectedCategory.name)
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
            <Expense expense={expense} num={i + 1} onDelete={handleDelete} key={expense.id} />
          ))}
        </ul>
      </div>
    </div>
  );
};

ExpenseList.propTypes = {
  selectedCategory: PropTypes.shape({}),
};

ExpenseList.defaultProps = {
  selectedCategory: null,
};

export default memo(ExpenseList);
