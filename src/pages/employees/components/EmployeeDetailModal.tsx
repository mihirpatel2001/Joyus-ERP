import React, { useState, useEffect } from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Building,
  Pencil,
  Banknote,
  Plus,
  Percent,
  Save,
} from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Modal } from '../../../components/ui/Modal'
import { Badge } from '../../../components/ui/Badge'
import {
  Employee,
  SalaryRecord,
  UserRole,
  Organization,
} from '../../../types/types'
import { MOCK_ORGANIZATIONS } from '@/constants'

interface EmployeeDetailModalProps {
  isOpen: boolean
  onClose: () => void
  employee: Employee
  onEditProfile: (employee: Employee) => void
  onUpdate: (updatedEmployee: Employee) => void
  currentOrg: Organization | undefined
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  onClose,
  employee,
  onEditProfile,
  onUpdate,
  currentOrg,
}) => {
  const [activeTab, setActiveTab] = useState<
    'profile' | 'salary' | 'commission'
  >('profile')
  const [salaryForm, setSalaryForm] = useState({
    amount: '',
    frequency: 'Monthly',
    reason: '',
  })
  const [commissionForm, setCommissionForm] = useState({
    rate: '',
    totalSales: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && employee) {
      setSalaryForm({
        amount: employee.currentSalary ? employee.currentSalary.toString() : '',
        frequency: employee.payFrequency || 'Monthly',
        reason: '',
      })
      setCommissionForm({
        rate: employee.commissionRate
          ? employee.commissionRate.toString()
          : '0',
        totalSales: employee.totalSales ? employee.totalSales.toString() : '0',
      })
      setActiveTab('profile')
    }
  }, [isOpen, employee])

  const isSalesRole = (role: string) =>
    [
      UserRole.SALES_PERSON,
      'Sales Person',
      'Manager',
      'Admin',
      'Super Admin',
    ].includes(role)

  const calculateAnnualCTC = (amount = 0, frequency = 'Monthly') => {
    const multipliers: any = {
      Monthly: 12,
      'Bi-Weekly': 26,
      Weekly: 52,
      Annually: 1,
    }
    return amount * (multipliers[frequency] || 1)
  }

  const getOrgDetails = (id: string) =>
    MOCK_ORGANIZATIONS.find((o) => o.id === id)

  const handleUpdateSalary = () => {
    setLoading(true)
    setTimeout(() => {
      const newHistoryItem: SalaryRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        amount: Number(salaryForm.amount),
        frequency: salaryForm.frequency as any,
        reason: salaryForm.reason,
        changedBy: 'Admin',
      }
      const updatedEmployee = {
        ...employee,
        currentSalary: Number(salaryForm.amount),
        payFrequency: salaryForm.frequency as any,
        salaryHistory: [newHistoryItem, ...(employee.salaryHistory || [])],
      }
      onUpdate(updatedEmployee)
      setSalaryForm((prev) => ({ ...prev, reason: '' }))
      setLoading(false)
    }, 800)
  }

  const handleUpdateCommission = () => {
    setLoading(true)
    setTimeout(() => {
      const rate = Number(commissionForm.rate)
      const sales = Number(commissionForm.totalSales)
      const updatedEmployee: Employee = {
        ...employee,
        commissionRate: rate,
        totalSales: sales,
        commissionEarned: (sales * rate) / 100,
      }
      onUpdate(updatedEmployee)
      setLoading(false)
    }, 800)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employee.name}
      description={
        employee.role === UserRole.SALES_PERSON ? 'Sales Person' : employee.role
      }
      size="lg"
    >
      <div className="flex border-b border-divider mb-6 overflow-x-auto flex-shrink-0">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'profile' ? 'border-primary-600 text-primary-700' : 'border-transparent text-content-sub hover:text-content-strong'}`}
        >
          Profile & Access
        </button>
        <button
          onClick={() => setActiveTab('salary')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'salary' ? 'border-primary-600 text-primary-700' : 'border-transparent text-content-sub hover:text-content-strong'}`}
        >
          Salary & Payroll
        </button>
        {isSalesRole(employee.role) && (
          <button
            onClick={() => setActiveTab('commission')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'commission' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-content-sub hover:text-content-strong'}`}
          >
            Commission & Sales
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-4 h-[500px]">
        {/* --- PROFILE TAB --- */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="space-y-6 w-full order-2 sm:order-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-xs text-content-sub uppercase tracking-wide font-medium mb-1">
                      Email
                    </p>
                    <p className="text-content-strong font-medium flex items-center gap-2 break-all">
                      <Mail className="w-4 h-4 text-content-sub flex-shrink-0" />
                      {employee.email}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-xs text-content-sub uppercase tracking-wide font-medium mb-1">
                      Mobile
                    </p>
                    <p className="text-content-strong font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4 text-content-sub flex-shrink-0" />
                      {employee.mobile || 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-xs text-content-sub uppercase tracking-wide font-medium mb-1">
                      Current City
                    </p>
                    <p className="text-content-strong font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-content-sub flex-shrink-0" />
                      {employee.currentCity || '-'}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-center">
                    <p className="text-xs text-content-sub uppercase tracking-wide font-medium mb-1">
                      Status
                    </p>
                    <div>
                      <Badge
                        variant={
                          employee.status === 'Active' ? 'success' : 'neutral'
                        }
                      >
                        {employee.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-auto order-1 sm:order-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditProfile(employee)}
                  className="w-full sm:w-auto justify-center"
                >
                  <Pencil className="w-3.5 h-3.5 mr-2" /> Edit Profile
                </Button>
              </div>
            </div>

            <div>
              <p className="text-xs text-content-sub uppercase tracking-wide font-medium mb-3">
                Assigned Organizations
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {employee.organizationIds &&
                employee.organizationIds.length > 0 ? (
                  employee.organizationIds.map((orgId) => {
                    const org = getOrgDetails(orgId)
                    return (
                      <div
                        key={orgId}
                        className="flex items-center gap-3 p-3 bg-surface border border-divider rounded-xl shadow-sm hover:border-primary-200 transition-colors"
                      >
                        <div className="p-2 bg-primary-50 rounded-lg text-primary-600 flex-shrink-0">
                          <Building className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-content-strong truncate">
                            {org?.name || 'Unknown Org'}
                          </p>
                          <p className="text-xs text-content-sub truncate">
                            {org?.address || 'Location N/A'}
                          </p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-surface border border-divider rounded-xl shadow-sm hover:border-primary-200 transition-colors">
                    <div className="p-2 bg-primary-50 rounded-lg text-primary-600 flex-shrink-0">
                      <Building className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-content-strong truncate">
                        {currentOrg?.name || 'Current Organization'}
                      </p>
                      <p className="text-xs text-content-sub truncate">
                        {currentOrg?.address || 'Active Session'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- SALARY TAB --- */}
        {activeTab === 'salary' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-6 text-white shadow-xl">
              <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2 text-primary-100 mb-2">
                    <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium tracking-wide uppercase">
                      Current Compensation
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-bold tracking-tight text-white">
                      ₹ {employee.currentSalary?.toLocaleString() || '0'}
                    </h3>
                    <span className="text-primary-100 font-medium bg-white/10 px-2 py-0.5 rounded text-sm">
                      {employee.payFrequency}
                    </span>
                  </div>
                </div>
                <div className="flex gap-8 border-t border-white/10 pt-4 sm:border-t-0 sm:border-l sm:pl-8 sm:pt-0">
                  <div>
                    <p className="text-xs font-medium text-primary-200 uppercase tracking-wider">
                      Annual CTC
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      ₹{' '}
                      {calculateAnnualCTC(
                        employee.currentSalary,
                        employee.payFrequency
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
                  onChange={(e) =>
                    setSalaryForm({ ...salaryForm, amount: e.target.value })
                  }
                />
                <Select
                  label="Frequency"
                  value={salaryForm.frequency}
                  onChange={(val) =>
                    setSalaryForm({ ...salaryForm, frequency: val })
                  }
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
                placeholder="e.g. Annual Appraisal"
                value={salaryForm.reason}
                onChange={(e) =>
                  setSalaryForm({ ...salaryForm, reason: e.target.value })
                }
              />
              <div className="flex justify-end mt-4">
                <Button onClick={handleUpdateSalary} isLoading={loading}>
                  Update Salary
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* --- COMMISSION TAB --- */}
        {activeTab === 'commission' && isSalesRole(employee.role) && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-surface p-5 rounded-xl border border-divider shadow-sm">
              <h4 className="font-bold text-content-strong mb-4 flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-600" /> Commission
                Configuration
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Commission Rate (%)"
                  type="percentage"
                  placeholder="0"
                  value={commissionForm.rate}
                  onChange={(e) =>
                    setCommissionForm({
                      ...commissionForm,
                      rate: e.target.value,
                    })
                  }
                />
                <Input
                  label="Total Sales (YTD)"
                  type="currency"
                  placeholder="0.00"
                  value={commissionForm.totalSales}
                  onChange={(e) =>
                    setCommissionForm({
                      ...commissionForm,
                      totalSales: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  onClick={handleUpdateCommission}
                  isLoading={loading}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Save className="w-4 h-4 mr-2" /> Update Commission
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
