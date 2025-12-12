import { storeTokens } from './tokenUtils'

/**
 * Utility function to handle login response and store data in localStorage
 * @param response - The API response from login endpoint
 */
export const handleLoginResponse = (response: any) => {
  try {
    const responseData = response?.data?.data || response?.data

    if (!responseData) {
      throw new Error('Invalid login response structure')
    }

    const isMultiCompany = responseData.isMultiCompany === true

    // Extract tokens (only available when isMultiCompany is false or after company selection)
    const accessToken = responseData.tokens?.access?.token
    const refreshToken = responseData.tokens?.refresh?.token
    const accessTokenExpires = responseData.tokens?.access?.expires
    const refreshTokenExpires = responseData.tokens?.refresh?.expires

    // Store tokens only if they exist (not available in multi-company initial response)
    if (accessToken && refreshToken) {
      storeTokens(
        {
          token: accessToken,
          expires: accessTokenExpires,
        },
        {
          token: refreshToken,
          expires: refreshTokenExpires,
        }
      )
    }

    // Store user data
    if (responseData.user) {
      localStorage.setItem('user', JSON.stringify(responseData.user))
    }

    // Handle company data - can be array (multi-company) or object (single company)
    if (responseData.company) {
      if (Array.isArray(responseData.company)) {
        // Multi-company: store as array
        localStorage.setItem('companies', JSON.stringify(responseData.company))
        // Don't store single company yet - wait for selection
      } else {
        // Single company: store as object
        localStorage.setItem('company', JSON.stringify(responseData.company))
      }
    }

    // Store role data (only available when isMultiCompany is false or after company selection)
    if (responseData.role) {
      localStorage.setItem('role', JSON.stringify(responseData.role))
    }

    // Store isMultiCompany flag
    if (isMultiCompany !== undefined) {
      localStorage.setItem('isMultiCompany', JSON.stringify(isMultiCompany))
    }

    return {
      user: responseData.user,
      company: responseData.company, // Can be array or object
      companies: Array.isArray(responseData.company) ? responseData.company : undefined,
      role: responseData.role,
      isMultiCompany: isMultiCompany,
      tokens: accessToken && refreshToken
        ? {
            access: {
              token: accessToken,
              expires: accessTokenExpires,
            },
            refresh: {
              token: refreshToken,
              expires: refreshTokenExpires,
            },
          }
        : undefined,
    }
  } catch (error) {
    console.error('Error handling login response:', error)
    throw error
  }
}

