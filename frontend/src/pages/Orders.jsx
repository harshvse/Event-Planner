import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bookActions } from "../store/book.slice";
import OrderCard from "../components/OrderCard";
import styles from "./styles/Orders.module.css";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.book);

  useEffect(() => {
    dispatch(bookActions.fetchOrders());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.orders}>
      <h2>My Orders</h2>
      <div className={styles.orderList}>
        {orders.map((order) => (
          <OrderCard order={order} key={order.id} />
        ))}
      </div>
    </div>
  );
};

export default Orders;
