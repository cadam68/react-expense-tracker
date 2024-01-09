import { log, LogLevel } from "./LogService";

export const handleFormikFieldChange = (formikProps, format, e) => {
  const numberRegex = /number\[(\d+)-(\d+)]/;
  const alphaRegex = /alpha\[(\d+)]/;
  const alphaNumRegex = /alphaNum\[(\d+)]/;

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
    if (format.match(alphaRegex)) {
      const [, maxLength] = format.match(alphaRegex);
      value = e.target.value.replace(/[^A-Za-z., ]/g, "").substring(0, maxLength);
      formikProps.setFieldValue(e.target.name, value, false);
      clearError(e.target.name);
    } else if (format.match(alphaNumRegex)) {
      const [, maxLength] = format.match(alphaNumRegex);
      value = e.target.value.replace(/[^A-Za-z0-9., ]/g, "").substring(0, maxLength);
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

// Function to change the filter property of the ::before pseudo-element
// Usage : changeBeforeFilter('hue-rotate(180deg) saturate(1.5)');
export const changeBeforeFilter = (filterValue) => {
  // Check if the style element already exists
  const styleId = "custom-filter-style";
  let style = document.getElementById(styleId);

  // If it doesn't exist, create a new style tag
  if (!style) {
    style = document.createElement("style");
    style.type = "text/css";
    style.id = styleId;
    document.head.appendChild(style);
  }

  // Add the CSS for the .container::before selector with the new filter value
  style.innerHTML = `.container::before { filter: ${filterValue}; }`;
};

export const changeTheme = (newTheme) => {
  // Access the root element
  const root = document.documentElement;
  const randomPalette = generateColorPalette();

  // Change the CSS custom properties
  root.style.setProperty("--color-lightest", newTheme ? newTheme.colorLightest : randomPalette[0]);
  root.style.setProperty("--color-light", newTheme ? newTheme.colorLight : randomPalette[1]);
  root.style.setProperty("--color-medium", newTheme ? newTheme.colorMedium : randomPalette[2]);
  root.style.setProperty("--color-dark", newTheme ? newTheme.colorDark : randomPalette[3]);
};

const generateColorPalette = () => {
  let palette = [];
  for (let i = 0; i < 4; i++) {
    // Generate a hue value (i * 90 ensures even distribution across the color wheel)
    let hue = (i * 90 + Math.floor(360 * Math.random())) % 360; // This will give us 4 colors spread evenly across the color wheel
    // Set saturation and lightness values
    let saturation = 80; // Saturation at 70%
    let lightness = 80; // Lightness at 50%
    // Construct HSL color string
    let color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    // Add color to the palette
    palette.push(color);
  }
  return palette;
};

export const themes = {
  light: {
    colorLightest: "#fff4e6",
    colorLight: "#ffe8cc",
    colorMedium: "#ffa94d",
    colorDark: "#ff922b",
  },
  dark: {
    colorLightest: "#f8f9fa",
    colorLight: "#e9ecef",
    colorMedium: "#ced4da",
    colorDark: "#adb5bd",
  },
  sun: {
    colorLightest: "#f4f4f8",
    colorLight: "#e6e6ea",
    colorMedium: "#fed766",
    colorDark: "#2ab7ca",
  },
  random: null,
};

export const capitalizeAfterPeriod = (inputString) => {
  inputString = inputString.trim().replace(/\s+/g, " ").replace(/\s\./g, ".");
  return inputString.charAt(0).toUpperCase() + inputString.slice(1).replace(/\.\s[a-z]/g, (match) => match.toUpperCase());
};
