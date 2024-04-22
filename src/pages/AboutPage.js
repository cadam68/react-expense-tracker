import { useEffect } from "react";
import { changeTheme, themes } from "../services/Helper";
import { useSettingsContext } from "../contexts/SettingsContext";

function AboutPage() {
  const { themeId } = useSettingsContext();

  useEffect(() => {
    if (themeId !== 0) changeTheme(themes[Object.keys(themes)[themeId]]);
  }, [themeId]);

  return (
    <section>
      <h1>About Me...</h1>
    </section>
  );
}

export default AboutPage;
