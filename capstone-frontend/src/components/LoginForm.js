import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, CircularProgress, Alert } from "@mui/material";

export default function LoginForm({ onSubmit }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ensures state updates properly
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(null); // Clears error when user types
  };

  // Ensuring submit logic properly updates state
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError("Username and Password are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Log In
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          margin="normal"
          required
          autoComplete="username"
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
          autoComplete="current-password"
        />
        <Box textAlign="center" sx={{ mt: 3 }}>
          <Button 
            variant="contained" 
            type="submit"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{ backgroundColor: '2b92ed', color: 'black' }}
          >
            {loading ? "Logging In..." : "Log In"}
          </Button>
        </Box>
      </form>
    </Container>
  );
}
