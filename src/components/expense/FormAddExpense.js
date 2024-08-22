import { useDebugContext } from "../../contexts/DebugContext";
import { Log } from "../../services/LogService";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { handleFormikFieldChange, handleFormikFieldBlur, capitalizeAfterPeriod, setFieldRefValue } from "../../services/Helper";
import FieldDatePicker from "./../divers/FieldDatePicker";
import S from "string";
import { memo, useCallback, useRef } from "react";
import Button from "./../divers/Button";
import Hover from "./../divers/Hover";
import { useAppContext } from "../../contexts/AppContext";
import { useToast } from "../../contexts/ToastContext";
import useShortcutContext from "../../hooks/UseShortcutContext";
import useShortcut from "../../hooks/UseShortcut";
import useComponentTranslation from "../../hooks/useComponentTranslation";

const logger = Log("FormAddExpense");

const FormAddExpense = () => {
  const { i18n, t, Trans } = useComponentTranslation("FormAddExpense");
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
      <div className={"popup"}>
        <h4>{t("popup_helpTitle")}</h4>
        <div>
          <Trans i18nKey="popup_helpContent" components={[<br />]} />
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
  const validate = useCallback(
    (values) => {
      logger.debug(`values : ${JSON.stringify(values)}`);
      const errors = {};
      const categoryNames = categories.map((item) => item.name);
      if (!categoryNames.includes(values.category)) values.category = undefined;
      if (!values.category) errors.category = i18n.t("lb_chooseOption");
      if (!values.description || values.description.trim().length <= 3) errors.description = i18n.t("lb_isRequiered", { name: "description" });
      if (!values.amount || +values.amount <= 0) errors.amount = i18n.t("lb_mustBeMoreThan", { value: 0 });
      if (Object.keys(errors).length !== 0) {
        const fieldName = Object.keys(errors)[0];
        if (fieldRefs.current[fieldName]) fieldRefs.current[fieldName].focus();
        logger.debug(`errors : ${JSON.stringify(errors)}`);
      }
      return errors;
    },
    [categories]
  );

  const handleSubmit = useCallback(
    (values, { resetForm }) => {
      try {
        const amount = +values.amount;
        logger.debug(`do submit: value=${JSON.stringify(values)}`);
        addExpense(values.date, values.category, values.description, amount);
        Toast.info(t("msg_expenseAdded", { name: values.category }));
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
      <p>{t("txt_newExpense")}</p>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
        validateOnChange={false} // Disable validation on field change
        validateOnBlur={false} // Disable validation on blur
      >
        {(formikProps) => (
          <Form className={"form-expense-add" + (debug ? " debug" : "")}>
            <Hover caption={t("caption_date")}>
              <FieldDatePicker className={"input-small "} fieldName="date" fieldRefs />
            </Hover>
            <span>
              <Hover caption={t("caption_category")}>
                <Field
                  as="select"
                  name={"category"}
                  className={formikProps.errors.hasOwnProperty("category") ? "error" : ""}
                  onChange={handleFormikFieldChange.bind(this, formikProps, null)}
                  innerRef={(el) => (fieldRefs.current["category"] = el)}
                >
                  <option value="" disabled hidden>
                    {t("txt_chooseCategory")}
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
              <Hover caption={t("caption_description")}>
                <Field
                  type={"text"}
                  name={"description"}
                  placeholder={i18n.t("lb_Description")}
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
              <Hover caption={t("caption_amount")}>
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
            <Hover caption={t("caption_addExpense")}>
              <Button type={"submit"}>{t("txt_addExpense")}</Button>
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
