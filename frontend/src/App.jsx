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
import User from "./pages/User";
import Admin from "./pages/Admin";

const App = () => {
  history.navigate = useNavigate();
  history.location = useLocation();

  return (
    <div>
      <Nav />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/user"
            element={
              <PrivateRoute roles={["User", "Admin"]}>
                <User />
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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
