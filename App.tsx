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
const ProtectedRoute: React.FC<React.PropsWithChildren<{ allowedRoles?: UserRole[], permissionScope?: string }>> = ({ children, allowedRoles, permissionScope }) => {
  const { isAuthenticated, hasRole, hasModuleAccess } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check Role-based access (Legacy/Fallback)
  if (allowedRoles && !hasRole(allowedRoles)) {
    return <AccessDenied required={allowedRoles.join(', ')} />;
  }

  // Check Permission-based access (Dynamic)
  if (permissionScope && !hasModuleAccess(permissionScope)) {
     return <AccessDenied required={`Permission: ${permissionScope}`} />;
  }

  return <>{children}</>;
};

const AccessDenied = ({ required }: { required: string }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[50vh]">
    <h2 className="text-2xl font-bold text-slate-800">Access Denied</h2>
    <p className="text-slate-500 mt-2">You do not have permission to view this page.</p>
    <p className="text-xs text-slate-400 mt-4">Required: {required}</p>
  </div>
);

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
                  <ProtectedRoute permissionScope="Contacts">
                    <Parties />
                  </ProtectedRoute>
                } />
                
                <Route path="/employees" element={
                  <ProtectedRoute permissionScope="Payroll">
                    <Employees />
                  </ProtectedRoute>
                } />

                {/* Permissions Management - Controlled by 'Settings.Role' permission */}
                <Route path="/settings/roles" element={
                  <ProtectedRoute permissionScope="Settings.Role">
                    <Roles />
                  </ProtectedRoute>
                } />

                {/* Modules */}
                <Route path="/inventory" element={<ProtectedRoute permissionScope="Inventory"><PlaceholderModule title="Inventory" /></ProtectedRoute>} />
                <Route path="/sales" element={<ProtectedRoute permissionScope="Sales"><PlaceholderModule title="Sales" /></ProtectedRoute>} />
                <Route path="/purchases" element={<ProtectedRoute permissionScope="Purchase"><PlaceholderModule title="Purchases" /></ProtectedRoute>} />
                <Route path="/banking" element={<ProtectedRoute permissionScope="Cash And Bank"><PlaceholderModule title="Banking" /></ProtectedRoute>} />
                <Route path="/accounting" element={<ProtectedRoute permissionScope="Accountant"><PlaceholderModule title="Accounting" /></ProtectedRoute>} />
                <Route path="/payroll" element={<ProtectedRoute permissionScope="Payroll"><PlaceholderModule title="Payroll" /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute permissionScope="Reports"><PlaceholderModule title="Reports" /></ProtectedRoute>} />
                <Route path="/documents" element={<ProtectedRoute permissionScope="Documents"><PlaceholderModule title="Documents" /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute permissionScope="Settings"><PlaceholderModule title="Settings" /></ProtectedRoute>} />
                
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