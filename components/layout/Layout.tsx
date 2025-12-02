import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { User } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas flex">
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 lg:pl-64">
        
        {/* Top Navigation */}
        <Navbar 
          onMenuClick={() => setSidebarOpen(true)} 
          user={user}
          onLogout={onLogout}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-surface border-t border-divider py-6 px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-content-sub">
            <p>&copy; {new Date().getFullYear()} Joyous Industries. All rights reserved.</p>
            <div className="flex gap-4 mt-2 md:mt-0">
              <a href="#" className="hover:text-primary-600">Privacy Policy</a>
              <a href="#" className="hover:text-primary-600">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};