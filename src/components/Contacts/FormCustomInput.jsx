import React from "react";
import { useState } from "react";
import "../LogIn/formInput.css";

const FormCustomInput = (props) => {
  const [focused, setFocused] = useState(false);

  const { label, errorMessage, onChange, removeItem, id, ...inputProps } =
    props;

  const handleFocus = (event) => {
    setFocused(true);
  };

  return (
    <div className="formInput">
      <label htmlFor={inputProps.type}>{label}: </label>
      <input
        {...inputProps}
        onChange={onChange}
        onBlur={handleFocus}
        focused={focused.toString()}
      />
      <span>{errorMessage}</span>
      <button
        className="removeBtn"
        type="button"
        onClick={() => removeItem(id)}
      >
        Remove
      </button>
    </div>
  );
};

export default FormCustomInput;
