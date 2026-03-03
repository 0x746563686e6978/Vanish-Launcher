import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CheatLoader from './pages/CheatLoader';
import RedeemLicense from './pages/RedeemLicense';
import Settings from './pages/Settings';
import Account from './pages/Account';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const { token, fetchUser } = useStore();

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token, fetchUser]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="cheat-loader" element={<CheatLoader />} />
        <Route path="redeem" element={<RedeemLicense />} />
        <Route path="settings" element={<Settings />} />
        <Route path="account" element={<Account />} />
      </Route>
    </Routes>
  );
}
