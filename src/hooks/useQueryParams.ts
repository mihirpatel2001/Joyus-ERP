import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

type ModuleParams = Record<string, Record<string, string>>

export function useQueryParams(
  moduleName: string,
  defaults?: Record<string, string | number | boolean>
) {
  const location = useLocation()
  const navigate = useNavigate()

  const getInitialParams = () => {
    const searchParams = new URLSearchParams(location.search)
    const initial: ModuleParams = {}

    if (!initial[moduleName]) initial[moduleName] = {}

    if (defaults) {
      Object.entries(defaults).forEach(([key, value]) => {
        initial[moduleName] = { ...initial[moduleName], [key]: String(value) }
      })
    }

    searchParams.forEach((value, key) => {
      initial[moduleName] = { ...initial[moduleName], [key]: String(value) }
    })

    return initial
  }

  const [params, setParamsState] = useState<ModuleParams>(getInitialParams())

  useEffect(() => {
    const searchParams = new URLSearchParams()
    const moduleParams = params[moduleName] as Record<string, string>

    Object.entries(moduleParams || {}).forEach(([key, value]) => {
      searchParams.set(key, value)
    })

    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true,
    })
  }, [params, moduleName, location.pathname, navigate])

  const setParams = (
    newParams: Record<string, string | number | boolean | null | undefined>,
    options?: { reset?: boolean }
  ) => {
    setParamsState((prev) => {
      let updated: Record<string, string> = {}

      if (options?.reset) {
        updated = {
          page: prev[moduleName]?.page || '1',
          limit: prev[moduleName]?.limit || '10',
          search: prev[moduleName]?.search || '',
        }
      } else {
        updated = { ...(prev[moduleName] || {}) }
      }

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          delete updated[key]
        } else {
          updated[key] = String(value)
        }
      })

      if (!updated.page) updated.page = '1'
      if (!updated.limit) updated.limit = '10'

      return {
        ...prev,
        [moduleName]: updated,
      }
    })
  }

  return { params: params[moduleName] || {}, setParams } as const
}

