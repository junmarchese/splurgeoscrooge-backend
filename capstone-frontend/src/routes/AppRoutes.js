import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import HomePage from '../pages/HomePage';
import SignupPage from '../pages/SignupPage';
import LoginPage from '../pages/LoginPage';
import BudgetStrategyPage from '../pages/BudgetStrategyPage';
import NeedsPage from '../pages/NeedsPage';
import WantsPage from '../pages/WantsPage';
import SavingsPage from '../pages/SavingsPage';
import SplurgeOScroogePage from '../pages/SplurgeOScroogePage';
import ProfilePage from '../pages/ProfilePage';

export default function AppRoutes() {
  const { user } = useContext(UserContext);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      {user ? (
        <>
          <Route path="/budget-strategy" element={<BudgetStrategyPage />} />
          <Route path="/needs" element={<NeedsPage />} />
          <Route path="/wants" element={<WantsPage />} />
          <Route path="/savings" element={<SavingsPage />} />
          <Route path="/splurge-o-scrooge" element={<SplurgeOScroogePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
}
