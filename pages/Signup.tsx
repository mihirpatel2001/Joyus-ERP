import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trim inputs
    const cleanedData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      jobTitle: formData.jobTitle.trim(),
      password: formData.password.trim()
    };
    setFormData(cleanedData);

    if (!validate()) {
      showToast('Please fix the errors below', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Account created successfully! Please sign in.', 'success');
      navigate('/login');
    }, 1000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
             <div className="p-3 bg-white rounded-xl shadow-md">
              <Hexagon className="w-10 h-10 text-primary-600 fill-primary-50" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Create Account</h2>
          <p className="text-slate-500 mt-2">Join Joyous Industries today</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="First Name" 
                placeholder="Jane" 
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                error={errors.firstName}
              />
              <Input 
                label="Last Name" 
                placeholder="Doe" 
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                error={errors.lastName}
              />
            </div>
            
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="name@company.com" 
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
            />
            
            <Input 
              label="Job Title" 
              placeholder="e.g. HR Manager" 
              value={formData.jobTitle}
              onChange={(e) => handleChange('jobTitle', e.target.value)}
              error={errors.jobTitle}
            />
            
            <Input 
              label="Password" 
              type="password" 
              placeholder="Min 8 chars" 
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
            />

            <div className="pt-2">
              <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                Get Started
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/login')} 
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};