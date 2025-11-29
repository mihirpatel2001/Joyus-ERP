import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FormInputProps } from '../../types';

export const Input: React.FC<FormInputProps> = ({ label, error, className = '', id, type = 'text', ...props }) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full mb-4">
      <label 
        htmlFor={inputId} 
        className="block text-sm font-medium text-slate-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          className={`
            w-full px-3 py-2 bg-white text-slate-900 border rounded-lg shadow-sm placeholder-slate-400
            transition-all duration-200
            border-slate-300
            focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
            ${className}
            ${isPassword ? 'pr-10' : ''}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs font-medium text-red-600 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};