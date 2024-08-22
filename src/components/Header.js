import { sprintf } from "sprintf-js";
import { useDebugContext } from "../contexts/DebugContext";
import { Log, LogLevel, setLogLevel } from "../services/LogService";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Button from "./divers/Button";
import ExpensesPdfDocument from "./expense/ExpensesPdfDocument";
import PropTypes from "prop-types";
import { memo, useEffect, useRef, useState } from "react";
import Hover from "./divers/Hover";
import { useSettingsContext } from "../contexts/SettingsContext";
import { sortExpensesBy } from "../services/ExpensesService";
import { format, parse, startOfDay } from "date-fns";
import { changeTheme, getLastExpenseDate, themes } from "../services/Helper";
import S from "string";
import { useAppContext } from "../contexts/AppContext";
import CryptoJS from "crypto-js";
import { settings } from "../Settings";
import { useLocation, useNavigate } from "react-router-dom";
import useShortcut from "../hooks/UseShortcut";
import useComponentTranslation from "../hooks/useComponentTranslation";

const logger = Log("Header");

const Header = ({ setSelectedCategory }) => {
  const { i18n, t, Trans } = useComponentTranslation("Header");
  const { debug, toggleDebug, admin } = useDebugContext();
  const { resetBasicData, themeId, setThemeId, toogleShowCharts } = useSettingsContext();
  const {
    categoriesService: { categories, clearCategories },
    expensesService: { expenses, clearExpensesByMonth, setExpensesCategories },
    confirmService: { requestConfirm },
  } = useAppContext();

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef([
    // new Audio("/sounds/AlanisMorissetteKingofPain.mp3"),
    // new Audio("/sounds/CountingCrowsMrJones.mp3"),
    // new Audio("/sounds/4NonBlondesWhatsUp.mp3"),
    // new Audio("/sounds/DisturbedDontTellMe.mp3"),
    // new Audio("/sounds/LostLinkinPark.mp3"),
    // new Audio("/sounds/NothingLastsForeverVisionAtlantis.mp3"),
  ]);
  const navigate = useNavigate();
  const location = useLocation();

  const totalExpenses = categories.reduce((acc, el) => acc + el.totalExpenses, 0);
  const totalBudget = categories.reduce((acc, el) => acc + (el.budget ? el.budget : el.totalExpenses), 0);

  useEffect(() => {
    [...Array(audioRef.current.length).keys()].forEach((i) => (audioRef.current[i].onended = () => setIsPlaying(false)));
    if (themeId !== 0) changeTheme(themes[Object.keys(themes)[themeId]]);
  }, [themeId]);

  const text = sprintf(t("text_spendResume"), totalExpenses, (totalExpenses * 100) / totalBudget, expenses.length);
  const themesNames = t("themes", { returnObjects: true });

  const playAudio = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      audioRef.current[Math.floor(Math.random() * audioRef.current.length)].play().catch((error) => console.error("Audio playback failed", error));
    }
  };

  const handleChangeTheme = () => {
    const nextThemeId = (themeId + 1) % Object.keys(themes).length;
    changeTheme(themes[Object.keys(themes)[nextThemeId]]);
    setThemeId(nextThemeId);
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = async (event) => handleImportData(event.target.result);
    reader.readAsText(file); // Read the uploaded file as text
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.target.classList.remove("isDroppable");
    const file = event.dataTransfer.files[0]; // Get the dropped file
    handleFile(file);
  };

  const handlerClearExpenses = async () => {
    let dateRef = format(getLastExpenseDate(expenses, false), "MMM yyyy");
    if (
      await requestConfirm(
        <p>
          <Trans i18nKey="popup_deleteExpensesConfirmation" components={[<strong />, <strong />]} values={{ date: dateRef }} />
        </p>,
        [
          { label: i18n.t("lb_No"), value: false },
          { label: i18n.t("lb_Yes"), value: true },
        ]
      )
    ) {
      clearExpensesByMonth(dateRef);
    }
  };

  const handleClearCategories = async () => {
    if (
      await requestConfirm(
        <p style={{ color: "red" }}>
          <Trans i18nKey="popup_deleteAllDataConfirmation" components={[<strong />, <strong />]} />
        </p>,
        [
          { label: i18n.t("lb_No"), value: false },
          { label: i18n.t("lb_Yes"), value: true },
        ]
      )
    ) {
      clearCategories();
    }
  };

  const handleExportData = () => {
    const data = {
      expenses: expenses.map((item) => ({
        id: item.id,
        date: format(item.date, "MM-dd-yyyy"),
        category: item.category,
        description: item.description,
        amount: item.amount,
      })),
      categories: categories.map((item) => ({ id: item.id, name: item.name, budget: item.budget, color: item.color })),
      date: format(new Date(), "MM-dd-yyyy hh:mm"),
    };
    const jsonData = JSON.stringify(data);
    const encryptedData = CryptoJS.AES.encrypt(jsonData, settings.passphrase).toString();
    const blob = new Blob([encryptedData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `expense-tracker_data_${format(new Date(), "yyyyMMdd")}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportData = async (encryptedData) => {
    try {
      const decryptedData = CryptoJS.AES.decrypt(encryptedData, settings.passphrase).toString(CryptoJS.enc.Utf8); // Decrypt the data
      const data = JSON.parse(decryptedData);

      data.date = parse(data.date, "MM-dd-yyyy hh:mm", new Date());
      if (data.date === undefined || !data.expenses?.length || !data.categories?.length) throw new Error();
      if (
        await requestConfirm(
          <p>
            <Trans i18nKey="popup_loadConfirmation" components={[<strong />]} values={{ nb: data.expenses.length, date: format(data.date, "dd MMM yyyy") }} />
          </p>,
          [
            { label: i18n.t("lb_No"), value: false },
            { label: i18n.t("lb_Yes"), value: true },
          ]
        )
      ) {
        logger.debug("loading data...");
        const updateExpenses = data.expenses.map((item) => ({
          id: item.id,
          date: startOfDay(parse(item.date, "MM-dd-yyyy", new Date())),
          category: item.category,
          description: item.description,
          amount: +item.amount,
        }));
        const updatedCategories = data.categories.map((item) => ({
          id: item.id,
          name: item.name,
          budget: +item.budget,
          totalExpenses: updateExpenses.filter((expense) => expense.category === item.name).reduce((acc, el) => acc + el.amount, 0),
          color: item.color,
        }));
        setExpensesCategories(updateExpenses, updatedCategories);
        await requestConfirm(<p>{t("popup_loadSucceed", { nb: updateExpenses.length })} 👍</p>, [{ label: i18n.t("lb_Close") }]);
      }
    } catch (error) {
      await requestConfirm(
        <p style={{ color: "red", display: "inline-flex", alignItems: "center" }}>
          <span style={{ fontSize: "2.5rem" }}>⚠️</span>️ {t("popup_loadError")}
        </p>,
        [{ label: i18n.t("lb_Close") }]
      );
    }
  };

  const handleListExpenses = () => {
    setSelectedCategory((selectedCategory) => (selectedCategory?.name === "*" ? null : { name: "*" }));
  };

  const handleShowCharts = () => {
    toogleShowCharts();
    navigate(`/app/${location.pathname === "/app/expenses" ? "charts" : "expenses"}`);
  };

  // Shortcuts
  useShortcut("Ctrl+T", "change-theme", handleChangeTheme);
  useShortcut("Ctrl+C", "change-theme", handleShowCharts);
  useShortcut("Ctrl+X", "change-theme", handleExportData);

  return (
    <nav className={"nav" + (debug ? " debug" : "")}>
      <p>
        {location.pathname === "/app/charts" ? (
          <span className={"text-middle"}>{text}</span>
        ) : (
          <Hover caption={t("caption_listExpenses")}>
            <Button onClick={handleListExpenses} className="button-shadow">
              {text}
            </Button>
          </Hover>
        )}
      </p>
      <p>
        <Hover caption={t("caption_print")}>
          <PDFDownloadLink
            className={"button button-small"}
            document={<ExpensesPdfDocument categories={categories} expenses={sortExpensesBy(expenses, "date-category")} />}
            fileName={`expenses-${format(new Date(), "yyyyMMdd")}.pdf`}
          >
            {({ blob, url, loading, error }) => (loading ? t("text_loading") : <Button className={"button-small"}>{i18n.t("lb_Print")}</Button>)}
          </PDFDownloadLink>
        </Hover>
        <Hover caption={location.pathname === "/app/charts" ? t("caption_ExpensesList") : t("caption_ExpensesCharts")}>
          <Button className={"button-outline button-small" + (location.pathname === "/app/charts" ? " selected" : "")} onClick={handleShowCharts}>
            {location.pathname === "/app/expenses" ? i18n.t("lb_Charts") : i18n.t("lb_Expenses")}
          </Button>
        </Hover>
        {admin && (
          <Button
            className={"button-outline button-small"}
            onClick={() => {
              resetBasicData();
              toggleDebug();
              setLogLevel(LogLevel.DEBUG);
            }}
          >
            Debug {debug ? "OFF" : "ON"}{" "}
          </Button>
        )}
        <Hover caption={t("caption_deleteExpenses")}>
          <Button className={"button-outline button-small"} secured={true} onClick={handlerClearExpenses}>
            {t("text_deleteExpenses")}
          </Button>
        </Hover>
        {admin && (
          <Hover caption={t("caption_deleteCategories")}>
            <Button className={"button-outline button-small"} secured={true} onClick={handleClearCategories}>
              {t("text_deleteCategories")}
            </Button>
          </Hover>
        )}
        <Hover caption={t("caption_changeTheme", { name: themesNames[(themeId + 1) % themesNames.length] })}>
          <Button className={"button-outline button-small"} onClick={handleChangeTheme}>
            {themesNames[themeId]}
          </Button>
        </Hover>
        {false && (
          <Hover caption={t("caption_playMusic")}>
            <Button className={"button-outline button-small" + (isPlaying ? " disabled" : "")} onClick={playAudio}>
              <span>🎵</span>
            </Button>
          </Hover>
        )}
        <Hover caption={t("caption_exportData")}>
          <Button className={"button-outline button-small"} onClick={handleExportData}>
            {t("text_exportData")}
          </Button>
        </Hover>
        <Hover caption={t("caption_importData")} visible>
          <span
            style={{ display: "inline-block" }}
            className={"button-outline button-small dragging"}
            onDragOver={(event) => {
              event.preventDefault();
              if (!event.target.classList.contains("isDroppable")) event.target.classList.add("isDroppable");
            }}
            onDragLeave={(event) => {
              event.target.classList.remove("isDroppable");
            }}
            onDrop={handleDrop}
          >
            {t("text_importData")}
          </span>
        </Hover>
      </p>
    </nav>
  );
};

Header.propTypes = {
  setSelectedCategory: PropTypes.func,
};

Header.defaultProps = {
  setSelectedCategory: () => {},
};

export default memo(Header);
