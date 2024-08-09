import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import { fetchWrapper } from "../helpers";
import styles from "./styles/UserDetails.module.css";
import { useNavigate } from "react-router-dom";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "firstName",
    headerName: "First Name",
    width: 150,
    editable: false,
  },
  {
    field: "lastName",
    headerName: "Last Name",
    width: 150,
    editable: false,
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
    editable: false,
  },
  {
    field: "orderCount",
    headerName: "Total Orders",
    type: "number",
    width: 150,
    editable: false,
  },
];

export default function UserDetails() {
  const [rows, setRows] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(0); // Material-UI DataGrid page is zero-indexed
  const [pageSize, setPageSize] = useState(100); // Rows per page
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); // Loading state for the table
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await fetchWrapper.get(
          `${import.meta.env.VITE_API_URL}/api/admin/users?page=${
            page + 1
          }&limit=${pageSize}&search=${search}`
        );
        setRows(
          data.users.map((user) => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            orderCount: user.orderCount,
          }))
        );
        setTotalUsers(data.totalUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, pageSize, search]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0); // Reset to the first page on search
  };

  const handleRowClick = (params) => {
    console.log(params);
    navigate(`/users/${params.id}`); // Navigate to the user orders page
  };

  return (
    <div className={styles.user}>
      <div className={styles.header}>
        <h1>User Orders</h1>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={handleSearchChange}
          className={styles.search}
        />
      </div>

      <Box sx={{ height: 600, width: "80%" }}>
        <DataGrid
          className={styles.datagrid}
          rows={rows}
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 25]}
          paginationMode="server"
          rowCount={totalUsers} // Ensure this reflects the correct total count from the server
          pagination
          page={page}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
            setPage(0); // Reset to the first page when page size changes
          }}
          loading={loading}
          disableRowSelectionOnClick
          onRowClick={handleRowClick} // Handle row click to navigate
        />
      </Box>
    </div>
  );
}
