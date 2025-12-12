import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Modal } from '../ui/Modal';
import { User } from '@/src/types/types';
import useAuthV2 from '@/src/context/AuthContextV2';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { LogOutMutation } = useAuthV2();

  const handleConfirmLogout = () => {
    // Call logout API
    LogOutMutation.mutate();
    setIsLogoutModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-surface-light">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden lg:pl-64">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
          onLogout={() => setIsLogoutModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="w-full">
            {children}
          </div>
        </main>

        <footer className="p-4 text-center text-xs text-content-sub border-t border-divider">
          © {new Date().getFullYear()} Joyous. All rights reserved.
        </footer>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Sign Out"
        description="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmLogout}
        size="sm"
      />
    </div>
  );
};