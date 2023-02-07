import React from "react";
import { useState } from "react";
import FormInput from "./FormInput";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthenticationContext";
import "./logIn.css";

const LoginForm = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const { login } = UserAuth();

  const navigate = useNavigate();
  const navigateHandle = (path) => {
    navigate(path);
  };

  const inputsList = [
    // {
    //   id: 1,
    //   name: 'username',
    //   type: 'text',
    //   placeholder: 'Username',
    //   errorMessage:
    //     'Username should contain 4-16 characters with no special characters!',
    //   label: 'Username',
    //   required: false,
    // },

    {
      id: 2,
      name: "email",
      type: "email",
      placeholder: "Email",
      label: "Email",
      required: false,
    },

    {
      id: 3,
      name: "password",
      type: "password",
      placeholder: "Password",
      errorMessage:
        "Password should contain 8 characters with one capital letter, one number and one special character!",
      label: "Password",
      required: false,
    },
  ];

  const onChangeValue = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(values.email, values.password);
      navigate("contacts");
    } catch (e) {
      setError(e.message);
      console.log(error);
    }
  };

  return (
    <>
      <h3>Welcome to this address book app!</h3>
      <p>Please sing in to continue!</p>
      <form onSubmit={handleLogin}>
        {inputsList.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChangeValue}
          />
        ))}
        <button type="submit" className="logInBtn">
          Submit
        </button>
      </form>
      <button
        type="button"
        className="switchBtn"
        onClick={() => navigateHandle("/register")}
      >
        Don't have account?
      </button>
    </>
  );
};

export default LoginForm;
