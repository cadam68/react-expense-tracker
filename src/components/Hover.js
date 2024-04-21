import React, { memo } from "react";
import "./Hover.css";
import PropTypes from "prop-types";
import { useSettingsContext } from "../contexts/SettingsContext";

const Hover = ({ caption, enable, visible, children }) => {
  const { firstTime } = useSettingsContext();

  if (visible !== undefined && !visible) return children;
  if (visible === undefined && !firstTime) return children; // iici - to uncomment for production -
  if (enable !== undefined && !enable) return children;

  return (
    <span className="hover-container">
      {children}
      <span className="caption">{caption}</span>
    </span>
  );
};

Hover.propTypes = {
  caption: PropTypes.string.isRequired,
  enable: PropTypes.bool,
  visible: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default memo(Hover);
