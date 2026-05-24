# 📱 Digital Payment Wallet System using MERN Stack

A secure and user-friendly Digital Payment Wallet web application developed using the MERN Stack (MongoDB, Express.js, React.js, and Node.js). The application allows users to register, log in, generate unique UPI IDs, send and receive money, maintain wallet balance, and track transactions in real time. An Admin Dashboard is also included for monitoring users, balances, and transaction history.

This project simulates the core functionality of modern digital payment platforms such as Paytm, PhonePe, and Google Pay.

---

# 📌 Table of Contents

- Project Overview
- Objectives
- Features
- Technology Stack
- System Architecture
- Workflow
- Frontend Description
- Backend Description
- Database Design
- API Endpoints
- Installation & Setup
- Project Screens
- Future Enhancements
- Learning Outcomes
- Conclusion

---

# 🚀 Project Overview

The Digital Payment Wallet System is a full-stack web application that enables users to perform secure digital transactions through a wallet-based payment system.

The application provides:
- User Authentication
- UPI ID Generation
- Peer-to-peer Transactions
- Wallet Balance Management
- Transaction Tracking
- Admin Monitoring

The project demonstrates full-stack web development concepts including frontend-backend integration, REST APIs, authentication, database management, and transaction processing.

---

# 🎯 Objectives of the Project

The primary objectives of this project are:

- To create a secure online wallet system
- To implement peer-to-peer money transfer functionality
- To maintain transaction records and wallet balances
- To understand frontend-backend communication
- To implement REST APIs using Node.js and Express.js
- To learn MongoDB database operations
- To develop a responsive and interactive user interface

---

# ✨ Features

## 👤 User Features

### 🔐 Authentication
- User Registration
- User Login
- Logout Functionality

### 💳 Wallet Functionalities
- Automatic UPI ID Generation
- Wallet Balance Display
- Send Money
- Receive Money
- Request Money

### 📜 Transaction Management
- Transaction History
- Date & Time Tracking
- Real-Time Balance Updates

### 📊 Analytics
- Transaction Graph Visualization using Chart.js

### 👤 Profile Management
- Username
- Email
- UPI ID

---

## 👨‍💼 Admin Features

- Admin Login
- View All Registered Users
- Monitor User Wallet Balances
- Monitor Transaction Histories
- Delete Users

---

# 🛠️ Technology Stack

## Frontend Technologies

| Technology | Purpose |
|------------|---------|
| React.js | User Interface |
| Material UI | UI Components & Styling |
| React Router DOM | Page Routing |
| Chart.js | Transaction Graphs |

---

## Backend Technologies

| Technology | Purpose |
|------------|---------|
| Node.js | Server Runtime |
| Express.js | API Development |
| REST APIs | Client-Server Communication |

---

## Database Technologies

| Technology | Purpose |
|------------|---------|
| MongoDB | Database |
| Mongoose | MongoDB Object Modeling |

---

# 🏗️ System Architecture

```text
Frontend (React.js)
        ↓
HTTP Requests (REST APIs)
        ↓
Backend Server (Node.js + Express.js)
        ↓
MongoDB Database
```

---

# ⚙️ Working Workflow of the Project

---

## 🟢 Step 1: User Registration

### Process:
1. User enters:
   - Username
   - Email
   - Password

2. Frontend sends request to backend:
```javascript
fetch("http://localhost:5000/api/users/register")
```

3. Backend:
   - Validates data
   - Checks duplicate users
   - Generates UPI ID

```javascript
const upiId = `${username}@payment`;
```

4. Data stored in MongoDB

---

## 🟢 Step 2: Login

### Process:
1. User enters credentials
2. Backend validates user
3. User session stored in localStorage

```javascript
localStorage.setItem("loggedInUser", JSON.stringify(user));
```

---

## 🟢 Step 3: Dashboard Loading

### Process:
1. React fetches user data
2. Backend returns:
   - Balance
   - UPI ID
   - Transaction history

---

## 🟢 Step 4: Send Money

### Process:
1. User enters:
   - Recipient UPI ID
   - Amount

2. Frontend sends POST request

```javascript
fetch("http://localhost:5000/api/transactions")
```

3. Backend:
   - Finds sender
   - Finds receiver
   - Checks balance
   - Deducts amount
   - Credits recipient
   - Updates transaction history

---

## 🟢 Step 5: Transaction History

