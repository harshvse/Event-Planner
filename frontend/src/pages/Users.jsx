import React from "react";
import UserDetails from "../components/UserDetails";
import styles from "./styles/Users.module.css";

const Users = () => {
  return (
    <div className={styles.users}>
      <UserDetails />
    </div>
  );
};

export default Users;
