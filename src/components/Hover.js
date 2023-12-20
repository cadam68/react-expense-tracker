import React from "react";
import "./Hover.css";
import PropTypes from "prop-types";
import { useBasicDataContext } from "../contexts/BasicDataContext";

const Hover = ({ caption, children }) => {
  const { firstTime } = useBasicDataContext();

  // if (!firstTime) return children; // iici - to uncomment -

  return (
    <span className="hover-container">
      {children}
      <span className="caption">{caption}</span>
    </span>
  );
};

Hover.propTypes = {
  caption: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Hover;
