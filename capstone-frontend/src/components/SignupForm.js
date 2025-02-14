import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, CircularProgress, Alert } from '@mui/material';

export default function SignupForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input before making request
    if (!formData.username || !formData.password || !formData.email) {
      setError("❌ Please fill out all required fields (Username, Password, Email).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData); // Call the passed `handleSignup` function
    } catch (error) {
      setError(error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Sign Up
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
          autoComplete="new-password"
        />
        <TextField
          fullWidth
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          margin="normal"
          required
          autoComplete="given-name"
        />
        <TextField
          fullWidth
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          margin="normal"
          required
          autoComplete="family-name"
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
          autoComplete="email"
        />
        <Box textAlign="center" sx={{ mt: 3 }}>
          <Button 
            variant="contained" 
            type="submit"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </Box>
      </form>
    </Container>
  );
}
