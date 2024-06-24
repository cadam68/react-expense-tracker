import Hover from "../components/Hover";
import Button from "../components/Button";
import CategoryList from "../components/CategoryList";
import FormAddCategory from "../components/FormAddCategory";
import ExpenseList from "../components/ExpenseList";
import { useDebugContext } from "../contexts/DebugContext";
import { settings } from "../Settings";
import { useState } from "react";
import { Log } from "../services/LogService";
import { useAppContext } from "../contexts/AppContext";
import { useOutletContext } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { Helmet } from "react-helmet";
import useComponentTranslation from "../hooks/useComponentTranslation";

const logger = Log("ExpensesPage");

const ExpensesPage = () => {
  const { selectedCategory, setSelectedCategory } = useOutletContext(); // <-- access context value
  const { Toast } = useToast();
  const { i18n, Trans, t } = useComponentTranslation("ExpensesPage");

  const { debug } = useDebugContext();
  const {
    categoriesService: { categories, delCategory, addCategory, updateCategory },
    expensesService: { assignExpense },
    confirmService: { requestConfirm },
  } = useAppContext();

  const [openFormCategory, setOpenFormCategory] = useState(false);
  const [updatedCategory, setUpdatedCategory] = useState(null);

  const handleOpenFormCategory = () => {
    if (selectedCategory && !openFormCategory) setSelectedCategory(null); // close the selection form
    setOpenFormCategory((showAddCategory) => !showAddCategory);
    setUpdatedCategory(null);
  };

  const handleAddCategory = (id, name, budget) => {
    if (id == null) {
      Toast.info(t("msg_categoryAdded"), { name });
      addCategory(name, budget);
    } else if (updatedCategory.name !== name || updatedCategory.budget !== budget) {
      const res = updateCategory(updatedCategory.id, name, budget);
      if (selectedCategory) setSelectedCategory(res);
    }
    setOpenFormCategory(false);
  };

  const handleSelectCategory = (category) => {
    logger.debug(JSON.stringify(category) + " is selected");
    setSelectedCategory((selectedCategory) => (selectedCategory?.id === category.id ? null : category));
    setOpenFormCategory(false); // close the add friend form
  };

  const handleDeleteCategory = async (category) => {
    if (
      await requestConfirm(
        <p>
          <Trans i18nKey="text_deleteConfirmation" components={[<strong />]} values={{ category: category.name }} />
        </p>,
        [
          { label: i18n.t("lb_No"), value: false },
          { label: i18n.t("lb_Yes"), value: true },
        ]
      )
    ) {
      logger.debug(JSON.stringify(category) + " is deleted");
      Toast.warn(t("msg_categoryDeleted", { name: category.name }));
      delCategory(category);
      setSelectedCategory(null);
    }
  };

  const handleUpdateCategory = (category) => {
    setUpdatedCategory(category);
    setOpenFormCategory(true);
    setSelectedCategory(null); /* optional */
  };

  const handleCloseCategory = () => {
    setOpenFormCategory(false);
  };

  const handleExpenseDrop = (expense, category) => {
    assignExpense(expense, category);
  };

  return (
    <section className={"sidebar" + (debug ? " debug" : "")}>
      <Helmet>
        <title>Expense Tracker - {t("title")}</title>
        <meta
          name="description"
          content="Manage your expenses effortlessly with our expense tracker. Create categories, track expenses, and perform detailed searches. Start organizing your finances today!"
        />
        <meta name="keywords" content="expense tracker, track expenses, personal finance, finance management" />
      </Helmet>
      <div className={"category-list" + (debug ? " debug" : "")}>
        <p className={"space-between"}>
          <span>{i18n.t("lb_Categories")}</span>
          <Hover caption={t("caption_addCategories", { maxCategories: settings.maxCategories })}>
            <Button className={"button button-small" + (openFormCategory || categories.length >= settings.maxCategories ? " disabled" : "")} onClick={handleOpenFormCategory}>
              {t("btn_addCategory")}
            </Button>
          </Hover>
        </p>
        <CategoryList
          onSelection={handleSelectCategory}
          onUpdate={handleUpdateCategory}
          onDelete={handleDeleteCategory}
          onExpenseDrop={handleExpenseDrop}
          selectedCategory={selectedCategory}
        />
        <div>
          {openFormCategory && (
            <>
              <p>{updatedCategory ? t("text_updateCategory", { name: updatedCategory.name }) : t("text_newCategory")}</p>
              <FormAddCategory
                key={updatedCategory?.id} // <-----/!\ force reset state for every new key value
                onAdd={handleAddCategory}
                onClose={handleCloseCategory}
                category={updatedCategory}
              />
            </>
          )}
        </div>
      </div>
      {selectedCategory && <ExpenseList selectedCategory={selectedCategory} />}
    </section>
  );
};
export default ExpensesPage;
