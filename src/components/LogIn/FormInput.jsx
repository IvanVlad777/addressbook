import React from "react";
import { useState } from "react";
import "./formInput.css";

const FormInput = (props) => {
  const [focused, setFocused] = useState(false);

  const { label, errorMessage, onChange, id, ...inputProps } = props;

  const handleFocus = (event) => {
    setFocused(true);
  };

  return (
    <div className="formInput">
      <label htmlFor={inputProps.type}>{label}: </label>
      <input
        className="inputBlock"
        {...inputProps}
        onChange={onChange}
        onBlur={handleFocus}
        onFocus={() =>
          inputProps.name === "confirmPassword" && setFocused(true)
        }
        focused={focused.toString()}
      />
      <p className="errorMsg">{errorMessage}</p>
    </div>
  );
};

export default FormInput;
