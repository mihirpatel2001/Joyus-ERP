/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useUserLogOut } from '@/src/hooks/auth/useLogout'
import { useToast } from '@/src/context/ToastContext'

interface User {
  id: string
  first_name: string
  middle_name?: string
  last_name: string
  mobile: string
  email: string
  panCard?: string
  aadharcardNumber?: string
  gender?: string
  [key: string]: any
}

interface Company {
  id: string
  company_name: string
  company_logo?: string | null
  gst_number?: string
  is_active: boolean
  [key: string]: any
}

interface Role {
  id: string
  role_name: string
  description?: string
  company_id: string
  is_admin: boolean
  is_active: boolean
  permissions?: any[]
  [key: string]: any
}

interface LoginResponseData {
  user: User
  company: Company
  role: Role
  tokens: {
    access: string | { token: string; expires?: string }
    refresh: string | { token: string; expires?: string }
  }
}

interface AuthContextV2Type {
  user: User | {}
  setUser: (user: User) => void
  LogOut: () => void
  company: Company | {}
  setCompany: (company: Company) => void
  role: Role | {}
  setRole: (role: Role) => void
  LogOutMutation: any
  handleLogin: (loginData: LoginResponseData) => void
}

const AuthContextV2 = createContext<AuthContextV2Type>({
  user: {},
  setUser: () => {},
  LogOut: () => {},
  company: {},
  setCompany: () => {},
  role: {},
  setRole: () => {},
  LogOutMutation: () => {},
  handleLogin: () => {},
})

export function AuthProviderV2({ children }: any) {
  const [user, setUser] = useState<User | {}>({})
  const [company, setCompany] = useState<Company | {}>({})
  const [role, setRole] = useState<Role | {}>({})
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Initialize user, company, and role from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedCompany = localStorage.getItem('company')
    const storedRole = localStorage.getItem('role')

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing user from localStorage:', error)
      }
    }

    if (storedCompany) {
      try {
        setCompany(JSON.parse(storedCompany))
      } catch (error) {
        console.error('Error parsing company from localStorage:', error)
      }
    }

    if (storedRole) {
      try {
        setRole(JSON.parse(storedRole))
      } catch (error) {
        console.error('Error parsing role from localStorage:', error)
      }
    }
  }, [])

  const LogOutMutation: any = useUserLogOut(
    (response: any) => {
      // Handle successful logout - display dynamic message from API
      const successMessage =
        response?.data?.message ||
        response?.data?.data?.message ||
        'Logged out successfully'
      
      showToast(successMessage, 'success')
      
      // Clear all data and logout
      LogOut()
    },
    (error: any) => {
      // Handle logout error - display dynamic error message from API
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.data?.message ||
        error?.response?.data?.data?.error ||
        error?.message ||
        'An error occurred during logout'
      
      showToast(errorMessage, 'error')
      
      // Even if logout API fails, clear local data and logout user
      LogOut()
    }
  )

  const handleLogin = (loginData: LoginResponseData) => {
    // Store tokens with expiry (if provided)
    if (typeof loginData.tokens.access === 'string') {
      localStorage.setItem('accessToken', loginData.tokens.access)
    } else {
      localStorage.setItem('accessToken', loginData.tokens.access.token)
      if (loginData.tokens.access.expires) {
        localStorage.setItem('accessTokenExpiry', loginData.tokens.access.expires)
      }
    }

    if (typeof loginData.tokens.refresh === 'string') {
      localStorage.setItem('refreshToken', loginData.tokens.refresh)
    } else {
      localStorage.setItem('refreshToken', loginData.tokens.refresh.token)
      if (loginData.tokens.refresh.expires) {
        localStorage.setItem('refreshTokenExpiry', loginData.tokens.refresh.expires)
      }
    }

    // Store user, company, and role
    localStorage.setItem('user', JSON.stringify(loginData.user))
    localStorage.setItem('company', JSON.stringify(loginData.company))
    localStorage.setItem('role', JSON.stringify(loginData.role))

    // Update state immediately
    setUser(loginData.user)
    setCompany(loginData.company)
    setRole(loginData.role)
  }

  const LogOut = () => {
    // Clear all localStorage items
    localStorage.removeItem('user')
    localStorage.removeItem('company')
    localStorage.removeItem('companies')
    localStorage.removeItem('role')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('accessTokenExpiry')
    localStorage.removeItem('refreshTokenExpiry')
    localStorage.removeItem('isMultiCompany')
    localStorage.removeItem('id_token')
    localStorage.removeItem('loginUsing')
    localStorage.removeItem('countryCode')
    localStorage.removeItem('selectedPlan')
    localStorage.removeItem('retryPaymentCounty')
    localStorage.removeItem('awsAccessToken')
    localStorage.removeItem('purchasePlan')

    // Clear any other localStorage items that might exist
    // Remove items that start with common prefixes
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (
        key.startsWith('joyous_') ||
        key.startsWith('auth_') ||
        key.startsWith('token_')
      )) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key))

    // Reset state
    setUser({})
    setCompany({})
    setRole({})

    // Clear React Query cache
    queryClient.clear()

    // Navigate to login page
    navigate('/login', { replace: true })
  }

  return (
    <React.Fragment>
      <AuthContextV2.Provider
        value={{
          user,
          setUser,
          LogOut,
          company,
          setCompany,
          role,
          setRole,
          LogOutMutation,
          handleLogin,
        }}
      >
        {children}
      </AuthContextV2.Provider>
    </React.Fragment>
  )
}

const useAuthV2 = () => {
  return useContext(AuthContextV2)
}

export default useAuthV2

