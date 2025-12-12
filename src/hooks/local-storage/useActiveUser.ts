import { useState, useEffect } from 'react'
import { User } from './userSchema'

const useActiveUser = () => {
  const [value, setValue] = useState<User>()

  useEffect(() => {
    const getActiveUser = async () => {
      try {
        const userData = localStorage.getItem('user')
        setValue(userData != null ? JSON.parse(userData) : null)
      } catch (e) {
        return e
      }
    }

    getActiveUser()
  }, [])

  return value
}

export default useActiveUser
