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
