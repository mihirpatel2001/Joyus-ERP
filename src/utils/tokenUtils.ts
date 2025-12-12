/**
 * Token utility functions for managing access and refresh tokens with expiry checking
 */

interface TokenData {
  token: string
  expires: string
}

/**
 * Check if a token is expired or will expire soon (within 5 minutes)
 * @param expires - ISO date string of token expiry
 * @param bufferMinutes - Buffer time in minutes before expiry to consider token as expired (default: 5)
 * @returns true if token is expired or will expire soon
 */
export const isTokenExpired = (
  expires: string | null,
  bufferMinutes: number = 5
): boolean => {
  if (!expires) return true

  try {
    const expiryDate = new Date(expires)
    const now = new Date()
    const bufferTime = bufferMinutes * 60 * 1000 // Convert minutes to milliseconds

    // Check if token is expired or will expire within buffer time
    return expiryDate.getTime() <= now.getTime() + bufferTime
  } catch (error) {
    console.error('Error parsing token expiry:', error)
    return true
  }
}

/**
 * Get access token from localStorage
 */
export const getAccessToken = (): string | null => {
  try {
    return localStorage.getItem('accessToken')
  } catch (error) {
    console.error('Error getting access token:', error)
    return null
  }
}

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  try {
    return localStorage.getItem('refreshToken')
  } catch (error) {
    console.error('Error getting refresh token:', error)
    return null
  }
}

/**
 * Get access token expiry from localStorage
 */
export const getAccessTokenExpiry = (): string | null => {
  try {
    return localStorage.getItem('accessTokenExpiry')
  } catch (error) {
    console.error('Error getting access token expiry:', error)
    return null
  }
}

/**
 * Get refresh token expiry from localStorage
 */
export const getRefreshTokenExpiry = (): string | null => {
  try {
    return localStorage.getItem('refreshTokenExpiry')
  } catch (error) {
    console.error('Error getting refresh token expiry:', error)
    return null
  }
}

/**
 * Store tokens and their expiry times in localStorage
 * @param accessToken - Access token data
 * @param refreshToken - Refresh token data
 */
export const storeTokens = (
  accessToken: TokenData,
  refreshToken: TokenData
): void => {
  try {
    localStorage.setItem('accessToken', accessToken.token)
    localStorage.setItem('refreshToken', refreshToken.token)
    localStorage.setItem('accessTokenExpiry', accessToken.expires)
    localStorage.setItem('refreshTokenExpiry', refreshToken.expires)
  } catch (error) {
    console.error('Error storing tokens:', error)
    throw error
  }
}

/**
 * Clear all tokens from localStorage
 */
export const clearTokens = (): void => {
  try {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('accessTokenExpiry')
    localStorage.removeItem('refreshTokenExpiry')
  } catch (error) {
    console.error('Error clearing tokens:', error)
  }
}

/**
 * Check if access token needs to be refreshed
 * @returns true if access token is expired or will expire soon
 */
export const shouldRefreshAccessToken = (): boolean => {
  const accessTokenExpiry = getAccessTokenExpiry()
  return isTokenExpired(accessTokenExpiry)
}

/**
 * Check if refresh token is still valid
 * @returns true if refresh token is not expired
 */
export const isRefreshTokenValid = (): boolean => {
  const refreshTokenExpiry = getRefreshTokenExpiry()
  return !isTokenExpired(refreshTokenExpiry, 0) // No buffer for refresh token
}

