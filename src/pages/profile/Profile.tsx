import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Building, Save, Lock, Shield, User, Globe, Camera, Image as ImageIcon, Hexagon } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AvatarUpload } from '../../components/ui/AvatarUpload';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UserRole } from '../../types/types';
import { useChangePassword } from '../../hooks/auth/useChangePaassword';

export const Profile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');
  
  // General Info State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [location, setLocation] = useState('San Francisco, CA');
  const [tempAvatar, setTempAvatar] = useState<string | undefined>(undefined);

  // Password State
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  useEffect(() => {
    if (user) {
      const names = user.name.split(' ');
      setFirstName(names[0] || '');
      setLastName(names.slice(1).join(' ') || '');
      setTempAvatar(user.avatarUrl);
    }
  }, [user]);

  const handleAvatarChange = (base64: string) => {
    setTempAvatar(base64);
  };

  const handleSaveProfile = () => {
    setLoading(true);
    setTimeout(() => {
      const fullName = `${firstName} ${lastName}`.trim();
      updateUserProfile({ name: fullName, avatarUrl: tempAvatar });
      showToast('Profile updated successfully', 'success');
      setLoading(false);
    }, 800);
  };

  // Change password mutation
  const changePasswordMutation = useChangePassword(
    (response) => {
      // Handle successful password change - display dynamic message from API
      setLoading(false);
      const successMessage =
        response?.data?.message ||
        response?.data?.data?.message ||
        'Password changed successfully';
      
      showToast(successMessage, 'success');
      setPasswordForm({ current: '', new: '', confirm: '' });
      setPasswordErrors({ current: '', new: '', confirm: '' });
    },
    (error: any) => {
      // Handle password change error - display dynamic error message from API
      setLoading(false);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.data?.message ||
        error?.response?.data?.data?.error ||
        error?.message ||
        'Failed to change password. Please try again.';
      
      showToast(errorMessage, 'error');
    }
  );

  const validatePasswordForm = () => {
    const errors = {
      current: '',
      new: '',
      confirm: ''
    };
    let isValid = true;

    // Validate current password
    if (!passwordForm.current.trim()) {
      errors.current = 'Current password is required';
      isValid = false;
    }

    // Validate new password
    if (!passwordForm.new.trim()) {
      errors.new = 'New password is required';
      isValid = false;
    } else if (passwordForm.new.length < 6) {
      errors.new = 'Password must be at least 6 characters';
      isValid = false;
    } else if (passwordForm.current === passwordForm.new) {
      errors.new = 'New password must be different from current password';
      isValid = false;
    }

    // Validate confirm password
    if (!passwordForm.confirm.trim()) {
      errors.confirm = 'Please confirm your new password';
      isValid = false;
    } else if (passwordForm.new !== passwordForm.confirm) {
      errors.confirm = 'New passwords do not match';
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setPasswordErrors({ current: '', new: '', confirm: '' });

    // Validate form
    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);

    // Call change password API
    changePasswordMutation.mutate({
      oldPassword: passwordForm.current,
      newPassword: passwordForm.new,
    });
  };

  const getRoleBadgeColor = (role: UserRole | undefined) => {
    switch (role) {
      case UserRole.SUPER_ADMIN: return 'bg-purple-100 text-purple-700 border-purple-200 ring-purple-500/10';
      case UserRole.ADMIN: return 'bg-blue-100 text-blue-700 border-blue-200 ring-blue-500/10';
      case UserRole.HR: return 'bg-pink-100 text-pink-700 border-pink-200 ring-pink-500/10';
      case UserRole.SALES_PERSON: return 'bg-amber-100 text-amber-700 border-amber-200 ring-amber-500/10';
      default: return 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/10';
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      {/* Header Section */}
      <div className="relative bg-surface rounded-2xl shadow-sm border border-divider overflow-hidden mb-8 group">
        
        {/* Premium Banner */}
        <div className="h-48 relative overflow-hidden bg-slate-900">
          {/* Rich Dark Background */}
          <div className="absolute inset-0 bg-[#0f172a]"></div>
          
          {/* Abstract Wild Shapes */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 mix-blend-screen"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 mix-blend-screen"></div>
          
          {/* Noise Texture for Grit */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

          {/* Premium Brand Identity (Centered) */}
          <div className="absolute inset-0 flex items-start pt-10 md:items-center md:pt-0 justify-center z-20 select-none pointer-events-none">
              <div className="flex items-center gap-4 md:gap-5 group cursor-default pointer-events-auto transform scale-90 md:scale-100 transition-transform">
                  {/* Icon Container */}
                  <div className="relative">
                      {/* Glow Effect behind icon */}
                      <div className="absolute inset-0 bg-primary-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                      
                      {/* The Physical Icon Card */}
                      <div className="relative h-14 w-14 bg-gradient-to-br from-slate-800 to-black rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl shadow-black/50 transform group-hover:rotate-6 transition-transform duration-500 ease-out ring-1 ring-white/5">
                          {/* Inner Shine */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-2xl"></div>
                          <Hexagon className="w-7 h-7 text-primary-400 fill-primary-400/10 drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]" strokeWidth={2.5} />
                      </div>
                  </div>
                  
                  {/* Typography */}
                  <div className="flex flex-col justify-center text-left">
                      <div className="flex items-baseline">
                          <h1 className="text-3xl font-black tracking-tighter text-white drop-shadow-lg leading-none transform -skew-x-6">
                              JOYOUS
                          </h1>
                          <div className="h-2 w-2 rounded-full bg-primary-500 ml-1 mb-1 animate-pulse"></div>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                          <div className="h-[1px] w-8 bg-primary-500/50"></div>
                          <p className="text-[10px] font-bold text-slate-300 tracking-[0.4em] uppercase shadow-black drop-shadow-md">
                              Industries
                          </p>
                      </div>
                  </div>
              </div>
          </div>

          {/* Change Cover Button (Subtle, Top Right) */}
          {/* <button className="absolute top-4 right-6 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white/80 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-2 border border-white/10 group/btn">
             <ImageIcon className="w-3.5 h-3.5 opacity-70 group-hover/btn:opacity-100" /> 
             <span>Edit Cover</span>
          </button> */}
        </div>

        {/* Profile Info Overlay */}
        <div className="px-6 sm:px-10 pb-6 relative">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 -mt-20 mb-2">
            
            {/* Avatar - Overlapping Banner */}
            <div className="relative flex-shrink-0 z-10">
              {/* Flex center ensures the avatar is perfectly centered within the white border ring */}
              <div className="rounded-full p-2 bg-surface ring-1 ring-divider shadow-2xl flex items-center justify-center">
                 <AvatarUpload 
                    name={user?.name || 'User'}
                    currentAvatarUrl={tempAvatar}
                    onSave={handleAvatarChange}
                 />
              </div>
            </div>

            {/* User Details - Right of Avatar, Below Banner */}
            {/* Added md:pt-24 to push text down below banner since we are using items-start */}
            <div className="flex-1 text-center md:text-left min-w-0 mt-4 md:mt-0 md:pt-24">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
                 <h1 className="text-3xl font-bold text-content-strong tracking-tight truncate">{firstName} {lastName}</h1>
                 <span className={`px-3 py-0.5 rounded-full border text-xs font-bold uppercase tracking-wide shadow-sm ring-1 ${getRoleBadgeColor(user?.role)}`}>
                    {user?.role?.replace('_', ' ')}
                 </span>
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-content-sub text-sm">
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-primary-500" /> {user?.email}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary-500" /> {location}</span>
                <span className="flex items-center gap-1.5"><Building className="w-4 h-4 text-primary-500" /> Employee ID: {user?.id}</span>
              </div>
            </div>

            {/* Global Actions (visible on general tab) */}
            {activeTab === 'general' && (
              <div className="flex-shrink-0 mb-4 md:mb-0 w-full md:w-auto md:pt-24">
                <Button onClick={handleSaveProfile} isLoading={loading} className="w-full md:w-auto shadow-lg shadow-primary-500/20">
                   <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-8 border-t border-divider pt-2 mt-6">
            <button
              onClick={() => setActiveTab('general')}
              className={`pb-3 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'general' 
                  ? 'border-primary-600 text-primary-600 translate-y-[1px]' 
                  : 'border-transparent text-content-sub hover:text-content-strong border-b-transparent'
              }`}
            >
              <User className="w-4 h-4" /> General Info
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`pb-3 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'security' 
                  ? 'border-primary-600 text-primary-600 translate-y-[1px]' 
                  : 'border-transparent text-content-sub hover:text-content-strong border-b-transparent'
              }`}
            >
              <Shield className="w-4 h-4" /> Security
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'general' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
           {/* Personal Info */}
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-surface rounded-xl shadow-sm border border-divider p-6">
                 <h2 className="text-lg font-bold text-content-strong mb-6 flex items-center gap-2 pb-4 border-b border-divider">
                    <User className="w-5 h-5 text-primary-500" /> Personal Details
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                      label="First Name" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)} 
                    />
                    <Input 
                      label="Last Name" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                    />
                    <Input 
                      label="Email Address" 
                      value={user?.email || ''} 
                      disabled 
                      className="bg-slate-50 text-slate-500 cursor-not-allowed" 
                    />
                    <Input 
                      label="Phone Number" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                    />
                 </div>
              </div>

              <div className="bg-surface rounded-xl shadow-sm border border-divider p-6">
                 <h2 className="text-lg font-bold text-content-strong mb-6 flex items-center gap-2 pb-4 border-b border-divider">
                    <Building className="w-5 h-5 text-primary-500" /> Work Information
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Department" value="Engineering" disabled className="bg-slate-50" />
                    <Input label="Job Title" value="Senior Developer" disabled className="bg-slate-50" />
                    <Input label="Office Location" value="HQ - Floor 4" disabled className="bg-slate-50" />
                    <Input label="Reporting To" value="CTO" disabled className="bg-slate-50" />
                 </div>
              </div>
           </div>

           {/* Sidebar Info */}
           <div className="space-y-8">
              <div className="bg-surface rounded-xl shadow-sm border border-divider p-6">
                 <h2 className="text-lg font-bold text-content-strong mb-4 pb-2 border-b border-divider">Address</h2>
                 <div className="space-y-4">
                    <Input 
                       label="Street" 
                       defaultValue="123 Innovation Dr" 
                       onChange={(e) => setLocation(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-4">
                       <Input label="City" defaultValue="San Francisco" />
                       <Input label="State" defaultValue="CA" />
                    </div>
                    <Input label="Zip Code" defaultValue="94107" />
                 </div>
              </div>

              {/* Quick Stats or Info */}
              <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl shadow-sm border border-primary-100 p-6">
                  <h3 className="font-bold text-primary-900 mb-2">Profile Completion</h3>
                  <div className="w-full bg-white rounded-full h-2.5 mb-2 border border-primary-100">
                    <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-xs text-primary-700">Your profile is 85% complete. Add your emergency contact to reach 100%.</p>
              </div>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
           {/* Change Password */}
           <div className="lg:col-span-2">
              <div className="bg-surface rounded-xl shadow-sm border border-divider p-6">
                 <div className="mb-6 pb-4 border-b border-divider">
                    <h2 className="text-lg font-bold text-content-strong flex items-center gap-2">
                       <Lock className="w-5 h-5 text-primary-500" /> Change Password
                    </h2>
                    <p className="text-content-sub text-sm mt-1">
                       Ensure your account is using a long, random password to stay secure.
                    </p>
                 </div>
                 
                 <form onSubmit={handlePasswordChange} className="max-w-lg space-y-4">
                    <Input 
                       label="Current Password" 
                       type="password" 
                       placeholder="Enter your current password" 
                       value={passwordForm.current}
                       onChange={(e) => {
                         setPasswordForm({...passwordForm, current: e.target.value});
                         if (passwordErrors.current) {
                           setPasswordErrors({...passwordErrors, current: ''});
                         }
                       }}
                       error={passwordErrors.current}
                    />
                    <div className="pt-2">
                       <Input 
                          label="New Password" 
                          type="password" 
                          placeholder="Min 6 characters"
                          value={passwordForm.new}
                          onChange={(e) => {
                            setPasswordForm({...passwordForm, new: e.target.value});
                            if (passwordErrors.new) {
                              setPasswordErrors({...passwordErrors, new: ''});
                            }
                            // Clear confirm error if passwords now match
                            if (passwordForm.confirm && e.target.value === passwordForm.confirm && passwordErrors.confirm) {
                              setPasswordErrors({...passwordErrors, confirm: ''});
                            }
                          }}
                          error={passwordErrors.new}
                       />
                       <Input 
                          label="Confirm New Password" 
                          type="password" 
                          placeholder="Re-enter new password"
                          value={passwordForm.confirm}
                          onChange={(e) => {
                            setPasswordForm({...passwordForm, confirm: e.target.value});
                            if (passwordErrors.confirm) {
                              setPasswordErrors({...passwordErrors, confirm: ''});
                            }
                          }}
                          error={passwordErrors.confirm}
                       />
                    </div>
                    <div className="pt-4 flex justify-end">
                       <Button type="submit" isLoading={loading || changePasswordMutation.isPending}>
                          Update Password
                       </Button>
                    </div>
                 </form>
              </div>
           </div>

           {/* Security Recommendations */}
           <div>
              <div className="bg-surface rounded-xl shadow-sm border border-divider p-6">
                 <h2 className="text-lg font-bold text-content-strong mb-4 flex items-center gap-2 pb-2 border-b border-divider">
                    <Shield className="w-5 h-5 text-success" /> Account Status
                 </h2>
                 <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-success-bg/30 rounded-lg border border-success-bg/50">
                       <div className="mt-0.5"><Shield className="w-5 h-5 text-success" /></div>
                       <div>
                          <p className="text-sm font-bold text-success-text">Secure</p>
                          <p className="text-xs text-success-text/80 mt-0.5">Two-Factor Authentication is enabled via Email.</p>
                       </div>
                    </div>
                    
                    <div className="pt-4">
                       <p className="font-bold text-content-strong text-sm mb-3">Recent Login Activity</p>
                       <div className="space-y-3">
                          <div className="flex items-center gap-3 text-content-sub bg-canvas p-3 rounded-lg border border-divider">
                             <Globe className="w-4 h-4 text-primary-500" />
                             <div className="flex-1">
                                <p className="text-xs font-semibold text-content-strong">Chrome on macOS</p>
                                <p className="text-[10px]">San Francisco, US • <span className="text-success font-medium">Current Session</span></p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3 text-content-sub opacity-70 p-2">
                             <Globe className="w-4 h-4" />
                             <div className="flex-1">
                                <p className="text-xs font-medium text-content-strong">Safari on iPhone</p>
                                <p className="text-[10px]">San Francisco, US • 2 hours ago</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};