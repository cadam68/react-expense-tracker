import { useLocation, useNavigate } from "react-router-dom";
import Hover from "./divers/Hover";
import Button from "./divers/Button";
import { useDebugContext } from "../contexts/DebugContext";
import { settings } from "../Settings";
import useComponentTranslation from "../hooks/useComponentTranslation";

const Logo = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { admin } = useDebugContext();
  const { i18n, t } = useComponentTranslation("Logo");

  const enableBackHome = pathname.indexOf("/app/") === -1;
  const enableBuyMeACafeHome = pathname.indexOf("/buyMeACafe") === -1;
  const enableAboutHome = pathname.indexOf("/about") === -1;

  const handleBackHome = (e) => {
    e.preventDefault();
    if (enableBackHome) navigate("/app");
  };

  const handleBuyMeACafeHome = (e) => {
    e.preventDefault();
    if (enableBuyMeACafeHome) navigate("/buyMeACafe");
  };

  const handleAboutHome = (e) => {
    e.preventDefault();
    if (enableAboutHome) navigate("/about");
  };

  return (
    <header className={`header ${enableBackHome ? "enable" : ""}`}>
      <div onClick={handleBackHome}>
        <h1>ExpensesTracker</h1>
        <h6>{t("title_slogan")}</h6>
      </div>
      <div className={"floatingBanner"}>
        {false && (
          <Hover visible={enableAboutHome} caption={"All you want to know about me..."}>
            <Button className={`button-shadow button-big ${!enableAboutHome ? "selected" : ""}`} onClick={handleAboutHome} disabled={!enableAboutHome}>
              😀
            </Button>
          </Hover>
        )}
        <Hover caption={t("caption_changeLanguage")}>
          <Button
            className={`button-shadow button-big`}
            onClick={() => {
              const availableLanguages = Object.keys(settings.availableLanguages);
              const i = (availableLanguages.indexOf(i18n.resolvedLanguage) + 1) % availableLanguages.length;
              i18n.changeLanguage(availableLanguages[i]);
            }}
          >
            {settings.availableLanguages[i18n.resolvedLanguage]}
          </Button>
        </Hover>
        <Hover visible={enableBuyMeACafeHome} caption={t("caption_buyMeACafe")}>
          <Button className={`button-shadow button-big ${!enableBuyMeACafeHome ? "selected" : ""}`} onClick={handleBuyMeACafeHome} disabled={!enableBuyMeACafeHome}>
            ☕️
          </Button>
        </Hover>
      </div>
    </header>
  );
};

export default Logo;
