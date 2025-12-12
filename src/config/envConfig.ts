// In Vite, use import.meta.env for environment variables in client-side code
export const ApiHead = import.meta.env.VITE_PUBLIC_BASE_URL || ''

export const ApiCollection = {
  user: {
    token: '/access-token',
    changePassword: '/v1/staff/change-password',
    login: '/v1/auth/login',
    signUp: '/sign-up',
    EditProfile: '/user-email',
    ForgotPassword: '/forgot-password',
    ResetPassword: '/confirm-password',
    logOut: '/v1/auth/logout',
  },
  accessToken: {
    accessTokenApi: '/access-token',
    refreshTokenApi: '/v1/auth/refresh-tokens',
  },
  staff: {
    getAll: '/v1/staff/get-all',
    create: '/v1/staff/create',
    list: '/v1/staff/staff-list',
  }
}
