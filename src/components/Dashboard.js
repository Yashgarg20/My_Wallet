import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import HomeIcon from "@mui/icons-material/Home";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const Dashboard = ({ onLogout }) => {
  const [balance, setBalance] = useState(1000); // Initial balance in INR
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Home");
  const [currentUser, setCurrentUser] = useState({ username: "", email: "" });

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setCurrentUser(loggedInUser);
    }
  }, []);

  const handleTransaction = (type) => {
    const amount = prompt(`Enter amount to ${type} (in ₹)`);
    if (amount && !isNaN(amount)) {
      const updatedBalance =
        type === "send" ? balance - parseInt(amount) : balance + parseInt(amount);

      if (updatedBalance >= 0) {
        setBalance(updatedBalance);
        setTransactionHistory([
          ...transactionHistory,
          { type, amount: parseInt(amount), date: new Date().toLocaleString() },
        ]);
      } else {
        alert("Insufficient Balance!");
      }
    } else {
      alert("Invalid Amount!");
    }
  };

  const renderContent = () => {
    if (selectedTab === "Home") {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ bgcolor: "primary.main", color: "#fff" }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Current Balance
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  ₹{balance.toLocaleString("en-IN")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Actions
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    sx={{ mb: 2 }}
                    onClick={() => handleTransaction("receive")}
                  >
                    Receive Money
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={() => handleTransaction("send")}
                  >
                    Send Money
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      );
    } else if (selectedTab === "Transaction Details") {
      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h5" gutterBottom>
            Transaction History
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {transactionHistory.length > 0 ? (
            <List>
              {transactionHistory.map((txn, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={`${txn.type.toUpperCase()} - ₹${txn.amount.toLocaleString(
                      "en-IN"
                    )}`}
                    secondary={`Date: ${txn.date}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No transactions yet.
            </Typography>
          )}
        </Box>
      );
    } else if (selectedTab === "Profile") {
      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h5">Profile</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Username:</strong> {currentUser.username}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            <strong>Email:</strong> {currentUser.email}
          </Typography>
        </Box>
      );
    }
    return <Typography variant="body1">Welcome to your dashboard!</Typography>;
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ textAlign: "center", my: 2 }}>
          <Avatar sx={{ bgcolor: "primary.main", mx: "auto" }}>
            <AccountBalanceWalletIcon />
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
            My Wallet
          </Typography>
        </Box>
        <Divider />
        <List>
          <ListItem button onClick={() => setSelectedTab("Home")}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={() => setSelectedTab("Transaction Details")}>
            <ListItemIcon>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary="Transaction Details" />
          </ListItem>
          <ListItem button onClick={() => setSelectedTab("Profile")}>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
        </List>
        <Divider />
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: "auto", mb: 2 }}
          onClick={onLogout}
        >
          Logout
        </Button>
      </Drawer>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
          {selectedTab}
        </Typography>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Dashboard;