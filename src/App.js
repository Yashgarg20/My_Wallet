import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load authentication state from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated") === "true";
    const storedAdmin = localStorage.getItem("isAdmin") === "true";
    setIsAuthenticated(storedAuth);
    setIsAdmin(storedAdmin);
  }, []);

  // Save authentication state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
    localStorage.setItem("isAdmin", isAdmin);
  }, [isAuthenticated, isAdmin]);

  const handleLogout = () => {
    console.log("Logout triggered"); // Debugging log
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("loggedInUser");
  };

  const renderHomeRedirect = useMemo(() => {
    if (isAuthenticated) {
      return isAdmin ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />;
    }
    return (
      <Login
        setIsAuthenticated={setIsAuthenticated}
        setIsAdmin={setIsAdmin}
      />
    );
  }, [isAuthenticated, isAdmin]);

  return (
    <Router>
      <Routes>
        {/* Home Route */}
        <Route path="/" element={renderHomeRedirect} />

        {/* Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated && !isAdmin ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Admin Dashboard Route */}
        <Route
          path="/admin"
          element={
            isAuthenticated && isAdmin ? (
              <AdminDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
