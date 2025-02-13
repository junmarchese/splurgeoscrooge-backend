import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

export async function signupUser(formData) {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, formData);
    return response.data;
  };


export async function loginUser(formData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, formData);
    console.log('Login API Response:', response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error('Login API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

