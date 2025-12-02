import React, { useState } from 'react';
import { Search, Filter, Plus, MoreVertical, Download, Phone, Mail, ArrowUpRight, ArrowDownRight, MapPin } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Party } from '../types';

const mockParties: Party[] = [
  { id: '1', name: 'Acme Corp', type: 'Customer', email: 'contact@acme.com', phone: '+91 98765 43210', receivables: 45000, payables: 0, status: 'Active' },
  { id: '2', name: 'Global Supplies', type: 'Vendor', email: 'sales@global.com', phone: '+91 99887 76655', receivables: 0, payables: 12000, status: 'Active' },
  { id: '3', name: 'John Doe Enterprises', type: 'Customer', email: 'john@doe.com', phone: '+91 91234 56789', receivables: 12500, payables: 0, status: 'Inactive' },
  { id: '4', name: 'Tech Solutions Ltd', type: 'Vendor', email: 'info@techsol.com', phone: '+91 88776 65544', receivables: 0, payables: 55000, status: 'Active' },
  { id: '5', name: 'Rapid Logistics', type: 'Vendor', email: 'dispatch@rapid.com', phone: '+91 77665 54433', receivables: 0, payables: 0, status: 'Active' },
];

export const Parties: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Customer' | 'Vendor'>('All');

  const filteredParties = mockParties.filter(party => {
    const matchesSearch = party.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          party.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || party.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Parties</h1>
          <p className="text-slate-500 text-sm">Manage your customers and vendors</p>
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

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Receivables</p>
                  <p className="text-xl font-bold text-green-600 mt-1">₹ 57,500</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg text-green-600">
                  <ArrowDownRight className="w-5 h-5" />
              </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Payables</p>
                  <p className="text-xl font-bold text-red-600 mt-1">₹ 67,000</p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg text-red-600">
                  <ArrowUpRight className="w-5 h-5" />
              </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Parties</p>
                  <p className="text-xl font-bold text-blue-600 mt-1">{mockParties.length}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Filter className="w-5 h-5" />
              </div>
          </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            {(['All', 'Customer', 'Vendor'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex-1 sm:flex-none ${
                  filterType === type 
                    ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-200' 
                    : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop List Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Name</th>
                <th className="px-6 py-4 whitespace-nowrap">Contact</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Receivables</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Payables</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Status</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParties.length > 0 ? (
                filteredParties.map((party) => (
                  <tr key={party.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          party.type === 'Customer' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {party.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{party.name}</p>
                          <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            party.type === 'Customer' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                          }`}>
                            {party.type}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-slate-500">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" /> {party.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" /> {party.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-700">
                      {party.receivables > 0 ? `₹ ${party.receivables.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-700">
                      {party.payables > 0 ? `₹ ${party.payables.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={party.status === 'Active' ? 'success' : 'warning'}>
                        {party.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-slate-600 p-1">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No parties found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          {filteredParties.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filteredParties.map((party) => (
                <div key={party.id} className="p-4 space-y-3 bg-white">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                        party.type === 'Customer' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {party.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{party.name}</h3>
                        <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded inline-block mt-0.5 ${
                          party.type === 'Customer' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                        }`}>
                          {party.type}
                        </span>
                      </div>
                    </div>
                    <button className="text-slate-400 p-1">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-sm text-slate-500 space-y-1 pl-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" /> {party.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" /> {party.phone}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <p className="text-xs text-slate-500 mb-0.5">Receivables</p>
                      <p className={`font-medium ${party.receivables > 0 ? 'text-green-600' : 'text-slate-700'}`}>
                        {party.receivables > 0 ? `₹ ${party.receivables.toLocaleString()}` : '-'}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg text-right">
                      <p className="text-xs text-slate-500 mb-0.5">Payables</p>
                      <p className={`font-medium ${party.payables > 0 ? 'text-red-600' : 'text-slate-700'}`}>
                        {party.payables > 0 ? `₹ ${party.payables.toLocaleString()}` : '-'}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <Badge variant={party.status === 'Active' ? 'success' : 'warning'}>
                      {party.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              No parties found matching your search.
            </div>
          )}
        </div>
        
        {/* Pagination (Visual only) */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <p>Showing {filteredParties.length} of {mockParties.length} entries</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};