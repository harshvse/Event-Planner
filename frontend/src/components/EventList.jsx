import React, { useState, useEffect } from "react";
import { fetchWrapper } from "../helpers";
import EventCard from "./EventCard";
import styles from "./styles/EventList.module.css";
import Pagination from "@mui/material/Pagination";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [pageSize, setPageSize] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEvents();
  }, [currentPage, search]);

  const fetchEvents = async () => {
    try {
      const fetchData = await fetchWrapper.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/events/events?page=${currentPage}&search=${search}`
      );
      setEvents(fetchData.events);
      setTotalPages(fetchData.total);
      setPageSize(fetchData.size);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handlePageChange = (e, page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div className={styles.eventList}>
      <h1>Upcoming Events</h1>
      <input
        type="text"
        placeholder="Filter by Title"
        value={search}
        onChange={handleSearchChange}
        className="search-input"
      />
      {events.length > 0 ? (
        <>
          <div className={styles.events}>
            {events.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </div>
          <div className={styles.pagination}>
            <Pagination
              count={Math.floor(totalPages / pageSize)}
              page={currentPage}
              onChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <div className={styles.eventList}>
          <h1>NO RESULTS FOUND</h1>
        </div>
      )}
    </div>
  );
};

export default EventList;
