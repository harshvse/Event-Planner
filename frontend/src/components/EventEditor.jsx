import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchWrapper } from "../helpers";
import styles from "./styles/EventEditor.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EventEditor = () => {
  const { eventId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [price, setPrice] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [url, setUrl] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (eventId) {
      // Fetch the event details if eventId is provided
      const fetchEvent = async () => {
        try {
          const event = await fetchWrapper.get(
            `${import.meta.env.VITE_API_URL}/api/events/${eventId}`
          );
          setTitle(event.title);
          setDescription(event.description || "");
          setLocation(event.location || "");
          setImageUrl(event.imageUrl);
          setStartDateTime(formatDate(event.startDateTime));
          setEndDateTime(formatDate(event.endDateTime));
          setPrice(event.price);
          setIsFree(event.isFree);
          setUrl(event.url || "");
          setCategoryName(event.category.name);
        } catch (error) {
          console.error("Error fetching event:", error);
        }
      };
      fetchEvent();
    }
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const event = {
      title,
      description,
      location,
      imageUrl,
      startDateTime,
      endDateTime,
      price,
      isFree,
      url,
      categoryName,
    };

    try {
      if (eventId) {
        // Update the event if eventId is provided
        await fetchWrapper.put(
          `${import.meta.env.VITE_API_URL}/api/events/${eventId}`,
          event
        );
        toast.success("Event updated successfully");
      } else {
        // Create a new event
        await fetchWrapper.post(
          `${import.meta.env.VITE_API_URL}/api/events/create`,
          event
        );
        toast.success("Event created successfully");
      }
      // Reset form fields
      resetForm();
    } catch (error) {
      console.error("Error submitting event:", error);
      toast.error("Failed to submit event");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setImageUrl("");
    setStartDateTime("");
    setEndDateTime("");
    setPrice("");
    setIsFree(false);
    setUrl("");
    setCategoryName("");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>
        {eventId ? "Edit Event" : "Create New Event"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Title</label>
          <input
            type="text"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Location</label>
          <input
            type="text"
            className={styles.input}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Image URL</label>
          <input
            type="text"
            className={styles.input}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Start Date and Time</label>
          <input
            type="datetime-local"
            className={styles.input}
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>End Date and Time</label>
          <input
            type="datetime-local"
            className={styles.input}
            value={endDateTime}
            onChange={(e) => setEndDateTime(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Price</label>
          <input
            type="text"
            className={styles.input}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
            />
            Is Free
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>URL</label>
          <input
            type="text"
            className={styles.input}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Category</label>
          <input
            type="text"
            className={styles.input}
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.button}>
          {eventId ? "Update Event" : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default EventEditor;
