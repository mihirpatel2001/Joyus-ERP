import { useMutation } from '@tanstack/react-query'
import { ApiCollection } from '../../config/envConfig'
import { handleLoginResponse } from '../../utils/authUtils'
import { useAxios1 } from '../axios/useAxios'

interface InitialLoginData {
  email?: string
  mobile?: string
  password: string
  os?: string
}

interface CompanySelectionLoginData {
  email?: string
  mobile?: string
  password: string
  os: string
  companyId: number
  staffId: number
}

export const useUserLogin = (onSuccess?: any, onError?: any) => {
  const axiosInstance = useAxios1('AccessToken')
  const urlKey = ApiCollection.user.login

  return useMutation({
    mutationFn: async (data: InitialLoginData) => {
      const payload: any = {
        password: data.password,
        os: data.os || 'web',
      };

      if (data.email) {
        payload.email = data.email;
      }

      if (data.mobile) {
        payload.mobile = data.mobile;
      }

      const response = await axiosInstance.post(urlKey, payload)
      return response
    },
    onSuccess: (response) => {
      try {
        const responseData = response?.data?.data || response?.data
        const isMultiCompany = responseData?.isMultiCompany === true

        if (isMultiCompany) {
          const loginData = {
            user: responseData.user,
            companies: responseData.company, // Array of companies
            isMultiCompany: true,
            tokens: undefined,
          }
          if (onSuccess) {
            onSuccess(loginData, response)
          }
        } else {
          // Single company: handle full response with tokens
          const loginData = handleLoginResponse(response)
          if (onSuccess) {
            onSuccess(loginData, response)
          }
        }
      } catch (error) {
        if (onError) {
          onError(error)
        }
      }
    },
    onError: (err) => {
      if (onError) {
        onError(err)
      }
    },
  })
}

export const useCompanySelectionLogin = (onSuccess?: any, onError?: any) => {
  const axiosInstance = useAxios1('AccessToken')
  const urlKey = ApiCollection.user.login

  return useMutation({
    mutationFn: async (data: CompanySelectionLoginData) => {
      const payload: any = {
        password: data.password,
        os: data.os,
        companyId: data.companyId,
        staffId: data.staffId,
      };

      if (data.email) payload.email = data.email;
      if (data.mobile) payload.mobile = data.mobile;

      const response = await axiosInstance.post(urlKey, payload)
      return response
    },
    onSuccess: (response) => {
      try {
        const responseData = response?.data?.data || response?.data
        const isMultiCompany = responseData?.isMultiCompany === true

        if (isMultiCompany) {
          const loginData = {
            user: responseData.user,
            companies: responseData.company, // Array of companies
            isMultiCompany: true,
            tokens: undefined,
          }
          if (onSuccess) {
            onSuccess(loginData, response)
          }
        } else {
          // Single company: handle full response with tokens
          const loginData = handleLoginResponse(response)
          if (onSuccess) {
            onSuccess(loginData, response)
          }
        }
      } catch (error) {
        if (onError) {
          onError(error)
        }
      }
    },
    onError: (err) => {
      if (onError) {
        onError(err)
      }
    },
  })
}
