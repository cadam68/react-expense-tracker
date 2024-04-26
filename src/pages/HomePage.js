import { memo, useState } from "react";
import { useDebugContext } from "../contexts/DebugContext";

import FormAddExpense from "../components/FormAddExpense";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import { ToastProvider } from "../contexts/ToastContext";
import ToastContainer from "../components/ToastContainer";

const HomePage = () => {
  const { debug } = useDebugContext();
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <ToastProvider>
      <div className={"main-box" + (debug ? " debug" : "")}>
        <ToastContainer />
        <Header setSelectedCategory={setSelectedCategory} />
        <FormAddExpense />
        <Outlet context={{ selectedCategory, setSelectedCategory }} />
      </div>
    </ToastProvider>
  );
};

export default memo(HomePage);
