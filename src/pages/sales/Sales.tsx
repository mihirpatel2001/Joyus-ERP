import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, Percent, Award, Plus, FileText, Search, Filter, Download, MoreVertical,
  CheckCircle, Clock, Building, DollarSign, Printer, ArrowRight, Trash2, FileCheck, Mail, Send
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState } from '../../components/ui/EmptyState';
import { SignaturePad } from '../../components/ui/SignaturePad';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UserRole, Estimate, Invoice, LineItem } from '../../types/types';import { MOCK_ORGANIZATIONS } from '@/constants';
import { DocumentPreview } from '@/src/components/common/documentPreview/DocumentPreview';


// Initial Mock Data
const initialEstimates: Estimate[] = [
  { 
    id: 'EST-001', 
    customerName: 'Tech Corp', 
    customerEmail: 'admin@techcorp.com',
    date: '2023-10-15', 
    expiryDate: '2023-10-22',
    items: [{ id: '1', description: 'Consulting Services', quantity: 10, rate: 5000, amount: 50000 }],
    subtotal: 50000, tax: 9000, total: 59000,
    status: 'Sent', 
    salesPersonId: 'user_sales',
    salesPersonName: 'Michael Ross'
  },
  { 
    id: 'EST-002', 
    customerName: 'StartUp Inc', 
    customerEmail: 'founder@startup.inc',
    date: '2023-10-18', 
    expiryDate: '2023-10-25',
    items: [{ id: '1', description: 'Server Setup', quantity: 1, rate: 25000, amount: 25000 }],
    subtotal: 25000, tax: 4500, total: 29500,
    status: 'Draft', 
    salesPersonId: 'user_sales',
    salesPersonName: 'Michael Ross'
  }
];

const initialInvoices: Invoice[] = [
  { 
    id: 'INV-001', 
    customerName: 'Acme Corp', 
    customerEmail: 'accounts@acme.com',
    date: '2023-10-01', 
    dueDate: '2023-10-15',
    items: [{ id: '1', description: 'Widget A', quantity: 100, rate: 450, amount: 45000 }],
    subtotal: 45000, tax: 0, total: 45000,
    status: 'Paid', 
    salesPersonId: 'user_sales',
    salesPersonName: 'Michael Ross'
  },
  { 
    id: 'INV-002', 
    customerName: 'Global Supplies', 
    customerEmail: 'billing@globalsupplies.com',
    date: '2023-10-03', 
    dueDate: '2023-11-03',
    items: [{ id: '1', description: 'Bulk Order', quantity: 1, rate: 12500, amount: 12500 }],
    subtotal: 12500, tax: 0, total: 12500,
    status: 'Pending', 
    salesPersonId: 'user_hr', // Example other user
    salesPersonName: 'Sarah Connor'
  },
];

// Mock Data for Commissions (Sales Team)
const salesTeamData = [
  { id: 'user_sales', name: 'Michael Ross', role: 'Sales Person', sales: 4500000, commission: 225000 },
  { id: 'user_hr', name: 'Sarah Connor', role: 'Manager', sales: 2800000, commission: 140000 },
  { id: '3', name: 'James Halpert', role: 'Sales Person', sales: 3200000, commission: 160000 },
  { id: '4', name: 'Dwight Schrute', role: 'Sales Person', sales: 5500000, commission: 275000 },
];

const teamTotals = {
  sales: salesTeamData.reduce((acc, curr) => acc + curr.sales, 0),
  commission: salesTeamData.reduce((acc, curr) => acc + curr.commission, 0)
};

const myPerformance = {
  earned: 225000,
  totalSales: 4500000,
  target: 6000000
};

