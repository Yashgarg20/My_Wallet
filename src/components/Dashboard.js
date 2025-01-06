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
  MenuItem,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ onLogout }) => {
  const [selectedTab, setSelectedTab] = useState("Home");
  const [balance, setBalance] = useState(0);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [recipientIdentifier, setRecipientIdentifier] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferMode, setTransferMode] = useState("upiId");

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (loggedInUser) {
        setCurrentUser(loggedInUser);
        try {
          const response = await fetch(
            `http://localhost:5000/api/users/me?username=${loggedInUser.username}`
          );
          const data = await response.json();
          setBalance(data.balance);
          setTransactionHistory(data.transactionHistory);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleSendMoney = async () => {
    if (!recipientIdentifier || !transferAmount || parseFloat(transferAmount) <= 0) {
      alert("Please enter a valid recipient and amount.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderIdentifier: currentUser.username,
          recipientIdentifier,
          transferMode,
          amount: parseFloat(transferAmount),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Transaction failed");

      setBalance(data.senderBalance);
      setTransactionHistory(data.senderTransactionHistory);
      alert(data.message);

      setRecipientIdentifier("");
      setTransferAmount("");
    } catch (error) {
      alert(error.message);
    }
  };

  const renderTransactionGraph = () => {
    const labels = transactionHistory.map((txn) =>
      new Date(txn.date).toLocaleDateString()
    );
    const data = {
      labels,
      datasets: [
        {
          label: "Transaction Amount",
          data: transactionHistory.map((txn) => txn.amount),
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0.1,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Transaction History Overview",
        },
      },
    };

    return <Line data={data} options={options} />;
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "Home":
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={7}>
              <Typography variant="h3" gutterBottom align="left">
                Fast & Secure Online Payments
              </Typography>
              <Typography variant="body1" align="left" sx={{ mb: 4 }}>
                Experience seamless transactions with PayEase. Whether you're a
                small business or an enterprise, our platform offers the tools
                you need to manage payments effortlessly.
              </Typography>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Key Features:
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography>Easy integration with your website or app</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography>Accept payments globally in multiple currencies</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography>Real-time transaction monitoring and analytics</Typography>
                </Box>
              </Card>
            </Grid>
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
                  src="/images/mywallet.png"
                  alt="My Wallet"
                  style={{
                    width: "500px",
                    height: "300px",
                    objectFit: "cover",
                  }}
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
                    select
                    fullWidth
                    label="Transfer Mode"
                    value={transferMode}
                    onChange={(e) => setTransferMode(e.target.value)}
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="upiId">UPI ID</MenuItem>
                    <MenuItem value="username">Username</MenuItem>
                  </TextField>
                  <TextField
                    label={`Recipient (${transferMode === "upiId" ? "UPI ID" : "Username"})`}
                    variant="outlined"
                    fullWidth
                    value={recipientIdentifier}
                    onChange={(e) => setRecipientIdentifier(e.target.value)}
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
              <>
                {transactionHistory.map((txn, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="body1">
                      {txn.type === "send"
                        ? `Sent to ${txn.to || "Unknown"}`
                        : `Received from ${txn.from || "Unknown"}`}
                    </Typography>
                    <Typography variant="body2">
                      Amount: ₹{txn.amount.toLocaleString("en-IN")}
                    </Typography>
                    <Typography variant="body2">
                      Date & Time: {new Date(txn.date).toLocaleString()}
                    </Typography>
                    <Divider />
                  </Box>
                ))}
                <Box sx={{ mt: 4 }}>{renderTransactionGraph()}</Box>
              </>
            ) : (
              <Typography variant="body1" color="textSecondary">
                No transactions yet.
              </Typography>
            )}
          </Box>
        );

      case "Profile":
        return currentUser ? (
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
        ) : (
          <Typography>Loading profile...</Typography>
        );

      default:
        return null;
    }
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
          <ListItem
            button
            onClick={() => setSelectedTab("Transaction and Balance Enquiry")}
          >
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

      <Box sx={{ flexGrow: 1, p: 3, overflowY: "auto" }}>{renderContent()}</Box>
    </Box>
  );
};

export default Dashboard;
