import React from "react";
import "./Hover.css";
import PropTypes from "prop-types";
import { useBasicDataContext } from "../contexts/BasicDataContext";

const Hover = ({ caption, enable, children }) => {
  const { firstTime } = useBasicDataContext();

  // if (!firstTime) return children; // iici - to uncomment -
  if (enable != undefined && !enable) return children;

  return (
    <span className="hover-container">
      {children}
      <span className="caption">{caption}</span>
    </span>
  );
};

Hover.propTypes = {
  caption: PropTypes.string.isRequired,
  enable: PropTypes,
  children: PropTypes.node.isRequired,
};

export default Hover;
