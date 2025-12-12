import React from 'react'
import { ProtectedRoute } from '../components/common/private-route'
import { Login } from '../pages/login/Login'
import { Signup } from '../pages/signup/Signup'
import { Dashboard } from '../pages/dashboard/Dashboard'
import { Profile } from '../pages/profile/Profile'
import { Parties } from '../pages/parties/Parties'
import { Employees } from '../pages/employees/Employees'
import { Inventory } from '../pages/inventory/Inventory'
import { Roles } from '../pages/roles/Roles'
import { Sales } from '../pages/sales/Sales'
import { NotFound } from '../pages/not-found/NotFound'
import { ForgotPassword } from '../pages/forgot-password/ForgotPassword'

// Placeholder for future modules
const PlaceholderModule = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
    <div className="bg-slate-100 p-6 rounded-full mb-4">
      <span className="text-4xl">🚧</span>
    </div>
    <h2 className="text-2xl font-bold text-slate-800 mb-2">{title} Module</h2>
    <p className="text-slate-500 max-w-md">
      This module is currently under development. It will handle{' '}
      {title.toLowerCase()} related operations.
    </p>
  </div>
)

export interface RouteConfig {
  path: string
  element: React.ReactElement
  permissionScope?: string
  allowedRoles?: string[]
}

// Public routes (no authentication required)
export const publicRoutes: RouteConfig[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  }
]

// Protected routes (require authentication)
export const protectedRoutes: RouteConfig[] = [
  // Common Routes (no additional permissions)
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },

  // Role Specific Routes
  {
    path: '/parties',
    element: <Parties />,
    permissionScope: 'Contacts',
  },
  {
    path: '/employees',
    element: <Employees />,
    permissionScope: 'Payroll',
  },
  {
    path: '/inventory',
    element: <Inventory />,
    permissionScope: 'Inventory',
  },
  {
    path: '/settings/roles',
    element: <Roles />,
    permissionScope: 'Settings.Role',
  },

  // Modules
  {
    path: '/sales',
    element: <Sales />,
    permissionScope: 'Sales',
  },
  {
    path: '/purchases',
    element: <PlaceholderModule title="Purchases" />,
    permissionScope: 'Purchase',
  },
  {
    path: '/banking',
    element: <PlaceholderModule title="Banking" />,
    permissionScope: 'Cash And Bank',
  },
  {
    path: '/accounting',
    element: <PlaceholderModule title="Accounting" />,
    permissionScope: 'Accountant',
  },
  {
    path: '/payroll',
    element: <PlaceholderModule title="Payroll" />,
    permissionScope: 'Payroll',
  },
  {
    path: '/reports',
    element: <PlaceholderModule title="Reports" />,
    permissionScope: 'Reports',
  },
  {
    path: '/documents',
    element: <PlaceholderModule title="Documents" />,
    permissionScope: 'Documents',
  },
  {
    path: '/settings',
    element: <PlaceholderModule title="Settings" />,
    permissionScope: 'Settings',
  },

  // 404 Route
  {
    path: '*',
    element: <NotFound />,
  },
]
