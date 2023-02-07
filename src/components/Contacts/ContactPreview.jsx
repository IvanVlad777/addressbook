import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { UserAuth } from "../../context/AuthenticationContext";
import { database } from "../../firebase";

const ContactPreview = () => {
  const { contactId } = useParams();

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
      <h2>Contact Preview</h2>
      {currentUser && currentUser.contacts && (
        <div className="contacPreviewList">
          {currentUser.contacts[contactId].favourite && (
            <p>This contact is on your list of favourites contacts.</p>
          )}
          <p>First Name: {currentUser.contacts[contactId].firstname}</p>
          <p>Last Name: {currentUser.contacts[contactId].lastname}</p>
          <p>Date of Birth: {currentUser.contacts[contactId].date}</p>
          <div>
            {Object.keys(currentUser.contacts[contactId])
              .sort()
              .map((key, index) => {
                if (
                  key !== "firstname" &&
                  key !== "lastname" &&
                  key !== "favourite" &&
                  key !== "date" &&
                  key !== "id"
                ) {
                  return (
                    <p key={index}>
                      {key}: {currentUser.contacts[contactId][key]}
                    </p>
                  );
                }
                return null;
              })}
          </div>
        </div>
      )}
      <button onClick={() => navigate("/contacts")}>Go back</button>
    </div>
  );
};

export default ContactPreview;
