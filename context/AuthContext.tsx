import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, RoleDefinition, Permission, Organization } from '../types';
import { MOCK_USERS, DEFAULT_ROLES, MOCK_ORGANIZATIONS } from '../constants';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  organizations: Organization[]; // List of all available organizations
  verifyCredentials: (email: string, password: string) => Promise<User | null>; // Step 1
  login: (user: User, orgId: string) => void; // Step 2 (Final)
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  hasModuleAccess: (scope: string) => boolean;
  getPermission: (scope: string) => Permission;
  roles: RoleDefinition[];
  updateRole: (updatedRole: RoleDefinition) => void;
  updateUserProfile: (data: { name?: string; avatarUrl?: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to map UserRole enum to Role ID convention
const getRoleIdFromEnum = (role: UserRole): string => {
  switch (role) {
    case UserRole.SUPER_ADMIN: return 'role_super_admin';
    case UserRole.ADMIN: return 'role_admin';
    case UserRole.HR: return 'role_hr';
    case UserRole.EMPLOYEE: return 'role_employee';
    default: return 'role_employee';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [roles, setRoles] = useState<RoleDefinition[]>(DEFAULT_ROLES);
  const [organizations] = useState<Organization[]>(MOCK_ORGANIZATIONS);

  // Initialize Roles from LocalStorage or Default
  useEffect(() => {
    const storedRoles = localStorage.getItem('joyous_roles');
    if (storedRoles) {
      setRoles(JSON.parse(storedRoles));
    } else {
      // First time load, save defaults
      localStorage.setItem('joyous_roles', JSON.stringify(DEFAULT_ROLES));
    }

    // Check user session
    const storedUser = localStorage.getItem('joyous_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Step 1: Verify Email/Password only (Returns User object if valid, else null)
  const verifyCredentials = async (email: string, password: string): Promise<User | null> => {
    const foundUser = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
       // Check if we have updated info in local storage for this email (simulating DB persistence)
      const storedUsersRaw = localStorage.getItem('joyous_users_db');
      let userData = { ...foundUser };

      if (storedUsersRaw) {
        const storedUsers = JSON.parse(storedUsersRaw);
        if (storedUsers[foundUser.id]) {
          userData = { ...userData, ...storedUsers[foundUser.id] };
        }
      }
      return userData as User;
    }
    return null;
  };

  // Step 2: Finalize Login with Selected Organization
  const login = (userData: User, orgId: string) => {
    const userSession: User = {
      ...userData,
      currentOrganizationId: orgId
    };

    setUser(userSession);
    setIsAuthenticated(true);
    localStorage.setItem('joyous_user', JSON.stringify(userSession));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('joyous_user');
  };

  // Update a role and persist to LocalStorage
  const updateRole = (updatedRole: RoleDefinition) => {
    const newRoles = roles.map(r => r.id === updatedRole.id ? updatedRole : r);
    // If it's a new role, add it
    if (!roles.find(r => r.id === updatedRole.id)) {
      newRoles.push(updatedRole);
    }
    setRoles(newRoles);
    localStorage.setItem('joyous_roles', JSON.stringify(newRoles));
  };

  const updateUserProfile = (data: { name?: string; avatarUrl?: string }) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('joyous_user', JSON.stringify(updatedUser));

    // "Persist" to mock DB structure for next login
    const storedUsersRaw = localStorage.getItem('joyous_users_db');
    const storedUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : {};
    storedUsers[user.id] = { ...storedUsers[user.id], ...data };
    localStorage.setItem('joyous_users_db', JSON.stringify(storedUsers));
  };

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    if (user.role === UserRole.SUPER_ADMIN) return true;
    return allowedRoles.includes(user.role);
  };

  // Retrieve specific permission object for a scope (e.g. 'Settings.Role')
  const getPermission = (scope: string): Permission => {
    const defaultPerm = { read: false, write: false, edit: false, delete: false };
    if (!user) return defaultPerm;
    
    // Super Admin has full access
    if (user.role === UserRole.SUPER_ADMIN) {
      return { read: true, write: true, edit: true, delete: true };
    }

    const roleId = getRoleIdFromEnum(user.role);
    const userRoleDef = roles.find(r => r.id === roleId);
    if (!userRoleDef || !userRoleDef.permissions) return defaultPerm;

    // Handle dot notation "Category.SubModule"
    if (scope.includes('.')) {
      const [category, subModule] = scope.split('.');
      return userRoleDef.permissions[category]?.[subModule] || defaultPerm;
    }

    return defaultPerm;
  };

  // Check if the current user has READ access to a module or sub-module
  const hasModuleAccess = (scope: string): boolean => {
    if (!user) return false;
    if (user.role === UserRole.SUPER_ADMIN) return true;

    const roleId = getRoleIdFromEnum(user.role);
    const userRoleDef = roles.find(r => r.id === roleId);
    if (!userRoleDef || !userRoleDef.permissions) return false;

    // Handle dot notation "Category.SubModule"
    if (scope.includes('.')) {
      const [category, subModule] = scope.split('.');
      return userRoleDef.permissions[category]?.[subModule]?.read === true;
    }

    // Handle broad Category check (returns true if ANY submodule is readable)
    const categoryPerms = userRoleDef.permissions[scope];
    if (!categoryPerms) return false;

    return Object.values(categoryPerms).some((perm: Permission) => perm.read === true);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      organizations,
      verifyCredentials,
      login, 
      logout, 
      hasRole, 
      hasModuleAccess,
      getPermission,
      roles,
      updateRole,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};