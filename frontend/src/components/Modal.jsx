// src/components/Modal.js
import React, { useState } from "react";
import styles from "./styles/Modal.module.css";
import CloseIcon from "@mui/icons-material/Close";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { useDispatch, useSelector } from "react-redux";
import { bookActions } from "../store";
import { toast } from "react-toastify";
const Modal = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const handleBook = () => {
    dispatch(bookActions.bookEvent({ eventId: event.id, quantity }));
    onClose();
    toast.success("Event Booked");
  };
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleQuantityChange = (event) => {
    const value = event.target.value;

    if (!isNaN(value) && value >= 1 && value <= 100) {
      setQuantity(Number(value)); // Convert to number
    }
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
              <strong>Price:</strong>{" "}
              {event.isFree ? "Free" : `₹${event.price}`}
            </p>
            <p>
              <strong>Start:</strong>{" "}
              {formatDate(new Date(event.startDateTime))}
            </p>
            <p>
              <strong>End:</strong> {formatDate(new Date(event.endDateTime))}
            </p>
            <div className={styles.bookContainer}>
              <label htmlFor="quantity">Tickets: </label>
              <input
                type="number"
                name="quantity"
                min="1"
                max="100"
                step="1"
                value={quantity}
                onChange={handleQuantityChange}
              />
              <button onClick={handleBook}>Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
