import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, Info, Building, Search, ArrowRight } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { User, Organization } from '../types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { verifyCredentials, login, organizations } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });

  // Organization Selection State
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [availableOrgs, setAvailableOrgs] = useState<Organization[]>([]);
  const [orgSearchTerm, setOrgSearchTerm] = useState('');

  const validate = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
      isValid = false;
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      showToast('Please fix the errors below.', 'error');
      return;
    }

    setLoading(true);
    
    // Simulate network delay
    setTimeout(async () => {
      // Step 1: Verify Credentials
      const user = await verifyCredentials(formData.email, formData.password);
      setLoading(false);

      if (user) {
        // Credentials valid. Now check Organizations.
        const userOrgs = organizations.filter(org => user.organizationIds.includes(org.id));
        
        if (userOrgs.length > 0) {
          // User has linked organizations, show selection modal
          setMatchedUser(user);
          setAvailableOrgs(userOrgs);
          setShowOrgModal(true);
        } else {
           // Edge case: User has no organizations. Login anyway with null/default? 
           // For now, let's treat it as a generic login or show error.
           showToast('No organization linked to this account.', 'error');
        }
      } else {
        showToast('Invalid email or password', 'error');
        setErrors(prev => ({ ...prev, password: ' ' }));
      }
    }, 800);
  };

  const handleOrgSelection = (orgId: string) => {
    if (matchedUser) {
      login(matchedUser, orgId);
      setShowOrgModal(false);
      showToast('Login successful! Redirecting...', 'success');
      navigate('/');
    }
  };

  const filteredOrgs = availableOrgs.filter(org => 
    org.name.toLowerCase().includes(orgSearchTerm.toLowerCase()) ||
    (org.address && org.address.toLowerCase().includes(orgSearchTerm.toLowerCase()))
  );

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
            <Input
              label="Email Address"
              type="email"
              placeholder="name@joyous.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({...formData, email: e.target.value});
                if (errors.email) setErrors({...errors, email: ''});
              }}
              error={errors.email}
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => {
                setFormData({...formData, password: e.target.value});
                if (errors.password) setErrors({...errors, password: ''});
              }}
              error={errors.password}
            />

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
            {filteredOrgs.length > 0 ? (
              filteredOrgs.map((org) => (
                <button
                  key={org.id}
                  onClick={() => handleOrgSelection(org.id)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-divider hover:border-primary-500 hover:bg-primary-50/50 transition-all duration-200 group text-left shadow-sm hover:shadow-md"
                >
                  <div className="p-2.5 bg-surface-highlight rounded-lg group-hover:bg-surface text-content-sub group-hover:text-primary-600 transition-colors shadow-inner">
                    <Building className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-content-strong group-hover:text-primary-800 truncate">{org.name}</h4>
                    <p className="text-xs text-content-sub truncate">{org.address || 'Headquarters'}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-input group-hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-content-sub">
                <p>No organizations found matching "{orgSearchTerm}"</p>
              </div>
            )}
          </div>
          
          <div className="pt-2 text-center text-xs text-content-sub border-t border-divider">
             Showing {filteredOrgs.length} of {availableOrgs.length} organizations
          </div>
        </div>
      </Modal>
    </div>
  );
};