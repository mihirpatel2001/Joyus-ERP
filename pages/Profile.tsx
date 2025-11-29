import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Building, Save } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { AvatarUpload } from '../components/ui/AvatarUpload';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserRole } from '../types';

export const Profile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Local state for form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [tempAvatar, setTempAvatar] = useState<string | undefined>(undefined);

  // Initialize state from User context
  useEffect(() => {
    if (user) {
      const names = user.name.split(' ');
      setFirstName(names[0] || '');
      setLastName(names.slice(1).join(' ') || '');
      setTempAvatar(user.avatarUrl);
    }
  }, [user]);

  const getRoleLabel = (role: UserRole | undefined) => {
    switch (role) {
      case UserRole.SUPER_ADMIN: return 'Super Admin';
      case UserRole.ADMIN: return 'Administrator';
      case UserRole.HR: return 'HR Manager';
      case UserRole.EMPLOYEE: return 'Employee';
      default: return 'User';
    }
  };

  const handleAvatarChange = (base64: string) => {
    setTempAvatar(base64);
  };

  const handleSave = () => {
    if (!user) return;
    
    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const fullName = `${firstName} ${lastName}`.trim();
      
      updateUserProfile({
        name: fullName,
        avatarUrl: tempAvatar
      });

      showToast('Profile updated successfully', 'success');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My Profile</h2>
          <p className="text-slate-500 text-sm">Manage your account settings and preferences.</p>
        </div>
        <Button onClick={handleSave} isLoading={loading}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
            
            {/* Avatar Uploader Component */}
            <div className="mb-4">
              <AvatarUpload 
                name={user?.name || 'User'}
                currentAvatarUrl={tempAvatar}
                onSave={handleAvatarChange}
              />
            </div>
            
            <h3 className="mt-4 text-lg font-bold text-slate-800">
              {firstName} {lastName}
            </h3>
            <p className="text-slate-500 text-sm mb-3">{user?.email}</p>
            <div className="flex justify-center gap-2">
              <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full uppercase tracking-wider">
                {getRoleLabel(user?.role)}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Contact Information</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Building className="w-4 h-4" />
                <span className="text-sm">HQ - 4th Floor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Forms */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">Personal Details</h3>
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
              <Input label="Email" defaultValue={user?.email || ''} disabled className="bg-slate-50 text-slate-500" />
              <Input label="Phone Number" defaultValue="+1 (555) 123-4567" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">Address</h3>
            <div className="grid grid-cols-1 gap-6">
              <Input label="Street Address" defaultValue="123 Innovation Drive" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input label="City" defaultValue="San Francisco" />
                <Input label="State" defaultValue="CA" />
                <Input label="Zip Code" defaultValue="94103" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};