import { settings } from "../Settings";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const Footer = () => {
  const { i18n, t } = useTranslation();
  const [randomProverb, setRandomProverb] = useState("");

  useEffect(() => {
    const proverbs = t("footer_proverbs", { returnObjects: true });
    setRandomProverb(proverbs[Math.floor(Math.random() * proverbs.length)]);
  }, [i18n.resolvedLanguage]);

  return (
    <footer className={"footer"}>
      {new Date().getFullYear()}/{settings.version} Ⓒopyright Ⓒyril | {`"${randomProverb}"`}
    </footer>
  );
};

export default Footer;
