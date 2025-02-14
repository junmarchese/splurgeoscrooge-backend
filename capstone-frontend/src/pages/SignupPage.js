import React, { useState } from "react";
import { Container, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import SignupForm from "../components/SignupForm";
import { signupUser } from "../utils/api";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [error, setError] = useState('');

  const handleSignup = async (formData) => {
    setError(''); // Clear any previous errors

    // Enhanced input validation
    if (!formData.username?.trim() || 
        !formData.password?.trim() || 
        !formData.firstName?.trim() || 
        !formData.lastName?.trim() || 
        !formData.email?.trim()) {
      setError('Please fill out all required fields (Username, Password, First Name, Last Name, Email).');
      return;
    }

    // Ensure password meets minimum requirements
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      // Clean the form data
      const cleanedFormData = {
        username: formData.username.trim(),
        password: formData.password.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase()
      };

      const userData = await signupUser(cleanedFormData);

      if (userData.token && userData.user) {
        login(userData);
        localStorage.setItem("token", userData.token);
        navigate("/budget-strategy");
      } else {
        setError('Invalid response from server. Please try again.');
      }
    } catch (error) {
      console.error("Signup error:", error);
      
      if (error.response) {
        switch (error.response.status) {
          case 409:
            setError('Username already exists. Please choose a different username.');
            break;
          case 400:
            setError(error.response.data.message || 'Invalid input. Please check your information.');
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError('Signup failed. Please try again.');
        }
      } else if (error.request) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError('Signup failed. Please try again.');
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ pb: 8, pt: 10 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Create Account
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <SignupForm onSubmit={handleSignup} />
    </Container>
  );
}
