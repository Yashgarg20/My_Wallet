import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(allUsers);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="h6" gutterBottom>
        All Registered Users
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        {users.map((user, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {user.username}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {user.email}
                </Typography>
                <Typography variant="body1">
                  <strong>UPI ID:</strong> {user.upiId}
                </Typography>
                <Typography variant="body1">
                  <strong>Password:</strong> {user.password}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
