import { settings } from "../Settings";
import useComponentTranslation from "../hooks/useComponentTranslation";
import { useEffect, useState } from "react";

const Footer = () => {
  const { i18n, t } = useComponentTranslation(Footer.name);
  const [randomProverb, setRandomProverb] = useState("");

  useEffect(() => {
    const proverbs = t("proverbs", { returnObjects: true });
    setRandomProverb(proverbs[Math.floor(Math.random() * proverbs.length)]);
  }, [i18n.resolvedLanguage]);

  return (
    <footer className={"footer"}>
      {new Date().getFullYear()}/{settings.version} Ⓒopyright Ⓒyril | {`"${randomProverb}"`}
    </footer>
  );
};

export default Footer;
