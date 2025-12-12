import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { UserRole } from '@/src/types/types'

interface ProtectedRouteProps {
    children: React.ReactNode
    allowedRoles?: UserRole[]
    permissionScope?: string
}

const AccessDenied = ({ required }: { required: string }) => (
    <div className="flex flex-col items-center justify-center h-full min-h-[50vh]">
        <h2 className="text-2xl font-bold text-slate-800">Access Denied</h2>
        <p className="text-slate-500 mt-2">
            You do not have permission to view this page.
        </p>
        <p className="text-xs text-slate-400 mt-4">Required: {required}</p>
    </div>
)

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
    permissionScope,
}) => {
    const { isAuthenticated, hasRole, hasModuleAccess, isLoading } = useAuth()
    const location = useLocation()

    // Check authentication - either from AuthContext or from accessToken in localStorage (AuthContextV2)
    const accessToken = localStorage.getItem('accessToken')
    const userFromStorage = localStorage.getItem('user')
    const isAuthenticatedV2 = !!(accessToken && userFromStorage)
    
    // Use either AuthContext authentication or AuthContextV2 authentication
    const isUserAuthenticated = isAuthenticated || isAuthenticatedV2

    if (!isUserAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // Check Role-based access (Legacy/Fallback)
    // if (allowedRoles && !hasRole(allowedRoles)) {
    //     return <AccessDenied required={allowedRoles.join(', ')} />
    // }

    // // Check Permission-based access (Dynamic)
    // if (permissionScope && !hasModuleAccess(permissionScope)) {
    //     return <AccessDenied required={`Permission: ${permissionScope}`} />
    // }

    return <>{children}</>
}

