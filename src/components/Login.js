import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Divider } from "@mui/material";

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  // Simulate a user database using localStorage
  const getUsers = () => {
    return JSON.parse(localStorage.getItem("users")) || [];
  };

  const saveUser = (user) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = getUsers();

    if (isRegistering) {
      // Check if username already exists
      if (users.some((user) => user.username === formData.username)) {
        alert("Username already exists. Please choose another.");
        return; // Stop registration if username exists
      }
      // Save new user
      saveUser(formData);
      alert("User Registered Successfully! You can now log in.");
      setIsRegistering(false);
    } else {
      // Validate login
      const user = users.find(
        (user) =>
          user.username === formData.username &&
          user.password === formData.password
      );
      if (user) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("loggedInUser", JSON.stringify(user)); // Save user data
        setIsAuthenticated(true);
        alert("Login Successful");
        navigate("/dashboard");
      } else {
        alert("Invalid Credentials");
      }
    }
  };

  return (
    <Box sx={{ mt: 4, maxWidth: "400px", margin: "auto" }}>
      <Typography variant="h4" gutterBottom align="center">
        {isRegistering ? "Register" : "Login"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          required
        />
        {isRegistering && (
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        )}
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          {isRegistering ? "Register" : "Login"}
        </Button>
      </form>
      <Divider sx={{ my: 3 }} />
      <Typography variant="body2" align="center">
        {isRegistering
          ? "Already have an account?"
          : "Don't have an account?"}{" "}
        <Button
          variant="text"
          color="secondary"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? "Login here" : "Register now"}
        </Button>
      </Typography>
    </Box>
  );
};

export default Login;