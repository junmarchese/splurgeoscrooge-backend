import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { UserProvider } from "../contexts/UserContext";
import LoginPage from "../pages/LoginPage";
import { loginUser } from "../utils/api";

const request = require('supertest');
const app = require('../server'); 


// Mock API response for login
jest.mock("../utils/api", () => ({
  loginUser: jest.fn(),
}));

describe("Login Page Functionality", () => {
  beforeEach(() => {
    localStorage.clear(); // Ensure clean state
  });

  test("renders login page correctly", () => {
    render(
      <UserProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </UserProvider>
    );

    expect(screen.getByText(/Log Into Your Account/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  test("successful login updates state & navigates", async () => {
    // Mock a successful login response
    loginUser.mockResolvedValue({
      token: "mocked_token",
      user: { id: 1, username: "testuser123" },
    });

    render(
      <UserProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </UserProvider>
    );

    // Fill out login form
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser123" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });

    // Click login button
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    // Wait for API call and navigation
    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("mocked_token");
      expect(loginUser).toHaveBeenCalledWith({ username: "testuser123", password: "password123" });
    });
  });

  test("handles failed login attempts", async () => {
    loginUser.mockRejectedValue(new Error("Invalid credentials"));

    render(
      <UserProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </UserProvider>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "wronguser" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "wrongpass" } });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });

    expect(localStorage.getItem("token")).toBeNull();
  });
});


describe('Auth Routes', () => {
  describe('POST /api/auth/signup', () => {
    it('should create a new user and return a token', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'testapp',
          password: 'testapp123',
          firstName: 'Test',
          lastName: 'App',
          email: 'testapp@example.com'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('username', 'testapp');
    });

    it('should return an error if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'testapp'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'All fields required');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should log in an existing user and return a token', async () => {
      // First, create a user
      await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'testapp',
          password: 'testapp123',
          firstName: 'Test',
          lastName: 'App',
          email: 'testapp@example.com'
        });

      // Then, log in with the same user
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testapp',
          password: 'testapp123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return an error for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistentuser',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Invalid username or password');
    });
  });
});

