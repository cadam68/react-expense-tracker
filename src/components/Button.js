import PropTypes from "prop-types";

const Button = ({ type, onClick, children }) => {
  return (
    <button type={type} className={"button"} onClick={onClick}>
      {children}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  type: "button",
  onClick: () => {},
};

export default Button;
