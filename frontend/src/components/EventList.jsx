import React, { useState, useEffect } from "react";
import { fetchWrapper } from "../helpers";
import EventCard from "./EventCard";
import styles from "./styles/EventList.module.css";
import Pagination from "@mui/material/Pagination";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import DisabledEventCard from "./DisabledEventCard";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentEvent, toggleModal } from "../store";
import Modal from "./Modal";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [pageSize, setPageSize] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state) => state.modal.isOpen);
  const currentEvent = useSelector((state) => state.modal.currentEvent);

  const { user: authUser } = useSelector((state) => state.auth);

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
  const handleCreateNew = () => {
    navigate("/admin");
  };

  const handleCloseModal = () => {
    dispatch(toggleModal(false));
  };

  return (
    <div className={styles.eventList}>
      <div className={styles.eventHeader}>
        <h1>Upcoming Events</h1>
        <div>
          {authUser.roles[0] == "Admin" && (
            <button onClick={handleCreateNew}>
              <AddIcon />
              Add Event
            </button>
          )}
          <input
            type="text"
            placeholder="Filter by Title"
            value={search}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>
      {events.length > 0 ? (
        <>
          <div className={styles.events}>
            {events.length === 0 ? (
              <p>No events available</p>
            ) : (
              events.map((event) =>
                !event.isHidden ? (
                  <EventCard event={event} key={event.id} />
                ) : (
                  <DisabledEventCard event={event} key={event.id} />
                )
              )
            )}
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
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={currentEvent}
      />
    </div>
  );
};

export default EventList;
