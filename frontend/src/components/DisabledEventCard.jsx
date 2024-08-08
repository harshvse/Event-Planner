import React from "react";
import styles from "./styles/DisabledEventCard.module.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import EditIcon from "@mui/icons-material/Edit";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchWrapper } from "../helpers";

const DisabledEventCard = ({ event }) => {
  const { user: authUser } = useSelector((x) => x.auth);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
  const formattedDate = formatDate(new Date(event.startDateTime));

  const handleHide = async (e) => {
    const hiddenCard = await fetchWrapper.get(
      `${import.meta.env.VITE_API_URL}/api/events/unhide/${event.id}`
    );
    window.location.reload();
  };

  return (
    <div className={styles.eventCard}>
      {authUser && authUser.roles[0] == "Admin" && (
        <>
          <Link onClick={handleHide} className={styles.deleteIcon}>
            <RestoreFromTrashIcon />
          </Link>
          <Link to={`/admin/${event.id}`} className={styles.editIcon}>
            <EditIcon />
          </Link>
        </>
      )}
      <img
        src={event.imageUrl}
        alt={event.title}
        className={styles.eventImage}
      />
      <h2>{event.title}</h2>
      <div className={styles.info}>
        <p>
          <LocationOnIcon className={styles.pIcon} />
          {event.location}
        </p>
        <p>
          <PersonIcon className={styles.pIcon} />
          {event.organizer.firstName} {event.organizer.lastName}
        </p>
        <p>
          <CategoryIcon className={styles.pIcon} />
          {event.category.name}
        </p>
        <p>
          <CurrencyRupeeIcon className={styles.pIcon} />
          {event.isFree ? "Free" : event.price}
        </p>
        <p>
          <AccessTimeFilledIcon className={styles.pIcon} />
          {formattedDate}
        </p>
        <div className={styles.buttons}>
          <button>More Info</button>
          <button>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default DisabledEventCard;
