import { Log } from "./LogService";
import { settings } from "../Settings";
import useComponentTranslation from "../hooks/useComponentTranslation";

/*
Usage : const { categories, setCategories, addCategory, ... } = CategoriesService(UseLocalStorageState("expense-tracker-categories", CategoriesService.getInitialCategories()));
*/

const logger = Log("CategoriesService");

const CategoriesService = (useState) => {
  const { i18n } = useComponentTranslation();

  const getInitialCategories = () => [
    { id: crypto.randomUUID(), name: i18n.t("lb_Food"), budget: 300, totalExpenses: 0, color: settings.palette[0] },
    { id: crypto.randomUUID(), name: i18n.t("lb_Shopping"), budget: 200, totalExpenses: 0, color: settings.palette[1] },
    { id: crypto.randomUUID(), name: i18n.t("lb_Car"), budget: 200, totalExpenses: 0, color: settings.palette[2] },
    { id: crypto.randomUUID(), name: i18n.t("lb_Divers"), budget: null, totalExpenses: 0, color: settings.palette[3] },
  ];

  const [categories, setCategories] = useState;

  const createCategory = (name, budget, id = crypto.randomUUID()) => {
    return { id, name, budget, totalExpenses: 0, color: settings.palette[categories?.length - 1] };
  };

  const addCategory = (name, budget) => {
    const newCategory = createCategory(name, budget);
    logger.debug(`add newCategory : ${JSON.stringify(newCategory)}`);
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id, name, budget) => {
    const updatedCategory = { ...categories.find((category) => category.id === id), name: name, budget: budget };
    logger.debug(`update category[i] : ${JSON.stringify(categories.find((category) => category.id === id))} to ${JSON.stringify(updatedCategory)}`);
    setCategories(categories.map((category) => (category.id === id ? updatedCategory : category)));
    return updatedCategory;
  };

  const removeCategory = (id) => {
    const updatedCategories = [...categories].filter((category) => category.id !== id);
    setCategories(updatedCategories);
  };

  const clearCategories = () => {
    setCategories([]);
  };

  const sortBy = (orderBy) => {
    logger.debug(`sort categories by ${orderBy}`);
    const updatedCategories = [...categories].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    setCategories(() => updatedCategories);
  };

  return { getInitialCategories, categories, setCategories, addCategory, updateCategory, removeCategory, clearCategories, sortBy };
};

export { CategoriesService };
