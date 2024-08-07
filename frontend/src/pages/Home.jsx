import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { userActions } from "../store";
import EventList from "../components/EventList";

const Home = () => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((x) => x.auth);
  const { users } = useSelector((x) => x.users);

  useEffect(() => {
    dispatch(userActions.getAll());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <EventList />;
};

export default Home;
