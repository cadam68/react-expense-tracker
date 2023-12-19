import React from "react";
import "./Hover.css";
import PropTypes from "prop-types";
import { useBasicDataContext } from "../contexts/BasicDataContext";

const Hover = ({ caption, children }) => {
  const { firstTime } = useBasicDataContext();

  if (!firstTime) return children;

  return (
    <div className="hover-container">
      {children}
      <div className="caption">{caption}</div>
    </div>
  );
};

Hover.propTypes = {
  caption: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Hover;
