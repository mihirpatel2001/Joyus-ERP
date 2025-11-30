import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Package, 
  ShoppingCart, 
  FileText, 
  BarChart3,
  CreditCard,
  BookOpen,
  Receipt,
  LogOut,
  User as UserIcon,
  Briefcase,
  UserPlus,
  ShieldCheck
} from 'lucide-react';
import { NavItem, UserRole, RoleDefinition, Organization } from './types';

export const APP_NAME = "Joyous ERP";

// Definition of Modules for the Roles UI
// These Keys must match permissionScope in NAV_ITEMS exactly
export const PERMISSION_MODULES: { [key: string]: string[] } = {
  'Company': ['Dashboard', 'Payment Term', 'Item', 'Bank', 'Tax', 'Manufacturing'],
  'Contacts': ['Customer', 'Vendor'],
  'Payroll': ['Employee', 'Salary', 'Attendance'], // Employees page maps here
  'Inventory': ['Item', 'Stock', 'Warehouse', 'Category'],
  'Sales': ['Estimate', 'Invoice', 'Credit Note', 'Repeating Invoice', 'Sales Person', 'Payment Received', 'Retail Invoice', 'Delivery Challan'],
  'Purchase': ['Expense', 'Order', 'Bill', 'Vendor Credit', 'Repeating Bill', 'Payment Made', 'Repeating Expense'],
  'Cash And Bank': ['Payment', 'Receipt'], // Banking maps here
  'Accountant': ['Journals', 'Chart of Account', 'Bulk Entries'], // Accounting maps here
  'Reports': ['Financial', 'Inventory', 'Sales', 'Purchase'],
  'Documents': ['Receipts', 'Statements', 'Upload'],
  'Settings': ['Company', 'Users', 'Role', 'Subscription'] // Roles & Settings map here
};

// Navigation with Strict Permission Scopes
export const NAV_ITEMS: NavItem[] = [
  { 
    label: 'Dashboard', 
    path: '/', 
    icon: LayoutDashboard,
    permissionScope: 'Company' // Requires read access to 'Company' module
  },
  { 
    label: 'Parties', 
    path: '/parties', 
    icon: Users, 
    badge: 0,
    permissionScope: 'Contacts'
  },
  { 
    label: 'Employees', 
    path: '/employees', 
    icon: UserPlus,
    permissionScope: 'Payroll' // Mapped to Payroll because PERMISSION_MODULES.Payroll includes 'Employee'
  },
  { 
    label: 'Inventory', 
    path: '/inventory', 
    icon: Package,
    permissionScope: 'Inventory'
  },
  { 
    label: 'Sales', 
    path: '/sales', 
    icon: ShoppingCart,
    permissionScope: 'Sales'
  },
  { 
    label: 'Purchase', // Renamed from Purchases to match module name context if needed, but label can be anything
    path: '/purchases', 
    icon: Receipt,
    permissionScope: 'Purchase'
  },
  { 
    label: 'Banking', 
    path: '/banking', 
    icon: CreditCard,
    permissionScope: 'Cash And Bank'
  },
  { 
    label: 'Accounting', 
    path: '/accounting', 
    icon: BookOpen,
    permissionScope: 'Accountant'
  },
  { 
    label: 'Payroll', 
    path: '/payroll', 
    icon: Briefcase,
    permissionScope: 'Payroll'
  },
  { 
    label: 'Reports', 
    path: '/reports', 
    icon: BarChart3,
    permissionScope: 'Reports'
  },
  { 
    label: 'Documents', 
    path: '/documents', 
    icon: FileText,
    permissionScope: 'Documents'
  },
  { 
    label: 'Roles & Permissions', 
    path: '/settings/roles', 
    icon: ShieldCheck,
    permissionScope: 'Settings.Role' // Specifically checks 'Role' submodule under 'Settings'
  },
  { 
    label: 'Settings', 
    path: '/settings', 
    icon: Settings,
    permissionScope: 'Settings'
  },
];

export const USER_MENU_ITEMS: NavItem[] = [
  { label: 'Profile', path: '/profile', icon: UserIcon },
  { label: 'Logout', path: '/logout', icon: LogOut },
];

// Helper to create empty permissions
const createEmptyPermissions = () => {
  const permissions: any = {};
  Object.entries(PERMISSION_MODULES).forEach(([category, subModules]) => {
    permissions[category] = {};
    subModules.forEach(sub => {
      permissions[category][sub] = { read: false, write: false, edit: false, delete: false };
    });
  });
  return permissions;
};

// Helper to create full permissions
const createFullPermissions = () => {
  const permissions: any = {};
  Object.entries(PERMISSION_MODULES).forEach(([category, subModules]) => {
    permissions[category] = {};
    subModules.forEach(sub => {
      permissions[category][sub] = { read: true, write: true, edit: true, delete: true };
    });
  });
  return permissions;
};

