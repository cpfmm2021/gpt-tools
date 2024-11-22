import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';

// Lazy load components
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const Users = React.lazy(() => import('./pages/admin/Users'));
const Profile = React.lazy(() => import('./pages/profile/Profile'));
const Tools = React.lazy(() => import('./pages/tools/Tools'));
const ToolDetail = React.lazy(() => import('./pages/tools/ToolDetail'));
const ToolRun = React.lazy(() => import('./pages/tools/ToolRun'));
const Notifications = React.lazy(() => import('./pages/notifications/Notifications'));

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
  const { user } = useAuth();

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/login" element={
          user ? <Navigate to="/" replace /> : <PublicLayout><Login /></PublicLayout>
        } />
        <Route path="/register" element={
          user ? <Navigate to="/" replace /> : <PublicLayout><Register /></PublicLayout>
        } />

        {/* Protected Routes */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/tools" element={<ProtectedRoute><Tools /></ProtectedRoute>} />
        <Route path="/tools/:id" element={<ProtectedRoute><ToolDetail /></ProtectedRoute>} />
        <Route path="/tools/:id/run" element={<ProtectedRoute><ToolRun /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute adminOnly><Users /></ProtectedRoute>} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </React.Suspense>
  );
};

export default AppRoutes;