export const Sales: React.FC = () => {
  const { hasRole, organizations, user } = useAuth();
  const { showToast } = useToast();
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'estimates' | 'commissions'>('overview');
  
  // Data State
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [estimates, setEstimates] = useState<Estimate[]>(initialEstimates);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Filter State
  const [selectedOrgFilter, setSelectedOrgFilter] = useState<string>('All');

  // Modals & Forms
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<{type: 'estimate' | 'invoice', data: any} | null>(null);
  
  // Email State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailDraft, setEmailDraft] = useState({ to: '', subject: '', message: '' });
  const [sendingEmail, setSendingEmail] = useState(false);

  // New Estimate Form Data
  const [estimateForm, setEstimateForm] = useState({
    customerName: '',
    customerEmail: '',
    expiryDate: '',
    items: [] as LineItem[],
    signature: '' as string | null
  });

  const isAdmin = hasRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  
  // Reset pagination on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  // --- Computed Metrics ---
  const estimatesGenerated = estimates.length;
  const invoicesGenerated = invoices.length;
  const convertedEstimates = estimates.filter(e => e.status === 'Converted').length;
  const conversionRate = estimatesGenerated > 0 ? ((convertedEstimates / estimatesGenerated) * 100).toFixed(1) : '0.0';

  // --- Filtering Logic ---
  const filteredInvoices = invoices.filter(inv => 
    inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inv.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEstimates = estimates.filter(est => 
    est.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    est.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Slices
  const currentList = activeTab === 'overview' ? filteredInvoices : filteredEstimates;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = currentList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(currentList.length / itemsPerPage);

  // --- Actions ---

  const handleOpenNewEstimate = () => {
    setEstimateForm({
      customerName: '',
      customerEmail: '',
      expiryDate: '',
      items: [{ id: Date.now().toString(), description: '', quantity: 1, rate: 0, amount: 0 }],
      signature: null
    });
    setIsEstimateModalOpen(true);
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
    const newItems = [...estimateForm.items];
    const item = newItems[index];
    
    // Update field
    (item as any)[field] = value;

    // Recalculate Amount
    if (field === 'quantity' || field === 'rate') {
      item.amount = Number(item.quantity) * Number(item.rate);
    }

    setEstimateForm({ ...estimateForm, items: newItems });
  };

  const addLineItem = () => {
    setEstimateForm({
      ...estimateForm,
      items: [...estimateForm.items, { id: Date.now().toString(), description: '', quantity: 1, rate: 0, amount: 0 }]
    });
  };

  const removeLineItem = (index: number) => {
    if (estimateForm.items.length > 1) {
      const newItems = estimateForm.items.filter((_, i) => i !== index);
      setEstimateForm({ ...estimateForm, items: newItems });
    }
  };

  const calculateTotals = (items: LineItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.18; // Flat 18% tax for demo
    return { subtotal, tax, total: subtotal + tax };
  };

  const handleCreateEstimate = () => {
    if (!estimateForm.customerName || estimateForm.items.some(i => !i.description)) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const { subtotal, tax, total } = calculateTotals(estimateForm.items);

    const newEstimate: Estimate = {
      id: `EST-${String(estimates.length + 1).padStart(3, '0')}`,
      customerName: estimateForm.customerName,
      customerEmail: estimateForm.customerEmail,
      date: new Date().toISOString(),
      expiryDate: estimateForm.expiryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      items: estimateForm.items,
      subtotal,
      tax,
      total,
      status: 'Sent', // Default to sent for demo flow
      salesPersonId: user?.id || 'unknown',
      salesPersonName: user?.name || 'Unknown',
      signature: estimateForm.signature || undefined
    };

    setEstimates([newEstimate, ...estimates]);
    setIsEstimateModalOpen(false);
    showToast('Estimate created successfully', 'success');
  };

  const handleConvertToInvoice = (estimate: Estimate) => {
    const newInvoice: Invoice = {
      id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      estimateId: estimate.id,
      customerName: estimate.customerName,
      customerEmail: estimate.customerEmail,
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Net 30
      items: estimate.items,
      subtotal: estimate.subtotal,
      tax: estimate.tax,
      total: estimate.total,
      status: 'Pending',
      salesPersonId: estimate.salesPersonId,
      salesPersonName: estimate.salesPersonName,
      signature: estimate.signature
    };

    setInvoices([newInvoice, ...invoices]);
    
    // Update estimate status
    const updatedEstimates = estimates.map(e => 
      e.id === estimate.id ? { ...e, status: 'Converted' as const } : e
    );
    setEstimates(updatedEstimates);

    showToast('Estimate converted to Invoice', 'success');
  };

  const handlePrintPreview = (type: 'estimate' | 'invoice', data: any) => {
    setPreviewDocument({ type, data });
    setIsPreviewModalOpen(true);
  };

  const printDocument = () => {
    const printContent = document.getElementById('printable-document');
    if (!printContent) return;

    const printWindow = window.open('', '', 'height=800,width=1000');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Print Document</title>');
      printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>'); // Load Tailwind
      printWindow.document.write('</head><body class="bg-white">');
      printWindow.document.write(printContent.outerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      
      // Wait for resources to load then print
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  // Email Functions
  const handleOpenEmailModal = (doc: Estimate | Invoice, type: 'estimate' | 'invoice') => {
    setEmailDraft({
      to: doc.customerEmail || '',
      subject: `${type === 'estimate' ? 'Estimate' : 'Invoice'} #${doc.id} from Joyous Industries`,
      message: `Dear ${doc.customerName},\n\nPlease find attached the ${type} #${doc.id} for your review.\n\nBest regards,\nJoyous Industries`
    });
    setIsEmailModalOpen(true);
  };

  const handleSendEmail = () => {
    if (!emailDraft.to) {
      showToast('Please enter a recipient email', 'error');
      return;
    }
    setSendingEmail(true);
    // Simulate API call
    setTimeout(() => {
      setSendingEmail(false);
      setIsEmailModalOpen(false);
      showToast('Document sent via email successfully', 'success');
    }, 1500);
  };

  // --- Admin Stats View Data ---
  // Re-calculate sales team stats based on our estimates/invoices state to be consistent
  // Note: For simplicity, we are augmenting the mock data logic here
  const enhancedTeamData = salesTeamData.map(person => {
     // Count how many estimates this person has in our state
     const personEstimates = estimates.filter(e => e.salesPersonName === person.name);
     const personInvoices = invoices.filter(i => i.salesPersonName === person.name);
     return {
       ...person,
       estimatesCount: personEstimates.length + 5, // Adding base mock number
       invoicesCount: personInvoices.length + 20
     };
  });

  const getStatusVariant = (status: string) => {
    switch(status) {
      case 'Paid': case 'Accepted': case 'Converted': return 'success';
      case 'Pending': case 'Sent': return 'warning';
      case 'Overdue': case 'Declined': return 'error';
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
             <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => setActiveTab('estimates')}>
                <FileText className="w-4 h-4 mr-2" /> Estimates
             </Button>
             {/* Creating invoice directly is just a shortcut, for now let's focus on estimates -> invoice flow */}
             <Button className="flex-1 sm:flex-none" onClick={handleOpenNewEstimate}>
                <Plus className="w-4 h-4 mr-2" /> New Estimate
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
            Invoices (Overview)
          </button>
          <button
            onClick={() => setActiveTab('estimates')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'estimates' 
                ? 'border-primary-600 text-primary-700' 
                : 'border-transparent text-content-sub hover:text-content-strong'
            }`}
          >
            Estimates
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

      {/* ======================= OVERVIEW (INVOICES) TAB ======================= */}
      {activeTab === 'overview' && (
        <div className="bg-surface rounded-xl shadow-sm border border-divider flex flex-col flex-1 min-h-0 overflow-hidden">
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
            </div>

            {/* Scrollable List Area */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
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
                    {currentItems.length > 0 ? (
                      (currentItems as Invoice[]).map(inv => (
                        <tr key={inv.id} className="hover:bg-surface-highlight transition-colors">
                          <td className="px-6 py-4 font-medium text-primary-600">{inv.id}</td>
                          <td className="px-6 py-4 font-medium text-content-strong">{inv.customerName}</td>
                          <td className="px-6 py-4 text-content-normal">{new Date(inv.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-right font-medium text-content-strong">₹ {inv.total.toLocaleString()}</td>
                          <td className="px-6 py-4 text-center">
                            <Badge variant={getStatusVariant(inv.status) as any}>{inv.status}</Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => handlePrintPreview('invoice', inv)}
                                  className="text-content-sub hover:text-primary-600 p-1"
                                  title="View PDF"
                                >
                                  <FileText className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleOpenEmailModal(inv, 'invoice')}
                                  className="text-content-sub hover:text-primary-600 p-1"
                                  title="Email PDF"
                                >
                                  <Mail className="w-4 h-4" />
                                </button>
                             </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                          <td colSpan={6}>
                            <EmptyState 
                              title="No Invoices Found"
                              description="Try adjusting your search or create a new invoice."
                              actionLabel="New Invoice"
                              onAction={handleOpenNewEstimate} // Reuse for now
                              icon={FileText}
                            />
                          </td>
                      </tr>
                    )}
                  </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex-shrink-0 mt-auto border-t border-divider">
               <Pagination 
                 currentPage={currentPage}
                 totalPages={totalPages}
                 onPageChange={setCurrentPage}
                 totalItems={currentList.length}
                 itemsPerPage={itemsPerPage}
                 onItemsPerPageChange={setItemsPerPage}
               />
            </div>
        </div>
      )}

      {/* ======================= ESTIMATES TAB ======================= */}
      {activeTab === 'estimates' && (
        <div className="flex flex-col flex-1 min-h-0 gap-4">
           {/* Estimates Stats */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
               <div className="bg-surface p-4 rounded-xl border border-divider shadow-sm flex items-center justify-between">
                  <div>
                     <p className="text-content-sub text-xs font-medium uppercase tracking-wider">Estimates Generated</p>
                     <p className="text-xl font-bold text-content-strong mt-1">{estimatesGenerated}</p>
                  </div>
                  <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                     <FileText className="w-5 h-5" />
                  </div>
               </div>
               <div className="bg-surface p-4 rounded-xl border border-divider shadow-sm flex items-center justify-between">
                  <div>
                     <p className="text-content-sub text-xs font-medium uppercase tracking-wider">Converted to Invoice</p>
                     <p className="text-xl font-bold text-success mt-1">{convertedEstimates}</p>
                  </div>
                  <div className="p-2 bg-success-bg rounded-lg text-success-text">
                     <FileCheck className="w-5 h-5" />
                  </div>
               </div>
               <div className="bg-surface p-4 rounded-xl border border-divider shadow-sm flex items-center justify-between">
                  <div>
                     <p className="text-content-sub text-xs font-medium uppercase tracking-wider">Conversion Rate</p>
                     <p className="text-xl font-bold text-purple-600 mt-1">{conversionRate}%</p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                     <TrendingUp className="w-5 h-5" />
                  </div>
               </div>
           </div>

           <div className="bg-surface rounded-xl shadow-sm border border-divider flex flex-col flex-1 min-h-0 overflow-hidden">
               {/* Toolbar */}
               <div className="p-4 border-b border-divider flex flex-col sm:flex-row gap-4 justify-between items-center flex-shrink-0">
                  <div className="relative flex-1 max-w-md w-full">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-sub" />
                     <input 
                       type="text" 
                       placeholder="Search estimates..." 
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full pl-10 pr-4 py-2 border border-input rounded-lg text-sm bg-surface text-content-strong placeholder-content-sub focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
                     />
                  </div>
                  <Button onClick={handleOpenNewEstimate} size="sm">
                     <Plus className="w-4 h-4 mr-2" /> New Estimate
                  </Button>
               </div>

               {/* Table */}
               <div className="flex-1 overflow-auto">
                   <table className="w-full text-sm text-left whitespace-nowrap">
                     <thead className="bg-canvas text-content-sub font-medium border-b border-divider sticky top-0 z-10">
                       <tr>
                         <th className="px-6 py-4 bg-canvas">Estimate #</th>
                         <th className="px-6 py-4 bg-canvas">Customer</th>
                         <th className="px-6 py-4 bg-canvas">Date</th>
                         <th className="px-6 py-4 bg-canvas text-right">Amount</th>
                         <th className="px-6 py-4 bg-canvas text-center">Status</th>
                         <th className="px-6 py-4 bg-canvas text-right">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-divider">
                       {currentItems.length > 0 ? (
                         (currentItems as Estimate[]).map(est => (
                           <tr key={est.id} className="hover:bg-surface-highlight transition-colors">
                             <td className="px-6 py-4 font-medium text-primary-600">{est.id}</td>
                             <td className="px-6 py-4 font-medium text-content-strong">{est.customerName}</td>
                             <td className="px-6 py-4 text-content-normal">{new Date(est.date).toLocaleDateString()}</td>
                             <td className="px-6 py-4 text-right font-medium text-content-strong">₹ {est.total.toLocaleString()}</td>
                             <td className="px-6 py-4 text-center">
                               <Badge variant={getStatusVariant(est.status) as any}>{est.status}</Badge>
                             </td>
                             <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                   <button 
                                     onClick={() => handlePrintPreview('estimate', est)}
                                     className="text-content-sub hover:text-primary-600 p-1"
                                     title="View PDF"
                                   >
                                     <FileText className="w-4 h-4" />
                                   </button>
                                   <button 
                                      onClick={() => handleOpenEmailModal(est, 'estimate')}
                                      className="text-content-sub hover:text-primary-600 p-1"
                                      title="Email PDF"
                                    >
                                      <Mail className="w-4 h-4" />
                                    </button>
                                   {est.status !== 'Converted' && (
                                     <button 
                                       onClick={() => handleConvertToInvoice(est)}
                                       className="text-content-sub hover:text-success p-1"
                                       title="Convert to Invoice"
                                     >
                                       <CheckCircle className="w-4 h-4" />
                                     </button>
                                   )}
                                </div>
                             </td>
                           </tr>
                         ))
                       ) : (
                         <tr>
                             <td colSpan={6}>
                               <EmptyState 
                                 title="No Estimates Found"
                                 description="Create your first estimate to get started."
                                 actionLabel="New Estimate"
                                 onAction={handleOpenNewEstimate}
                                 icon={FileText}
                               />
                             </td>
                         </tr>
                       )}
                     </tbody>
                   </table>
               </div>
               
               {/* Pagination */}
               <div className="flex-shrink-0 mt-auto border-t border-divider">
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={currentList.length}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                  />
               </div>
           </div>
        </div>
      )}

      {/* ======================= COMMISSIONS TAB ======================= */}
      {activeTab === 'commissions' && (
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          
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
                      <table className="w-full text-sm text-left whitespace-nowrap">
                         <thead className="bg-canvas text-content-sub font-medium border-b border-divider sticky top-0 z-10">
                            <tr>
                               <th className="px-6 py-4 bg-canvas">Name</th>
                               <th className="px-6 py-4 bg-canvas">Role</th>
                               <th className="px-6 py-4 bg-canvas text-center">Estimates</th>
                               <th className="px-6 py-4 bg-canvas text-center">Invoices</th>
                               <th className="px-6 py-4 bg-canvas text-right">Total Sales</th>
                               <th className="px-6 py-4 bg-canvas text-right">Commission</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-divider">
                            {enhancedTeamData.map((person) => (
                               <tr key={person.id} className="hover:bg-surface-highlight">
                                  <td className="px-6 py-4 font-medium text-content-strong">{person.name}</td>
                                  <td className="px-6 py-4 text-content-normal">{person.role}</td>
                                  <td className="px-6 py-4 text-center text-content-normal">{person.estimatesCount}</td>
                                  <td className="px-6 py-4 text-center text-content-normal">{person.invoicesCount}</td>
                                  <td className="px-6 py-4 text-right font-medium text-content-strong">₹ {person.sales.toLocaleString()}</td>
                                  <td className="px-6 py-4 text-right font-bold text-success">₹ {person.commission.toLocaleString()}</td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
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
                       </div>
                       <div className="p-4 bg-canvas rounded-xl border border-divider">
                          <p className="text-xs font-medium text-content-sub uppercase tracking-wider mb-1">Estimates Created</p>
                          <p className="text-2xl font-bold text-content-strong">{estimates.filter(e => e.salesPersonId === user?.id || true).length}</p> 
                          {/* using 'true' just to show numbers for demo since mock user ID might mismatch */}
                       </div>
                       <div className="p-4 bg-canvas rounded-xl border border-divider">
                          <p className="text-xs font-medium text-content-sub uppercase tracking-wider mb-1">Invoices Generated</p>
                          <p className="text-2xl font-bold text-primary-600">{invoices.filter(i => i.salesPersonId === user?.id || true).length}</p>
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

      {/* --- MODALS --- */}

      {/* New Estimate Modal */}
      <Modal
         isOpen={isEstimateModalOpen}
         onClose={() => setIsEstimateModalOpen(false)}
         title="Create New Estimate"
         size="lg"
      >
         <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Input 
                 label="Customer Name" 
                 value={estimateForm.customerName} 
                 onChange={(e) => setEstimateForm({...estimateForm, customerName: e.target.value})}
               />
               <Input 
                 label="Customer Email" 
                 type="email"
                 value={estimateForm.customerEmail} 
                 onChange={(e) => setEstimateForm({...estimateForm, customerEmail: e.target.value})}
               />
            </div>
            <div>
               <label className="block text-sm font-medium text-content-normal mb-1">Expiry Date</label>
               <input 
                 type="date"
                 className="w-full px-3 py-2 bg-surface text-content-strong border border-input rounded-lg shadow-sm focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 transition-all"
                 value={estimateForm.expiryDate}
                 onChange={(e) => setEstimateForm({...estimateForm, expiryDate: e.target.value})}
               />
            </div>

            {/* Line Items */}
            <div>
               <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-content-strong">Items</h4>
                  <Button size="sm" variant="outline" onClick={addLineItem}>
                     <Plus className="w-3 h-3 mr-1" /> Add Item
                  </Button>
               </div>
               <div className="space-y-3 bg-canvas p-4 rounded-xl border border-divider">
                  {estimateForm.items.map((item, index) => (
                     <div key={item.id} className="flex gap-2 items-start">
                        <div className="flex-1">
                           <Input 
                             label={index === 0 ? "Description" : ""}
                             placeholder="Item description"
                             value={item.description}
                             onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                             className="mb-0"
                           />
                        </div>
                        <div className="w-20">
                           <Input 
                             label={index === 0 ? "Qty" : ""}
                             type="number"
                             value={item.quantity.toString()}
                             onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                             className="mb-0"
                           />
                        </div>
                        <div className="w-28">
                           <Input 
                             label={index === 0 ? "Rate" : ""}
                             type="currency"
                             value={item.rate.toString()}
                             onChange={(e) => updateLineItem(index, 'rate', e.target.value)}
                             className="mb-0"
                           />
                        </div>
                        <div className="w-28">
                           <Input 
                             label={index === 0 ? "Amount" : ""}
                             type="currency"
                             value={item.amount.toString()}
                             readOnly
                             disabled
                             className="mb-0 bg-slate-50"
                           />
                        </div>
                        <div className={index === 0 ? "mt-7" : "mt-1"}>
                           <button onClick={() => removeLineItem(index)} className="p-2 text-danger hover:bg-danger-bg rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
               <div className="flex justify-end mt-2">
                  <p className="text-lg font-bold text-content-strong">
                     Total: ₹ {calculateTotals(estimateForm.items).total.toLocaleString()}
                  </p>
               </div>
            </div>

            {/* Signature Pad */}
            <div>
               <h4 className="font-bold text-content-strong mb-2">Digital Signature</h4>
               <SignaturePad 
                  onEnd={(base64) => setEstimateForm({...estimateForm, signature: base64})}
                  className="w-full"
               />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-divider">
               <Button variant="outline" onClick={() => setIsEstimateModalOpen(false)}>Cancel</Button>
               <Button onClick={handleCreateEstimate}>Create Estimate</Button>
            </div>
         </div>
      </Modal>

      {/* Email Modal */}
      <Modal
         isOpen={isEmailModalOpen}
         onClose={() => setIsEmailModalOpen(false)}
         title="Send via Email"
         size="md"
      >
         <div className="space-y-4">
             <Input 
               label="Recipient Email"
               value={emailDraft.to}
               onChange={(e) => setEmailDraft({...emailDraft, to: e.target.value})}
               placeholder="client@company.com"
             />
             <Input 
               label="Subject"
               value={emailDraft.subject}
               onChange={(e) => setEmailDraft({...emailDraft, subject: e.target.value})}
               placeholder="Email Subject"
             />
             <div>
                <label className="block text-sm font-medium text-content-normal mb-1">Message</label>
                <textarea 
                  className="w-full px-3 py-2 bg-surface text-content-strong border border-input rounded-lg shadow-sm placeholder-content-sub focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 transition-all h-32 resize-none"
                  value={emailDraft.message}
                  onChange={(e) => setEmailDraft({...emailDraft, message: e.target.value})}
                />
             </div>
             <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setIsEmailModalOpen(false)} disabled={sendingEmail}>Cancel</Button>
                <Button onClick={handleSendEmail} isLoading={sendingEmail}>
                   <Send className="w-4 h-4 mr-2" /> Send Email
                </Button>
             </div>
         </div>
      </Modal>

      {/* Document Preview Modal (Print) */}
      <Modal
         isOpen={isPreviewModalOpen}
         onClose={() => setIsPreviewModalOpen(false)}
         title="Document Preview"
         size="xl"
      >
         <div className="flex flex-col h-[75vh]">
             <div className="flex-1 overflow-auto bg-slate-100 p-2 sm:p-6 rounded-lg border border-divider">
                {previewDocument && (
                   <DocumentPreview type={previewDocument.type} data={previewDocument.data} />
                )}
             </div>
             <div className="pt-4 flex justify-end gap-3 flex-shrink-0">
                <Button variant="outline" onClick={() => setIsPreviewModalOpen(false)}>Close</Button>
                {previewDocument && (
                  <Button variant="outline" onClick={() => handleOpenEmailModal(previewDocument.data, previewDocument.type)}>
                    <Mail className="w-4 h-4 mr-2" /> Email
                  </Button>
                )}
                <Button onClick={printDocument}>
                   <Printer className="w-4 h-4 mr-2" /> Print / Save PDF
                </Button>
             </div>
         </div>
      </Modal>

    </div>
  );
};