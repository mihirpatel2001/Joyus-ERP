interface User {
  name: string
  email: string
  id: string
  token: string
  profilePicture: string
  role: string
  isVerified: boolean
  permissions: string[]
  loggedIn: boolean
  language: string
  userType: string
}

export type { User }
