import PropTypes from "prop-types";
import Expense from "./Expense";
import { memo, useEffect, useState } from "react";
import S from "string";
import Hover from "./Hover";
import { useAppContext } from "../contexts/AppContext";
import useComponentTranslation from "../hooks/useComponentTranslation";

const ExpenseList = ({ selectedCategory }) => {
  const { t } = useComponentTranslation("ExpenseList");
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
        {totalExpenseList > 0 ? t("text_titleWithTotal", { value: totalExpenseList }) : t("text_title")}
      </p>
      <p className={"card expense-list-searchbar"}>
        <span className="input-big">
          <Hover caption={t("caption_searchBy")}>
            <input value={searchBy} type="text" placeholder={t("placeHolder_searchBy")} onChange={handleSearchBy} />
          </Hover>
        </span>
        <Hover caption={t("caption_orderBy")}>
          <select onChange={handleOrderBy} value={orderBy}>
            <option value="date">{t("text_orderByDate")}</option>
            <option value="description">{t("text_orderByDescription")}</option>
            <option value="amount">{t("text_orderByAmount")}</option>
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
