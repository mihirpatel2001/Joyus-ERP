import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreVertical, Mail, Briefcase, Calendar, Banknote, History, User, ArrowRight, Building, CheckCircle2, AlertCircle, TrendingUp, Percent, BarChart3, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Checkbox } from '../components/ui/Checkbox';
import { Pagination } from '../components/ui/Pagination';
import { Employee, SalaryRecord, UserRole } from '../types';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { MOCK_ORGANIZATIONS } from '../constants';

// Extended Mock Data with Salary Info
const mockEmployees: Employee[] = [
  { 
    id: '1', 
    name: 'Sarah Connor', 
    email: 'sarah.c@joyous.com', 
    role: 'Manager', 
    status: 'Active', 
    joinDate: '2023-01-15',
    organizationIds: ['org_hq', 'org_north', 'org_tech', 'org_apex', 'org_pixel'],
    currentSalary: 85000,
    payFrequency: 'Monthly',
    salaryHistory: [
      { id: 'h1', date: '2023-01-15', amount: 75000, frequency: 'Monthly', reason: 'Joining Salary', changedBy: 'Admin' },
      { id: 'h2', date: '2024-01-15', amount: 85000, frequency: 'Monthly', reason: 'Annual Appraisal', changedBy: 'Super Admin' }
    ],
    commissionRate: 5,
    totalSales: 2500000, // 25 Lakhs
    commissionEarned: 125000 // 1.25 Lakhs
  },
  { 
    id: '2', 
    name: 'John Smith', 
    email: 'john.s@joyous.com', 
    role: 'Developer', 
    status: 'Active', 
    joinDate: '2023-03-10',
    organizationIds: ['org_tech'],
    currentSalary: 60000,
    payFrequency: 'Monthly',
    salaryHistory: [
      { id: 'h3', date: '2023-03-10', amount: 60000, frequency: 'Monthly', reason: 'Joining Salary', changedBy: 'HR' }
    ],
    commissionRate: 0,
    totalSales: 0,
    commissionEarned: 0
  },
  { 
    id: '3', 
    name: 'Emily Blunt', 
    email: 'emily.b@joyous.com', 
    role: 'Designer', 
    status: 'Inactive', 
    joinDate: '2022-11-05',
    organizationIds: ['org_hq', 'org_north'],
    currentSalary: 55000,
    payFrequency: 'Bi-Weekly',
    salaryHistory: []
  },
  { 
    id: '4', 
    name: 'Michael Ross', 
    email: 'sales@joyous.com', 
    role: UserRole.SALES_PERSON, // Use Enum value
    status: 'Active', 
    joinDate: '2023-06-01',
    organizationIds: ['org_hq'],
    currentSalary: 45000,
    payFrequency: 'Monthly',
    salaryHistory: [],
    commissionRate: 8.5,
    totalSales: 1000000, // 10 Lakhs
    commissionEarned: 85000
  },
  // Adding more for pagination testing
  { id: '5', name: 'James Halpert', email: 'jim@joyous.com', role: UserRole.SALES_PERSON, status: 'Active', joinDate: '2023-07-01', organizationIds: ['org_hq'] },
  { id: '6', name: 'Pam Beesly', email: 'pam@joyous.com', role: 'Employee', status: 'Active', joinDate: '2023-07-05', organizationIds: ['org_hq'] },
];

