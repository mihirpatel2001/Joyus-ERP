import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, Percent, Award, Plus, FileText, Search, Filter, Download, MoreVertical,
  CheckCircle, Clock, Building, DollarSign
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { Pagination } from '../components/ui/Pagination';
import { EmptyState } from '../components/ui/EmptyState';
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
  { id: 'INV-005', customer: 'Wayne Enterprises', date: '2023-10-07', amount: 550000, status: 'Paid', salesPerson: 'Harvey Specter' },
  { id: 'INV-006', customer: 'Cyberdyne', date: '2023-10-08', amount: 150000, status: 'Pending', salesPerson: 'Sarah Connor' },
  { id: 'INV-007', customer: 'Massive Dynamic', date: '2023-10-09', amount: 67000, status: 'Paid', salesPerson: 'Michael Ross' },
  { id: 'INV-008', customer: 'Hooli', date: '2023-10-10', amount: 320000, status: 'Pending', salesPerson: 'Jessica Pearson' },
  { id: 'INV-009', customer: 'Initech', date: '2023-10-11', amount: 12000, status: 'Overdue', salesPerson: 'Michael Ross' },
  { id: 'INV-010', customer: 'Umbrella Corp', date: '2023-10-12', amount: 850000, status: 'Paid', salesPerson: 'Harvey Specter' },
  { id: 'INV-011', customer: 'Aperture Science', date: '2023-10-13', amount: 42000, status: 'Pending', salesPerson: 'Sarah Connor' },
];

