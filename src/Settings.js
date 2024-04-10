import { generateColorPalette } from "./services/Helper";

export const settings = {
  maxCategories: 6,
  amountHigh: 30,
  palette: generateColorPalette(6),
  passphrase: process.env.REACT_APP_PASSPHRASE || "secret passphrase",
};
