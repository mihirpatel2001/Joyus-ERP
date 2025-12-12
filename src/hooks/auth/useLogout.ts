import { useMutation } from '@tanstack/react-query'

import { useAxios1 } from '../axios/useAxios'
import { ApiCollection } from '../../config/envConfig'

export const useUserLogOut = (onSuccess?: any, onError?: any) => {
  const axios = useAxios1()

  const urlKey = ApiCollection.user.logOut

  return useMutation({
    mutationFn: async () => {
      // Logout API call - no body needed, token is sent in Authorization header
      const res = await axios.post(urlKey, {})
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
