import PropTypes from "prop-types";

const Button = ({ className, type, onClick, children }) => {
  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
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
