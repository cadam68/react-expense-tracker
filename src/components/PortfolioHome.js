import React, { memo } from "react";
import styles from "./Portfolio.module.css";
import { Helmet } from "react-helmet";
import Header from "./portfolio/Header";
import AboutUs from "./portfolio/AboutUs";
import ContactUs from "./portfolio/ContactUs";
import Footer from "./portfolio/Footer";

const PortfolioHome = () => {
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
        <AboutUs />
      </section>
      <Footer />
    </>
  );
};

export default memo(PortfolioHome);
