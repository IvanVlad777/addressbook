import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../../context/AuthenticationContext";
import { database } from "../../firebase";
import FormInput from "../LogIn/FormInput";
import ContactsList from "./ContactsList";
import FormCustomInput from "./FormCustomInput";
import "./newContactForm.css";
import { uuidv4 } from "@firebase/util";

const NewContactForm = ({ currentUser, refreshingContactList }) => {
  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    date: "",
  });
  const [contactType, setContactType] = useState("mobilePhone");
  const [anotherType, setAnotherType] = useState("");
  const [contactTypeList, setContactTypeList] = useState([
    {
      id: uuidv4(),
      name: `mobilePhone${uuidv4()}`,
      type: "tel",
      label: "Mobile",
      contactname: "mobilePhone",
      contactdata: "",
    },
  ]);

  const { user } = UserAuth();

  const inputsList = [
    {
      id: 1,
      name: "firstname",
      type: "text",
      placeholder: "First Name",
      errorMessage: "Name should contain 1-20 characters!",
      label: "FirstName",
      pattern: "^.{1,20}$",
      required: true,
    },
    {
      id: 2,
      name: "lastname",
      type: "text",
      placeholder: "Last Name",
      errorMessage: "Last name should contain 1-30 characters!",
      label: "LastName",
      pattern: "^.{1,30}$",
      required: false,
    },
    {
      id: 3,
      name: "date",
      type: "date",
      placeholder: "Date",
      errorMessage: "We neeed a valid date!",
      label: "Date",
      required: true,
    },
  ];

  const onChangeValue = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onChangeAnotherType = (e) => {
    setAnotherType(e.target.value);
    console.log(e.target.value);
  };

  const addContactType = (name) => {
    let type = "";
    let label = "";
    switch (name) {
      case "email":
        type = "email";
        label = "Email";
        break;
      case "mobilePhone":
        type = "tel";
        label = "Mobile";
        break;
      case "landlinePhone":
        type = "tel";
        label = "Landline";
        break;
      case "pager":
        type = "text";
        label = "Pager";
        break;
      default:
        type = "text";
        label = anotherType;
    }
    setContactTypeList((contactTypeList) => [
      ...contactTypeList,
      {
        id: uuidv4(),
        name: `${name}${uuidv4()}`,
        type: type,
        label: label,
        contactname: name,
        contactdata: "",
      },
    ]);
  };

  const removeContactFromList = (id) => {
    setContactTypeList((contactTypeList) =>
      contactTypeList.filter((arr) => arr.id !== id)
    );
  };

  const [users, setUsers] = useState([]);
  const usersRefer = collection(database, "users");

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersRefer);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUserContacts = async (contactDetails) => {
    const filterdUser = users.filter((el) => {
      return el.email === user.email;
    });
    const targetUser = filterdUser[0];

    const userDoc = doc(database, "users", targetUser.id);
    const existingContacts = targetUser.contacts || [];
    const newFields = {
      contacts: [...existingContacts, contactDetails],
    };
    await updateDoc(userDoc, newFields);
    refreshingContactList();
  };

  const handleDelete = async (id) => {
    const filterdUser = users.filter((el) => {
      return el.email === user.email;
    });

    const targetUser = filterdUser[0];

    const updatedContacts = targetUser.contacts.filter(
      (contact) => contact.id !== id
    );

    const userDoc = doc(database, "users", targetUser.id);
    const newFields = {
      contacts: updatedContacts,
    };
    // const newFields = {
    //   contacts: [...targetUser.contacts.filter((el, index) => index !== id)],
    // };
    await updateDoc(userDoc, newFields);
    refreshingContactList();
  };

  const handleFavourite = async (e, contact) => {
    e.stopPropagation();
    const filterdUser = users.filter((el) => {
      return el.email === user.email;
    });
    const targetUser = filterdUser[0];

    const userDoc = doc(database, "users", targetUser.id);
    // const newFields = {
    //   contacts: [
    //     ...targetUser.contacts.filter((el, index) => el.id !== contact.id),
    //     { ...contact, favourite: !contact.favourite },
    //   ],
    // };
    const newContacts = targetUser.contacts.map((el) => {
      if (el.id === contact.id) {
        return { ...contact, favourite: !contact.favourite };
      }
      return el;
    });
    const newFields = {
      contacts: newContacts,
    };
    await updateDoc(userDoc, newFields);
    refreshingContactList();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let contactDetails = {
      firstname: values.firstname,
      lastname: values.lastname,
      date: values.date,
      favourite: false,
      id: `${uuidv4() + values.firstname}`,
    };

    const contactsArray = contactTypeList.map((el, i) => {
      return {
        contacttype: el.label,
        contactdata: values[el.name],
      };
    });

    const contactsMap = contactsArray.reduce(
      (o, key) => ({ ...o, [key.contacttype]: key.contactdata }),
      {}
    );

    contactDetails = { ...contactDetails, ...contactsMap };

    updateUserContacts(contactDetails);

    setValues({
      firstname: "",
      lastname: "",
      date: "",
    });
  };

  return (
    <div>
      <ContactsList
        currentUser={currentUser}
        onDelete={handleDelete}
        handleFavourite={handleFavourite}
      />
      <form onSubmit={handleSubmit} className="newContactForm">
        {inputsList.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name] || ""}
            onChange={onChangeValue}
          />
        ))}
        <div className="chooseContactType">
          <label htmlFor="contacts">Add new contact:</label>
          <select
            id="contacts"
            value={contactType}
            onChange={(e) => setContactType(e.target.value)}
          >
            <option value="mobilePhone">Mobile Phone</option>
            <option value="landlinePhone">Landline Phone</option>
            <option value="email">E-mail</option>
            <option value="pager">Pager</option>
            <option value="another">Another Contact</option>
          </select>
          {contactType === "another" && (
            <p>
              <label htmlFor="anotherContact">Type contact name: </label>
              <input type="text" onChange={onChangeAnotherType} />
            </p>
          )}
          <button type="button" onClick={() => addContactType(contactType)}>
            Add
          </button>
        </div>
        <div>
          {contactTypeList.map((input) => (
            <FormCustomInput
              key={input.id}
              {...input}
              value={values[input.name] || ""}
              onChange={onChangeValue}
              removeItem={removeContactFromList}
            />
          ))}
        </div>
        <button
          type="submit"
          className="submitBtn"
          onClick={() => refreshingContactList()}
        >
          Add New Contact
        </button>
      </form>
    </div>
  );
};

export default NewContactForm;
