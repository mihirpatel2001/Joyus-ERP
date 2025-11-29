import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Parties } from './pages/Parties';
import { Employees } from './pages/Employees';
import { Roles } from './pages/Roles';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserRole } from './types';

// Placeholder for future modules
const PlaceholderModule = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
    <div className="bg-slate-100 p-6 rounded-full mb-4">
      <span className="text-4xl">🚧</span>
    </div>
    <h2 className="text-2xl font-bold text-slate-800 mb-2">{title} Module</h2>
    <p className="text-slate-500 max-w-md">
      This module is currently under development. It will handle {title.toLowerCase()} related operations.
    </p>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: UserRole[] }) => {
  const { isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh]">
        <h2 className="text-2xl font-bold text-slate-800">Access Denied</h2>
        <p className="text-slate-500 mt-2">You do not have permission to view this page.</p>
        <p className="text-xs text-slate-400 mt-4">Required Roles: {allowedRoles.join(', ')}</p>
      </div>
    );
  }

  return <>{children}</>;
};

// Inner App to use auth hooks
const AppRoutes = () => {
  const { user, logout } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <Layout user={user} onLogout={logout}>
              <Routes>
                {/* Common Routes */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                
                {/* Role Specific Routes */}
                <Route path="/parties" element={
                  <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                    <Parties />
                  </ProtectedRoute>
                } />
                
                <Route path="/employees" element={
                  <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR]}>
                    <Employees />
                  </ProtectedRoute>
                } />

                {/* Permissions Management */}
                <Route path="/settings/roles" element={
                  <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                    <Roles />
                  </ProtectedRoute>
                } />

                {/* Modules */}
                <Route path="/inventory" element={<PlaceholderModule title="Inventory" />} />
                <Route path="/sales" element={<PlaceholderModule title="Sales" />} />
                <Route path="/purchases" element={<PlaceholderModule title="Purchases" />} />
                <Route path="/banking" element={<PlaceholderModule title="Banking" />} />
                <Route path="/accounting" element={<PlaceholderModule title="Accounting" />} />
                <Route path="/payroll" element={<PlaceholderModule title="Payroll" />} />
                <Route path="/reports" element={<PlaceholderModule title="Reports" />} />
                <Route path="/documents" element={<PlaceholderModule title="Documents" />} />
                <Route path="/settings" element={<PlaceholderModule title="Settings" />} />
                
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;