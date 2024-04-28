import { useEffect } from "react";
import { changeTheme, themes } from "../services/Helper";
import { useSettingsContext } from "../contexts/SettingsContext";
import BuyMeACafeService from "../services/BuyMeACafeService";
import Button from "../components/Button";
import { useToast } from "../contexts/ToastContext";

function AboutPage() {
  const { themeId } = useSettingsContext();
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
      <h1>Buy me a cafe...</h1>
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
    </section>
  );
}

export default AboutPage;
