import React from "react";
import PropTypes from "prop-types";

const Input = ({ label, text, type, id, paramId, personId, min, max, value, handleChange }) => (
    <div className="form-group">
        <label htmlFor={label}>{text}</label>
        <input
            type={type}
            className="form-control"
            id={id}
            value={value}
            onChange={(e) => handleChange( personId, paramId, e )}
            min={min}
            max={max}
            required
        />
    </div>
);
Input.propTypes = {
    label: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    paramId: PropTypes.string.isRequired,
    personId: PropTypes.number.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.number.isRequired,
    handleChange: PropTypes.func.isRequired
};
export default Input;