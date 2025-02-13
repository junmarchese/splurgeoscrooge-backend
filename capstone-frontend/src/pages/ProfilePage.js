import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import NavBar from "../components/NavBar";

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setUser({ ...user, ...formData });
        alert('Profile updated successfully!');
      } else {
        alert(data.message || `Update failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Update failed:', error);
      alert('An error occurred while updating the profile.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Profile
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          margin="normal"
          disabled
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          margin="normal"
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          margin="normal"
          required
          sx={{ mb: 2 }}
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
          sx={{ mb: 2 }}
        />
        <Box mt={2}>
          <Button type="submit" variant="contained" color="success" sx={{ mt: 2 }}>
            Save Changes
          </Button>
        </Box>
      </Box>

      <NavBar />
      
    </Container>
  );
}
