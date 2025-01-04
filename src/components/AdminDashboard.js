import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
  Card,
  CardContent,
} from "@mui/material";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch user details
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/users", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err.message);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Delete a user
  const handleDeleteUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userToDelete}`, // Delete API endpoint
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error deleting user");
      }

      const data = await response.json();
      alert(data.message);

      // Remove the user from the UI after successful deletion
      setUsers(users.filter((user) => user._id !== userToDelete));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (err) {
      console.error("Error deleting user:", err.message);
      alert(err.message);
    }
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (userId) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 1200,
          backgroundColor: "#ffffff",
          boxShadow: 3,
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ textAlign: "center", fontWeight: "bold" }}
          >
            Admin Dashboard
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ textAlign: "center", color: "gray" }}
          >
            Manage User Details and Delete Permissions
          </Typography>

          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography
              color="error"
              sx={{ textAlign: "center", marginTop: 3 }}
            >
              {error}
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ marginTop: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography fontWeight="bold">Username</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">Email</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">UPI ID</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">Balance (₹)</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontWeight="bold">Actions</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.upiId}</TableCell>
                        <TableCell>
                          ₹{user.balance.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleOpenDeleteDialog(user._id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography>No users found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
            <DialogTitle>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogTitle>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
              <Button
                onClick={handleDeleteUser}
                color="error"
                variant="contained"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard;
