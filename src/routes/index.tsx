import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

// Lazy load components
const Home = React.lazy(() => import('../pages/Home'));
const Login = React.lazy(() => import('../pages/auth/Login'));
const Register = React.lazy(() => import('../pages/auth/Register'));
const Dashboard = React.lazy(() => import('../pages/admin/Dashboard'));
const Users = React.lazy(() => import('../pages/admin/Users'));
const Profile = React.lazy(() => import('../pages/profile/Profile'));
const ToolList = React.lazy(() => import('../pages/tools/ToolList'));
const ToolForm = React.lazy(() => import('../pages/tools/ToolForm'));
const Notifications = React.lazy(() => import('../pages/notifications/Notifications'));

// Protected Route Component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  adminOnly?: boolean;
}> = ({ children, adminOnly }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <Layout>{children}</Layout>;
};

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

const AppRoutes: React.FC = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/tools"
          element={
            <PublicLayout>
              <ToolList />
            </PublicLayout>
          }
        />

        {/* Protected routes */}
        <Route
          path="/tools/new"
          element={
            <ProtectedRoute>
              <ToolForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tools/:id/edit"
          element={
            <ProtectedRoute>
              <ToolForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* 404 redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </React.Suspense>
  );
};

export default AppRoutes;
