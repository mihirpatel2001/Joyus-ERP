import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, Mail, Briefcase, Calendar, Banknote, History, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Employee, SalaryRecord } from '../types';
import { useToast } from '../context/ToastContext';

// Extended Mock Data with Salary Info
const mockEmployees: Employee[] = [
  { 
    id: '1', 
    name: 'Sarah Connor', 
    email: 'sarah.c@joyous.com', 
    role: 'Manager', 
    status: 'Active', 
    joinDate: '2023-01-15',
    currentSalary: 85000,
    payFrequency: 'Monthly',
    salaryHistory: [
      { id: 'h1', date: '2023-01-15', amount: 75000, frequency: 'Monthly', reason: 'Joining Salary', changedBy: 'Admin' },
      { id: 'h2', date: '2024-01-15', amount: 85000, frequency: 'Monthly', reason: 'Annual Appraisal', changedBy: 'Super Admin' }
    ]
  },
  { 
    id: '2', 
    name: 'John Smith', 
    email: 'john.s@joyous.com', 
    role: 'Developer', 
    status: 'Active', 
    joinDate: '2023-03-10',
    currentSalary: 60000,
    payFrequency: 'Monthly',
    salaryHistory: [
      { id: 'h3', date: '2023-03-10', amount: 60000, frequency: 'Monthly', reason: 'Joining Salary', changedBy: 'HR' }
    ]
  },
  { 
    id: '3', 
    name: 'Emily Blunt', 
    email: 'emily.b@joyous.com', 
    role: 'Designer', 
    status: 'Inactive', 
    joinDate: '2022-11-05',
    currentSalary: 55000,
    payFrequency: 'Bi-Weekly',
    salaryHistory: []
  },
];

