import { log, LogLevel } from "./LogService";

export const handleFormikFieldChange = (formikProps, format, e) => {
  const numberRegex = /number\[(\d+)-(\d+)\]/;

  const clearError = (errorName) => {
    if (formikProps.errors.hasOwnProperty(errorName)) {
      const newErrors = { ...formikProps.errors };
      delete newErrors[errorName];
      formikProps.setErrors(newErrors);
    }
  };

  // log(`${e.target.name}=[${e.target.value}]`, LogLevel.DEBUG);
  let value = e.target.value;

  if (e.target.localName === "input") {
    if (format === "alphaValue") {
      value = e.target.value.replace(/[^A-Za-z ]/g, "");
      formikProps.setFieldValue(e.target.name, value, false);
      clearError(e.target.name);
    } else if (format.match(numberRegex)) {
      value = Number(value);
      const [, minValue, maxValue] = format.match(numberRegex);
      if (e.target.value === "" || (value >= minValue && value <= maxValue)) {
        formikProps.setFieldValue(e.target.name, e.target.value === "" ? "" : value, false);
        clearError(e.target.name);
      } else formikProps.setFieldError(e.target.name, `(*) between ${minValue} and ${maxValue}`);
    }
  } else if (e.target.localName === "select") {
    formikProps.setFieldValue(e.target.name, value, false);
    clearError(e.target.name);
  }
};

export const handleFormikFieldBlur = ({ handleBlur }, callback, e) => {
  handleBlur(e); //!\ important
  log(`${e.target.name} value changed to ${e.target.value}`, LogLevel.DEBUG);
  callback(e);
};
