import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { X, Hexagon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { APP_NAME, NAV_ITEMS } from '@/constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { hasRole, hasModuleAccess, user } = useAuth();

  // Filter items based purely on Permissions
  const filteredNavItems = NAV_ITEMS.filter(item => {
    // If permissionScope is set, user MUST have read access to that module category
    if (item.permissionScope) {
      return hasModuleAccess(item.permissionScope);
    }

    // Fallback for items without permission scope (shouldn't happen with new strict structure, 
    // but useful for generic links like 'Logout' if they were here)
    if (item.allowedRoles) {
      return hasRole(item.allowedRoles);
    }

    return true;
  });

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 shadow-xl lg:shadow-none transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo Area */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2 text-primary-600">
            <Hexagon className="w-8 h-8 fill-primary-100" />
            <span className="text-lg font-bold tracking-tight text-slate-800 leading-tight">
              {APP_NAME}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links - Scrollable Area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <nav className="px-4 py-4 space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={`
                    flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group
                    ${isActive 
                      ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-200' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge ? (
                    <span className={`
                      px-2 py-0.5 text-xs font-semibold rounded-full
                      ${isActive ? 'bg-primary-200 text-primary-800' : 'bg-slate-100 text-slate-600'}
                    `}>
                      {item.badge}
                    </span>
                  ) : null}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg p-4 text-white">
            <h4 className="font-semibold text-sm mb-1">Need Help?</h4>
            <p className="text-xs text-primary-100 mb-3">Contact support for assistance.</p>
            <button className="w-full py-1.5 bg-white/10 hover:bg-white/20 text-xs font-medium rounded transition-colors border border-white/20">
              Contact Support
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};