// Static Data for Roles
export const DEFAULT_ROLES: RoleDefinition[] = [
  {
    id: 'role_super_admin',
    name: 'Super Admin',
    description: 'Root user with full access to all modules and settings.',
    permissions: createFullPermissions()
  },
  {
    id: 'role_admin',
    name: 'Admin',
    description: 'Operational administrator with access to most business modules.',
    permissions: (() => {
      const p = createFullPermissions();
      // Example: Remove delete permission from Settings for Admin
      if (p['Settings'] && p['Settings']['Subscription']) {
        p['Settings']['Subscription'].delete = false;
      }
      return p;
    })()
  },
  {
    id: 'role_hr',
    name: 'HR Manager',
    description: 'Manages employees, payroll, and company documents.',
    permissions: (() => {
      const p = createEmptyPermissions();
      
      // Company Dashboard Access
      p['Company']['Dashboard'] = { read: true, write: false, edit: false, delete: false };
      
      // Settings: Users
      p['Settings']['Users'] = { read: true, write: true, edit: true, delete: false };
      
      // Role Management is HIDDEN by default for HR. 
      // Root user must explicitly enable this via the Roles UI if they want HR to manage roles.
      p['Settings']['Role'] = { read: false, write: false, edit: false, delete: false }; 
      
      // Documents
      p['Documents']['Upload'] = { read: true, write: true, edit: true, delete: true };
      
      // Payroll (Includes Employees)
      p['Payroll']['Employee'] = { read: true, write: true, edit: true, delete: true };
      p['Payroll']['Salary'] = { read: true, write: true, edit: true, delete: true };
      p['Payroll']['Attendance'] = { read: true, write: true, edit: true, delete: true };
      
      return p;
    })()
  },
  {
    id: 'role_employee',
    name: 'Employee',
    description: 'Standard access. Can view dashboard and personal profile.',
    permissions: (() => {
      const p = createEmptyPermissions();
      // Only Dashboard Read Access
      p['Company']['Dashboard'] = { read: true, write: false, edit: false, delete: false };
      return p;
    })()
  }
];

// Mock Organizations - Expanded list for testing
export const MOCK_ORGANIZATIONS: Organization[] = [
  // Existing
  { id: 'org_hq', name: 'Joyous Industries HQ', address: 'Mumbai, India' },
  { id: 'org_north', name: 'Joyous North Branch', address: 'Delhi, India' },
  { id: 'org_tech', name: 'Joyous Tech Division', address: 'Bangalore, India' },
  
  // New Additions
  { id: 'org_apex', name: 'Apex Innovations Ltd', address: 'Pune, India' },
  { id: 'org_global', name: 'Global Logistics Solutions', address: 'Chennai, India' },
  { id: 'org_quantum', name: 'Quantum Systems Inc.', address: 'Hyderabad, India' },
  { id: 'org_green', name: 'GreenLeaf AgroTech', address: 'Nashik, India' },
  { id: 'org_urban', name: 'Urban Construct Builders', address: 'Ahmedabad, India' },
  { id: 'org_medi', name: 'MediCare Health Services', address: 'Kolkata, India' },
  { id: 'org_blue', name: 'BlueOcean Shipping', address: 'Kochi, India' },
  { id: 'org_stellar', name: 'Stellar Marketing Group', address: 'Gurgaon, India' },
  { id: 'org_prime', name: 'Prime Retail Outlets', address: 'Mumbai, India' },
  { id: 'org_fusion', name: 'Fusion Energy Labs', address: 'Noida, India' },
  { id: 'org_vertex', name: 'Vertex Financial Group', address: 'Mumbai, India' },
  { id: 'org_silver', name: 'SilverStone Manufacturing', address: 'Surat, India' },
  { id: 'org_nexgen', name: 'NexGen Robotics', address: 'Bangalore, India' },
  { id: 'org_pacific', name: 'Pacific Trade House', address: 'Visakhapatnam, India' },
  { id: 'org_rapid', name: 'Rapid Delivery Services', address: 'Indore, India' },
  { id: 'org_elite', name: 'Elite Hospitality Group', address: 'Goa, India' },
  { id: 'org_pixel', name: 'Creative Pixel Studio', address: 'Jaipur, India' }
];

// Mock Users for Authentication
export const MOCK_USERS = [
  {
    id: 'user_root',
    name: 'Super Admin',
    email: 'root@joyous.com',
    password: 'root1234',
    role: UserRole.SUPER_ADMIN,
    avatarUrl: 'https://ui-avatars.com/api/?name=Super+Admin&background=0ea5e9&color=fff',
    // Root user has access to ALL mock organizations
    organizationIds: MOCK_ORGANIZATIONS.map(org => org.id)
  },
  {
    id: 'user_admin',
    name: 'Admin User',
    email: 'admin@joyous.com',
    password: 'admin1234',
    role: UserRole.ADMIN,
    avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff',
    organizationIds: ['org_hq', 'org_apex', 'org_global', 'org_quantum']
  },
  {
    id: 'user_hr',
    name: 'HR Manager',
    email: 'hr@joyous.com',
    password: 'hr123456',
    role: UserRole.HR,
    avatarUrl: 'https://ui-avatars.com/api/?name=HR+Manager&background=ec4899&color=fff',
    organizationIds: ['org_hq', 'org_north']
  },
  {
    id: 'user_employee',
    name: 'John Doe',
    email: 'emp@joyous.com',
    password: 'emp12345',
    role: UserRole.EMPLOYEE,
    avatarUrl: 'https://ui-avatars.com/api/?name=John+Doe&background=22c55e&color=fff',
    organizationIds: ['org_hq']
  }
];