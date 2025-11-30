
import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Percent, 
  Award, 
  Plus, 
  FileText, 
  Search, 
  Filter, 
  Download, 
  MoreVertical,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Building,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { MOCK_ORGANIZATIONS } from '../constants';

// Mock Data for Team Sales (Admin View) with Org IDs
const salesTeamData = [
  { id: 1, name: 'Michael Ross', role: 'Sales Person', sales: 1000000, commission: 85000, rate: 8.5, orgId: 'org_hq' },
  { id: 2, name: 'Sarah Connor', role: 'Manager', sales: 2500000, commission: 125000, rate: 5.0, orgId: 'org_north' },
  { id: 3, name: 'Jessica Pearson', role: 'Sales Lead', sales: 4500000, commission: 135000, rate: 3.0, orgId: 'org_hq' },
  { id: 4, name: 'Harvey Specter', role: 'Partner', sales: 8200000, commission: 410000, rate: 5.0, orgId: 'org_global' },
  { id: 5, name: 'Louis Litt', role: 'Senior Sales', sales: 3200000, commission: 160000, rate: 5.0, orgId: 'org_north' },
];

// Mock Invoices
const mockInvoices = [
  { id: 'INV-001', customer: 'Acme Corp', date: '2023-10-01', amount: 45000, status: 'Paid', salesPerson: 'Michael Ross' },
  { id: 'INV-002', customer: 'Global Supplies', date: '2023-10-03', amount: 12500, status: 'Pending', salesPerson: 'Sarah Connor' },
  { id: 'INV-003', customer: 'Tech Solutions', date: '2023-10-05', amount: 89000, status: 'Overdue', salesPerson: 'Michael Ross' },
  { id: 'INV-004', customer: 'Stark Ind', date: '2023-10-06', amount: 240000, status: 'Paid', salesPerson: 'Jessica Pearson' },
];

export const Sales: React.FC = () => {
  const { user, hasRole, organizations } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'commissions'>('overview');
  const [invoiceFilter, setInvoiceFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Admin Filter State
  const [selectedOrgFilter, setSelectedOrgFilter] = useState<string>('All');

  const isAdmin = hasRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  
  // --- Computed Data for Admin View ---
  const filteredTeamData = useMemo(() => {
    if (selectedOrgFilter === 'All') return salesTeamData;
    return salesTeamData.filter(p => p.orgId === selectedOrgFilter);
  }, [selectedOrgFilter]);

  const teamTotals = useMemo(() => {
    return filteredTeamData.reduce((acc, curr) => ({
      sales: acc.sales + curr.sales,
      commission: acc.commission + curr.commission
    }), { sales: 0, commission: 0 });
  }, [filteredTeamData]);

  // --- Mock Personal Data ---
  const myPerformance = {
    totalSales: 2500000,
    commissionRate: 5,
    earned: 125000,
    target: 4000000
  };

  const getStatusVariant = (status: string) => {
    switch(status) {
      case 'Paid': return 'success';
      case 'Pending': return 'warning';
      case 'Overdue': return 'error';
      default: return 'neutral';
    }
  };

  const getOrgName = (id: string) => {
    const org = MOCK_ORGANIZATIONS.find(o => o.id === id);
    return org ? org.name : 'Unknown Org';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sales</h1>
          <p className="text-slate-500 text-sm">Manage sales operations and track performance.</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'overview' && (
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Create Invoice
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex space-x-8">
           <button
             onClick={() => setActiveTab('overview')}
             className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
               activeTab === 'overview' 
                 ? 'border-primary-600 text-primary-600' 
                 : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
             }`}
           >
             Overview & Invoices
           </button>
           <button
             onClick={() => setActiveTab('commissions')}
             className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
               activeTab === 'commissions' 
                 ? 'border-emerald-600 text-emerald-600' 
                 : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
             }`}
           >
             {isAdmin ? 'Team Commissions' : 'My Commission'}
           </button>
        </div>
      </div>

      {/* ======================= OVERVIEW TAB ======================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Quick Stats Row */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                       <p className="text-slate-500