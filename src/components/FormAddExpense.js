import { useDebugContext } from "../contexts/DebugContext";
import { Log } from "../services/LogService";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { handleFormikFieldChange, handleFormikFieldBlur, capitalizeAfterPeriod, setFieldRefValue } from "../services/Helper";
import FieldDatePicker from "./FieldDatePicker";
import S from "string";
import { memo, useCallback, useRef } from "react";
import Button from "./Button";
import Hover from "./Hover";
import { useAppContext } from "../contexts/AppContext";
import { useToast } from "../contexts/ToastContext";
import useShortcutContext from "../hooks/UseShortcutContext";
import useShortcut from "../hooks/UseShortcut";

const logger = Log("FormAddExpense");

const FormAddExpense = () => {
  const { debug } = useDebugContext();
  const { Toast } = useToast();
  const fieldRefs = useRef({});
  const {
    categoriesService: { categories },
    expensesService: { addExpense },
    confirmService: { requestConfirm },
  } = useAppContext();

  // shortcuts
  const handleShortcut = (category) => {
    setFieldRefValue(fieldRefs.current["category"], category.name);
  };
  useShortcutContext(handleShortcut);

  useShortcut("Ctrl+H", "help-expenses", async () => {
    await requestConfirm(
      <div style={{ maxWidth: "50vw" }}>
        <div style={{ marginBottom: "1rem" }}>
          <h4>New Expense Form Help Page</h4>
        </div>
        <div style={{ textAlign: "left" }}>
          Please select a date, choose the category associated to the expense, enter a description and the amount.
          <br />
          Tips: Use the category shortcut to select directly the category in the drop down list.
        </div>
      </div>,
      []
    );
  });

  const initialValues = {
    date: new Date(),
    category: "",
    description: "",
    amount: 0,
  };

  // Validation function
  const validate = useCallback((values) => {
    logger.debug(`values : ${JSON.stringify(values)}`);
    const errors = {};
    if (!values.category) errors.category = "(*) choose an option";
    if (!values.description || values.description.trim().length <= 3) errors.description = "(*) a description is required";
    if (!values.amount || +values.amount <= 0) errors.amount = "(*) must be more than 0";
    if (Object.keys(errors).length !== 0) {
      const fieldName = Object.keys(errors)[0];
      if (fieldRefs.current[fieldName]) fieldRefs.current[fieldName].focus();
      logger.debug(`errors : ${JSON.stringify(errors)}`);
    }
    return errors;
  }, []);

  const handleSubmit = useCallback(
    (values, { resetForm }) => {
      try {
        const amount = +values.amount;
        logger.debug(`do submit: value=${JSON.stringify(values)}`);
        addExpense(values.date, values.category, values.description, amount);
        Toast.info(`Expenses added to category ${values.category}`);
        // After submitting the form, reset it to initial values
        resetForm({ values: { ...values, description: "", amount: 0 } });
        // set the focus on the field description
        if (fieldRefs.current["description"]) fieldRefs.current["description"].focus();
      } catch (err) {
        logger.fatal(err.message);
      }
    },
    [addExpense]
  );

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
                  onChange={handleFormikFieldChange.bind(this, formikProps, "alphaNum[45]")}
                  onBlur={handleFormikFieldBlur.bind(this, formikProps, (e) => {
                    formikProps.setFieldValue(e.target.name, capitalizeAfterPeriod(e.target.value).trim(), false);
                  })}
                  innerRef={(el) => (fieldRefs.current["description"] = el)}
                />
              </Hover>
              <ErrorMessage name="description" component="span" className={"errorMessage"} />
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
              </Hover>
              <ErrorMessage name="amount" component="span" className={"errorMessage"} />
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

FormAddExpense.propTypes = {};

FormAddExpense.defaultProps = {};

export default memo(FormAddExpense);
