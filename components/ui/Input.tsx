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

  // Input Sanitization for Custom Types
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (type === 'tel') {
      value = value.replace(/[^0-9+\-() ]/g, ''); // Allow digits, +, -, (, ), and space
    } else if (type === 'zip' || type === 'numeric') {
      value = value.replace(/[^0-9]/g, ''); // Digits only
    } else if (type === 'percentage') {
      value = value.replace(/[^0-9.]/g, ''); // Numbers and dot
      // Optional: Strict range check 0-100
      const num = parseFloat(value);
      if (num > 100) value = '100';
      if (num < 0) value = '0';
    } else if (type === 'currency') {
      value = value.replace(/[^0-9.]/g, ''); // Numbers and dot
    }

    if (props.onChange) {
      e.target.value = value;
      props.onChange(e);
    }
  };

  // Determine standard HTML type for custom variants
  const getHtmlType = () => {
    if (type === 'password') return showPassword ? 'text' : 'password';
    if (type === 'tel' || type === 'zip' || type === 'numeric' || type === 'percentage' || type === 'currency') return 'text';
    return type;
  };

  const getInputMode = () => {
    if (type === 'zip' || type === 'numeric' || type === 'percentage' || type === 'currency') return 'numeric';
    if (type === 'tel') return 'tel';
    return undefined;
  };

  return (
    <div className="w-full mb-4">
      <label 
        htmlFor={inputId} 
        className="block text-sm font-medium text-content-normal mb-1"
      >
        {label}
      </label>
      <div className="relative">
        
        {/* Prefix Icons/Text for custom types */}
        {type === 'currency' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-content-sub font-medium">₹</span>
          </div>
        )}

        <input
          id={inputId}
          type={getHtmlType()}
          inputMode={getInputMode()}
          className={`
            w-full px-3 py-2 bg-surface text-content-strong border rounded-lg shadow-sm placeholder-content-sub
            transition-all duration-200
            border-input
            focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10
            ${error ? 'border-danger focus:border-danger focus:ring-danger/10' : ''}
            ${className}
            ${isPassword ? 'pr-10' : ''}
            ${type === 'currency' ? 'pl-8' : ''}
            ${type === 'percentage' ? 'pr-8' : ''}
          `}
          onChange={handleInputChange}
          {...props}
        />

        {/* Suffix Icons for Percentage */}
        {type === 'percentage' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-content-sub font-medium">%</span>
          </div>
        )}

        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-content-sub hover:text-content-strong focus:outline-none"
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
        <p className="mt-1 text-xs font-medium text-danger animate-fadeIn flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
};