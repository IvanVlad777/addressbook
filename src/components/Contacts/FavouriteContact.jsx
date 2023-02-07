import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthenticationContext";
import { database } from "../../firebase";

const FavouriteContact = () => {
  const { user } = UserAuth();
  const [currentUser, setCurrentUser] = useState([]); //Current user from users "collection".
  const [users, setUsers] = useState([]); //All users in database collection named "users".

  const contactsRefer = collection(database, "users");
  const navigate = useNavigate();

  const targetCurrentUser = () => {
    const filterdUser = users.filter((el) => {
      return el.email === user.email;
    });
    setCurrentUser(filterdUser[0]);
    console.log("CurrentUser", currentUser, filterdUser[0]);
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
      {currentUser && currentUser.contacts ? (
        <div>
          {currentUser.contacts
            .filter((contact) => contact.favourite === true)
            .map((contact) => {
              return (
                <p key={contact.id}>
                  Name: {contact.firstname} {contact.lastname}
                </p>
              );
            })}
        </div>
      ) : (
        <p>No Favourite Contacts</p>
      )}
      <button onClick={() => navigate("/contacts")}>Go back</button>
    </div>
  );
};

export default FavouriteContact;
