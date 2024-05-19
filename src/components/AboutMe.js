import styles from "../pages/BuyMeACafePage.module.css";

const AboutMe = () => {
  return (
    <div className={styles.aboutMe}>
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
      </p>
      <p>Cheers to innovation and thank you for your support!</p>
    </div>
  );
};

export default AboutMe;
