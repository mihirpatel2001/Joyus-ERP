import React, { useEffect, useMemo, useState } from 'react'
import {
  Search,
  Plus,
  Phone,
  Briefcase,
  Calendar,
  Mail,
  ArrowRight,
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { Badge } from '../../components/ui/Badge'
import { Pagination } from '../../components/ui/Pagination'
import { Employee, UserRole } from '../../types/types'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { AddEmployeeModal } from './components/AddEmployeeModal'
import { EmployeeDetailModal } from './components/EmployeeDetailModal'
import { useFetchEmployee } from '@/src/hooks/employees/useFetchEmployee'
import { useQueryParams } from '@/src/hooks/useQueryParams'
import { formatDate } from '@/src/utils/formatDate'

export const Employees: React.FC = () => {
  const { showToast } = useToast()
  const { user, organizations, roles } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const { params, setParams } = useQueryParams('employees', {
    page: 1,
    limit: 10,
    sortOrder: 'ASC',
  })
  const [searchTerm, setSearchTerm] = useState(params.search || '')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const pageFromParams = Number(params.page || 1)
  const limitFromParams = Number(params.limit || 10)
  const sortOrderFromParams = (params.sortOrder as 'ASC' | 'DESC') || 'ASC'
  const currentPage = Number.isNaN(pageFromParams) ? 1 : pageFromParams
  const itemsPerPage = Number.isNaN(limitFromParams) ? 10 : limitFromParams

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  )
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

  // Get current logged in organization details
  const currentOrg = organizations.find(
    (o) => o.id === user?.currentOrganizationId
  )

  useEffect(() => {
    if ((params.search || '') !== searchTerm) {
      setSearchTerm(params.search || '')
    }
  }, [params.search])

  const {
    data: employeeRes,
    isLoading,
    isError,
  } = useFetchEmployee({
    page: pageFromParams,
    limit: limitFromParams,
    sortOrder: sortOrderFromParams,
    search: params.search || undefined,
  })

  const mappedEmployees = useMemo(() => {
    const users = employeeRes?.data?.data?.users || []
    return users.map((user: any) => {
      const staff = user?.staff || {}
      const role = user?.role || {}
      const nameParts = [
        staff.first_name,
        staff.middle_name,
        staff.last_name,
      ].filter(Boolean)
      const fallbackName = staff.email || 'Unknown'

      return {
        id: staff.id || user.id,
        name: nameParts.join(' ').trim() || fallbackName,
        email: staff.email || '',
        mobile: staff.mobile || '',
        role: role.role_name || UserRole.EMPLOYEE,
        status: user.is_active ? 'Active' : 'Inactive',
        joinDate:
          staff.created_date || user.created_date || new Date().toISOString(),
        firstName: staff.first_name,
        lastName: staff.last_name,
        currentAddress: staff.current_address,
        currentCity: staff.current_city,
        currentState: staff.current_state,
        currentCountry: staff.current_country,
        currentPincode: staff.current_pincode,
        permanentAddress: staff.permanent_address,
        permanentCity: staff.permanent_city,
        permanentState: staff.permanent_state,
        permanentCountry: staff.permanent_country,
        permanentPincode: staff.permanent_pincode,
        pancard: staff.panCard,
        aadharCardNumber: staff.aadharcardNumber,
        staffDOB: staff.staff_dob,
      } as Employee
    })
  }, [employeeRes])

  useEffect(() => {
    setEmployees(mappedEmployees)
  }, [mappedEmployees])

  const filteredEmployees = employees.filter((emp) => {
    const matchesRole = roleFilter === 'All' || emp.role === roleFilter
    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter
    return matchesRole && matchesStatus
  })

  const totalItems = employeeRes?.data?.data?.total || 0
  const totalPages = employeeRes?.data?.data?.totalPages || 0
  const apiLimit = employeeRes?.data?.data?.limit
  const pageSizeOptions = useMemo(() => {
    const opts = new Set<number>([5, 10, 20, 50, 100])
    if (apiLimit) opts.add(apiLimit)
    if (itemsPerPage) opts.add(itemsPerPage)
    return Array.from(opts).sort((a, b) => a - b)
  }, [apiLimit, itemsPerPage])

  // --- Search Logic ---
  const currentItems = filteredEmployees

  const roleOptions = roles.map((r) => ({ label: r.name, value: r.name }))

  // --- Handlers ---

  const handleOpenAddModal = () => {
    setEditingEmployee(null)
    setIsAddModalOpen(true)
  }

  const handleOpenDetails = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDetailModalOpen(true)
  }

  const handleEditProfileFromDetails = (employee: Employee) => {
    setIsDetailModalOpen(false)
    setEditingEmployee(employee)
    setIsAddModalOpen(true)
  }

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setEmployees(
      employees.map((e) => (e.id === updatedEmployee.id ? updatedEmployee : e))
    )
    setSelectedEmployee(updatedEmployee)
    showToast('Employee updated successfully', 'success')
  }

  const handlePageChange = (page: number) => {
    setParams({ page })
  }

  const handleItemsPerPageChange = (value: number) => {
    setParams({ limit: value, page: 1 })
  }

  // Called when Add/Edit modal successfully completes an action
  const handleRefreshList = () => {
    // In a real app, this would refetch the employees list from API
    // For now, if we added a new employee via mutation, it's done via API.
    // Since we don't have a `useGetEmployeeList` hook here yet, we rely on the mutation success.
    // If the API returns the new employee, we could append it.
    // Assuming a refresh or refetch is needed.
    showToast('List refreshed', 'info')
  }

  return (
    <div className="flex flex-col h-[calc(100vh)] gap-6">
      {/* Header */}
      <div className="flex-shrink-0 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-content-strong">
              Employees
            </h1>
            <p className="text-content-sub text-sm">
              Manage your team members and roles
            </p>
          </div>
          <Button onClick={handleOpenAddModal}>
            <Plus className="w-4 h-4 mr-2" /> Add Employee
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-surface rounded-xl shadow-sm border border-divider flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-divider flex flex-col lg:flex-row gap-4 justify-between items-center flex-shrink-0">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-sub" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value
                setSearchTerm(value)
                setParams({ search: value || null, page: 1 })
              }}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg text-sm bg-surface focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
            <div className="w-full sm:w-40">
              <Select
                value={roleFilter}
                onChange={setRoleFilter}
                options={[{ label: 'All Roles', value: 'All' }, ...roleOptions]}
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

        {/* List */}
        <div className="flex-1 overflow-auto">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full text-sm text-left">
              <thead className="bg-canvas text-content-sub font-medium border-b border-divider sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-4 bg-canvas">Name</th>
                  <th className="px-6 py-4 bg-canvas">Contact</th>
                  <th className="px-6 py-4 bg-canvas">DOB</th>
                  <th className="px-6 py-4 bg-canvas">Role</th>
                  <th className="px-6 py-4 bg-canvas">Status</th>
                  <th className="px-6 py-4 bg-canvas">Join Date</th>
                  <th className="px-6 py-4 text-right bg-canvas">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {isLoading && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-content-sub"
                    >
                      Loading employees...
                    </td>
                  </tr>
                )}
                {isError && !isLoading && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-content-sub"
                    >
                      Failed to load employees. Please try again.
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  !isError &&
                  currentItems.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-surface-highlight transition-colors cursor-pointer group"
                      onClick={() => handleOpenDetails(emp)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-content-strong group-hover:text-primary-600 transition-colors">
                              {emp.name}
                            </p>
                            <div className="flex items-center gap-1 text-content-sub text-xs">
                              {emp.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-content-normal">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-content-sub" />{' '}
                          {emp.mobile || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-content-normal">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-content-sub" />{' '}
                          {formatDate(emp.staffDOB) || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-content-normal">
                          <Briefcase className="w-4 h-4 text-content-sub" />{' '}
                          {emp.role === UserRole.SALES_PERSON
                            ? 'Sales Person'
                            : emp.role}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            emp.status === 'Active' ? 'success' : 'neutral'
                          }
                        >
                          {emp.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-content-normal">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-content-sub" />{' '}
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
                {!isLoading && !isError && currentItems.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-content-sub"
                    >
                      No employees found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden grid grid-cols-1 gap-4 p-4">
            {currentItems.map((emp) => (
              <div
                key={emp.id}
                className="bg-surface p-4 rounded-xl border border-divider shadow-sm space-y-4 active:bg-surface-highlight"
                onClick={() => handleOpenDetails(emp)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-content-strong">
                        {emp.name}
                      </h3>
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
                      <Briefcase className="w-3.5 h-3.5 text-content-sub" />{' '}
                      {emp.role}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-content-sub mb-1">Status</p>
                    <Badge
                      variant={emp.status === 'Active' ? 'success' : 'neutral'}
                    >
                      {emp.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-shrink-0 mt-auto border-t border-divider">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            pageSizeOptions={pageSizeOptions}
          />
        </div>
      </div>

      {/* Modals */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        editingEmployee={editingEmployee}
        currentOrg={currentOrg}
        roles={roles}
        onSuccess={handleRefreshList}
      />

      {selectedEmployee && (
        <EmployeeDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          employee={selectedEmployee}
          onEditProfile={handleEditProfileFromDetails}
          onUpdate={handleUpdateEmployee}
          currentOrg={currentOrg}
        />
      )}
    </div>
  )
}
