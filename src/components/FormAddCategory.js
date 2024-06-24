import { useRef } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useDebugContext } from "../contexts/DebugContext";
import { Log } from "../services/LogService";
import { handleFormikFieldChange, handleFormikFieldBlur } from "../services/Helper";
import S from "string";
import PropTypes from "prop-types";
import Button from "./Button";
import Hover from "./Hover";
import { useAppContext } from "../contexts/AppContext";
import useShortcut from "../hooks/UseShortcut";
import useComponentTranslation from "../hooks/useComponentTranslation";

const logger = Log("FormAddCategory");

const FormAddCategory = ({ onAdd, onClose, category }) => {
  const { i18n, t, Trans } = useComponentTranslation("FormAddCategory");
  const { debug } = useDebugContext();
  const {
    categoriesService: { categories },
    confirmService: { requestConfirm },
  } = useAppContext();

  // shortcuts
  useShortcut("Ctrl+H", "help-category", async () => {
    await requestConfirm(
      <div className={"popup"}>
        <h4>{t("popup_helpTitle")}</h4>
        <div>
          <Trans i18nKey="popup_helpContent" components={[<br />]} />
        </div>
      </div>,
      []
    );
  });

  /*
  const previousCategory = useRef(null); // persist during renders

  const FormikValuesWatcher = () => {
    const { resetForm } = useFormikContext();

    useEffect(() => {
      if (category && previousCategory && previousCategory.current !== category.name) {
        logger.debug(`category has changed from ${previousCategory.current} to ${category.name}...`);
        // reset the form
        resetForm({
          values: {
            id: category.id,
            name: category.name,
            budget: category.budget === null ? "" : category.budget,
          },
        });
        previousCategory.current = category.name;
      }
    }, [category]);

    return null; // or render any UI components if needed
  };
   */

  const fieldRefs = useRef({});

  const initialValues = {
    id: category ? category.id : null,
    name: category ? category.name : "",
    budget: category ? (category.budget === null ? "" : category.budget) : "",
  };

  const validate = (values) => {
    logger.debug(`values : ${JSON.stringify(values)}`);
    const errors = {};
    if (!values.name || values.name.trim().length < 3) errors.name = i18n.t("lb_isRequiered", { name: "name" });
    if (categories.some((category) => S(category.name).equalsIgnoreCase(values.name) && category.id !== values.id)) errors.name = i18n.t("lb_alreadyUsed");
    if (values.budget && +values.budget <= 0) errors.budget = i18n.t("lb_mustBeMoreThan", { value: 0 }); // note the budget could be null
    if (Object.keys(errors).length !== 0) {
      const fieldName = Object.keys(errors)[0];
      if (fieldRefs.current[fieldName]) fieldRefs.current[fieldName].focus();
      logger.debug(`errors : ${JSON.stringify(errors)}`);
    }
    return errors;
  };

  const handleSubmit = (values, { resetForm }) => {
    logger.debug(`do submit: value=${JSON.stringify(values)}`);
    onAdd(values.id, values.name, values.budget === "" ? null : +values.budget);
    // After submitting the form, reset it to initial values
    resetForm({ values: initialValues });
    if (fieldRefs.current["name"]) fieldRefs.current["name"].focus();
  };

  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit} validateOnChange={false} validateOnBlur={false}>
      {(formikProps) => (
        <Form className={"form-category-add" + (debug ? " debug" : "")}>
          <label htmlFor="name">{i18n.t("lb_Name")}</label>
          <span>
            <Hover caption={t("caption_categoryName")}>
              <Field
                type={"text"}
                name={"name"}
                onChange={handleFormikFieldChange.bind(this, formikProps, "alpha[25]")}
                onBlur={handleFormikFieldBlur.bind(this, formikProps, (e) => {
                  formikProps.setFieldValue(e.target.name, S(e.target.value).capitalize().trim().s, false);
                })}
                innerRef={(el) => (fieldRefs.current["name"] = el)}
              />
            </Hover>
            <ErrorMessage name="name" component="span" className={"errorMessage"} />
          </span>
          <label htmlFor="budget">{i18n.t("lb_Budget")}</label>
          <span>
            <Hover caption={t("caption_budget")}>
              <Field
                type={"number"}
                name={"budget"}
                className={"input-small " + (formikProps.errors.hasOwnProperty("category") ? "error" : "")}
                onChange={handleFormikFieldChange.bind(this, formikProps, "number[0-2000]")}
                onBlur={handleFormikFieldBlur.bind(this, formikProps, (e) => {
                  if (e.target.value === "") return;
                  formikProps.setFieldValue(e.target.name, Number(e.target.value).toFixed(2), false);
                })}
                innerRef={(el) => (fieldRefs.current["budget"] = el)}
              />
            </Hover>
            <ErrorMessage name="budget" component="span" className={"errorMessage"} />
          </span>
          <span>
            <Button className={"button button-small"} type={"submit"}>
              {i18n.t("lb_Save")}
            </Button>
            <Button className={"button-outline button-small"} onClick={onClose}>
              {i18n.t("lb_Close")}
            </Button>
          </span>
          {/* <FormikValuesWatcher /> */}
        </Form>
      )}
    </Formik>
  );
};

FormAddCategory.propTypes = {
  onAdd: PropTypes.func,
  onClose: PropTypes.func,
  category: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape({})]),
};

FormAddCategory.defaultProps = {
  onAdd: () => {},
  onClose: () => {},
  category: {},
};

export default FormAddCategory;
