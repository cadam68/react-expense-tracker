// src/components/Header.js

import React from "react";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/images/logo.jpg" alt="In-Line Logo" />
        In-Line
      </div>
      <nav className={styles.nav}>
        <ul>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">About Us</a>
          </li>
          <li>
            <a href="#">Contact Us</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