export const Employees: React.FC = () => {
  const { showToast } = useToast();
  const { organizations, roles } = useAuth(); 
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);
  
  // ... (Keep existing Modal/Form states)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'salary' | 'commission'>('profile');

  // Add Employee Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Employee',
    status: 'Active',
    organizationIds: [] as string[]
  });
  
  const [orgSearchTerm, setOrgSearchTerm] = useState('');

  const [salaryForm, setSalaryForm] = useState({
    amount: '',
    frequency: 'Monthly',
    reason: ''
  });

  const [commissionForm, setCommissionForm] = useState({
    rate: '',
    totalSales: ''
  });

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || emp.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const filteredOrgs = organizations.filter(org => 
    org.name.toLowerCase().includes(orgSearchTerm.toLowerCase())
  );

  const roleOptions = roles.map(r => ({ label: r.name, value: r.name }));

  const isSalesRole = (role: string) => {
    return [
      UserRole.SALES_PERSON, 
      'Sales Person', 
      'Manager', 
      UserRole.ADMIN, 
      'Admin', 
      UserRole.SUPER_ADMIN, 
      'Super Admin'
    ].includes(role);
  };

  // ... (Keep Handlers handleCreateEmployee, toggleOrgSelection, openEmployeeDetails, handleUpdateSalary, handleUpdateCommission, getOrgName, calculateAnnualCTC)
  const handleCreateEmployee = () => {
    if (!formData.name || !formData.email) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    if (formData.organizationIds.length === 0) {
      showToast('Please assign at least one organization', 'error');
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
        organizationIds: formData.organizationIds,
        currentSalary: 0,
        payFrequency: 'Monthly',
        salaryHistory: [],
        commissionRate: 0,
        totalSales: 0,
        commissionEarned: 0
      };
      setEmployees([...employees, newEmp]);
      setIsLoading(false);
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', role: 'Employee', status: 'Active', organizationIds: [] });
      setOrgSearchTerm(''); 
      showToast('Employee created successfully', 'success');
    }, 800);
  };

  const toggleOrgSelection = (orgId: string, checked: boolean) => {
    setFormData(prev => {
      const newIds = checked 
        ? [...prev.organizationIds, orgId]
        : prev.organizationIds.filter(id => id !== orgId);
      return { ...prev, organizationIds: newIds };
    });
  };

  const openEmployeeDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setSalaryForm({
      amount: employee.currentSalary ? employee.currentSalary.toString() : '',
      frequency: employee.payFrequency || 'Monthly',
      reason: ''
    });
    setCommissionForm({
      rate: employee.commissionRate ? employee.commissionRate.toString() : '0',
      totalSales: employee.totalSales ? employee.totalSales.toString() : '0'
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
        changedBy: 'Admin'
      };

      const updatedEmployee = {
        ...selectedEmployee,
        currentSalary: Number(salaryForm.amount),
        payFrequency: salaryForm.frequency as any,
        salaryHistory: [newHistoryItem, ...(selectedEmployee.salaryHistory || [])]
      };

      setEmployees(employees.map(e => e.id === selectedEmployee.id ? updatedEmployee : e));
      setSelectedEmployee(updatedEmployee);
      
      setIsLoading(false);
      setSalaryForm(prev => ({ ...prev, reason: '' }));
      showToast('Salary updated successfully', 'success');
    }, 800);
  };

  const handleUpdateCommission = () => {
    if (!selectedEmployee) return;

    const rate = Number(commissionForm.rate);
    const sales = Number(commissionForm.totalSales);

    if (isNaN(rate) || isNaN(sales)) {
      showToast('Please enter valid numeric values', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const earned = (sales * rate) / 100;
      const updatedEmployee: Employee = {
        ...selectedEmployee,
        commissionRate: rate,
        totalSales: sales,
        commissionEarned: earned
      };

      setEmployees(employees.map(e => e.id === selectedEmployee.id ? updatedEmployee : e));
      setSelectedEmployee(updatedEmployee);
      
      setIsLoading(false);
      showToast('Commission settings updated successfully', 'success');
    }, 800);
  };

  const getOrgName = (id: string) => {
    const org = MOCK_ORGANIZATIONS.find(o => o.id === id);
    return org ? org.name : id;
  };

  const calculateAnnualCTC = (amount: number = 0, frequency: string = 'Monthly') => {
    if (frequency === 'Monthly') return amount * 12;
    if (frequency === 'Bi-Weekly') return amount * 26;
    if (frequency === 'Weekly') return amount * 52;
    return amount;
  };


  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
      {/* Header & Fixed Top Section */}
      <div className="flex-shrink-0 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-content-strong">Employees</h1>
            <p className="text-content-sub text-sm">Manage your team members and roles</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Employee
          </Button>
        </div>
      </div>

      {/* Main Content Card - Flexible Height */}
      <div className="bg-surface rounded-xl shadow-sm border border-divider flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Filters & Search - Fixed */}
        <div className="p-4 border-b border-divider flex flex-col lg:flex-row gap-4 justify-between items-center rounded-t-xl flex-shrink-0">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-sub" />
            <input 
              type="text" 
              placeholder="Search employees..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg text-sm bg-surface text-content-strong placeholder-content-sub focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
             <div className="w-full sm:w-40">
                <Select
                  value={roleFilter}
                  onChange={setRoleFilter}
                  options={[
                    { label: 'All Roles', value: 'All' },
                    { label: 'Sales Person', value: UserRole.SALES_PERSON },
                    { label: 'Manager', value: 'Manager' },
                    { label: 'Developer', value: 'Developer' },
                    { label: 'Employee', value: UserRole.EMPLOYEE },
                    { label: 'Admin', value: UserRole.ADMIN },
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

        {/* Scrollable Table Area */}
        <div className="flex-1 overflow-auto">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <table className="w-full text-sm text-left">
              <thead className="bg-canvas text-content-sub font-medium border-b border-divider sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap bg-canvas">Name</th>
                  <th className="px-6 py-4 whitespace-nowrap bg-canvas">Role</th>
                  <th className="px-6 py-4 whitespace-nowrap bg-canvas">Status</th>
                  <th className="px-6 py-4 whitespace-nowrap bg-canvas">Join Date</th>
                  <th className="px-6 py-4 text-right bg-canvas">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {currentItems.map((emp) => (
                  <tr 
                    key={emp.id} 
                    className="hover:bg-surface-highlight transition-colors cursor-pointer group"
                    onClick={() => openEmployeeDetails(emp)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-content-strong group-hover:text-primary-600 transition-colors">{emp.name}</p>
                          <div className="flex items-center gap-1 text-content-sub text-xs">
                            <Mail className="w-3 h-3" /> {emp.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-content-normal">
                        <Briefcase className="w-4 h-4 text-content-sub" />
                        {emp.role === UserRole.SALES_PERSON ? 'Sales Person' : emp.role}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={emp.status === 'Active' ? 'success' : 'neutral'}>
                        {emp.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-content-normal">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-content-sub" />
                        {new Date(emp.joinDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-content-sub hover:text-content-strong p-1">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {currentItems.length === 0 && (
                   <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-content-sub">
                      No employees found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden grid grid-cols-1 gap-4 p-4">
            {currentItems.map((emp) => (
              <div 
                key={emp.id} 
                className="bg-surface p-4 rounded-xl border border-divider shadow-sm space-y-4 active:bg-surface-highlight"
                onClick={() => openEmployeeDetails(emp)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-content-strong">{emp.name}</h3>
                      <div className="flex items-center gap-1 text-content-sub text-xs mt-0.5">
                        <Mail className="w-3 h-3" /> {emp.email}
                      </div>
                    </div>
                  </div>
                  <button className="text-content-sub p-1">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-divider">
                  <div>
                    <p className="text-xs text-content-sub mb-1">Role</p>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-content-normal">
                      <Briefcase className="w-3.5 h-3.5 text-content-sub" />
                      {emp.role === UserRole.SALES_PERSON ? 'Sales Person' : emp.role}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-content-sub mb-1">Status</p>
                    <Badge variant={emp.status === 'Active' ? 'success' : 'neutral'}>
                      {emp.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            {currentItems.length === 0 && (
              <div className="text-center py-10 bg-surface rounded-xl border border-divider border-dashed">
                <p className="text-content-sub">No employees found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination Footer - Fixed Bottom */}
        <div className="flex-shrink-0 mt-auto border-t border-divider">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredEmployees.length}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      </div>
      
      {/* ... (Keep existing Modals unchanged) ... */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Employee"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Full Name" 
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <Input 
              label="Email Address" 
              type="email"
              placeholder="john@company.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Select 
                label="Role"
                value={formData.role}
                onChange={(val) => setFormData({...formData, role: val})}
                options={roleOptions}
             />
             <Select 
                label="Status"
                value={formData.status}
                onChange={(val) => setFormData({...formData, status: val})}
                options={[
                  { label: 'Active', value: 'Active' },
                  { label: 'Inactive', value: 'Inactive' },
                ]}
             />
          </div>

          <div>
            <label className="block text-sm font-medium text-content-normal mb-2">
              Assign Organizations
            </label>
            
            {/* Org Search Input */}
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-content-sub" />
              <input
                type="text"
                placeholder="Search organizations..."
                value={orgSearchTerm}
                onChange={(e) => setOrgSearchTerm(e.target.value)}
                className="bg-surface text-content-strong w-full pl-9 pr-3 py-1.5 text-sm border border-input rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/10"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-3 border border-divider rounded-lg bg-canvas">
              {filteredOrgs.length > 0 ? (
                filteredOrgs.map(org => (
                  <label 
                    key={org.id} 
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                      ${formData.organizationIds.includes(org.id) 
                        ? 'bg-primary-50 border-primary-200 shadow-sm' 
                        : 'bg-surface border-divider hover:border-input'}
                    `}
                  >
                    <Checkbox 
                      checked={formData.organizationIds.includes(org.id)}
                      onChange={(checked) => toggleOrgSelection(org.id, checked)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${formData.organizationIds.includes(org.id) ? 'text-primary-800' : 'text-content-normal'}`}>
                        {org.name}
                      </p>
                    </div>
                  </label>
                ))
              ) : (
                <div className="col-span-full py-4 text-center text-xs text-content-sub italic">
                  No organizations found
                </div>
              )}
            </div>
            <p className="text-xs text-content-sub mt-2">
              Selected: {formData.organizationIds.length} organizations
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-divider">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateEmployee} isLoading={isLoading}>Create Employee</Button>
          </div>
        </div>
      </Modal>

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={selectedEmployee.name}
          description={selectedEmployee.role === UserRole.SALES_PERSON ? 'Sales Person' : selectedEmployee.role}
          size="lg"
        >
          <div className="flex flex-col h-[600px]">
            {/* Tabs */}
            <div className="flex border-b border-divider mb-6 overflow-x-auto flex-shrink-0">
               <button
                 onClick={() => setActiveTab('profile')}
                 className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === 'profile' 
                      ? 'border-primary-600 text-primary-700' 
                      : 'border-transparent text-content-sub hover:text-content-strong'
                 }`}
               >
                 Profile & Access
               </button>
               <button
                 onClick={() => setActiveTab('salary')}
                 className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === 'salary' 
                      ? 'border-primary-600 text-primary-700' 
                      : 'border-transparent text-content-sub hover:text-content-strong'
                 }`}
               >
                 Salary & Payroll
               </button>
               {/* Only show Commission tab for Sales roles */}
               {isSalesRole(selectedEmployee.role) && (
                 <button
                   onClick={() => setActiveTab('commission')}
                   className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === 'commission' 
                        ? 'border-emerald-600 text-emerald-700' 
                        : 'border-transparent text-content-sub hover:text-content-strong'
                   }`}
                 >
                   Commission & Sales
                 </button>
               )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 pb-4">
               {/* --- PROFILE TAB --- */}
               {activeTab === 'profile' && (
                 <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                       <div>
                          <p className="text-xs text-content-sub uppercase tracking-wide font-medium mb-1">Email Address</p>
                          <p className="text-content-strong font-medium flex items-center gap-2">
                            <Mail className="w-4 h-4 text-content-sub" /> {selectedEmployee.email}
                          </p>
                       </div>
                       <div>
                          <p className="text-xs text-content-sub uppercase tracking-wide font-medium mb-1">Join Date</p>
                          <p className="text-content-strong font-medium flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-content-sub" /> {selectedEmployee.joinDate}
                          </p>
                       </div>
                       <div>
                          <p className="text-xs text-content-sub uppercase tracking-wide font-medium mb-1">Status</p>
                          <Badge variant={selectedEmployee.status === 'Active' ? 'success' : 'neutral'}>
                            {selectedEmployee.status}
                          </Badge>
                       </div>
                    </div>

                    <div>
                       <p className="text-xs text-content-sub uppercase tracking-wide font-medium mb-3">Assigned Organizations</p>
                       <div className="bg-canvas p-4 rounded-xl border border-divider">
                         {selectedEmployee.organizationIds && selectedEmployee.organizationIds.length > 0 ? (
                           <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                             {selectedEmployee.organizationIds.map(orgId => (
                               <div key={orgId} className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-divider rounded-full shadow-sm">
                                  <Building className="w-3.5 h-3.5 text-primary-500" />
                                  <span className="text-sm text-content-normal">{getOrgName(orgId)}</span>
                               </div>
                             ))}
                           </div>
                         ) : (
                           <div className="text-content-sub italic text-sm flex items-center gap-2">
                             <AlertCircle className="w-4 h-4" /> No organizations assigned
                           </div>
                         )}
                       </div>
                    </div>
                 </div>
               )}

               {/* --- SALARY TAB --- */}
               {activeTab === 'salary' && (
                 <div className="space-y-8 animate-fadeIn">
                    {/* Current Salary Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-6 text-white shadow-xl">
                        {/* Decorative Shapes */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl"></div>

                        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                            <div>
                                <div className="flex items-center gap-2 text-primary-100 mb-2">
                                    <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <Banknote className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium tracking-wide uppercase">Current Compensation</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-4xl font-bold tracking-tight text-white">
                                        ₹ {selectedEmployee.currentSalary?.toLocaleString() || '0'}
                                    </h3>
                                    <span className="text-primary-100 font-medium bg-white/10 px-2 py-0.5 rounded text-sm">
                                        {selectedEmployee.payFrequency}
                                    </span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-8 border-t border-white/10 pt-4 sm:border-t-0 sm:border-l sm:pl-8 sm:pt-0">
                                <div>
                                    <p className="text-xs font-medium text-primary-200 uppercase tracking-wider">Annual CTC</p>
                                    <p className="mt-1 text-lg font-semibold text-white">
                                        ₹ {calculateAnnualCTC(selectedEmployee.currentSalary, selectedEmployee.payFrequency).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-primary-200 uppercase tracking-wider">Last Revision</p>
                                    <p className="mt-1 text-lg font-semibold text-white">
                                         {selectedEmployee.salaryHistory && selectedEmployee.salaryHistory.length > 0 
                                            ? selectedEmployee.salaryHistory[0].date 
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Update Form */}
                    <div className="bg-surface p-5 rounded-xl border border-divider shadow-sm">
                       <h4 className="font-bold text-content-strong mb-4 flex items-center gap-2">
                         <Plus className="w-4 h-4 text-primary-600" /> Update Salary
                       </h4>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <Input 
                             label="New Amount"
                             type="currency"
                             placeholder="0.00"
                             value={salaryForm.amount}
                             onChange={(e) => setSalaryForm({...salaryForm, amount: e.target.value})}
                          />
                          <Select 
                             label="Frequency"
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
                       <Input 
                          label="Reason for Change"
                          placeholder="e.g. Annual Appraisal, Promotion"
                          value={salaryForm.reason}
                          onChange={(e) => setSalaryForm({...salaryForm, reason: e.target.value})}
                       />
                       <div className="flex justify-end mt-4">
                          <Button onClick={handleUpdateSalary} isLoading={isLoading}>Update Salary</Button>
                       </div>
                    </div>

                    {/* History Table */}
                    <div>
                       <h4 className="font-bold text-content-strong mb-3 flex items-center gap-2">
                         <History className="w-4 h-4 text-content-sub" /> Salary History
                       </h4>
                       <div className="border border-divider rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                             <thead className="bg-canvas text-content-normal border-b border-divider">
                                <tr>
                                   <th className="px-4 py-3 text-left font-medium">Date</th>
                                   <th className="px-4 py-3 text-left font-medium">Reason</th>
                                   <th className="px-4 py-3 text-right font-medium">Amount</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-divider">
                                {(selectedEmployee.salaryHistory || []).map(record => (
                                  <tr key={record.id} className="hover:bg-surface-highlight">
                                     <td className="px-4 py-3 text-content-normal">{record.date}</td>
                                     <td className="px-4 py-3 text-content-strong font-medium">{record.reason}</td>
                                     <td className="px-4 py-3 text-right font-bold text-content-normal">₹ {record.amount.toLocaleString()}</td>
                                  </tr>
                                ))}
                                {(!selectedEmployee.salaryHistory || selectedEmployee.salaryHistory.length === 0) && (
                                   <tr>
                                      <td colSpan={3} className="px-4 py-6 text-center text-content-sub italic">
                                         No salary history available.
                                      </td>
                                   </tr>
                                )}
                             </tbody>
                          </table>
                       </div>
                    </div>
                 </div>
               )}

               {/* --- COMMISSION TAB --- */}
               {activeTab === 'commission' && isSalesRole(selectedEmployee.role) && (
                 <div className="space-y-8 animate-fadeIn">
                    {/* Performance Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 p-6 text-white shadow-xl">
                        {/* Decorative Shapes */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl"></div>

                        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                            <div>
                                <div className="flex items-center gap-2 text-emerald-100 mb-2">
                                    <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <TrendingUp className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium tracking-wide uppercase">Commission Earned</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-4xl font-bold tracking-tight text-white">
                                        ₹ {selectedEmployee.commissionEarned?.toLocaleString() || '0'}
                                    </h3>
                                    <span className="text-emerald-100 font-medium bg-white/10 px-2 py-0.5 rounded text-sm">
                                        {selectedEmployee.commissionRate}% Cut
                                    </span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-8 border-t border-white/10 pt-4 sm:border-t-0 sm:border-l sm:pl-8 sm:pt-0">
                                <div>
                                    <p className="text-xs font-medium text-emerald-200 uppercase tracking-wider">Total Sales</p>
                                    <p className="mt-1 text-lg font-semibold text-white">
                                        ₹ {selectedEmployee.totalSales?.toLocaleString() || '0'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Update Commission Form */}
                    <div className="bg-surface p-5 rounded-xl border border-divider shadow-sm">
                       <h4 className="font-bold text-content-strong mb-4 flex items-center gap-2">
                         <Percent className="w-4 h-4 text-emerald-600" /> Commission Configuration
                       </h4>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <Input 
                             label="Commission Rate (%)"
                             type="percentage"
                             placeholder="0"
                             value={commissionForm.rate}
                             onChange={(e) => setCommissionForm({...commissionForm, rate: e.target.value})}
                          />
                          <Input 
                             label="Total Sales (YTD)"
                             type="currency"
                             placeholder="0.00"
                             value={commissionForm.totalSales}
                             onChange={(e) => setCommissionForm({...commissionForm, totalSales: e.target.value})}
                          />
                       </div>
                       <div className="flex justify-end mt-4">
                          <Button 
                            onClick={handleUpdateCommission} 
                            isLoading={isLoading}
                            className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 shadow-emerald-500/20"
                          >
                            <Save className="w-4 h-4 mr-2" /> Update Commission
                          </Button>
                       </div>
                    </div>
                    
                    <div className="p-4 bg-canvas border border-divider rounded-lg text-sm text-content-sub flex items-start gap-3">
                       <AlertCircle className="w-5 h-5 text-content-sub mt-0.5 flex-shrink-0" />
                       <p>
                         Commission is calculated automatically based on total sales. 
                         In the future, Total Sales will be linked directly to paid Invoices where this employee is assigned as the salesperson.
                       </p>
                    </div>
                 </div>
               )}
            </div>
            
            <div className="pt-6 mt-2 border-t border-divider flex justify-end flex-shrink-0">
               <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};