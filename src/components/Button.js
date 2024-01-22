import PropTypes from "prop-types";
import { useState } from "react";

const Button = ({ className, type, onClick, children, secured = false }) => {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <button
      type={type}
      className={className}
      style={secured && !confirmed ? { opacity: "0.5", cursor: "default" } : {}}
      onClick={(e) => {
        if (e.target.name === "checkbox-confirmation" || (secured && !confirmed)) return;
        onClick(e);
      }}
    >
      {children}{" "}
      {secured && (
        <input
          type="checkbox"
          checked={confirmed}
          style={{ cursor: "pointer", marginLeft: "5px" }}
          onChange={(e) => {
            e.stopPropagation();
            setConfirmed((value) => !value);
          }}
          name={"checkbox-confirmation"}
        />
      )}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  className: "button",
  type: "button",
  onClick: () => {},
};

export default Button;
