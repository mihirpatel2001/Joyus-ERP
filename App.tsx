import React from 'react'
import { HashRouter as Router } from 'react-router-dom'
import { AuthProvider } from './src/context/AuthContext'
import { ToastProvider } from './src/context/ToastContext'
import { AppRoutes } from './src/routes'
import { AuthProviderV2 } from './src/context/AuthContextV2'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient()
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Router>
          <AuthProvider>
            <AuthProviderV2>
              <AppRoutes />
            </AuthProviderV2>
          </AuthProvider>
        </Router>
      </ToastProvider>
    </QueryClientProvider>
  )
}

export default App
