import { generateColorPalette } from "./services/Helper";

export const settings = {
  maxCategories: 6,
  amountHigh: 30,
  version: 3.0,
  palette: generateColorPalette(6),
  passphrase: process.env.REACT_APP_PASSPHRASE || "passphrase",
  apiKey: process.env.REACT_APP_API_KEY || "apiKey",
  baseApiUrl: process.env.REACT_APP_API_URL || "http://localhost:5001",
  basicDataReferences: ["users", "countries", "products"], // exemple of implementation
  availableLanguages: { fr: "🇫🇷", en: "🇺🇸", de: "🇩🇪", es: "🇪🇸" },
  appName: "expenses",
};
