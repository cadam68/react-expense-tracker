import { useField } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from "prop-types";

const FieldDatePicker = ({ fieldName, fieldRefs }) => {
  const [field, meta, helpers] = useField(fieldName);
  const { value } = meta;
  const { setValue } = helpers;
  return (
    <DatePicker
      {...field}
      selected={value}
      maxDate={new Date()}
      dateFormat="dd/MM/yyyy"
      onChange={(date) => setValue(date)}
      innerRef={(el) => {
        if (fieldRefs) fieldRefs.current[fieldName] = el;
      }}
    />
  );
};

FieldDatePicker.propTypes = {
  fieldName: PropTypes.string.isRequired,
  fieldRefs: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      current: PropTypes.any, // since useRef can be a reference to any kind of element
    }),
  ]),
};

export default FieldDatePicker;
