import { LocalUser } from './localUser'

export const setActiveUser = async (value: LocalUser) => {
  try {
    const userData = JSON.stringify(value)
    localStorage.setItem('user', userData)
  } catch (e) {
    return e
  }
}
export const setLogoutUser = async () => {
  try {
    await localStorage.removeItem('user')
  } catch (e) {
    return e
  }
}
