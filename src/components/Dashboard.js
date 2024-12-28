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
  TextField,
  Grid,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const Dashboard = ({ onLogout }) => {
  const [selectedTab, setSelectedTab] = useState("Home");
  const [balance, setBalance] = useState(0);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [recipientUpi, setRecipientUpi] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  // Load user data on component mount
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setCurrentUser(loggedInUser);
      const storedBalance = JSON.parse(localStorage.getItem(`${loggedInUser.username}_balance`)) || 1000;
      const storedHistory = JSON.parse(localStorage.getItem(`${loggedInUser.username}_history`)) || [];
      setBalance(storedBalance);
      setTransactionHistory(storedHistory);
    }
  }, []);

  const handleSendMoney = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const recipient = users.find((user) => user.upiId === recipientUpi);

    if (!recipient) {
      alert("Recipient UPI ID not found!");
      return;
    }

    const amount = parseInt(transferAmount);
    if (!amount || amount <= 0 || balance < amount) {
      alert("Invalid transaction amount or insufficient balance!");
      return;
    }

    // Update sender's balance
    const updatedSenderBalance = balance - amount;
    setBalance(updatedSenderBalance);
    localStorage.setItem(`${currentUser.username}_balance`, updatedSenderBalance);

    // Update recipient's balance
    const recipientBalance = parseInt(localStorage.getItem(`${recipient.username}_balance`) || 1000);
    const updatedRecipientBalance = recipientBalance + amount;
    localStorage.setItem(`${recipient.username}_balance`, updatedRecipientBalance);

    // Update transaction history
    const now = new Date().toLocaleString("en-IN");
    const senderTransaction = {
      type: "send",
      amount,
      to: recipientUpi,
      dateTime: now,
    };
    const recipientTransaction = {
      type: "receive",
      amount,
      from: currentUser.upiId,
      dateTime: now,
    };

    const updatedHistory = [...transactionHistory, senderTransaction];
    setTransactionHistory(updatedHistory);
    localStorage.setItem(
      `${currentUser.username}_history`,
      JSON.stringify(updatedHistory)
    );

    const recipientHistory = JSON.parse(
      localStorage.getItem(`${recipient.username}_history`) || "[]"
    );
    localStorage.setItem(
      `${recipient.username}_history`,
      JSON.stringify([...recipientHistory, recipientTransaction])
    );

    alert(`₹${amount} sent to ${recipient.username}`);
    setRecipientUpi("");
    setTransferAmount("");
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "Home":
        return (
          <Grid container spacing={2}>
            {/* Left Side: Text Content */}
            <Grid item xs={12} sm={7}>
              <Typography variant="h3" gutterBottom align="left">
                Fast & Secure Online Payments
              </Typography>
              <Typography variant="body1" align="left" sx={{ mb: 4 }}>
                Experience seamless transactions with PayEase. Whether you're a small
                business or an enterprise, our platform offers the tools you need to
                manage payments effortlessly.
              </Typography>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Key Features:
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                  <Typography>Easy integration with your website or app</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                  <Typography>Accept payments globally in multiple currencies</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                  <Typography>Real-time transaction monitoring and analytics</Typography>
                </Box>
              </Card>
            </Grid>

            {/* Right Side: Image */}
            <Grid item xs={12} sm={5}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <img
                  src="/images/mywallet.png" // Path to your image
                  alt="My Wallet"
                  style={{ width: "500px", height: "300px", objectFit: "cover" }}
                />
              </Box>
            </Grid>
          </Grid>
        );

      case "Transaction and Balance Enquiry":
        return (
          <Grid container spacing={3} sx={{ mt: 2 }}>
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
                    Send Money
                  </Typography>
                  <TextField
                    label="Recipient UPI ID"
                    variant="outlined"
                    fullWidth
                    value={recipientUpi}
                    onChange={(e) => setRecipientUpi(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Amount (₹)"
                    variant="outlined"
                    fullWidth
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSendMoney}
                  >
                    Send Money
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case "Transaction Details":
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5">Transaction History</Typography>
            <Divider sx={{ mb: 2 }} />
            {transactionHistory.length > 0 ? (
              transactionHistory.map((txn, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    {txn.type === "send"
                      ? `Sent to ${txn.to}`
                      : `Received from ${txn.from}`}
                  </Typography>
                  <Typography variant="body2">
                    Amount: ₹{txn.amount.toLocaleString("en-IN")}, Date & Time:{" "}
                    {txn.dateTime}
                  </Typography>
                  <Divider />
                </Box>
              ))
            ) : (
              <Typography variant="body1" color="textSecondary">
                No transactions yet.
              </Typography>
            )}
          </Box>
        );

      case "Profile":
        if (!currentUser) {
          return <Typography>Loading profile...</Typography>;
        }
        return (
          <Box>
            <Typography variant="h5">Profile</Typography>
            <Typography variant="body1">
              <strong>Username:</strong> {currentUser.username}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {currentUser.email}
            </Typography>
            <Typography variant="body1">
              <strong>UPI ID:</strong> {currentUser.upiId}
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
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
          <ListItem button onClick={() => setSelectedTab("Transaction and Balance Enquiry")}>
            <ListItemIcon>
              <MonetizationOnIcon />
            </ListItemIcon>
            <ListItemText primary="Transaction and Balance Enquiry" />
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

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3, overflowY: "auto" }}>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Dashboard;
