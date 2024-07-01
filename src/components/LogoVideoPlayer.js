import { useLocation, useNavigate } from "react-router-dom";
import Hover from "./Hover";
import Button from "./Button";
import { useDebugContext } from "../contexts/DebugContext";
import { settings } from "../Settings";
import useComponentTranslation from "../hooks/useComponentTranslation";

const Logo = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { admin } = useDebugContext();
  const { i18n, t } = useComponentTranslation("Logo");

  return (
    <header className={"video-header"}>
      <div>
        <h2>@yril Portfolio</h2>
        <h6>— Innovator. Problem Solver. Team Player —</h6>
      </div>

      <div className={"floatingBanner"}>
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
      </div>
    </header>
  );
};

export default Logo;
