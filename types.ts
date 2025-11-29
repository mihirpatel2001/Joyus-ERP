import React from 'react';
import { LucideIcon } from 'lucide-react';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN', // Root user
  ADMIN = 'ADMIN',
  HR = 'HR',
  EMPLOYEE = 'EMPLOYEE',
}

export interface Permission {
  read: boolean;
  write: boolean;
  edit: boolean;
  delete: boolean;
}

export interface ModulePermissions {
  [subModule: string]: Permission;
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  permissions: {
    [category: string]: ModulePermissions;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: number;
  allowedRoles?: UserRole[]; // Coarse-grained Role check
  permissionScope?: string;  // Fine-grained Permission Category check (e.g., 'Sales')
}

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  color?: string;
  bg?: string;
}

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export interface Party {
  id: string;
  name: string;
  type: 'Customer' | 'Vendor';
  email: string;
  phone: string;
  receivables: number;
  payables: number;
  status: 'Active' | 'Inactive';
}

export interface SalaryRecord {
  id: string;
  date: string;
  amount: number;
  frequency: 'Monthly' | 'Bi-Weekly' | 'Weekly' | 'Annually';
  reason: string;
  changedBy: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  joinDate: string;
  // Salary Details
  currentSalary?: number;
  payFrequency?: 'Monthly' | 'Bi-Weekly' | 'Weekly' | 'Annually';
  salaryHistory?: SalaryRecord[];
}