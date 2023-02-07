import React from "react";
import { useNavigate } from "react-router-dom";
import "./contactsList.css";

const ContactsList = ({ currentUser, onDelete, handleFavourite }) => {
  const uniqueId = () => parseInt(Date.now() * Math.random()).toString();

  const navigate = useNavigate();

  const handleDelete = (e, id) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <>
      <table>
        <tbody>
          {currentUser &&
            currentUser.contacts &&
            currentUser.contacts.map((contact, i) => {
              return (
                <tr
                  key={uniqueId()}
                  id={i}
                  onClick={() => navigate(`/contacts/${i}`)}
                >
                  <td
                    onClick={(e) => handleDelete(e, contact.id)}
                    className="deleteBtn"
                  >
                    Delete
                  </td>
                  <td
                    className="favouriteBtn"
                    style={contact.favourite ? { color: "gold" } : {}}
                    onClick={(e) => handleFavourite(e, contact)}
                  >
                    {i + 1}. {contact.favourite ? "★" : "☆"}
                  </td>
                  <td>
                    {contact.firstname} {contact.lastname}
                  </td>
                  <td>{contact.date}</td>

                  {Object.keys(contact)
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
                          <td key={index}>
                            {key}: {contact[key]}
                          </td>
                        );
                      }
                      return null;
                    })}
                </tr>
              );
            })}
        </tbody>
      </table>
      <button onClick={() => navigate("/contacts/favourites")}>
        Go to my Favourites
      </button>
    </>
  );
};

export default ContactsList;
