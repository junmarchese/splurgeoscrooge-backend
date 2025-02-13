import React from "react";
import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser  } from "../contexts/UserContext";
import SignupForm from "../components/SignupForm";
import { signupUser } from "../utils/api";  // ✅ Import API function

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSignup = async (formData) => {
    // ✅ Validate user input before sending request
    if (!formData.username || !formData.password || !formData.firstName || !formData.lastName || !formData.email) {
      alert("❌ Please fill out all required fields (Username, Password, First Name, Last Name, Email).");
      return;
    }

    try {
      const userData = await signupUser(formData);  // ✅ Call API function

      if (userData.token && userData.user) {
        login(userData);
        localStorage.setItem("token", userData.token);  // ✅ Store token
        // setUser({
        //   id: userData.user.id,
        //   username: userData.user.username,
        //   firstName: userData.user.firstName,
        //   lastName: userData.user.lastName,
        //   email: userData.user.email,
        // });

        navigate("/budget-strategy");  // ✅ Navigate after successful signup
      }
    } catch (error) {
      console.error("Signup error:", error.message);
      alert(error.message || "Signup failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ pb: 8, pt: 10, backgroundColor: '#cccccc' }}>
      <Typography variant="h4" align="center" gutterBottom>
      </Typography>
      <SignupForm onSubmit={handleSignup} />
    </Container>
  );
}
