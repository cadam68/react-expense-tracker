import { useEffect, useRef } from "react";
import { ErrorMessage, Field, Form, Formik, useFormikContext } from "formik";
import { useDebugContext } from "../contexts/DebugContext";
import { log, LogLevel } from "../services/LogService";
import { handleFormikFieldChange, handleFormikFieldBlur } from "../services/Helper";
import S from "string";
import PropTypes from "prop-types";
import Button from "./Button";

const FormAddCategory = ({ onAdd, categories, category }) => {
  const { debug } = useDebugContext();
  const previousCategory = useRef(null); // persist

  const FormikValuesWatcher = () => {
    const { resetForm } = useFormikContext();

    useEffect(() => {
      if (category && previousCategory && previousCategory.current !== category.name) {
        log(`category has changed from ${previousCategory.current} to ${category.name}...`, LogLevel.DEBUG);
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

  const fieldRefs = useRef({});

  const initialValues = {
    id: category ? category.id : null,
    name: category ? category.name : "",
    budget: category ? (category.budget === null ? "" : category.budget) : "",
  };

  const validate = (values) => {
    log(`values : ${JSON.stringify(values)}`, LogLevel.DEBUG);
    const errors = {};
    if (!values.name || values.name.trim().length <= 3) errors.name = "(*) a name is required";
    if (categories.some((category) => S(category.name).equalsIgnoreCase(values.name) && category.id !== values.id))
      errors.name = "(*) already used";
    if (values.budget && +values.budget <= 0) errors.budget = "(*) must be more than 0"; // note the budget could be null
    if (Object.keys(errors).length !== 0) {
      const fieldName = Object.keys(errors)[0];
      if (fieldRefs.current[fieldName]) fieldRefs.current[fieldName].focus();
      log(`errors : ${JSON.stringify(errors)}`, LogLevel.DEBUG);
    }
    return errors;
  };

  const handleSubmit = (values, { resetForm }) => {
    log(`do submit: value=${JSON.stringify(values)}`, LogLevel.DEBUG);
    onAdd(values.id, values.name, values.budget === "" ? null : +values.budget);
    // After submitting the form, reset it to initial values
    resetForm({ values: initialValues });
    if (fieldRefs.current["name"]) fieldRefs.current["name"].focus();
  };

  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit} validateOnChange={false} validateOnBlur={false}>
      {(formikProps) => (
        <Form className={"add-form" + (debug ? " debug" : "")}>
          <label htmlFor="name">Name</label>
          <span>
            <Field
              type={"text"}
              name={"name"}
              onChange={handleFormikFieldChange.bind(this, formikProps, "alpha[30]")}
              onBlur={handleFormikFieldBlur.bind(this, formikProps, (e) => {
                formikProps.setFieldValue(e.target.name, S(e.target.value).capitalize().trim().s, false);
              })}
              innerRef={(el) => (fieldRefs.current["name"] = el)}
              placeholder={"Name..."}
            />
            <ErrorMessage name="name" component="span" className={"errorMessage"} />
          </span>

          <label htmlFor="budget">Budget</label>
          <span>
            <Field
              type={"number"}
              name={"budget"}
              className={formikProps.errors.hasOwnProperty("category") ? "error" : ""}
              onChange={handleFormikFieldChange.bind(this, formikProps, "number[0-2000]")}
              onBlur={handleFormikFieldBlur.bind(this, formikProps, (e) => {
                if (e.target.value === "") return;
                formikProps.setFieldValue(e.target.name, Number(e.target.value).toFixed(2), false);
              })}
              innerRef={(el) => (fieldRefs.current["budget"] = el)}
            />
            <ErrorMessage name="budget" component="span" className={"errorMessage"} />
          </span>
          <Button type={"submit"}>{category ? "Update" : "Add"} Category</Button>
          <FormikValuesWatcher />
        </Form>
      )}
    </Formik>
  );
};

FormAddCategory.propTypes = {
  onAdd: PropTypes.func,
  categories: PropTypes.array,
  category: PropTypes.shape,
};

FormAddCategory.defaultProps = {
  onAdd: () => {},
  categories: [],
};

export default FormAddCategory;