export const Employees: React.FC = () => {
  const { showToast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'salary'>('profile');

  // Add Employee Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Employee',
    status: 'Active'
  });

  // Salary Update Form State
  const [salaryForm, setSalaryForm] = useState({
    amount: '',
    frequency: 'Monthly',
    reason: ''
  });

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || emp.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // --- Handlers ---

  const handleCreateEmployee = () => {
    if (!formData.name || !formData.email) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newEmp: Employee = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status as 'Active' | 'Inactive',
        joinDate: new Date().toISOString().split('T')[0],
        currentSalary: 0,
        payFrequency: 'Monthly',
        salaryHistory: []
      };
      setEmployees([...employees, newEmp]);
      setIsLoading(false);
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', role: 'Employee', status: 'Active' });
      showToast('Employee created successfully', 'success');
    }, 800);
  };

  const openEmployeeDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setSalaryForm({
      amount: employee.currentSalary ? employee.currentSalary.toString() : '',
      frequency: employee.payFrequency || 'Monthly',
      reason: ''
    });
    setActiveTab('profile');
    setIsDetailModalOpen(true);
  };

  const handleUpdateSalary = () => {
    if (!selectedEmployee) return;
    if (!salaryForm.amount || isNaN(Number(salaryForm.amount))) {
      showToast('Please enter a valid salary amount', 'error');
      return;
    }
    if (!salaryForm.reason) {
      showToast('Please provide a reason for the change', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newHistoryItem: SalaryRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        amount: Number(salaryForm.amount),
        frequency: salaryForm.frequency as any,
        reason: salaryForm.reason,
        changedBy: 'Admin' // In real app, get from AuthContext
      };

      const updatedEmployee = {
        ...selectedEmployee,
        currentSalary: Number(salaryForm.amount),
        payFrequency: salaryForm.frequency as any,
        salaryHistory: [newHistoryItem, ...(selectedEmployee.salaryHistory || [])]
      };

      // Update Local State
      setEmployees(employees.map(e => e.id === selectedEmployee.id ? updatedEmployee : e));
      setSelectedEmployee(updatedEmployee);
      
      setIsLoading(false);
      setSalaryForm(prev => ({ ...prev, reason: '' })); // Reset reason only
      showToast('Salary updated successfully', 'success');
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Employees</h1>
          <p className="text-slate-500 text-sm">Manage your team members and roles</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Employee
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-4 justify-between items-center rounded-t-xl">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search employees..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
             <div className="w-full sm:w-40">
                <Select
                  value={roleFilter}
                  onChange={setRoleFilter}
                  options={[
                    { label: 'All Roles', value: 'All' },
                    { label: 'Manager', value: 'Manager' },
                    { label: 'Developer', value: 'Developer' },
                    { label: 'Designer', value: 'Designer' },
                    { label: 'Employee', value: 'Employee' },
                    { label: 'Admin', value: 'Admin' },
                  ]}
                  className="!mb-0"
                />
             </div>
             <div className="w-full sm:w-40">
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { label: 'All Status', value: 'All' },
                    { label: 'Active', value: 'Active' },
                    { label: 'Inactive', value: 'Inactive' },
                  ]}
                  className="!mb-0"
                />
             </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto rounded-b-xl">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Name</th>
                <th className="px-6 py-4 whitespace-nowrap">Role</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap">Join Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => (
                <tr 
                  key={emp.id} 
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  onClick={() => openEmployeeDetails(emp)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 group-hover:text-primary-600 transition-colors">{emp.name}</p>
                        <div className="flex items-center gap-1 text-slate-500 text-xs">
                          <Mail className="w-3 h-3" /> {emp.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      {emp.role}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={emp.status === 'Active' ? 'success' : 'neutral'}>
                      {emp.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(emp.joinDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600 p-1">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                 <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No employees found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredEmployees.map((emp) => (
          <div 
            key={emp.id} 
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4 active:bg-slate-50"
            onClick={() => openEmployeeDetails(emp)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{emp.name}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                    <Mail className="w-3 h-3" /> {emp.email}
                  </div>
                </div>
              </div>
              <button className="text-slate-400 p-1">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-400 mb-1">Role</p>
                <div className="flex items-center gap-2 text-slate-700 text-sm">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  {emp.role}
                </div>
              </div>
              <div>
                 <p className="text-xs text-slate-400 mb-1">Status</p>
                 <Badge variant={emp.status === 'Active' ? 'success' : 'neutral'}>
                    {emp.status}
                  </Badge>
              </div>
            </div>
          </div>
        ))}
        {filteredEmployees.length === 0 && (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
             No employees found matching your filters.
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Employee"
      >
        <form className="space-y-4 mt-2">
          <Input 
            label="Full Name" 
            placeholder="e.g. John Doe"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <Input 
            label="Email Address" 
            type="email"
            placeholder="e.g. john@company.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Role"
              value={formData.role}
              onChange={(value) => setFormData({...formData, role: value})}
              options={[
                { label: 'Employee', value: 'Employee' },
                { label: 'Manager', value: 'Manager' },
                { label: 'Admin', value: 'Admin' },
                { label: 'Developer', value: 'Developer' },
              ]}
            />
            <Select 
              label="Status"
              value={formData.status}
              onChange={(value) => setFormData({...formData, status: value})}
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
              ]}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              className="flex-1" 
              onClick={(e) => { e.preventDefault(); handleCreateEmployee(); }}
              isLoading={isLoading}
            >
              Create Employee
            </Button>
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Employee Details Modal with Tabs */}
      {selectedEmployee && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title="Employee Details"
          size="lg" // Larger modal for better table visibility
        >
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold border-4 border-white shadow-sm">
              {selectedEmployee.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">{selectedEmployee.name}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <Briefcase className="w-3.5 h-3.5" /> {selectedEmployee.role}
                <span>•</span>
                <Mail className="w-3.5 h-3.5" /> {selectedEmployee.email}
              </div>
              <Badge variant={selectedEmployee.status === 'Active' ? 'success' : 'neutral'}>
                {selectedEmployee.status}
              </Badge>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'profile' 
                  ? 'border-primary-600 text-primary-700 bg-primary-50/50' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4" /> Profile
            </button>
            <button
              onClick={() => setActiveTab('salary')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'salary' 
                  ? 'border-primary-600 text-primary-700 bg-primary-50/50' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Banknote className="w-4 h-4" /> Salary & Payroll
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            {activeTab === 'profile' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">Email</p>
                      <p className="text-sm font-medium text-slate-800 truncate">{selectedEmployee.email}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">Hire Date</p>
                      <p className="text-sm font-medium text-slate-800">{new Date(selectedEmployee.joinDate).toLocaleDateString()}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">Role</p>
                      <p className="text-sm font-medium text-slate-800">{selectedEmployee.role}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">Department</p>
                      <p className="text-sm font-medium text-slate-800">General</p>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'salary' && (
              <div className="space-y-8 animate-fadeIn">
                
                {/* Current Salary Overview Card */}
                <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 p-6 overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Banknote className="w-32 h-32 text-green-800 transform rotate-12 translate-x-8 -translate-y-8" />
                   </div>
                   
                   <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                     <div>
                        <p className="text-green-800 text-sm font-bold uppercase tracking-wider mb-2">Current Annual Salary</p>
                        <h3 className="text-3xl font-extrabold text-green-700 tracking-tight">
                          {selectedEmployee.currentSalary ? `₹ ${selectedEmployee.currentSalary.toLocaleString()}` : 'Not Set'}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="success" className="bg-green-200/50 border-green-200">
                             Paid {selectedEmployee.payFrequency}
                          </Badge>
                        </div>
                     </div>
                     <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-green-200/50 shadow-sm">
                        <div className="text-xs text-green-800 font-medium mb-1">Next Pay Date</div>
                        <div className="text-lg font-bold text-green-900">Oct 31, 2023</div>
                     </div>
                   </div>
                </div>

                {/* Edit Salary Form */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                   <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center gap-2">
                     <EditIcon className="w-4 h-4 text-slate-500" />
                     <h4 className="text-sm font-bold text-slate-700">Update Salary Configuration</h4>
                   </div>
                   
                   <div className="p-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <Input 
                          label="New Amount (₹)" 
                          type="currency"
                          placeholder="0.00"
                          value={salaryForm.amount}
                          onChange={(e) => setSalaryForm({...salaryForm, amount: e.target.value})}
                        />
                        <Select 
                          label="Pay Frequency"
                          value={salaryForm.frequency}
                          onChange={(val) => setSalaryForm({...salaryForm, frequency: val})}
                          options={[
                            { label: 'Monthly', value: 'Monthly' },
                            { label: 'Bi-Weekly', value: 'Bi-Weekly' },
                            { label: 'Weekly', value: 'Weekly' },
                            { label: 'Annually', value: 'Annually' },
                          ]}
                        />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Effective Date</label>
                         <input 
                           type="date"
                           className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 transition-all"
                           defaultValue={new Date().toISOString().split('T')[0]}
                         />
                       </div>
                       <Input 
                          label="Reason for Adjustment"
                          placeholder="e.g. Annual Appraisal, Promotion"
                          value={salaryForm.reason}
                          onChange={(e) => setSalaryForm({...salaryForm, reason: e.target.value})}
                       />
                     </div>
                     <div className="flex justify-end">
                        <Button onClick={handleUpdateSalary} isLoading={isLoading}>
                           Update Salary Record
                        </Button>
                     </div>
                   </div>
                </div>

                {/* History Table */}
                <div>
                   <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2 px-1">
                     <History className="w-4 h-4" /> Compensation History
                   </h4>
                   <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                           <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                              <tr>
                                 <th className="px-6 py-3 whitespace-nowrap w-32">Effective Date</th>
                                 <th className="px-6 py-3 whitespace-nowrap w-40 text-right">Amount</th>
                                 <th className="px-6 py-3 whitespace-nowrap w-32">Frequency</th>
                                 <th className="px-6 py-3 whitespace-nowrap">Reason</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100 bg-white">
                              {selectedEmployee.salaryHistory && selectedEmployee.salaryHistory.length > 0 ? (
                                 selectedEmployee.salaryHistory.map((rec) => (
                                   <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                                      <td className="px-6 py-4 text-slate-600">
                                        {new Date(rec.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                      </td>
                                      <td className="px-6 py-4 font-bold text-slate-800 text-right font-mono">
                                        ₹ {rec.amount.toLocaleString()}
                                      </td>
                                      <td className="px-6 py-4">
                                        <Badge variant="neutral" className="bg-slate-100 text-slate-600 border-slate-200">
                                          {rec.frequency}
                                        </Badge>
                                      </td>
                                      <td className="px-6 py-4 text-slate-500">
                                        {rec.reason}
                                      </td>
                                   </tr>
                                 ))
                              ) : (
                                 <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                       <div className="flex flex-col items-center gap-2">
                                          <div className="p-3 bg-slate-50 rounded-full">
                                            <History className="w-6 h-6 text-slate-300" />
                                          </div>
                                          <p>No salary history available</p>
                                       </div>
                                    </td>
                                 </tr>
                              )}
                           </tbody>
                        </table>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end pt-5 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Helper icon
const EditIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);