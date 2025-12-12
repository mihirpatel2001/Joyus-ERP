import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { useAxios1 } from '../axios/useAxios'
import { ApiCollection } from '@/src/config/envConfig'

type SortOrder = 'ASC' | 'DESC'

export interface FetchEmployeeParams {
    page?: number
    limit?: number
    sortOrder?: SortOrder
    search?: string
}

export interface StaffListApiResponse {
    success: boolean
    message: string
    data: {
        users: any[]
        total: number
        page: number
        limit: number
        totalPages: number
    }
}

export const useFetchEmployee = (
    params?: FetchEmployeeParams
): UseQueryResult<AxiosResponse<StaffListApiResponse>> => {
    const axios = useAxios1()
    const urlKey = ApiCollection.staff.list

  return useQuery<AxiosResponse<StaffListApiResponse>>({
    queryKey: ['staff-list', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()

      if (params?.page) searchParams.append('page', String(params.page))
      if (params?.limit) searchParams.append('limit', String(params.limit))
      if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder)
      if (params?.search) searchParams.append('search', params.search)

      const queryString = searchParams.toString()
      const url = queryString ? `${urlKey}?${queryString}` : urlKey

      const res = await axios.get<StaffListApiResponse>(url)
      return res
    },
    placeholderData: (oldData) => oldData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: true,
  })
}