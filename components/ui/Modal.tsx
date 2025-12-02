import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading = false,
  size = 'md'
}) => {
  if (!isOpen) return null;

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw]'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fadeIn" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={`relative bg-surface rounded-xl shadow-2xl w-full ${maxWidths[size]} flex flex-col max-h-[90vh] transform transition-all scale-100 animate-fadeIn`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-divider">
          <div className="flex items-center gap-3 pr-8">
            {variant === 'danger' && (
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-danger-bg">
                <AlertTriangle className="h-6 w-6 text-danger" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-content-strong leading-tight">
                {title}
              </h3>
              {description && (
                <p className="text-sm text-content-sub mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-content-sub hover:text-content-strong hover:bg-surface-highlight p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer (only if confirm action exists) */}
        {onConfirm && (
          <div className="p-6 border-t border-divider bg-surface-highlight/50 rounded-b-xl flex flex-col sm:flex-row-reverse gap-3">
            <Button 
              variant={variant} 
              onClick={onConfirm}
              isLoading={isLoading}
              className="w-full sm:w-auto"
            >
              {confirmText}
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {cancelText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};