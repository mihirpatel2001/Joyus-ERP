import { useMutation } from '@tanstack/react-query'
import { useAxios1 } from '../axios/useAxios'
import { ApiCollection } from '../../config/envConfig'

interface CreateStaffData {
  roleId: number
  email: string
  mobile: string
  firstName: string
  lastName: string
  password: string
  pancard?: string
  aadharCardNumber?: string
  currentAddress?: string
  permanentAddress?: string
  currentCity?: string
  permanentCity?: string
  permanentState?: string
  currentCountry?: string
  permanentCountry?: string
  currentPincode?: string
  permanentPincode?: string
  staffDOB?: string
  currentState?: string
}

export const useAddEmployee = (onSuccess?: any, onError?: any) => {
  const axios = useAxios1()
  const urlKey = ApiCollection.staff.create

  return useMutation({
    mutationFn: async (data: CreateStaffData) => {
      const response = await axios.post(urlKey, data)
      return response
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

