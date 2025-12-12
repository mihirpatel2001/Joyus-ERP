import { useMutation } from '@tanstack/react-query'
import { useAxios1 } from '../axios/useAxios'
import { ApiCollection } from '../../config/envConfig'

export const useEditProfile = (onSuccess?: any, onError?: any) => {
  const axios = useAxios1()

  const urlKey = ApiCollection.user.EditProfile

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.patch(urlKey, data)
      return res
    },
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data)
      }
    },
    onError: (err) => {
      if (onError) {
        onError(err)
      }
    },
  })
}
