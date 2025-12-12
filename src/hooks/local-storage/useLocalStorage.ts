import { useQuery } from '@tanstack/react-query'

const useLocalStorage = (key: string) => {
  // return useQuery(
  //   key,
  //   async () => {
  //     const value = await window.localStorage.getItem(key)
  //     if (value !== null && key === 'user') {
  //       return JSON.parse(value)
  //     }
  //     if (value !== null && key !== 'user') {
  //       return value
  //     } else {
  //       return value
  //     }
  //   },
  //   {
  //     refetchInterval: false,
  //   }
  // )

  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const value = await window.localStorage.getItem(key)
      if (value !== null && key === 'user') {
        return JSON.parse(value)
      }
      if (value !== null && key !== 'user') {
        return value
      } else {
        return value
      }
    },
    refetchInterval: false,
  })
}

export default useLocalStorage
