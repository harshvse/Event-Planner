import React from "react";
import styles from "./styles/OrderCard.module.css";

const OrderCard = ({ order }) => {
  const { event, quantity, totalAmount } = order;
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
  const formattedDate = formatDate(new Date(event.startDateTime));

  return (
    <div className={styles.orderCard}>
      <img
        src={event.imageUrl}
        alt={event.title}
        className={styles.eventImage}
      />
      <div className={styles.orderDetails}>
        <h3 className={styles.eventTitle}>{event.title}</h3>
        <p className={styles.eventLocation}>Location: {event.location}</p>
        <p className={styles.eventPrice}>Price: ${event.price}</p>
        <p className={styles.orderQuantity}>Tickets: {quantity}</p>
        <p className={styles.orderQuantity}>Start Date: {formattedDate}</p>
        <p className={styles.totalAmount}>Total Amount: ${totalAmount}</p>
      </div>
    </div>
  );
};

export default OrderCard;
