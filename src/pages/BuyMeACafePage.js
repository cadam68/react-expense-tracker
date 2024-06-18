import { useEffect } from "react";
import { changeTheme, themes } from "../services/Helper";
import { useSettingsContext } from "../contexts/SettingsContext";
import BuyMeACafeService from "../services/BuyMeACafeService";
import Button from "../components/Button";
import { useToast } from "../contexts/ToastContext";
import styles from "./BuyMeACafePage.module.css";
import { useDebugContext } from "../contexts/DebugContext";
import { Helmet } from "react-helmet";
import useComponentTranslation from "../hooks/useComponentTranslation";

function AboutPage() {
  const { themeId } = useSettingsContext();
  const { debug, admin } = useDebugContext();
  const { supporters, isLoading, error, testAdd } = BuyMeACafeService();
  const { Toast } = useToast();
  const { Trans, t } = useComponentTranslation(AboutPage.name);

  useEffect(() => {
    if (themeId !== 0) changeTheme(themes[Object.keys(themes)[themeId]]);
  }, [themeId]);

  useEffect(() => {
    if (error?.length) Toast.error(error);
  }, [error]);

  return (
    <section>
      <Helmet>
        <title>Expense Tracker - {t("title")}</title>
        <meta
          name="description"
          content="Learn more about the creator of this expense tracker and support the development of this application. Buy me a coffee to keep this project going!"
        />
        <meta name="keywords" content="support us, buy me a coffee, support developer, expense tracker creator, support project" />
      </Helmet>
      <div className={styles.container}>
        <p>{t("text_me")}</p>
        <p>
          <Trans i18nKey="text_more" components={[<a href="https://github.com/cadam68/react-expense-tracker" target="_blank"></a>]} />
        </p>
        <p>
          {t("text_support")}
          <br />
          {t("text_thanks")}
        </p>
      </div>
      {admin && (
        <div>
          <Button onClick={testAdd} disabled={isLoading}>
            Add
          </Button>
          <ul>
            {supporters.map((supporter) => (
              <li key={supporter.id}>
                <p>
                  Supporter : {supporter.name} - {supporter.firstname}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default AboutPage;
