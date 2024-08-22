import { memo, useState } from "react";
import { useDebugContext } from "../contexts/DebugContext";

import FormAddExpense from "../components/expense/FormAddExpense";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

const HomePage = () => {
  const { debug } = useDebugContext();
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className={"main-box" + (debug ? " debug" : "")}>
      <Header setSelectedCategory={setSelectedCategory} />
      <FormAddExpense />
      <Outlet context={{ selectedCategory, setSelectedCategory }} />
    </div>
  );
};

export default memo(HomePage);
