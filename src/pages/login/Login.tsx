import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Hexagon, Info, Building, Search, ArrowRight } from 'lucide-react'
import { useToast } from '@/src/context/ToastContext'
import useAuthV2 from '@/src/context/AuthContextV2'
import { useUserLogin, useCompanySelectionLogin } from '@/src/hooks/auth/useLogin'
import { Input } from '@/src/components/ui/Input'
import { Button } from '@/src/components/ui/Button'
import { Modal } from '@/src/components/ui/Modal'
import { Organization, User } from '@/src/types/types'

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { handleLogin } = useAuthV2()
  const [loading, setLoading] = useState(false)
  // const [formData, setFormData] = useState({ email: '', password: '' })
  const [formData, setFormData] = useState({
    identifier: "",  // email or mobile in single field
    password: "",
  });
  const [errors, setErrors] = useState({ email: '', password: '' })

  // Store login credentials for company selection
  // const [loginCredentials, setLoginCredentials] = useState<{
  //   email: string
  //   password: string
  //   os: string
  // } | null>(null)
  const [loginCredentials, setLoginCredentials] = useState<{
    email?: string;
    mobile?: string;
    password: string;
    os: string;
  } | null>(null);


  // Organization Selection State
  const [showOrgModal, setShowOrgModal] = useState(false)
  const [availableCompanies, setAvailableCompanies] = useState<any[]>([])
  const [orgSearchTerm, setOrgSearchTerm] = useState('')
  const [orgLoading, setOrgLoading] = useState(false);


  const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isMobile = (value: string) => /^[0-9]{10}$/.test(value);

  const validate = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    // if (!formData.email.trim()) {
    //   newErrors.email = 'Email address is required'
    //   isValid = false
    // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    //   newErrors.email = 'Please enter a valid email address'
    //   isValid = false
    // }
    if (!formData.identifier.trim()) {
      newErrors.email = "Please enter email or mobile number";
      isValid = false;
    } else if (!isEmail(formData.identifier) && !isMobile(formData.identifier)) {
      newErrors.email = "Please enter a valid email or mobile number";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
      isValid = false
    }

    setErrors(newErrors);
    return isValid;
  };

  // Initial login mutation - only email, password, and os
  const loginMutation = useUserLogin(
    (loginData, response) => {
      setLoading(false)

      // Get dynamic success message from API response
      const successMessage =
        response?.data?.message ||
        response?.data?.data?.message ||
        'Login successful!'

      // Check if user has multiple companies
      const isMultiCompany = loginData.isMultiCompany === true

      if (isMultiCompany) {
        // Store credentials for company selection login
        // setLoginCredentials({
        //   email: formData.email,
        //   password: formData.password,
        //   os: 'web',
        // })
        setLoginCredentials({
          email: isEmail(formData.identifier) ? formData.identifier : undefined,
          mobile: isMobile(formData.identifier) ? formData.identifier : undefined,
          password: formData.password,
          os: "web",
        });

        // Store companies array from response
        if (loginData.companies && Array.isArray(loginData.companies)) {
          setAvailableCompanies(loginData.companies)
        }

        // User has multiple companies - show organization selection modal
        setShowOrgModal(true)
        showToast('Please select an organization', 'info')
      } else {
        // Single company - complete login and navigate (tokens are already in loginData)
        handleLogin(loginData)
        showToast(successMessage, 'success')
        // Use replace to prevent going back to login page
        setTimeout(() => {
          navigate('/', { replace: true })
        }, 500)
      }
    },
    (error: any) => {
      // Handle login error - display dynamic error message from API
      setLoading(false)

      // Extract error message from API response
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.data?.message ||
        error?.response?.data?.data?.error ||
        error?.message ||
        'Login failed. Please check your credentials and try again.'

      showToast(errorMessage, 'error')
      setErrors((prev) => ({ ...prev, password: ' ' }))
    }
  )

  // Company selection login mutation - includes companyId and staffId
  const companySelectionMutation = useCompanySelectionLogin(
    (loginData, response) => {
      // Handle successful company selection login
      handleLogin(loginData)
      setLoading(false)
      setOrgLoading(false)
      setShowOrgModal(false)

      // Get dynamic success message from API response
      const successMessage =
        response?.data?.message ||
        response?.data?.data?.message ||
        'Login successful! Redirecting...'

      showToast(successMessage, 'success')

      // Navigate to dashboard/home - use replace to prevent going back to login
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 500)
    },
    (error: any) => {
      // Handle company selection login error
      setLoading(false)
      setOrgLoading(false)

      // Extract error message from API response
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.data?.message ||
        error?.response?.data?.data?.error ||
        error?.message ||
        'Failed to login with selected organization. Please try again.'

      showToast(errorMessage, 'error')
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      showToast('Please fix the errors below.', 'error');
      return;
    }

    setLoading(true)

    // Initial login - only send email, password, and os
    // loginMutation.mutate({
    //   email: formData.email,
    //   password: formData.password,
    //   os: 'web',
    // })
    const payload: any = {
      password: formData.password,
      os: "web"
    };

    if (isEmail(formData.identifier)) {
      payload.email = formData.identifier;
    } else {
      payload.mobile = formData.identifier;
    }

    loginMutation.mutate(payload);

  }

  const handleOrgSelection = (companyId: string) => {
    if (!loginCredentials) {
      showToast('Login credentials not found. Please login again.', 'error')
      return
    }

    setOrgLoading(true);
    setLoading(true)

    // Call login API with companyId and staffId
    // Using selected companyId and static staffId as per requirements
    // companySelectionMutation.mutate({
    //   email: loginCredentials.email,
    //   password: loginCredentials.password,
    //   os: loginCredentials.os,
    //   companyId: parseInt(companyId, 10), // Use selected company ID
    //   staffId: 10, // Static value for now
    // })
    const payload: any = {
      password: loginCredentials.password,
      os: loginCredentials.os,
      companyId: parseInt(companyId, 10),
      staffId: 10,
    };

    if (loginCredentials.email) payload.email = loginCredentials.email;
    if (loginCredentials.mobile) payload.mobile = loginCredentials.mobile;

    companySelectionMutation.mutate(payload);

  }

  const filteredCompanies = availableCompanies.filter(
    (company) =>
      company.company_name?.toLowerCase().includes(orgSearchTerm.toLowerCase()) ||
      (company.gst_number &&
        company.gst_number.toLowerCase().includes(orgSearchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-surface rounded-xl shadow-md">
              <Hexagon className="w-10 h-10 text-primary-600 fill-primary-50" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-content-strong tracking-tight">Welcome back</h2>
          <p className="text-content-sub mt-2">Sign in to Joyous Industries CRM</p>
        </div>

        <div className="bg-surface rounded-2xl shadow-xl border border-divider p-8">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* <Input
              label="Email Address"
              type="email"
              placeholder="name@joyous.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              error={errors.email}
            /> */}

            <Input
              label="Email or Mobile"
              type="text"
              placeholder="name@joyous.com or 9876543210"
              value={formData.identifier}
              onChange={(e) => {
                setFormData({ ...formData, identifier: e.target.value });
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              error={errors.email}
            />

            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                error={errors.password}
                className="mb-0" // Override default margin
              />
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline transition-all"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
              Sign in
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-divider text-center">
            <div className="bg-surface-highlight p-3 rounded-lg border border-divider flex gap-2 items-start text-left">
              <Info className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-content-sub leading-relaxed">
                Contact an authorized person to register.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Organization Selection Modal */}
      <Modal
        isOpen={showOrgModal}
        onClose={() => setShowOrgModal(false)}
        title="Select Organization"
        description="Choose the workspace you want to access."
        size="lg" // Increased size for grid layout
      >
        <div className="space-y-4">
          {/* Search Bar for Orgs */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-sub" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={orgSearchTerm}
              onChange={(e) => setOrgSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-highlight border border-divider rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all text-content-strong"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => handleOrgSelection(company.id)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-divider hover:border-primary-500 hover:bg-primary-50/50 transition-all duration-200 group text-left shadow-sm hover:shadow-md"
                >
                  <div className="p-2.5 bg-surface-highlight rounded-lg group-hover:bg-surface text-content-sub group-hover:text-primary-600 transition-colors shadow-inner">
                    <Building className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-content-strong group-hover:text-primary-800 truncate">
                      {company.company_name}
                    </h4>
                    <p className="text-xs text-content-sub truncate">
                      {company.gst_number || 'No GST Number'}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-input group-hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-content-sub">
                <p>No companies found matching "{orgSearchTerm}"</p>
              </div>
            )}
          </div>

          <div className="pt-2 text-center text-xs text-content-sub border-t border-divider">
            Showing {filteredCompanies.length} of {availableCompanies.length}{' '}
            companies
          </div>
        </div>
      </Modal>

      {orgLoading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] pointer-events-auto">
          <div className="w-12 h-12 border-4 border-white/40 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

    </div>
  );
};
