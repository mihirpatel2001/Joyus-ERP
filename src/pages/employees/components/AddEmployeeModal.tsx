import React, { useState, useEffect } from 'react'
import {
  Smartphone,
  ArrowRight,
  Building,
  User,
  CreditCard,
  MapPin,
} from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Modal } from '../../../components/ui/Modal'
import { Checkbox } from '../../../components/ui/Checkbox'
import { Badge } from '../../../components/ui/Badge'
import { Employee, Organization, RoleDefinition } from '../../../types/types'
import { useToast } from '../../../context/ToastContext'
import { useGetEmployees } from '../../../hooks/employees/useGetEmployees'
import { useAddEmployee } from '../../../hooks/employees/useAddEmployees'

interface AddEmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  editingEmployee: Employee | null
  currentOrg: Organization | undefined
  roles: RoleDefinition[]
  onSuccess: () => void
}

const initialFormData: Partial<Employee> = {
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  role: 'Employee',
  status: 'Active',
  password: '',
  pancard: '',
  aadharCardNumber: '',
  staffDOB: '',
  currentAddress: '',
  currentCity: '',
  currentState: '',
  currentCountry: '',
  currentPincode: '',
  permanentAddress: '',
  permanentCity: '',
  permanentState: '',
  permanentCountry: '',
  permanentPincode: '',
  organizationIds: [],
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  editingEmployee,
  currentOrg,
  roles,
  onSuccess,
}) => {
  const { showToast } = useToast()
  const [addStep, setAddStep] = useState<'check' | 'form'>('check')
  const [checkMobile, setCheckMobile] = useState('')
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([])
  const [formData, setFormData] = useState<Partial<Employee>>(initialFormData)
  const [isSameAddress, setIsSameAddress] = useState(false)

  // API hook for checking existing staff
  const { data: staffSearchData, isLoading: isSearchingStaff } =
    useGetEmployees({ search: checkMobile }, checkMobile.length === 10)

  // Add employee mutation
  const addEmployeeMutation = useAddEmployee(
    (response) => {
      const successMessage =
        response?.data?.message ||
        response?.data?.data?.message ||
        'Employee added successfully'
      showToast(successMessage, 'success')
      onSuccess()
      handleClose()
    },
    (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to create employee.'
      showToast(errorMessage, 'error')
    }
  )

  useEffect(() => {
    if (isOpen) {
      if (editingEmployee) {
        setFormData({
          ...editingEmployee,
          firstName:
            editingEmployee.firstName || editingEmployee.name.split(' ')[0],
          lastName:
            editingEmployee.lastName ||
            editingEmployee.name.split(' ').slice(1).join(' '),
        })

        // Check if address is same
        const isAddressSame =
          editingEmployee.currentAddress &&
          editingEmployee.currentAddress === editingEmployee.permanentAddress &&
          editingEmployee.currentCity === editingEmployee.permanentCity

        setIsSameAddress(!!isAddressSame)
        setAddStep('form')
      } else {
        setFormData(initialFormData)
        setAddStep('check')
        setCheckMobile('')
        setSuggestedUsers([])
        setIsSameAddress(false)
      }
    }
  }, [isOpen, editingEmployee])

  // Handle Search Result
  useEffect(() => {
    if (checkMobile.length === 10 && staffSearchData) {
      const responseData = staffSearchData?.data?.data || staffSearchData?.data
      const staffList = responseData?.staff || []

      if (staffList && staffList.length > 0) {
        const mappedStaff = staffList.map((staff: any) => ({
          ...staff,
          firstName: staff.first_name || '',
          lastName: staff.last_name || '',
          staffDOB: staff.staff_dob || '',
        }))
        setSuggestedUsers(mappedStaff)
      } else {
        setSuggestedUsers([])
      }
    } else if (checkMobile.length < 10) {
      setSuggestedUsers([])
    }
  }, [checkMobile, staffSearchData])

  // Address Sync
  useEffect(() => {
    if (isSameAddress) {
      setFormData((prev) => ({
        ...prev,
        permanentAddress: prev.currentAddress,
        permanentCity: prev.currentCity,
        permanentState: prev.currentState,
        permanentCountry: prev.currentCountry,
        permanentPincode: prev.currentPincode,
      }))
    }
  }, [
    isSameAddress,
    formData.currentAddress,
    formData.currentCity,
    formData.currentState,
    formData.currentCountry,
    formData.currentPincode,
  ])

  const handleClose = () => {
    setAddStep('check')
    setCheckMobile('')
    setSuggestedUsers([])
    setFormData(initialFormData)
    onClose()
  }

  const handleMobileInput = (val: string) => {
    const cleanVal = val.replace(/\D/g, '').slice(0, 10)
    setCheckMobile(cleanVal)
    if (cleanVal.length < 10) setSuggestedUsers([])
  }

  const handleSuggestionClick = (selectedUser: any) => {
    if (selectedUser) {
      setFormData({
        ...initialFormData,
        ...selectedUser,
        role: 'Employee',
        name: `${selectedUser.firstName} ${selectedUser.lastName}`.trim(),
      })
      setAddStep('form')
      setSuggestedUsers([])
    }
  }

  const handleCreateNewProfile = () => {
    if (checkMobile.length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error')
      return
    }
    setFormData({ ...initialFormData, mobile: checkMobile })
    setAddStep('form')
  }

  const getRoleIdFromName = (roleName: string): number => {
    const roleIdMap: { [key: string]: number } = {
      Admin: 10,
      Employee: 10,
      HR: 10,
      'Sales Person': 10,
      Manager: 10,
    }
    return roleIdMap[roleName] || 10
  }

  const handleSave = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.mobile
    ) {
      showToast('Please fill in required fields (Name, Email, Mobile)', 'error')
      return
    }

    if (!editingEmployee && !formData.password) {
      showToast('Password is required for new employees', 'error')
      return
    }

    const payload = {
      roleId: getRoleIdFromName(formData.role || 'Employee'),
      email: formData.email!,
      mobile: formData.mobile!,
      firstName: formData.firstName!,
      lastName: formData.lastName!,
      password: formData.password || 'Default@123', // Default if editing and not changing
      pancard: formData.pancard || '',
      aadharCardNumber: formData.aadharCardNumber || '',
      currentAddress: formData.currentAddress || '',
      permanentAddress: formData.permanentAddress || '',
      currentCity: formData.currentCity || '',
      permanentCity: formData.permanentCity || '',
      permanentState: formData.permanentState || '',
      currentCountry: formData.currentCountry || '',
      permanentCountry: formData.permanentCountry || '',
      currentPincode: formData.currentPincode || '',
      permanentPincode: formData.permanentPincode || '',
      staffDOB: formData.staffDOB || '',
      currentState: formData.currentState || '',
    }

    if (editingEmployee) {
      // Logic for Edit API Call would go here
      showToast('Edit functionality pending API integration', 'info')
      onSuccess() // Simulate success
      handleClose()
    } else {
      addEmployeeMutation.mutate(payload)
    }
  }

  const roleOptions = roles.map((r) => ({ label: r.name, value: r.name }))

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        editingEmployee
          ? 'Edit Employee'
          : addStep === 'form'
            ? 'Employee Details'
            : 'Add Employee'
      }
      size={addStep === 'form' ? 'xl' : 'lg'}
    >
      <div className="min-h-[250px] flex flex-col">
        {/* STEP 1: CHECK MOBILE */}
        {addStep === 'check' && (
          <div className="flex flex-col items-center justify-center space-y-6 py-8 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-3">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Enter Mobile Number
              </h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                Enter the 10-digit mobile number to check availability.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-4">
              <div className="relative">
                <Input
                  label=""
                  placeholder="e.g. 1234567890"
                  value={checkMobile}
                  onChange={(e) => handleMobileInput(e.target.value)}
                  className="text-center text-lg tracking-widest font-mono"
                  autoFocus
                  maxLength={10}
                />
                <div className="absolute right-3 top-3.5 text-xs text-slate-400 font-mono">
                  {checkMobile.length}/10
                </div>
              </div>

              {isSearchingStaff && checkMobile.length === 10 && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-slate-600">
                    Searching for existing staff...
                  </p>
                </div>
              )}

              {!isSearchingStaff && suggestedUsers.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-600 font-medium mb-2">
                    Found {suggestedUsers.length} existing staff member(s):
                  </p>
                  {suggestedUsers.map((user, index) => (
                    <div
                      key={user.id || index}
                      onClick={() => handleSuggestionClick(user)}
                      className="bg-primary-50 border border-primary-200 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-primary-100 transition-colors animate-fadeIn"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-200 text-primary-700 flex items-center justify-center font-bold">
                          {user.firstName?.charAt(0) || 'U'}
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-sm text-primary-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-primary-700">
                            {user.mobile}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white rounded-full p-1 shadow-sm">
                        <ArrowRight className="w-4 h-4 text-primary-600" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isSearchingStaff &&
                suggestedUsers.length === 0 &&
                checkMobile.length === 10 && (
                  <Button
                    className="w-full animate-fadeIn"
                    onClick={handleCreateNewProfile}
                  >
                    Create New Profile
                  </Button>
                )}
            </div>
          </div>
        )}

        {/* STEP 2: FORM */}
        {addStep === 'form' && (
          <div className="animate-fadeIn space-y-6">
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Smartphone className="w-4 h-4" />
                <span className="font-mono">{formData.mobile}</span>
              </div>
              {!editingEmployee && (
                <button
                  onClick={() => setAddStep('check')}
                  className="text-xs text-primary-600 hover:underline"
                >
                  Change Number
                </button>
              )}
            </div>

            <div className="space-y-8 h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {/* Organization Section */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Building className="w-4 h-4" /> Assigned Organization
                </h4>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-md">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-900">
                      {currentOrg?.name || 'Unknown Organization'}
                    </p>
                    <p className="text-xs text-blue-700">
                      {currentOrg?.address || 'Location N/A'}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="info">Current</Badge>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" /> Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={formData.staffDOB}
                    onChange={(e) =>
                      setFormData({ ...formData, staffDOB: e.target.value })
                    }
                  />
                  {!editingEmployee && (
                    <Input
                      label="Password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  )}
                  <Select
                    label="Role"
                    value={formData.role || 'Employee'}
                    onChange={(val) => setFormData({ ...formData, role: val })}
                    options={roleOptions}
                  />
                </div>
              </div>

              {/* Identity */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Identity Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="PAN Card"
                    value={formData.pancard}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pancard: e.target.value.toUpperCase(),
                      })
                    }
                  />
                  <Input
                    label="Aadhar Card"
                    value={formData.aadharCardNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        aadharCardNumber: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Addresses */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Addresses
                </h4>
                {/* Current Address */}
                <div className="space-y-4 mb-6">
                  <p className="text-xs font-semibold text-slate-500">
                    Current Address
                  </p>
                  <Input
                    label="Line"
                    value={formData.currentAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentAddress: e.target.value,
                      })
                    }
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="City"
                      value={formData.currentCity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentCity: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="State"
                      value={formData.currentState}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentState: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Country"
                      value={formData.currentCountry}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentCountry: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Pincode"
                      value={formData.currentPincode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentPincode: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                {/* Permanent Address */}
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <p className="text-xs font-semibold text-slate-500">
                      Permanent Address
                    </p>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={isSameAddress}
                        onChange={setIsSameAddress}
                      />
                      <span className="text-sm text-slate-600">
                        Same as Current
                      </span>
                    </div>
                  </div>
                  <div
                    className={
                      isSameAddress ? 'opacity-50 pointer-events-none' : ''
                    }
                  >
                    <Input
                      label="Line"
                      value={formData.permanentAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          permanentAddress: e.target.value,
                        })
                      }
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="City"
                        value={formData.permanentCity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            permanentCity: e.target.value,
                          })
                        }
                      />
                      <Input
                        label="State"
                        value={formData.permanentState}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            permanentState: e.target.value,
                          })
                        }
                      />
                      <Input
                        label="Country"
                        value={formData.permanentCountry}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            permanentCountry: e.target.value,
                          })
                        }
                      />
                      <Input
                        label="Pincode"
                        value={formData.permanentPincode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            permanentPincode: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-divider">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                isLoading={addEmployeeMutation.isPending}
              >
                {editingEmployee ? 'Update Employee' : 'Create Employee'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
