import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, Info } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });

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
      const success = await login(formData.email, formData.password);
      setLoading(false);

      if (success) {
        showToast('Login successful! Redirecting...', 'success');
        navigate('/');
      } else {
        showToast('Invalid email or password', 'error');
        setErrors(prev => ({ ...prev, password: ' ' })); // Clear password field error visually or trigger generic error
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white rounded-xl shadow-md">
              <Hexagon className="w-10 h-10 text-primary-600 fill-primary-50" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome back</h2>
          <p className="text-slate-500 mt-2">Sign in to Joyous Industries CRM</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
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

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-sm font-medium text-slate-600 mb-2">Don't have an account?</p>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex gap-2 items-start text-left">
              <Info className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-500 leading-relaxed">
                Contact an authorized person to register.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};