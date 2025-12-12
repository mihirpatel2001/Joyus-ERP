import { useMutation } from '@tanstack/react-query'
import { useAxios1 } from '../axios/useAxios'
import { ApiCollection } from '../../config/envConfig'

interface ChangePasswordData {
  oldPassword: string
  newPassword: string
}

export const useChangePassword = (onSuccess?: any, onError?: any) => {
  const axios = useAxios1()

  const urlKey = ApiCollection.user.changePassword

  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      // API expects oldPassword and newPassword
      const payload = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }
      const res = await axios.put(urlKey, payload)
      return res
    },
    onSuccess: (response) => {
      if (onSuccess) {
        onSuccess(response)
      }
    },
    onError: (err) => {
      if (onError) {
        onError(err)
      }
    },
  })
}
