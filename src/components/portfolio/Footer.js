// src/components/Footer.js

import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h4>About In-Line</h4>
          <p>
            <em>In-Line</em> is a dynamic and innovative company dedicated to providing high-quality and cutting-edge technology products to our valued customers across the globe.
          </p>
        </div>
        <div className={styles.footerSection}>
          <h4>Quick Links</h4>
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
        </div>
        <div className={styles.footerSection}>
          <h4>Contact Us</h4>
          <p>
            <strong>Phone:</strong> +33 (0)6 51 72 23 39
          </p>
          <p>
            <strong>Email:</strong> info@in-line.fr
          </p>
          <p>
            <strong>Address:</strong> 19A rue Rogg Haas, Sierentz, France
          </p>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; 2024 In-Line Global. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
