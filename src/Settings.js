import { generateColorPalette } from "./services/Helper";

export const settings = {
  maxCategories: 6,
  amountHigh: 30,
  version: 2.4,
  palette: generateColorPalette(6),
  passphrase: process.env.REACT_APP_PASSPHRASE || "passphrase",
  apiKey: process.env.REACT_APP_API_KEY || "apiKey",
  baseApiUrl: process.env.REACT_APP_API_URL || "http://localhost:5001",
  downloadReferences: [
    { id: "about-me", lg: "fr", type: "video", target: "firebase://AdamCyrilMoiMesValeurs.mp4" },
    { id: "thierry-wagner", lg: "en", type: "video", target: "https://vimeo.com/953134033" },
    { id: "thierry-wagner", lg: "fr", type: "video", target: "https://vimeo.com/953131039" },
    { id: "thierry-wagner", lg: "de", type: "video", target: "https://vimeo.com/953132280" },
    { id: "hobby", lg: null, type: "video", target: "https://youtu.be/9MaqsyzG2W0" },
    { id: "cv", lg: "en", type: "file", target: "firebase://CyrilAdamFullStack-EN.pdf" },
    { id: "cv", lg: "de", type: "file", target: "firebase://CyrilAdamFullStack-DE.pdf" },
    { id: "linkedin", lg: null, type: "url", target: "https://www.linkedin.com/in/cyril-adam" },
  ],
  availableLanguages: { fr: "🇫🇷", en: "🇺🇸", de: "🇩🇪", es: "🇪🇸" },
};
