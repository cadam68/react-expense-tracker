import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import { FaArrowTrendUp } from "react-icons/fa6";
import PortfolioLink from "./PortfolioLink";
import { FetchService } from "../../services/FetchService";
import SpinnerFullPage from "../SpinnerFullPage";

const sortAndLimitItems = (items, limit = 100) => {
  // Shuffle both VIP and non-VIP items
  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };
  // Separate VIP and non-VIP items
  const vipItems = items.filter((item) => item.vip);
  const nonVipItems = items.filter((item) => !item.vip);
  shuffle(nonVipItems);

  // Insert all VIP items within the first 100 positions
  const insertionLimit = Math.min(limit - vipItems.length, nonVipItems.length);
  const combinedItems = nonVipItems.slice(0, insertionLimit);

  // Merge VIP items into the selected portion of non-VIP items
  combinedItems.push(...vipItems);
  shuffle(combinedItems);

  // Combine the shuffled part with the rest of the non-VIP items
  const result = combinedItems.concat(nonVipItems.slice(insertionLimit));

  return result;
};

const Home = () => {
  const [portfolio, setPortfolio] = useState();
  const [inputValues, setInputValues] = useState({
    searchCriteria: "",
  });

  const handleInputChange = (e, regex) => {
    const { name, value } = e.target;
    let upperValue = value.toUpperCase();
    if (regex.test(upperValue)) {
      setInputValues({
        ...inputValues,
        [name]: upperValue,
      });
    }
  };

  const fetchPortfolio = async (controller) => {
    const signal = controller.signal;
    try {
      const data = await FetchService().fetchPortfolio(signal);
      // console.log(`portfolio : ${JSON.stringify(data)}`);
      setPortfolio(sortAndLimitItems(data));
    } catch (err) {
      if (err.name === "AbortError") console.log("fetch portfolio aborted!");
      else console.log(err.message);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    let isFetching = true;

    fetchPortfolio(controller).finally(() => {
      isFetching = false;
    });

    // Cleanup function to abort fetch when `query` changes
    return () => {
      if (isFetching) controller.abort();
    };
  }, []);

  if (!portfolio) return <SpinnerFullPage />;

  return (
    <div className={styles.aboutUs}>
      <div className={styles.banner}>
        <img src="/images/BannerHome.jpg" alt="Home Banner" className={styles.bannerImage} />
        <h1 className="slide-in">Welcome!</h1>
      </div>
      <div className={styles.content}>
        <h2>
          Already {portfolio.length} Portfolio On-Line <FaArrowTrendUp />
        </h2>
        <p>
          It's time to elevate your online presence and make your mark. Our platform gives you the power to build a portfolio that not only reflects your <em>true potential</em>{" "}
          but also highlights your unique strengths and vision. Stand out from the crowd with a personalized space where your work, story, and creativity take center stage. Whether
          you're just starting out or looking to refine your online image, our tools make it easy to showcase what makes you special. Tell your story in your own words, connect
          with the world on your terms, and unleash your creativity to start making waves today.
        </p>
        <div className={styles.portfolioList}>
          <p>
            Search For &nbsp;
            <input
              type="text"
              name="searchCriteria"
              placeholder="Name"
              value={inputValues.searchCriteria}
              size={21}
              maxLength={15}
              onChange={(e) => handleInputChange(e, /^[A-Z]*$/)}
            />
          </p>
          <p>
            {portfolio
              .filter((item) => item.name.toUpperCase().includes(inputValues.searchCriteria.toUpperCase()))
              .slice(0, 100)
              .map((item) => (
                <PortfolioLink key={item.userid} data={item} />
              ))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
