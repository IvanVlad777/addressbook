import React, { useEffect, useState } from "react";
import NewContactForm from "./NewContactForm";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthenticationContext";
import { database } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const Contacts = () => {
  const { user, logout } = UserAuth();
  const [currentUser, setCurrentUser] = useState([]); //Current user from users "collection".
  const [users, setUsers] = useState([]); //All users in database collection named "users".

  const contactsRefer = collection(database, "users");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      console.log("Logged out!");
    } catch (e) {
      console.log(e.message);
    }
  };

  const targetCurrentUser = () => {
    const filterdUser = users.filter((el) => {
      return el.email === user.email;
    });
    setCurrentUser(filterdUser[0]);
    //console.log("CurrentUser", currentUser, filterdUser[0]);
  };

  const refreshingContactList = () => {
    const getUsers = async () => {
      const data = await getDocs(contactsRefer);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      targetCurrentUser();
    };
    getUsers();
  };

  useEffect(() => {
    refreshingContactList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    targetCurrentUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  return (
    <div>
      <h3>Contacts</h3>
      <p>Hello, {user && user.email}!</p>
      <NewContactForm
        currentUser={currentUser}
        refreshingContactList={refreshingContactList}
      />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Contacts;
