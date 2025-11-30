
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
                       <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Revenue</p>
                       <p className="text-2xl font-bold text-slate-800 mt-1">₹ 4.5 Cr</p>
                    </div>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                       <DollarSign className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-xs text-green-600 font-medium">
                     <TrendingUp className="w-3 h-3 mr-1" /> +12% vs last month
                  </div>
               </div>
               
               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                       <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Pending Invoices</p>
                       <p className="text-2xl font-bold text-slate-800 mt-1">12</p>
                    </div>
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                       <Clock className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-slate-500">
                     Total value: ₹ 8.2 Lakhs
                  </div>
               </div>

               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                       <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Invoices Paid</p>
                       <p className="text-2xl font-bold text-slate-800 mt-1">145</p>
                    </div>
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                       <CheckCircle className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-slate-500">
                     This fiscal year
                  </div>
               </div>
           </div>

           {/* Invoices Table */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
                 <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search invoices..." 
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
                 <div className="flex gap-2">
                    <Button variant="outline" className="text-slate-600">
                       <Filter className="w-4 h-4 mr-2" /> Filter
                    </Button>
                    <Button variant="outline" className="text-slate-600">
                       <Download className="w-4 h-4 mr-2" /> Export
                    </Button>
                 </div>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                       <tr>
                          <th className="px-6 py-4">Invoice ID</th>
                          <th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4 text-right">Amount</th>
                          <th className="px-6 py-4">Sales Person</th>
                          <th className="px-6 py-4 text-center">Status</th>
                          <th className="px-6 py-4"></th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {mockInvoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-50/50">
                             <td className="px-6 py-4 font-medium text-primary-600">{inv.id}</td>
                             <td className="px-6 py-4 text-slate-800">{inv.customer}</td>
                             <td className="px-6 py-4 text-slate-500">{inv.date}</td>
                             <td className="px-6 py-4 text-right font-medium text-slate-700">₹ {inv.amount.toLocaleString()}</td>
                             <td className="px-6 py-4 text-slate-600">{inv.salesPerson}</td>
                             <td className="px-6 py-4 text-center">
                                <Badge variant={getStatusVariant(inv.status)}>{inv.status}</Badge>
                             </td>
                             <td className="px-6 py-4 text-right">
                                <button className="text-slate-400 hover:text-slate-600">
                                   <MoreVertical className="w-4 h-4" />
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {/* ======================= COMMISSIONS TAB ======================= */}
      {activeTab === 'commissions' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* --- ADMIN VIEW: TEAM LEADERBOARD & ORG FILTER --- */}
          {isAdmin && (
            <>
              {/* Org Filter & Aggregates */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-6">
                   <div>
                      <h3 className="text-lg font-bold text-slate-800">Team Performance</h3>
                      <p className="text-slate-500 text-sm mt-1">Overview of sales team metrics across organizations.</p>
                   </div>
                   <div className="w-full md:w-64">
                      <Select
                        label="Filter by Organization"
                        value={selectedOrgFilter}
                        onChange={setSelectedOrgFilter}
                        options={[
                          { label: 'All Organizations', value: 'All' },
                          ...MOCK_ORGANIZATIONS.map(org => ({ label: org.name, value: org.id }))
                        ]}
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                      <p className="text-emerald-700 font-medium text-sm uppercase tracking-wide">Total Team Sales</p>
                      <p className="text-2xl font-bold text-emerald-900 mt-1">₹ {teamTotals.sales.toLocaleString()}</p>
                   </div>
                   <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <p className="text-blue-700 font-medium text-sm uppercase tracking-wide">Total Commission Payout</p>
                      <p className="text-2xl font-bold text-blue-900 mt-1">₹ {teamTotals.commission.toLocaleString()}</p>
                   </div>
                </div>
              </div>

              {/* Leaderboard Table */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                   <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                     <Award className="w-4 h-4 text-amber-500" /> Sales Leaderboard
                   </h4>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                         <tr>
                            <th className="px-6 py-4">Sales Person</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Organization</th>
                            <th className="px-6 py-4 text-right">Total Sales</th>
                            <th className="px-6 py-4 text-center">Comm. Rate</th>
                            <th className="px-6 py-4 text-right">Commission Earned</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {filteredTeamData.length > 0 ? (
                           filteredTeamData.map((person) => (
                            <tr key={person.id} className="hover:bg-slate-50/50">
                               <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                                        {person.name.charAt(0)}
                                     </div>
                                     <span className="font-medium text-slate-800">{person.name}</span>
                                  </div>
                               </td>
                               <td className="px-6 py-4 text-slate-600">{person.role}</td>
                               <td className="px-6 py-4">
                                  <div className="flex items-center gap-2 text-slate-600">
                                    <Building className="w-3 h-3 text-slate-400" />
                                    {getOrgName(person.orgId)}
                                  </div>
                               </td>
                               <td className="px-6 py-4 text-right font-medium text-slate-700">₹ {person.sales.toLocaleString()}</td>
                               <td className="px-6 py-4 text-center">
                                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium border border-slate-200">
                                     {person.rate}%
                                  </span>
                               </td>
                               <td className="px-6 py-4 text-right font-bold text-emerald-600">₹ {person.commission.toLocaleString()}</td>
                            </tr>
                           ))
                         ) : (
                           <tr>
                             <td colSpan={6} className="px-6 py-8 text-center text-slate-500 italic">
                               No sales data found for the selected organization.
                             </td>
                           </tr>
                         )}
                      </tbody>
                   </table>
                </div>
              </div>
            </>
          )}

          {/* --- PERSONAL VIEW: MY PERFORMANCE --- */}
          {!isAdmin && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                   {/* Background Decorations */}
                   <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                   <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl"></div>
                   
                   <div className="relative z-10">
                      <div className="flex items-center gap-2 text-emerald-100 mb-6">
                         <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                            <Briefcase className="w-5 h-5" />
                         </div>
                         <span className="font-semibold tracking-wide uppercase text-sm">My Performance (YTD)</span>
                      </div>

                      <div className="space-y-8">
                         <div>
                            <p className="text-emerald-200 text-sm font-medium mb-1">Total Sales Generated</p>
                            <h3 className="text-4xl font-bold tracking-tight">₹ {myPerformance.totalSales.toLocaleString()}</h3>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/10">
                            <div>
                               <p className="text-emerald-200 text-xs uppercase tracking-wider font-medium mb-1">Commission Earned</p>
                               <p className="text-2xl font-bold text-white">₹ {myPerformance.earned.toLocaleString()}</p>
                               <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 rounded text-xs text-white font-medium">
                                 {myPerformance.commissionRate}% Cut
                               </span>
                            </div>
                            <div>
                               <p className="text-emerald-200 text-xs uppercase tracking-wider font-medium mb-1">Annual Target</p>
                               <p className="text-2xl font-semibold text-white/90">₹ {myPerformance.target.toLocaleString()}</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h4 className="font-bold text-slate-800 mb-4">Target Progress</h4>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                              On Track
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-emerald-600">
                              {Math.round((myPerformance.totalSales / myPerformance.target) * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-emerald-100">
                          <div style={{ width: `${(myPerformance.totalSales / myPerformance.target) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"></div>
                        </div>
                        <p className="text-xs text-slate-500">
                           You are <strong>₹ {(myPerformance.target - myPerformance.totalSales).toLocaleString()}</strong> away from hitting your annual target.
                        </p>
                      </div>
                   </div>

                   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h4 className="font-bold text-slate-800 mb-4">Commission Breakdown</h4>
                      <div className="space-y-3">
                         <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg">
                            <span className="text-slate-600">Pending Approval</span>
                            <span className="font-medium text-slate-800">₹ 12,500</span>
                         </div>
                         <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg">
                            <span className="text-slate-600">Ready for Payout</span>
                            <span className="font-medium text-green-600">₹ 45,000</span>
                         </div>
                         <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg">
                            <span className="text-slate-600">Paid Out (YTD)</span>
                            <span className="font-medium text-slate-800">₹ 67,500</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          )}
        </div>
      )}
    </div>
  );
};
