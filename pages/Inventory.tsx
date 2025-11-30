import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, SlidersHorizontal, Package, ArrowUpRight, ArrowDownRight, Pencil } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Checkbox } from '../components/ui/Checkbox';
import { Switch } from '../components/ui/Switch';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../context/ToastContext';
import { InventoryItem } from '../types';

// Mock Data
const mockItems: InventoryItem[] = [
  { id: '1', name: 'MacBook Pro 16"', description: 'M3 Max, 32GB RAM', unit: 'pcs', type: 'Goods', salesRate: 249000, purchaseRate: 210000, stockOnHand: 5, sku: 'MBP-16-M3', salesAccount: 'Sales', purchaseAccount: 'Purchase' },
  { id: '2', name: 'Logitech MX Master 3S', description: 'Wireless Mouse', unit: 'pcs', type: 'Goods', salesRate: 9999, purchaseRate: 6500, stockOnHand: 24, sku: 'LOGI-MX3', salesAccount: 'Sales', purchaseAccount: 'COGS' },
  { id: '3', name: 'Software Installation', description: 'On-site setup', unit: 'hr', type: 'Service', salesRate: 1500, purchaseRate: 0, stockOnHand: 0, salesAccount: 'General Income' },
];

export const Inventory: React.FC = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>(mockItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: '',
    unit: 'pcs',
    type: 'Goods',
    salesRate: 0,
    purchaseRate: 0,
    stockOnHand: 0
  });

  // Toggle State for Form Sections
  const [isSalesInfoEnabled, setIsSalesInfoEnabled] = useState(true);
  const [isPurchaseInfoEnabled, setIsPurchaseInfoEnabled] = useState(true);

  // Preferences State
  const [prefs, setPrefs] = useState({
    trackInventory: true,
    sku: true,
    hsn: true,
    inventoryStartDate: false,
    group: false,
    category: false,
    godown: false,
    batch: false,
    priceList: false,
    barcode: false
  });

  // --- Handlers ---

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({ 
      name: '', 
      unit: 'pcs', 
      type: 'Goods', 
      salesRate: 0, 
      purchaseRate: 0, 
      stockOnHand: 0,
      description: '',
      sku: '',
      hsn: '',
      tax: ''
    });
    setIsSalesInfoEnabled(true);
    setIsPurchaseInfoEnabled(true);
    setIsAddModalOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingId(item.id);
    setFormData({ ...item });
    
    // Auto-enable sections if data exists
    setIsSalesInfoEnabled(!!item.salesRate || !!item.salesAccount);
    setIsPurchaseInfoEnabled(!!item.purchaseRate || !!item.purchaseAccount);
    
    setIsAddModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!formData.name) {
      showToast('Item name is required', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const itemData: InventoryItem = {
        id: editingId || Date.now().toString(),
        name: formData.name!,
        unit: formData.unit || 'pcs',
        type: formData.type || 'Goods',
        salesRate: isSalesInfoEnabled ? formData.salesRate : 0,
        purchaseRate: isPurchaseInfoEnabled ? formData.purchaseRate : 0,
        stockOnHand: editingId ? (formData.stockOnHand || 0) : 0, // Preserve stock if editing, else 0
        description: formData.description,
        sku: formData.sku,
        hsn: formData.hsn,
        salesAccount: isSalesInfoEnabled ? formData.salesAccount : undefined,
        purchaseAccount: isPurchaseInfoEnabled ? formData.purchaseAccount : undefined,
        tax: formData.tax
      };

      if (editingId) {
        // Update existing
        setItems(prev => prev.map(item => item.id === editingId ? itemData : item));
        showToast('Item updated successfully', 'success');
      } else {
        // Create new
        setItems([...items, itemData]);
        showToast('Item created successfully', 'success');
      }

      setLoading(false);
      setIsAddModalOpen(false);
    }, 800);
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventory</h1>
          <p className="text-slate-500 text-sm">Manage products and services</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsPreferencesOpen(true)}>
            <SlidersHorizontal className="w-4 h-4 mr-2" /> Preferences
          </Button>
          <Button onClick={handleOpenAddModal}>
            <Plus className="w-4 h-4 mr-2" /> Add Item
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Items</p>
              <p className="text-xl font-bold text-slate-800 mt-1">{items.length}</p>
           </div>
           <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
              <Package className="w-5 h-5" />
           </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Stock Value</p>
              <p className="text-xl font-bold text-green-600 mt-1">₹ 12.4L</p>
           </div>
           <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <ArrowUpRight className="w-5 h-5" />
           </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Low Stock</p>
              <p className="text-xl font-bold text-orange-600 mt-1">2</p>
           </div>
           <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <ArrowDownRight className="w-5 h-5" />
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search items by name or SKU..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="px-3">
              <Filter className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="px-3">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-10"><Checkbox checked={false} onChange={() => {}} /></th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">HSN/SAC</th>
                <th className="px-6 py-4 text-right">Sales Rate</th>
                <th className="px-6 py-4 text-right">Purchase Rate</th>
                <th className="px-6 py-4 text-center">Stock In Hand</th>
                <th className="px-6 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    onClick={() => handleEditItem(item)}
                  >
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={false} onChange={() => {}} />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-800 group-hover:text-primary-600 transition-colors">{item.name}</p>
                        {item.sku && <p className="text-xs text-slate-500">SKU: {item.sku}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{item.description || '-'}</td>
                    <td className="px-6 py-4 text-slate-500">{item.hsn || '-'}</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-700">₹ {item.salesRate?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-slate-500">₹ {item.purchaseRate?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.stockOnHand > 0 ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.stockOnHand} {item.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="text-slate-400 hover:text-slate-600 p-1">
                          <Pencil className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan={8}>
                     <EmptyState 
                       title="No Items Found"
                       description="Get started by creating a new inventory item."
                       actionLabel="Add First Item"
                       onAction={handleOpenAddModal}
                     />
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 p-4">
                    {filteredItems.map(item => (
                        <div 
                          key={item.id} 
                          className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm active:bg-slate-50 transition-colors"
                          onClick={() => handleEditItem(item)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                                    <p className="text-xs text-slate-500">SKU: {item.sku || '-'}</p>
                                </div>
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                                    {item.stockOnHand} {item.unit}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm mt-3 pt-3 border-t border-slate-50">
                                <div>
                                    <p className="text-xs text-slate-400">Sales Rate</p>
                                    <p className="font-medium text-slate-700">₹ {item.salesRate?.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400">Purchase Rate</p>
                                    <p className="font-medium text-slate-700">₹ {item.purchaseRate?.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState 
                    title="No Items Found"
                    description="Get started by creating a new inventory item."
                    actionLabel="Add First Item"
                    onAction={handleOpenAddModal}
                />
            )}
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingId ? "Edit Item" : "Add Item"}
        size="lg"
      >
        <div className="space-y-6 pt-2">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input 
              label="Name" 
              placeholder="Item Name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="col-span-1"
            />
            <Select 
              label="Unit"
              value={formData.unit || 'pcs'}
              onChange={(val) => setFormData({...formData, unit: val})}
              options={[
                { label: 'Pieces (pcs)', value: 'pcs' },
                { label: 'Kilograms (kg)', value: 'kg' },
                { label: 'Meters (mtr)', value: 'mtr' },
                { label: 'Box', value: 'box' },
                { label: 'Hours (hr)', value: 'hr' },
              ]}
            />
            <Select 
              label="Type"
              value={formData.type || 'Goods'}
              onChange={(val) => setFormData({...formData, type: val as any})}
              options={[
                { label: 'Goods', value: 'Goods' },
                { label: 'Service', value: 'Service' },
              ]}
            />
          </div>

          {/* Discount Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Input label="Default Discount (%)" type="percentage" placeholder="0" />
             <Input label="Amount Discount (₹)" type="currency" placeholder="0.00" />
          </div>

          {/* Sales Information */}
          <div className="border rounded-lg p-4 bg-slate-50/50">
             <div className="flex items-center gap-2 mb-4">
                <Checkbox 
                   checked={isSalesInfoEnabled} 
                   onChange={setIsSalesInfoEnabled}
                />
                <span className="font-semibold text-slate-700">Sales Information</span>
             </div>
             
             {isSalesInfoEnabled && (
                <div className="space-y-4 animate-fadeIn">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input 
                         label="Rate (₹)" 
                         type="currency"
                         placeholder="0.00"
                         value={formData.salesRate?.toString()}
                         onChange={(e) => setFormData({...formData, salesRate: Number(e.target.value)})}
                      />
                      <Select 
                         label="Account"
                         value={formData.salesAccount || 'Sales'}
                         onChange={(val) => setFormData({...formData, salesAccount: val})}
                         options={[
                           { label: 'Sales', value: 'Sales' },
                           { label: 'General Income', value: 'General Income' },
                         ]}
                      />
                      <Select 
                         label="Tax"
                         value={formData.tax || ''}
                         onChange={(val) => setFormData({...formData, tax: val})}
                         options={[
                           { label: 'None', value: '' },
                           { label: 'GST 5%', value: '5' },
                           { label: 'GST 12%', value: '12' },
                           { label: 'GST 18%', value: '18' },
                           { label: 'GST 28%', value: '28' },
                         ]}
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                      <textarea 
                        className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 transition-all h-20 resize-none"
                        placeholder="Description for sales invoices..."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                   </div>
                </div>
             )}
          </div>

          {/* Purchase Information */}
          <div className="border rounded-lg p-4 bg-slate-50/50">
             <div className="flex items-center gap-2 mb-4">
                <Checkbox 
                   checked={isPurchaseInfoEnabled} 
                   onChange={setIsPurchaseInfoEnabled}
                />
                <span className="font-semibold text-slate-700">Purchase Information</span>
             </div>
             
             {isPurchaseInfoEnabled && (
                <div className="space-y-4 animate-fadeIn">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input 
                         label="Rate (₹)" 
                         type="currency"
                         placeholder="0.00"
                         value={formData.purchaseRate?.toString()}
                         onChange={(e) => setFormData({...formData, purchaseRate: Number(e.target.value)})}
                      />
                      <Select 
                         label="Account"
                         value={formData.purchaseAccount || 'Purchase'}
                         onChange={(val) => setFormData({...formData, purchaseAccount: val})}
                         options={[
                           { label: 'Purchase', value: 'Purchase' },
                           { label: 'Cost of Goods Sold', value: 'COGS' },
                         ]}
                      />
                      <Select 
                         label="Tax"
                         value={formData.tax || ''}
                         onChange={(val) => setFormData({...formData, tax: val})}
                         options={[
                           { label: 'None', value: '' },
                           { label: 'GST 5%', value: '5' },
                           { label: 'GST 12%', value: '12' },
                           { label: 'GST 18%', value: '18' },
                           { label: 'GST 28%', value: '28' },
                         ]}
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                      <textarea 
                        className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 transition-all h-20 resize-none"
                        placeholder="Description for purchase bills..."
                      />
                   </div>
                </div>
             )}
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
             <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
             <Button onClick={handleSaveItem} isLoading={loading}>
                {editingId ? 'Update Item' : 'Save Item'}
             </Button>
          </div>
        </div>
      </Modal>

      {/* Preferences Modal */}
      <Modal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        title="Set your preference"
        size="md"
        confirmText="Save"
        onConfirm={() => setIsPreferencesOpen(false)}
      >
        <div className="space-y-0 divide-y divide-slate-100">
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 py-2">
            <Switch label="Track Inventory" checked={prefs.trackInventory} onChange={(v) => setPrefs({...prefs, trackInventory: v})} />
            <Switch label="SKU" checked={prefs.sku} onChange={(v) => setPrefs({...prefs, sku: v})} />
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 py-2">
            <div className="py-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Inventory Start Date</label>
                <input type="date" className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:border-primary-500" disabled={!prefs.trackInventory} />
            </div>
            <Switch label="Group" checked={prefs.group} onChange={(v) => setPrefs({...prefs, group: v})} />
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 py-2">
            <Switch label="Negative Stock Entry" checked={false} onChange={() => {}} />
            <Switch label="Category" checked={prefs.category} onChange={(v) => setPrefs({...prefs, category: v})} />
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 py-2">
            <Switch label="Warning on out of Stock" checked={true} onChange={() => {}} />
            <Switch label="Godown" checked={prefs.godown} onChange={(v) => setPrefs({...prefs, godown: v})} />
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 py-2">
            <Switch label="Alternate Unit(s)" checked={false} onChange={() => {}} />
            <Switch label="Batch" checked={prefs.batch} onChange={(v) => setPrefs({...prefs, batch: v})} />
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 py-2">
            <Switch label="MRP" checked={false} onChange={() => {}} />
            <Switch label="Price List" checked={prefs.priceList} onChange={(v) => setPrefs({...prefs, priceList: v})} />
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 py-2">
            <Switch label="Item Image" checked={false} onChange={() => {}} />
            <Switch label="Barcode for Items" checked={prefs.barcode} onChange={(v) => setPrefs({...prefs, barcode: v})} />
          </div>
        </div>
      </Modal>
    </div>
  );
};