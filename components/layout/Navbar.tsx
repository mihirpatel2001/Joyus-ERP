import React, { useState } from 'react';
import { Menu, Bell, Search, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants';

interface NavbarProps {
  onMenuClick: () => void;
  user: { name: string; email: string; avatarUrl?: string } | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, user, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const currentRoute = NAV_ITEMS.find(item => item.path === location.pathname);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-full">
        {/* Left: Mobile Menu & Breadcrumb/Title */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-xl font-semibold text-slate-800">
              {currentRoute?.label || 'Dashboard'}
            </h1>
          </div>
        </div>

        {/* Center: Global Search (Optional - Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search anything..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 sm:text-sm transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 block w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          <div className="relative ml-2">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
              className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
            >
              <img 
                className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-100"
                src={user?.avatarUrl || "https://picsum.photos/200"} 
                alt="User avatar" 
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-700">{user?.name || 'Guest'}</p>
                <p className="text-xs text-slate-500">{user?.email || 'guest@joyous.com'}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 py-1 focus:outline-none origin-top-right transform transition-all duration-200">
                <button 
                  onClick={() => navigate('/profile')}
                  className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600"
                >
                  <UserIcon className="mr-3 h-4 w-4" />
                  Profile
                </button>
                <div className="border-t border-slate-100 my-1"></div>
                <button 
                  onClick={onLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};