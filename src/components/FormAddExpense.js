import { useDebugContext } from "../contexts/DebugContext";
import { log, LogLevel } from "../services/LogService";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { handleFormikFieldChange, handleFormikFieldBlur } from "../services/Helper";
import FieldDatePicker from "./FieldDatePicker";
import S from "string";
import { useRef } from "react";
import PropTypes from "prop-types";
import Button from "./Button";
import Hover from "./Hover";

const FormAddExpense = ({ onAdd, categories }) => {
  const { debug } = useDebugContext();
  const fieldRefs = useRef({});

  const initialValues = {
    date: new Date(),
    category: "",
    description: "",
    amount: 0,
  };

  // Validation function
  const validate = (values) => {
    log(`values : ${JSON.stringify(values)}`, LogLevel.DEBUG);
    const errors = {};
    if (!values.category) errors.category = "(*) choose an option";
    if (!values.description || values.description.trim().length <= 3) errors.description = "(*) a description is required";
    if (!values.amount || +values.amount <= 0) errors.amount = "(*) must be more than 0";
    if (Object.keys(errors).length !== 0) {
      const fieldName = Object.keys(errors)[0];
      if (fieldRefs.current[fieldName]) fieldRefs.current[fieldName].focus();
      log(`errors : ${JSON.stringify(errors)}`, LogLevel.DEBUG);
    }
    return errors;
  };

  const handleSubmit = (values, { resetForm }) => {
    log(`do submit: value=${JSON.stringify(values)}`, LogLevel.DEBUG);
    onAdd(values.date, values.category, values.description, +values.amount);
    // After submitting the form, reset it to initial values
    resetForm({ values: { ...values, description: "", amount: 0 } });
    // set the focus on the field description
    if (fieldRefs.current["description"]) fieldRefs.current["description"].focus();
  };

  return (
    <section>
      <p>New Expense</p>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
        validateOnChange={false} // Disable validation on field change
        validateOnBlur={false} // Disable validation on blur
      >
        {(formikProps) => (
          <Form className={"form-expense-add" + (debug ? " debug" : "")}>
            <Hover caption={"When did you spend the money ?"}>
              <FieldDatePicker className={"input-small "} fieldName="date" fieldRefs />
            </Hover>
            <span>
              <Hover caption={"What is it related to ?"}>
                <Field
                  as="select"
                  name={"category"}
                  className={formikProps.errors.hasOwnProperty("category") ? "error" : ""}
                  onChange={handleFormikFieldChange.bind(this, formikProps, null)}
                  innerRef={(el) => (fieldRefs.current["category"] = el)}
                >
                  <option value="" disabled hidden>
                    Choose an Category
                  </option>
                  {categories
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
                    .map(({ name, id }) => (
                      <option value={name} key={id}>
                        {S(name).capitalize().s}
                      </option>
                    ))}
                </Field>
              </Hover>
              <ErrorMessage name="category" component="span" className={"errorMessage"} />
            </span>
            <span className={"input-big"}>
              <Hover caption={"Enter the name of the shop, location ..."}>
                <Field
                  type={"text"}
                  name={"description"}
                  placeholder={"Description"}
                  className={formikProps.errors.hasOwnProperty("category") ? "error" : ""}
                  onChange={handleFormikFieldChange.bind(this, formikProps, "alpha[45]")}
                  onBlur={handleFormikFieldBlur.bind(this, formikProps, (e) => {
                    formikProps.setFieldValue(e.target.name, S(e.target.value).capitalize().trim().s, false);
                  })}
                  innerRef={(el) => (fieldRefs.current["description"] = el)}
                />
                <ErrorMessage name="description" component="span" className={"errorMessage"} />
              </Hover>
            </span>
            <span>
              <Hover caption={"How much is it ?"}>
                <Field
                  type={"number"}
                  name={"amount"}
                  className={"input-small " + (formikProps.errors.hasOwnProperty("category") ? "error" : "")}
                  onChange={handleFormikFieldChange.bind(this, formikProps, "number[0-2000]")}
                  onBlur={handleFormikFieldBlur.bind(this, formikProps, (e) => {
                    formikProps.setFieldValue(e.target.name, Number(e.target.value).toFixed(2), false);
                  })}
                  innerRef={(el) => (fieldRefs.current["amount"] = el)}
                />
                <ErrorMessage name="amount" component="span" className={"errorMessage"} />
              </Hover>
            </span>
            <Hover caption={"Record the expense :)"}>
              <Button type={"submit"}>Add Expense</Button>
            </Hover>
          </Form>
        )}
      </Formik>
    </section>
  );
};

FormAddExpense.propTypes = {
  onAdd: PropTypes.func,
  categories: PropTypes.array,
};

FormAddExpense.defaultProps = {
  onAdd: () => {},
  categories: [],
};

export default FormAddExpense;
