import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import LoginForm from "../components/LoginForm";
import { Container } from "@mui/material";
import { loginUser } from "../utils/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = async (formData) => {
    try {
      console.log("Attempting login...");

      const data = await loginUser(formData);
      console.log("API Response:", data);

      if (!data || !data.token || !data.user) {
        throw new Error("Invalid login response. Missing token or user data.");
      }

      // First store token
      localStorage.setItem("token", data.token);
      
      // Then update user context
      console.log("Setting user data:", data.user); // Debugging
      login(data.user);

      // Wait a brief moment to ensure context is updated
      setTimeout(() => {
        console.log("Login successful! Navigating to /budget-strategy");
        navigate("/budget-strategy", { replace: true });
      }, 1000);

    } catch (error) {
      console.error("Login failed:", error.message);
      alert(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ pb: 8, pt: 10 }}>
      <LoginForm onSubmit={handleLogin} />
    </Container>
  );
}
