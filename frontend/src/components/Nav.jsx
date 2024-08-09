import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import styles from "./styles/Nav.module.css";
import { useEffect, useState } from "react";
import { fetchWrapper } from "../helpers";

const Nav = () => {
  const [user, setUser] = useState("");
  const authUser = useSelector((x) => x.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!authUser) {
      return;
    }
    const fetchUserData = async () => {
      const userData = await fetchWrapper.get(
        `${import.meta.env.VITE_API_URL}/api/users/profile`
      );
      setUser(userData);
    };
    fetchUserData();
  }, []);
  useEffect(() => {}, [user]);
  const logout = () => dispatch(authActions.logout());
  if (
    window.location.pathname == "/login" ||
    window.location.pathname == "/register" ||
    window.location.pathname == "/registerAdmin"
  ) {
    return null;
  }

  return (
    <nav className={styles.navContainer}>
      <Link to="/" styles={styles.navLink}>
        JIN EVENT PLANNER
      </Link>
      {!authUser ? (
        <div className={styles.log}>
          <NavLink to="/login" styles={styles.navLink}>
            Login
          </NavLink>
        </div>
      ) : (
        <div className={styles.log}>
          {user && (
            <p
              className={styles.greeting}
            >{`Welcome, ${user.firstName} ${user.lastName}`}</p>
          )}
          <button onClick={logout} className="">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Nav;
