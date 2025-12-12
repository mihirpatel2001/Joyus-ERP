# Joyous Industries CRM/HRM System

A comprehensive, modern Business Management solution designed to streamline Customer Relationship Management (CRM) and Human Resource Management (HRM) operations. This application features a robust Role-Based Access Control (RBAC) system, financial dashboards, and modular architecture.

## 🚀 Key Features

### 📊 Dashboard & Analytics

- **Financial Overview**: Real-time tracking of Receivables, Payables, Net Profit, and Cash Flow.
- **Interactive Charts**: Visual data representation using Recharts for income/expense analysis.
- **Task Management**: Quick view of pending tasks and approvals.

### 👥 Human Resource Management (HRM)

- **Employee Directory**: Manage employee profiles with advanced filtering (Role, Status).
- **Payroll & Salary**: detailed salary configuration with history tracking.
- **Responsive Views**: Switch between table view (desktop) and card view (mobile).

### 🤝 Contact Management (Parties)

- **Customer & Vendor Tracking**: Unified interface for managing business contacts.
- **Ledger Overview**: Instant visibility of receivables and payables per party.
- **Direct Actions**: Integrated call and email actions.

### 🛡️ Security & Access Control

- **Granular RBAC**: Finely tuned permissions (Read, Write, Edit, Delete) for every module.
- **Dynamic Navigation**: Sidebar menus adapt automatically based on user permissions.
- **Secure Authentication**: Context-based auth flow with session persistence.

### 🎨 User Interface

- **Custom Component Library**: Built-in, theme-aware components (Inputs, Modals, Toasts).
- **Responsive Design**: Fully optimized for Mobile, Tablet, and Desktop.
- **Dark/Light Mode Ready**: Structural preparation for theme switching.

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router DOM v6
- **Image Processing**: React Easy Crop (Canvas-based)

## 📂 Project Structure

```
├── components/
│   ├── layout/         # Sidebar, Navbar, Layout wrappers
│   └── ui/             # Reusable atoms (Button, Input, Modal, etc.)
├── context/
│   ├── AuthContext     # User session and RBAC logic
│   └── ToastContext    # Global notification system
├── pages/              # Route views (Dashboard, Employees, etc.)
├── utils/              # Helper functions (Image cropping, etc.)
├── constants.ts        # App configuration and static definitions
└── types.ts            # TypeScript interfaces
```

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Run the development server**
   ```bash
   npm run dev
   ```

## 🔐 Permissions System

The application uses a matrix-based permission system defined in `constants.ts`.

- **Super Admin**: Full access to all modules.
- **Admin**: Operational access (configurable).
- **HR**: Restricted to Payroll and Document modules.
- **Employee**: Limited to Dashboard and Profile.

_Note: Default credentials for development are configured in the mock data handler._
