import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, disabled, className = '' }) => {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={`
        flex items-center justify-center w-5 h-5 rounded border transition-all duration-200
        focus:outline-none focus:ring-4 focus:ring-primary-500/20
        ${checked
          ? 'bg-primary-600 border-primary-600 text-white'
          : 'bg-white border-slate-300 hover:border-primary-500 text-transparent'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer shadow-sm'}
        ${className}
      `}
      disabled={disabled}
      aria-checked={checked}
      role="checkbox"
    >
      <Check className="w-3.5 h-3.5" strokeWidth={3} />
    </button>
  );
};