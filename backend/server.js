const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/wallet", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// User Schema and Model
// const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  balance: { type: Number, default: 2000 },
  upiId: { type: String, unique: true },
  transactionHistory: [
    {
      type: { type: String, enum: ["send", "receive"], required: true },
      amount: { type: Number, required: true },
      to: String, // Recipient's UPI ID or username
      from: String, // Sender's UPI ID or username
      senderUpiId: String, // Explicit sender UPI ID
      date: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;


// Register a new user
app.post("/api/users/register", async (req, res) => {
    const { username, email, password } = req.body;
  
    console.log("Attempting to register user:", { username, email, password });
  
    try {
      // Check if the username or email already exists
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
  
      if (existingUser) {
        console.log("Registration failed: Username or email already exists:", existingUser);
        return res.status(400).json({ message: "Username or email already exists" });
      }
  
      // Create a unique UPI ID
      const upiId = `${username}@payment`;
  
      // Create and save the new user
      const newUser = new User({
        username,
        email,
        password,
        upiId,
        balance: 2000, // Default balance for new users
      });
  
      await newUser.save();
      console.log("User saved to the database:", newUser);
  
      res.status(201).json({
        message: "User registered successfully",
        upiId,
      });
    } catch (error) {
      console.error("Error during user registration:", error);
      res.status(500).json({ message: "Error registering user" });
    }
  });
  

// Login a user
app.post("/api/users/login", async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    if (usernameOrEmail === "admin" && password === "admin123") {
      return res.status(200).json({
        success: true,
        isAdmin: true,
        user: { username: "admin", email: "admin@system.com", role: "admin" },
      });
    }

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    res.status(200).json({
      success: true,
      isAdmin: false,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        balance: user.balance,
        upiId: user.upiId,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Login failed. Please try again." });
  }
});



// Fetch current user data
app.get("/api/users/me", async (req, res) => {
  const username = req.query.username;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
      balance: user.balance,
      upiId: user.upiId,
      transactionHistory: user.transactionHistory,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
});

app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await User.find({}, { password: 1, username: 1, email: 1, upiId: 1, balance: 1}); // Exclude the password field
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Error fetching users" });
    }
});


app.delete("/api/admin/users/:id", async (req, res) => {
    
  
    try {
      const userId = req.params.id;
      const deletedUser = await User.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Error deleting user" });
    }
});
  
// Perform a transaction

app.post("/api/transactions", async (req, res) => {
  const { senderIdentifier, recipientIdentifier, transferMode, amount } = req.body;

  try {
    if (!senderIdentifier || !recipientIdentifier || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid transaction data" });
    }

    const sender = await User.findOne({
      $or: [{ username: senderIdentifier }, { upiId: senderIdentifier }],
    });

    const recipient = await User.findOne({
      $or: [{ username: recipientIdentifier }, { upiId: recipientIdentifier }],
    });

    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct amount from sender and update balance
    sender.balance -= amount;
    sender.transactionHistory.push({
      type: "send",
      amount,
      to: recipient.upiId, // Receiver's UPI ID
      date: new Date(),
    });

    // Credit amount to recipient and update balance
    recipient.balance += amount;
    recipient.transactionHistory.push({
      type: "receive",
      amount,
      from: sender.upiId, // Sender's UPI ID
      date: new Date(),
    });

    // Save updates to database
    await sender.save();
    await recipient.save();

    res.status(200).json({
      message: `Transaction successful: ₹${amount} transferred`,
      senderBalance: sender.balance,
      senderTransactionHistory: sender.transactionHistory,
    });
  } catch (error) {
    console.error("Transaction error:", error);
    res.status(500).json({ message: "Transaction failed" });
  }
});














// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));