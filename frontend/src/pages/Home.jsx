import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { userActions } from "../store";
import EventList from "../components/EventList";

const Home = () => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((x) => x.auth);
  const { users } = useSelector((x) => x.users);

  // useEffect(() => {
  //   dispatch(userActions.getAll());
  // }, []);

  return <EventList />;
};

export default Home;
