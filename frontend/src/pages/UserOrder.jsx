import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { fetchWrapper } from "../helpers";
import styles from "./styles/UserOrder.module.css";
const columns = [
  { field: "id", headerName: "Order ID", width: 350 },
  { field: "eventTitle", headerName: "Event Title", width: 400 },
  { field: "quantity", headerName: "Quantity", width: 150 },
  { field: "totalAmount", headerName: "Total Amount", width: 150 },
  { field: "createdAt", headerName: "Order Date", width: 200 },
];

export default function UserOrder() {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await fetchWrapper.get(
          `${import.meta.env.VITE_API_URL}/api/admin/orders/${userId}`
        );
        console.log(data);
        if (data && data.orders) {
          setOrders(
            data.orders.map((order) => ({
              id: order.id,
              eventTitle: order.event.title,
              quantity: order.quantity,
              totalAmount: order.totalAmount,
              createdAt: new Date(order.createdAt).toLocaleString(),
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <div className={styles.orders}>
      <Box sx={{ height: 500, width: "70%" }}>
        <DataGrid
          rows={orders}
          columns={columns}
          loading={loading}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 25]}
          pagination
          className={styles.datagrid}
        />
      </Box>
    </div>
  );
}
