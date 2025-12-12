import { useQuery } from '@tanstack/react-query'
import { useAxios1 } from '../axios/useAxios'
import { ApiCollection } from '../../config/envConfig'

interface GetEmployeesParams {
  search?: string
}

export const useGetEmployees = (params: GetEmployeesParams, enabled: boolean = true) => {
  const axios = useAxios1()
  const urlKey = ApiCollection.staff.getAll

  return useQuery({
    queryKey: ['employees', params.search],
    queryFn: async () => {
      const queryParams = new URLSearchParams()
      if (params.search) {
        queryParams.append('search', params.search)
      }

      const url = queryParams.toString() ? `${urlKey}?${queryParams.toString()}` : urlKey
      const response = await axios.get(url)
      return response
    },
    enabled: enabled && !!params.search && params.search.length === 10, // Only fetch when search is exactly 10 digits
    staleTime: 0, // Always fetch fresh data
  })
}