export const Sales: React.FC = () => {
  const { hasRole, organizations } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'commissions'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination State for Invoices
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Admin Filter State
  const [selectedOrgFilter, setSelectedOrgFilter] = useState<string>('All');

  const isAdmin = hasRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  
  // Reset pagination on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter Invoices
  const filteredInvoices = mockInvoices.filter(inv => 
    inv.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inv.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Slices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

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
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
      {/* Header & Fixed Top Section */}
      <div className="flex-shrink-0 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-content-strong">Sales</h1>
            <p className="text-content-sub text-sm">Track invoices, estimates, and performance</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
             <Button variant="outline" className="flex-1 sm:flex-none">
                <FileText className="w-4 h-4 mr-2" /> Estimates
             </Button>
             <Button className="flex-1 sm:flex-none">
                <Plus className="w-4 h-4 mr-2" /> New Invoice
             </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-divider overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview' 
                ? 'border-primary-600 text-primary-700' 
                : 'border-transparent text-content-sub hover:text-content-strong'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('commissions')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'commissions' 
                ? 'border-primary-600 text-primary-700' 
                : 'border-transparent text-content-sub hover:text-content-strong'
            }`}
          >
            Commissions
          </button>
        </div>
      </div>

      {/* ======================= OVERVIEW TAB ======================= */}
      {activeTab === 'overview' && (
        <div className="bg-surface rounded-xl shadow-sm border border-divider flex flex-col flex-1 min-h-0 overflow-hidden animate-fadeIn">
            {/* Toolbar */}
            <div className="p-4 border-b border-divider flex flex-col sm:flex-row gap-4 justify-between items-center flex-shrink-0">
               <div className="relative flex-1 max-w-md w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-sub" />
                  <input 
                    type="text" 
                    placeholder="Search invoices..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg text-sm bg-surface text-content-strong placeholder-content-sub focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
                  />
               </div>
               <div className="flex gap-2">
                 <Button variant="outline" size="sm" className="hidden sm:flex">
                   <Filter className="w-4 h-4 mr-2" /> Filter
                 </Button>
                 <Button variant="outline" size="sm">
                   <Download className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Export</span>
                 </Button>
               </div>
            </div>

            {/* Scrollable List Area */}
            <div className="flex-1 overflow-auto">
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-canvas text-content-sub font-medium border-b border-divider sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-4 bg-canvas">Invoice #</th>
                        <th className="px-6 py-4 bg-canvas">Customer</th>
                        <th className="px-6 py-4 bg-canvas">Date</th>
                        <th className="px-6 py-4 bg-canvas text-right">Amount</th>
                        <th className="px-6 py-4 bg-canvas text-center">Status</th>
                        <th className="px-6 py-4 bg-canvas text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-divider">
                      {currentInvoices.length > 0 ? (
                        currentInvoices.map(inv => (
                          <tr key={inv.id} className="hover:bg-surface-highlight transition-colors">
                            <td className="px-6 py-4 font-medium text-primary-600">{inv.id}</td>
                            <td className="px-6 py-4 font-medium text-content-strong">{inv.customer}</td>
                            <td className="px-6 py-4 text-content-normal">{new Date(inv.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-right font-medium text-content-strong">₹ {inv.amount.toLocaleString()}</td>
                            <td className="px-6 py-4 text-center">
                              <Badge variant={getStatusVariant(inv.status) as any}>{inv.status}</Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-content-sub hover:text-content-strong p-1">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                           <td colSpan={6}>
                              <EmptyState 
                                title="No Invoices Found"
                                description="Try adjusting your search or create a new invoice."
                                actionLabel="Create Invoice"
                                icon={FileText}
                              />
                           </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View - Ensure this is visible and structured correctly */}
                <div className="md:hidden p-4 space-y-4">
                  {currentInvoices.length > 0 ? (
                    currentInvoices.map(inv => (
                      <div key={inv.id} className="bg-surface border border-divider rounded-xl p-4 shadow-sm space-y-3">
                         <div className="flex justify-between items-start">
                            <div>
                               <p className="font-bold text-primary-600 text-sm">{inv.id}</p>
                               <h3 className="font-semibold text-content-strong">{inv.customer}</h3>
                            </div>
                            <Badge variant={getStatusVariant(inv.status) as any}>{inv.status}</Badge>
                         </div>
                         <div className="flex justify-between items-center text-sm pt-2 border-t border-divider">
                            <div className="flex items-center gap-1.5 text-content-sub">
                               <Clock className="w-3.5 h-3.5" />
                               {new Date(inv.date).toLocaleDateString()}
                            </div>
                            <p className="font-bold text-content-strong text-base">₹ {inv.amount.toLocaleString()}</p>
                         </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState 
                      title="No Invoices Found"
                      description="Try adjusting your search or create a new invoice."
                      actionLabel="Create Invoice"
                      icon={FileText}
                    />
                  )}
                </div>
            </div>

            {/* Pagination */}
            <div className="flex-shrink-0 mt-auto border-t border-divider">
               <Pagination 
                 currentPage={currentPage}
                 totalPages={totalPages}
                 onPageChange={setCurrentPage}
                 totalItems={filteredInvoices.length}
                 itemsPerPage={itemsPerPage}
                 onItemsPerPageChange={setItemsPerPage}
               />
            </div>
        </div>
      )}

      {/* ======================= COMMISSIONS TAB ======================= */}
      {activeTab === 'commissions' && (
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden animate-fadeIn">
          
          {/* --- ADMIN VIEW --- */}
          {isAdmin ? (
             <div className="flex flex-col h-full gap-4">
                {/* Admin Stats & Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
                   <div className="bg-surface p-4 rounded-xl border border-divider shadow-sm flex items-center justify-between">
                      <div>
                         <p className="text-content-sub text-xs font-medium uppercase tracking-wider">Total Sales (YTD)</p>
                         <p className="text-xl font-bold text-content-strong mt-1">₹ {teamTotals.sales.toLocaleString()}</p>
                      </div>
                      <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                         <TrendingUp className="w-5 h-5" />
                      </div>
                   </div>
                   <div className="bg-surface p-4 rounded-xl border border-divider shadow-sm flex items-center justify-between">
                      <div>
                         <p className="text-content-sub text-xs font-medium uppercase tracking-wider">Total Payout</p>
                         <p className="text-xl font-bold text-success mt-1">₹ {teamTotals.commission.toLocaleString()}</p>
                      </div>
                      <div className="p-2 bg-success-bg rounded-lg text-success-text">
                         <DollarSign className="w-5 h-5" />
                      </div>
                   </div>
                   <div className="bg-surface p-4 rounded-xl border border-divider shadow-sm">
                      <p className="text-content-sub text-xs font-medium uppercase tracking-wider mb-2">Filter by Organization</p>
                      <Select 
                        value={selectedOrgFilter}
                        onChange={setSelectedOrgFilter}
                        options={[
                          { label: 'All Organizations', value: 'All' },
                          ...organizations.map(org => ({ label: org.name, value: org.id }))
                        ]}
                        className="mb-0"
                      />
                   </div>
                </div>

                {/* Team Leaderboard */}
                <div className="bg-surface rounded-xl shadow-sm border border-divider flex flex-col flex-1 min-h-0 overflow-hidden">
                   <div className="p-4 border-b border-divider flex-shrink-0">
                      <h3 className="font-bold text-content-strong">Sales Team Performance</h3>
                   </div>
                   <div className="flex-1 overflow-auto">
                      <table className="w-full text-sm text-left hidden md:table">
                         <thead className="bg-canvas text-content-sub font-medium border-b border-divider sticky top-0 z-10">
                            <tr>
                               <th className="px-6 py-4 bg-canvas">Name</th>
                               <th className="px-6 py-4 bg-canvas">Role</th>
                               <th className="px-6 py-4 bg-canvas">Organization</th>
                               <th className="px-6 py-4 bg-canvas text-right">Commission Rate</th>
                               <th className="px-6 py-4 bg-canvas text-right">Total Sales</th>
                               <th className="px-6 py-4 bg-canvas text-right">Commission Earned</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-divider">
                            {filteredTeamData.map((person) => (
                               <tr key={person.id} className="hover:bg-surface-highlight">
                                  <td className="px-6 py-4 font-medium text-content-strong">{person.name}</td>
                                  <td className="px-6 py-4 text-content-normal">{person.role}</td>
                                  <td className="px-6 py-4 text-content-sub text-xs">
                                     <div className="flex items-center gap-1">
                                        <Building className="w-3 h-3" />
                                        {getOrgName(person.orgId)}
                                     </div>
                                  </td>
                                  <td className="px-6 py-4 text-right text-content-normal">{person.rate}%</td>
                                  <td className="px-6 py-4 text-right font-medium text-content-strong">₹ {person.sales.toLocaleString()}</td>
                                  <td className="px-6 py-4 text-right font-bold text-success">₹ {person.commission.toLocaleString()}</td>
                               </tr>
                            ))}
                         </tbody>
                      </table>

                      {/* Mobile Card View for Leaderboard */}
                      <div className="md:hidden p-4 space-y-4">
                         {filteredTeamData.map(person => (
                            <div key={person.id} className="bg-surface border border-divider rounded-xl p-4 shadow-sm">
                               <div className="flex justify-between items-start mb-2">
                                  <div>
                                     <h3 className="font-bold text-content-strong">{person.name}</h3>
                                     <p className="text-xs text-content-sub">{person.role}</p>
                                  </div>
                                  <Badge variant="success">₹ {person.commission.toLocaleString()}</Badge>
                               </div>
                               <div className="space-y-2 mt-3 pt-3 border-t border-divider text-sm">
                                  <div className="flex justify-between">
                                     <span className="text-content-sub">Organization</span>
                                     <span className="font-medium text-content-normal">{getOrgName(person.orgId)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                     <span className="text-content-sub">Total Sales</span>
                                     <span className="font-medium text-content-strong">₹ {person.sales.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                     <span className="text-content-sub">Rate</span>
                                     <span className="font-medium text-content-normal">{person.rate}%</span>
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          ) : (
             // --- PERSONAL VIEW ---
             <div className="flex-1 overflow-auto p-1">
                {/* My Performance Card */}
                <div className="bg-surface rounded-xl shadow-sm border border-divider p-6 max-w-4xl mx-auto mt-4">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg">
                          <Award className="w-6 h-6" />
                       </div>
                       <div>
                          <h2 className="text-xl font-bold text-content-strong">My Performance (YTD)</h2>
                          <p className="text-content-sub text-sm">Track your progress and earnings</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                       <div className="p-4 bg-canvas rounded-xl border border-divider">
                          <p className="text-xs font-medium text-content-sub uppercase tracking-wider mb-1">Commission Earned</p>
                          <p className="text-2xl font-bold text-success">₹ {myPerformance.earned.toLocaleString()}</p>
                          <p className="text-xs text-success mt-1 flex items-center gap-1">
                             <CheckCircle className="w-3 h-3" /> Paid out
                          </p>
                       </div>
                       <div className="p-4 bg-canvas rounded-xl border border-divider">
                          <p className="text-xs font-medium text-content-sub uppercase tracking-wider mb-1">Total Sales</p>
                          <p className="text-2xl font-bold text-content-strong">₹ {myPerformance.totalSales.toLocaleString()}</p>
                          <p className="text-xs text-content-sub mt-1">
                             {((myPerformance.totalSales / myPerformance.target) * 100).toFixed(1)}% of annual target
                          </p>
                       </div>
                       <div className="p-4 bg-canvas rounded-xl border border-divider">
                          <p className="text-xs font-medium text-content-sub uppercase tracking-wider mb-1">Commission Rate</p>
                          <p className="text-2xl font-bold text-primary-600">{myPerformance.commissionRate}%</p>
                          <p className="text-xs text-content-sub mt-1">Fixed percentage</p>
                       </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div>
                       <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-content-normal">Annual Sales Target</span>
                          <span className="text-content-sub">₹ {myPerformance.totalSales.toLocaleString()} / ₹ {myPerformance.target.toLocaleString()}</span>
                       </div>
                       <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                             className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-1000"
                             style={{ width: `${(myPerformance.totalSales / myPerformance.target) * 100}%` }}
                          ></div>
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