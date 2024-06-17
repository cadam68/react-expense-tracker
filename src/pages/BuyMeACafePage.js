import { useEffect } from "react";
import { changeTheme, themes } from "../services/Helper";
import { useSettingsContext } from "../contexts/SettingsContext";
import BuyMeACafeService from "../services/BuyMeACafeService";
import Button from "../components/Button";
import { useToast } from "../contexts/ToastContext";
import styles from "./BuyMeACafePage.module.css";
import { useDebugContext } from "../contexts/DebugContext";
import { Helmet } from "react-helmet";

function AboutPage() {
  const { themeId } = useSettingsContext();
  const { debug, admin } = useDebugContext();
  const { supporters, isLoading, error, testAdd } = BuyMeACafeService();
  const { Toast } = useToast();

  useEffect(() => {
    if (themeId !== 0) changeTheme(themes[Object.keys(themes)[themeId]]);
  }, [themeId]);

  useEffect(() => {
    if (error?.length) Toast.error(error);
  }, [error]);

  return (
    <section>
      <Helmet>
        <title>Support Us - Buy Me a Coffee</title>
        <meta
          name="description"
          content="Learn more about the creator of this expense tracker and support the development of this application. Buy me a coffee to keep this project going!"
        />
        <meta name="keywords" content="support us, buy me a coffee, support developer, expense tracker creator, support project" />
      </Helmet>
      <div className={styles.container}>
        <p>Hey there! I'm Cyril, and I've been diving into the realms of IT Development Engineering and Full Stack development since 2001.</p>
        <p>
          One of my latest creations is ExpensesTracker, a testament to my journey in web development. Curious to peek under the hood? Take a stroll through my{" "}
          <a href="https://github.com/cadam68/react-expense-tracker" target="_blank">
            GitHub repository
          </a>
          .
        </p>
        <p>
          If you find it helpful or intriguing, consider supporting my work with a cup of coffee. Your contribution fuels the continuous evolution of ExpensesTracker. <br />
          Cheers to innovation and thank you for your support!
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