Every transaction stores:
- Type
- Amount
- Sender
- Receiver
- Date & Time

Displayed dynamically in dashboard.

---

## 🟢 Step 6: Admin Monitoring

Admin can:
- View all users
- View balances
- Monitor transactions
- Delete users

---

# 💻 Frontend Description

The frontend is developed using React.js.

## React Concepts Used

### useState
Stores dynamic data.

```javascript
const [balance, setBalance] = useState(0);
```

---

### useEffect
Fetches data when page loads.

```javascript
useEffect(() => {
  fetchUserData();
}, []);
```

---

### React Router DOM
Used for navigation between:
- Login
- Dashboard
- Admin Dashboard

---

## Material UI Components Used

| Component | Purpose |
|-----------|---------|
| Drawer | Sidebar Navigation |
| Card | Display Wallet Data |
| Typography | Text Styling |
| Button | User Actions |
| Grid | Responsive Layout |
| Avatar | User/Profile Icon |

---

# 🔙 Backend Description

Backend is developed using:
- Node.js
- Express.js

The backend handles:
- Authentication
- APIs
- Transactions
- Database operations
- Validation

---

# 🗄️ Database Design

## MongoDB Database

Database Name:
```text
wallet
```

---

## User Schema

```javascript
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  balance: Number,
  upiId: String,
  transactionHistory: []
});
```

---

## Transaction History Schema

```javascript
transactionHistory: [
  {
    type: String,
    amount: Number,
    to: String,
    from: String,
    date: Date
  }
]
```

---

# 📡 API Endpoints

## User APIs

### Register User
```http
POST /api/users/register
```

### Login User
```http
POST /api/users/login
```

### Fetch User Data
```http
GET /api/users/me
```

---

## Transaction APIs

### Send Money
```http
POST /api/transactions
```

---

## Admin APIs

### Fetch All Users
```http
GET /api/admin/users
```

### Delete User
```http
DELETE /api/admin/users/:id
```

---

# ⚙️ Installation & Setup

---

## 🔹 Clone Repository

```bash
git clone <repository-url>
cd My_Wallet
```

---

# 📦 Backend Setup

## Navigate to backend folder

```bash
cd backend
```

## Install dependencies

```bash
npm install
```

## Install Required Packages

```bash
npm install express mongoose cors body-parser nodemon
```

## Start Backend Server

```bash
node server.js
```

OR

```bash
nodemon server.js
```

Backend runs on:
```text
http://localhost:5000
```

---

# 💻 Frontend Setup

## Navigate to frontend folder

```bash
cd frontend
```

## Install dependencies

```bash
npm install
```

## Install Required Packages

```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install react-router-dom
npm install react-chartjs-2 chart.js
```

## Start React Application

```bash
npm start
```

Frontend runs on:
```text
http://localhost:3000
```

---

# 🗄️ MongoDB Setup

Install MongoDB locally or use MongoDB Atlas.

MongoDB Connection:

```javascript
mongoose.connect("mongodb://127.0.0.1:27017/wallet")
```

---

# 📈 Graph Visualization

Transaction analytics are displayed using Chart.js.

Features:
- Transaction Amount Graph
- Date-wise Tracking
- Visual Analytics

---

# 🔥 Key Concepts Used

- MERN Stack Development
- REST APIs
- CRUD Operations
- Authentication
- React Hooks
- State Management
- MongoDB Schema Design
- Client-Server Architecture

---

# ⚠️ Current Limitations

- Passwords are not encrypted
- No JWT Authentication
- No OTP Verification
- No Payment Gateway Integration

---

# 🚀 Future Enhancements

- JWT Authentication
- bcrypt Password Encryption
- QR Code Payments
- Razorpay/Stripe Integration
- Email Notifications
- OTP Verification
- Push Notifications
- MongoDB Transactions

---

# 📚 Learning Outcomes

This project helped in understanding:
- Full-Stack MERN Development
- Frontend-Backend Integration
- REST API Development
- MongoDB Database Operations
- Transaction Processing
- Authentication & Authorization
- Real-Time UI Updates

---

# 📌 Conclusion

The Digital Payment Wallet System successfully demonstrates the implementation of a secure and scalable digital transaction platform using the MERN stack. The project provides practical experience in frontend-backend integration, REST APIs, database management, authentication, and real-time transaction processing. It also simulates the core functionality of real-world digital payment applications.
