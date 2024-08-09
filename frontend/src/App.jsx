import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { history } from "./helpers";
import Nav from "./components/Nav";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import User from "./pages/UserOrder";
import Admin from "./pages/Admin";
import Orders from "./pages/Orders";
import { ToastContainer } from "react-toastify";
import Users from "./pages/Users";
import UserOrder from "./pages/UserOrder";
import RegisterAdmin from "./pages/RegisterAdmin";

const App = () => {
  history.navigate = useNavigate();
  history.location = useLocation();

  return (
    <div>
      <Nav />
      <ToastContainer />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registerAdmin" element={<RegisterAdmin />} />
          <Route
            path="/orders"
            element={
              <PrivateRoute roles={["User", "Admin"]}>
                <Orders />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/:eventId?"
            element={
              <PrivateRoute roles={["Admin"]}>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute roles={["Admin"]}>
                <Users />
              </PrivateRoute>
            }
          />
          <Route
            path="/users/:userId"
            element={
              <PrivateRoute roles={["Admin"]}>
                <UserOrder />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
