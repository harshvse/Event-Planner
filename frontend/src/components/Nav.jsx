import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import styles from "./styles/Nav.module.css";

const Nav = () => {
  const authUser = useSelector((x) => x.auth.user);
  const dispatch = useDispatch();
  const logout = () => dispatch(authActions.logout());
  if (
    window.location.pathname == "/login" ||
    window.location.pathname == "/register"
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
          <ShoppingCartIcon />
          <button onClick={logout} className="">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Nav;
