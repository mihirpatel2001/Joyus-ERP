import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Layout } from '../components/layout/Layout'
import { ProtectedRoute } from '../components/common/private-route'
import { publicRoutes, protectedRoutes, RouteConfig } from './routes.config'

// Helper to render a route with protection if needed
const renderRoute = (route: RouteConfig) => {
  const { path, element, permissionScope, allowedRoles } = route

  // If route needs protection, wrap it
  if (permissionScope || allowedRoles) {
    return (
      <Route
        path={path}
        element={
          <ProtectedRoute
            permissionScope={permissionScope}
            allowedRoles={allowedRoles}
          >
            {element}
          </ProtectedRoute>
        }
      />
    )
  }

  // Public route
  return <Route path={path} element={element} />
}

export const AppRoutes = () => {
  const { user, logout } = useAuth()

  return (
    <Routes>
      {/* Public Routes */}
      {publicRoutes.map((route) => (
        <React.Fragment key={route.path}>{renderRoute(route)}</React.Fragment>
      ))}

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout user={user} onLogout={logout}>
              <Routes>
                {protectedRoutes.map((route) => (
                  <React.Fragment key={route.path}>
                    {renderRoute(route)}
                  </React.Fragment>
                ))}
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
