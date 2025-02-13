import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import HomePage from '../pages/HomePage';
import SignupPage from '../pages/SignupPage';
import LoginPage from '../pages/LoginPage';
import BudgetStrategyPage from '../pages/BudgetStrategyPage';
import NeedsPage from '../pages/NeedsPage';
import WantsPage from '../pages/WantsPage';
import SavingsPage from '../pages/SavingsPage';
import SplurgeOScroogePage from '../pages/SplurgeOScroogePage';
import ProfilePage from '../pages/ProfilePage';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useUser();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/budget-strategy"
        element={
          <ProtectedRoute>
            <BudgetStrategyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/needs"
        element={
          <ProtectedRoute>
            <NeedsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wants"
        element={
          <ProtectedRoute>
            <WantsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/savings"
        element={
          <ProtectedRoute>
            <SavingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/splurge-o-scrooge"
        element={
          <ProtectedRoute>
            <SplurgeOScroogePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
