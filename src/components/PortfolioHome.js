import React, { memo } from "react";
import styles from "./Portfolio.module.css";
import { Helmet } from "react-helmet";

const PortfolioHome = () => {
  return (
    <section className={styles.container + " debug"}>
      <Helmet>
        <title>Cyril Adam - Professional Portfolio</title>
        <meta name="description" content="Learn more about the creator of this expense tracker and support the development of this application." />
        <meta name="keywords" content="expense tracker, track expenses, personal finance, finance management" />
      </Helmet>
      <h2>List of available portfolio...</h2>
    </section>
  );
};

export default memo(PortfolioHome);
