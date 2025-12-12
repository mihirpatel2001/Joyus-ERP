interface LocalUser {
  /**
   * First name
   * @param string first name of user
   */
  firstName?: string

  /**
   * Last name
   * @param string last name of user
   */
  lastName?: string

  /**
   * username
   * @param string username
   */
  username: string

  /**
   * User email
   * @param string email
   */
  email: string

  /**
   * User Id
   * @param string id
   */
  id: string

  /**
   * User token
   * @param string token
   */
  token: string
  /**
   * Profile Picture url
   * @param string profilePicture
   */
  profilePicture: string

  /**
   * User Role
   * @param string role
   */
  role: string

  /**
   * Is user verified
   * @param boolean isVerified
   *
   * @default false
   */

  isVerified: boolean

  /**
   * User permissions
   * @param string[] permissions
   * @default []
   * @example ['read', 'write', 'delete']
   */

  permissions: string[]

  /**
   * User logged in
   * @param boolean loggedIn
   * @default false
   */
  loggedIn: boolean

  /**
   * User language
   * @param string language
   * @default 'en'
   * @example 'en', 'es'
   */
  language?: string

  /**
   * Company Information
   * @param object company
   */
  company: any
}

export type { LocalUser }
