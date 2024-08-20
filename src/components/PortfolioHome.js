import React, { memo, useEffect } from "react";
import styles from "./Portfolio.module.css";
import { Helmet } from "react-helmet";
import Header from "./portfolio/Header";
import Footer from "./portfolio/Footer";
import { Outlet } from "react-router-dom";
import { changeTheme, themes } from "../services/Helper";

const PortfolioHome = () => {
  useEffect(() => {
    changeTheme({
      colorLightest: themes.light.colorLightest,
      colorLight: themes.light.colorLight,
      colorMedium: themes.light.colorMedium,
      colorDark: themes.light.colorDark,
      colorBackground: themes.light.colorBackground,
      fontFamily: themes.light.fontFamily,
    });
  }, []);

  return (
    <>
      <Header />
      <section className={styles.largeContainer}>
        <Helmet>
          <title>In-Line Portfolio</title>
          <meta
            name="description"
            content="In-Line is a dynamic and innovative company dedicated to providing high-quality and cutting-edge technology products to our valued customers across the globe."
          />
          <meta name="keywords" content="Innovative technology, Customer-focused, High-quality products, Global tech solutions" />
        </Helmet>
        <Outlet />
      </section>
      <Footer />
    </>
  );
};

export default memo(PortfolioHome);
