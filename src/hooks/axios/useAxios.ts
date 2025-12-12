import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { useToast } from '@/src/context/ToastContext'
import { ApiCollection, ApiHead } from '@/src/config/envConfig'
import useAuthV2 from '@/src/context/AuthContextV2'
import {
  getRefreshToken,
  shouldRefreshAccessToken,
  isRefreshTokenValid,
  storeTokens,
  getAccessTokenExpiry,
  isTokenExpired,
} from '@/src/utils/tokenUtils'

export const useAxios1 = (type = 'AccessToken') => {
  const { user }: any = useAuthV2()
  const [Authorization, setAuthorization] = useState(() => {
    if (typeof window === 'undefined') return ''
    try {
      const item = localStorage.getItem('accessToken')
      return item || ''
    } catch (error) {
      return ''
    }
  })

  const [token] = useState(() => {
    if (typeof window === 'undefined') return ''
    try {
      const item = localStorage.getItem('id_token')
      return item ? JSON.parse(item) : {}
    } catch (error) {
      return ''
    }
  })

  const { showToast } = useToast()
  const { LogOut } = useAuthV2()
  const navigate = useNavigate()
  const isRefreshing = useRef(false)
  const failedQueue = useRef<Array<{
    resolve: (value?: any) => void
    reject: (error?: any) => void
  }>>([])

  /**
   * Refresh access token using refresh token API
   */
  async function refreshToken(): Promise<string> {
    // Prevent multiple simultaneous refresh calls
    if (isRefreshing.current) {
      return new Promise((resolve, reject) => {
        failedQueue.current.push({ resolve, reject })
      })
    }

    isRefreshing.current = true

    try {
      const _refreshToken = getRefreshToken()

      if (!_refreshToken) {
        throw new Error('No refresh token available')
      }

      // Check if refresh token is still valid
      if (!isRefreshTokenValid()) {
        throw new Error('Refresh token has expired')
      }

      const payload = {
        refreshToken: _refreshToken,
      }

      const axiosConfig1 = {
        baseURL: ApiHead,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_APP_PUBLIC_API_KEY || '',
        },
      }

      const urlKey = ApiCollection.accessToken.refreshTokenApi
      const response = await axios.post(urlKey, payload, axiosConfig1)

      // Handle response structure: response.data.data.access.token
      const responseData = response.data?.data || response.data
      const newAccessToken = responseData?.access?.token
      const newRefreshToken = responseData?.refresh?.token
      const accessTokenExpires = responseData?.access?.expires
      const refreshTokenExpires = responseData?.refresh?.expires

      if (!newAccessToken) {
        throw new Error('No access token in refresh response')
      }

      // Store new tokens with expiry times
      storeTokens(
        {
          token: newAccessToken,
          expires: accessTokenExpires,
        },
        {
          token: newRefreshToken || _refreshToken, // Use new refresh token if provided, otherwise keep old one
          expires: refreshTokenExpires,
        }
      )

      // Update authorization state
      setAuthorization(newAccessToken)

      // Process queued requests
      failedQueue.current.forEach(({ resolve }) => resolve(newAccessToken))
      failedQueue.current = []

      return newAccessToken
    } catch (error: any) {
      // Process queued requests with error
      failedQueue.current.forEach(({ reject }) => reject(error))
      failedQueue.current = []

      // If refresh fails, logout user
      if (error.response?.status === 401 || error.response?.status === 403) {
        LogOut()
      }
      throw error
    } finally {
      isRefreshing.current = false
    }
  }

  useEffect(() => {
    if (type === 'IdToken') {
      setAuthorization(`${token.id_token || ''}`)
    } else {
      const accessToken = localStorage.getItem('accessToken')
      setAuthorization(accessToken || '')
    }
  }, [token, type])

  const axiosConfig = {
    baseURL: ApiHead || '', // Use ApiHead from envConfig which should have VITE_PUBLIC_BASE_URL
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_APP_PUBLIC_API_KEY || '',
      Authorization: Authorization ? `Bearer ${Authorization}` : '',
    },
  }

  const axiosInstance = axios.create(axiosConfig)

  // Request interceptor: Set Authorization header with Bearer token
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Skip token check and remove Authorization header for login and refresh token endpoints
      if (
        config.url?.includes('/v1/auth/login') ||
        config.url?.includes('/v1/auth/refresh-tokens')
      ) {
        // Remove Authorization header for login/refresh endpoints
        if (config.headers) {
          delete config.headers['Authorization']
        }
        return config
      }

      // Ensure latest token is used with Bearer prefix
      const currentToken = localStorage.getItem('accessToken')
      if (currentToken && config.headers) {
        config.headers['Authorization'] = `Bearer ${currentToken}`
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor: Handle 401 errors and refresh token only when token is expired
  const interceptor = axiosInstance.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      const originalRequest = error.config

      // Handle 401 Unauthorized - Only refresh if token is actually expired
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        // Skip retry for login endpoint
        if (originalRequest.url?.includes('/v1/auth/login')) {
          return Promise.reject(error)
        }

        // Check if token is actually expired by comparing current time with accessTokenExpiry
        const accessTokenExpiry = getAccessTokenExpiry()
        const isTokenActuallyExpired = isTokenExpired(accessTokenExpiry, 0) // No buffer, check exact expiry

        // Only refresh token if it's actually expired
        if (isTokenActuallyExpired) {
          try {
            const newToken = await refreshToken()
            
            // Update the original request with new token (with Bearer prefix)
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`
            }

            // Retry the original request
            return axiosInstance(originalRequest)
          } catch (refreshError: any) {
            // Refresh failed, logout user
            LogOut()
            return Promise.reject(refreshError)
          }
        } else {
          // Token is not expired but we got 401 - might be invalid token or other issue
          // Logout user as token might be invalid
          LogOut()
          return Promise.reject(error)
        }
      } else if (error.response && error.response.status === 402) {
        // Handle 402 Payment Required
        showToast(
          error.response?.data?.error || error.response?.data?.message || 'Subscription required',
          'info'
        )
        navigate('/plan')
      }

      return Promise.reject(error)
    }
  )

  return axiosInstance
}
