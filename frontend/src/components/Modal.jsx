// src/components/Modal.js
import React from "react";
import styles from "./styles/Modal.module.css";
import CloseIcon from "@mui/icons-material/Close";

const Modal = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <CloseIcon />
        </button>
        <h2 className={styles.title}>{event.title}</h2>
        <img
          src={event.imageUrl}
          alt={event.title}
          className={styles.modalImage}
        />
        <div className={styles.modalInfo}>
          <div className={styles.description}>
            <p>
              <strong>Description: </strong>
              {event.description}
            </p>
          </div>
          <div className={styles.information}>
            <p>
              <strong>Location:</strong> {event.location}
            </p>
            <p>
              <strong>Organizer:</strong> {event.organizer.firstName}{" "}
              {event.organizer.lastName}
            </p>
            <p>
              <strong>Category:</strong> {event.category.name}
            </p>
            <p>
              <strong>Price:</strong> {event.isFree ? "Free" : event.price}
            </p>
            <p>
              <strong>Start:</strong>{" "}
              {formatDate(new Date(event.startDateTime))}
            </p>
            <p>
              <strong>End:</strong> {formatDate(new Date(event.endDateTime))}
            </p>
            <button>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
