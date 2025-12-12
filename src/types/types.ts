import React from "react";
import { LucideIcon } from "lucide-react";

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN", // Root user
  ADMIN = "ADMIN",
  HR = "HR",
  EMPLOYEE = "EMPLOYEE",
  SALES_PERSON = "SALES_PERSON", // Added dedicated Sales Role
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

export interface Organization {
  id: string;
  name: string;
  address?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  organizationIds: string[]; // User belongs to these orgs
  currentOrganizationId?: string; // Currently logged into this org
}

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: number;
  allowedRoles?: UserRole[]; // Coarse-grained Role check
  permissionScope?: string; // Fine-grained Permission Category check (e.g., 'Sales')
}

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  color?: string;
  bg?: string;
}

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export interface Party {
  id: string;
  name: string;
  type: "Customer" | "Vendor";
  email: string;
  phone: string;
  receivables: number;
  payables: number;
  status: "Active" | "Inactive";
}

export interface SalaryRecord {
  id: string;
  date: string;
  amount: number;
  frequency: "Monthly" | "Bi-Weekly" | "Weekly" | "Annually";
  reason: string;
  changedBy: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role: string;
  status: "Active" | "Inactive";
  joinDate: string;
  organizationIds?: string[];
  
  // Extended Details
  firstName?: string;
  lastName?: string;
  password?: string; // Only used during creation/update
  pancard?: string;
  aadharCardNumber?: string;
  staffDOB?: string;
  
  // Address Details
  currentAddress?: string;
  currentCity?: string;
  currentState?: string;
  currentCountry?: string;
  currentPincode?: string;

  permanentAddress?: string;
  permanentCity?: string;
  permanentState?: string;
  permanentCountry?: string;
  permanentPincode?: string;

  // Salary Details
  currentSalary?: number;
  payFrequency?: "Monthly" | "Bi-Weekly" | "Weekly" | "Annually";
  salaryHistory?: SalaryRecord[];
  
  // Commission & Sales Details
  commissionRate?: number; // Percentage (e.g., 5.0)
  totalSales?: number; // Total volume of sales generated (e.g., 1000000)
  commissionEarned?: number; // Calculated amount
}

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  hsn?: string;
  unit: string;
  type: "Goods" | "Service";
  salesRate?: number;
  purchaseRate?: number;
  stockOnHand: number;
  salesAccount?: string;
  purchaseAccount?: string;
  tax?: string;
}


// Sales & Documents

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Estimate {
  id: string;
  customerName: string;
  customerEmail?: string;
  date: string;
  expiryDate: string;
  items: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Converted' | 'Declined';
  salesPersonId: string;
  salesPersonName: string;
  signature?: string; // base64 string
}

export interface Invoice {
  id: string;
  estimateId?: string; // Linked estimate
  customerName: string;
  customerEmail?: string;
  date: string;
  dueDate?: string;
  items: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  salesPersonId: string;
  salesPersonName: string;
  signature?: string;
}