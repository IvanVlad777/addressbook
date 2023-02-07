import React, { useEffect } from "react";
import { useState } from "react";
import FormInput from "./FormInput";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthenticationContext";
import { addDoc, getDocs, collection } from "firebase/firestore";
import { database } from "../../firebase";
import "./logIn.css";

const LoginForm = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const { user, createUser } = UserAuth();

  const navigate = useNavigate();
  const navigateHandle = (path) => {
    navigate(path);
  };

  const [users, setUsers] = useState([]);
  const usersRefer = collection(database, "users");

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersRefer);
      console.log(data);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      console.log(users);
    };

    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createNewUser = async () => {
    await addDoc(usersRefer, {
      email: values.email,
      username: values.username,
      contacts: [],
    });
  };

  const inputsList = [
    {
      id: 1,
      name: "username",
      type: "text",
      placeholder: "Username",
      errorMessage:
        "Username should contain 4-16 characters with no special characters!",
      label: "Username",
      pattern: "^[A-Za-z0-9]{4,16}$",
      required: true,
    },
    {
      id: 2,
      name: "email",
      type: "email",
      placeholder: "Email",
      errorMessage: "We neeed a valid e-mail adress!",
      label: "Email",
      required: true,
    },
    {
      id: 3,
      name: "password",
      type: "password",
      placeholder: "Password",
      errorMessage:
        "Password should contain 8 characters with one capital letter, one number and one special character!",
      label: "Password",
      pattern:
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$",
      required: true,
    },
    {
      id: 4,
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm Password",
      errorMessage: "Passwords do not match!",
      label: "Confirm Password",
      pattern: values.password,
      required: true,
    },
  ];

  const onChangeValue = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUser(values.email, values.password);
      createNewUser();

      navigateHandle("/contacts");
    } catch (e) {
      setError(e.message);
      console.log(error);
    }
  };

  return (
    <>
      <h3>Welcome to this address book app!</h3>
      <p>Please sing up to continue!</p>
      <form onSubmit={handleRegister}>
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
        onClick={() => navigateHandle("/")}
      >
        Already have an account?
      </button>
    </>
  );
};

export default LoginForm;
