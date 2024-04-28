import { Log } from "./LogService";
import { settings } from "../Settings";

const logger = Log("CategoriesService");

const initialCategories = [
  { id: crypto.randomUUID(), name: "Food", budget: 300, totalExpenses: 0, color: settings.palette[0] },
  { id: crypto.randomUUID(), name: "Shopping", budget: 200, totalExpenses: 0, color: settings.palette[1] },
  { id: crypto.randomUUID(), name: "Car", budget: 200, totalExpenses: 0, color: settings.palette[2] },
  { id: crypto.randomUUID(), name: "Divers", budget: null, totalExpenses: 0, color: settings.palette[3] },
];

const CategoriesService = (useState) => {
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

  return { categories, setCategories, addCategory, updateCategory, removeCategory, clearCategories, sortBy };
};

export { initialCategories, CategoriesService };
