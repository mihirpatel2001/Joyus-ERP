import React, { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Download,
  Phone,
  Mail,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { Badge } from '@/src/components/ui/Badge'
import { Button } from '@/src/components/ui/Button'
import { Pagination } from '@/src/components/ui/Pagination'
import { Party } from '@/src/types/types'

const mockParties: Party[] = [
  { id: '1', name: 'Acme Corp', type: 'Customer', email: 'contact@acme.com', phone: '+91 98765 43210', receivables: 45000, payables: 0, status: 'Active' },
  { id: '2', name: 'Global Supplies', type: 'Vendor', email: 'sales@global.com', phone: '+91 99887 76655', receivables: 0, payables: 12000, status: 'Active' },
  { id: '3', name: 'John Doe Enterprises', type: 'Customer', email: 'john@doe.com', phone: '+91 91234 56789', receivables: 12500, payables: 0, status: 'Inactive' },
  { id: '4', name: 'Tech Solutions Ltd', type: 'Vendor', email: 'info@techsol.com', phone: '+91 88776 65544', receivables: 0, payables: 55000, status: 'Active' },
  { id: '5', name: 'Rapid Logistics', type: 'Vendor', email: 'dispatch@rapid.com', phone: '+91 77665 54433', receivables: 0, payables: 0, status: 'Active' },
  { id: '6', name: 'Alpha Traders', type: 'Customer', email: 'alpha@trade.com', phone: '+91 77766 55544', receivables: 8500, payables: 0, status: 'Active' },
  { id: '7', name: 'Beta Systems', type: 'Vendor', email: 'beta@sys.com', phone: '+91 66655 44433', receivables: 0, payables: 23000, status: 'Active' },
  { id: '8', name: 'Gamma Retails', type: 'Customer', email: 'gamma@store.com', phone: '+91 55544 33322', receivables: 56000, payables: 0, status: 'Inactive' },
  { id: '9', name: 'Delta Force', type: 'Vendor', email: 'delta@force.com', phone: '+91 44433 22211', receivables: 0, payables: 4500, status: 'Active' },
  { id: '10', name: 'Epsilon Partners', type: 'Customer', email: 'ep@partner.com', phone: '+91 33322 11100', receivables: 21000, payables: 0, status: 'Active' },
  { id: '11', name: 'Zeta Corp', type: 'Customer', email: 'zeta@corp.com', phone: '+91 22211 00099', receivables: 34000, payables: 0, status: 'Active' },
  { id: '12', name: 'Eta Ventures', type: 'Vendor', email: 'eta@ventures.com', phone: '+91 11100 99988', receivables: 0, payables: 15000, status: 'Active' },
];

export const Parties: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Customer' | 'Vendor'>('All');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const filteredParties = mockParties.filter(party => {
    const matchesSearch = party.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          party.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || party.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Calculate Pagination Slices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredParties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredParties.length / itemsPerPage);

  return (
    <div className="flex flex-col h-[calc(100vh)] gap-4 sm:gap-6">
      {/* Page Header & Stats Area - Fixed Top */}
      <div className="flex-shrink-0 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-content-strong">Parties</h1>
            <p className="text-content-sub text-sm">Manage your customers and vendors</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Download className="w-4 h-4 mr-2" /> Import
            </Button>
            <Button className="flex-1 sm:flex-none">
              <Plus className="w-4 h-4 mr-2" /> Add New
            </Button>
          </div>
        </div>

        {/* Stats Summary - Horizontal Scroll on Mobile to save vertical space */}
        <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto pb-2 md:pb-0 snap-x">
            <div className="min-w-[85vw] md:min-w-0 bg-surface p-4 rounded-xl border border-divider shadow-sm flex items-center justify-between snap-center">
                <div>
                    <p className="text-content-sub text-xs font-medium uppercase tracking-wider">Total Receivables</p>
                    <p className="text-xl font-bold text-success mt-1">₹ 57,500</p>
                </div>
                <div className="p-2 bg-success-bg rounded-lg text-success-text">
                    <ArrowDownRight className="w-5 h-5" />
                </div>
            </div>
            <div className="min-w-[85vw] md:min-w-0 bg-surface p-4 rounded-xl border border-divider shadow-sm flex items-center justify-between snap-center">
                <div>
                    <p className="text-content-sub text-xs font-medium uppercase tracking-wider">Total Payables</p>
                    <p className="text-xl font-bold text-danger mt-1">₹ 67,000</p>
                </div>
                <div className="p-2 bg-danger-bg rounded-lg text-danger-text">
                    <ArrowUpRight className="w-5 h-5" />
                </div>
            </div>
            <div className="min-w-[85vw] md:min-w-0 bg-surface p-4 rounded-xl border border-divider shadow-sm flex items-center justify-between snap-center">
                <div>
                    <p className="text-content-sub text-xs font-medium uppercase tracking-wider">Total Parties</p>
                    <p className="text-xl font-bold text-info mt-1">{mockParties.length}</p>
                </div>
                <div className="p-2 bg-info-bg rounded-lg text-info-text">
                    <Filter className="w-5 h-5" />
                </div>
            </div>
        </div>
      </div>

      {/* Main Content Area - Flexible Height with Internal Scroll */}
      <div className="bg-surface rounded-xl shadow-sm border border-divider flex flex-col flex-1 min-h-0 overflow-hidden">
        
        {/* Toolbar - Fixed at top of card */}
        <div className="p-4 border-b border-divider flex flex-col sm:flex-row gap-4 justify-between flex-shrink-0">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-sub" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg text-sm bg-surface text-content-strong placeholder-content-sub focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto p-1 scrollbar-hide">
            {(['All', 'Customer', 'Vendor'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex-1 sm:flex-none ${
                  filterType === type 
                    ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-200' 
                    : 'bg-surface text-content-normal border border-input hover:bg-surface-highlight'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content Wrapper */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-canvas text-content-sub font-medium border-b border-divider sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4 bg-canvas">Name</th>
                <th className="px-6 py-4 bg-canvas">Contact</th>
                <th className="px-6 py-4 text-right bg-canvas">Receivables</th>
                <th className="px-6 py-4 text-right bg-canvas">Payables</th>
                <th className="px-6 py-4 text-center bg-canvas">Status</th>
                <th className="px-6 py-4 text-right bg-canvas">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider">
              {currentItems.length > 0 ? (
                currentItems.map((party) => (
                  <tr key={party.id} className="hover:bg-surface-highlight transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          party.type === 'Customer' ? 'bg-info-bg text-info-text' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {party.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-content-strong">{party.name}</p>
                          <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            party.type === 'Customer' ? 'bg-info-bg text-info-text' : 'bg-purple-50 text-purple-600'
                          }`}>
                            {party.type}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-content-sub">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" /> {party.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" /> {party.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-content-normal">
                      {party.receivables > 0 ? `₹ ${party.receivables.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-content-normal">
                      {party.payables > 0 ? `₹ ${party.payables.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={party.status === 'Active' ? 'success' : 'warning'}>
                        {party.status}
                      </Badge>
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
                  <td colSpan={6} className="px-6 py-8 text-center text-content-sub">
                    No parties found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination - Fixed Bottom */}
        <div className="flex-shrink-0 mt-auto border-t border-divider bg-surface">
           <Pagination 
             currentPage={currentPage}
             totalPages={totalPages}
             onPageChange={setCurrentPage}
             totalItems={filteredParties.length}
             itemsPerPage={itemsPerPage}
             onItemsPerPageChange={setItemsPerPage}
           />
        </div>
      </div>
    </div>
  );
};
