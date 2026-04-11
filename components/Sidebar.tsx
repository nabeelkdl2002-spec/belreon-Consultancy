

import React, { useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChartPieIcon, UsersIcon, BriefcaseIcon, BanknotesIcon, Cog6ToothIcon, Squares2X2Icon, DatabaseIcon, ArrowsRightLeftIcon, TrashBinIcon, PencilSquareIcon, CodeBracketSquareIcon, NewspaperIcon, ChevronDownIcon, ChevronRightIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const Sidebar: React.FC = () => {
  const { companyName, user, services } = useAuth();
  const location = useLocation();
  const [isClientsOpen, setIsClientsOpen] = useState(location.pathname.startsWith('/admin/clients'));
  const [isFinopsOpen, setIsFinopsOpen] = useState(location.pathname.startsWith('/admin/finops'));
  
  const navItems = useMemo(() => [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <ChartPieIcon /> },
    { to: '/admin/clients', label: 'Clients', icon: <BriefcaseIcon /> },
    { to: '/admin/users', label: 'User Management', icon: <UsersIcon /> },
    { to: '/admin/finops', label: 'FinOps', icon: <BriefcaseIcon /> },
    { to: '/admin/financials', label: 'Financial Reports', icon: <BanknotesIcon /> },
    { to: '/admin/transactions', label: 'Transactions', icon: <ArrowsRightLeftIcon /> },
    { to: '/admin/database', label: 'Database', icon: <DatabaseIcon /> },
    { to: '/admin/news', label: 'Market News', icon: <NewspaperIcon /> },
    { to: '/admin/services', label: 'Our Services', icon: <Squares2X2Icon /> },
    { to: '/admin/app-modify', label: 'App Modify', icon: <CodeBracketSquareIcon /> },
    { to: '/admin/settings', label: 'Settings', icon: <Cog6ToothIcon /> },
    { to: '/admin/trash', label: 'Trash', icon: <TrashBinIcon /> },
  ], [isClientsOpen, isFinopsOpen, services]);

  const visibleNavItems = useMemo(() => {
    if (!user || !('navPermissions' in user)) return [];
    if (user.role === UserRole.PrimaryAdmin || user.navPermissions.includes('all')) {
      return navItems;
    }
    // Employees should always see their dashboard if they have any permissions
    const coreAccess = ['/admin/dashboard'];
    const hasCoreAccess = user.navPermissions.some(p => coreAccess.includes(p));

    return navItems.filter(item => {
        if (item.to === '/admin/dashboard' && hasCoreAccess) return true;
        if (item.isExpandable) {
          if (item.label === 'Clients') return user.navPermissions.includes('/admin/clients');
          if (item.label === 'FinOps') return user.navPermissions.includes('/admin/finops');
          return false;
        }
        return user.navPermissions.includes(item.to || '');
    });
  }, [user, navItems]);
  
  return (
    <div className="w-64 bg-white text-slate-600 flex flex-col h-full fixed border-r border-slate-200">
      <div className="flex flex-col items-center justify-center py-6 border-b border-slate-200">
        <h2 className="text-2xl font-black tracking-widest uppercase bg-gradient-to-r from-amber-200 via-yellow-500 to-amber-600 bg-clip-text text-transparent">{companyName}</h2>
        <div className="mt-1 px-4 text-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter pb-0.5">
            Simplifying Finance for Every Business
          </p>
        </div>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        {visibleNavItems.map((item, idx) => (
          <div key={idx}>
            {item.isExpandable ? (
              <div>
                <button
                  onClick={item.onToggle}
                  className={`w-full flex items-center justify-between text-sm font-medium rounded-lg px-4 py-3 mb-1 transition-colors duration-200 ${
                    (item.label === 'Clients' && location.pathname.startsWith('/admin/clients')) || 
                    (item.label === 'FinOps' && location.pathname.startsWith('/admin/finops'))
                    ? 'bg-slate-50 text-slate-900' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-4">{item.label}</span>
                  </div>
                  {item.isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
                </button>
                {item.isOpen && (
                  <div className="ml-10 space-y-1 mb-2">
                    {item.subItems?.map((sub) => (
                      <NavLink
                        key={sub.to}
                        to={sub.to}
                        end
                        className={({ isActive }) =>
                          `block text-xs font-medium py-2 px-3 rounded-md transition-colors ${
                            isActive ? 'text-green-700 bg-green-50 font-bold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                          }`
                        }
                      >
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to={item.to || ''}
                end={item.to === '/admin/dashboard'}
                className={({ isActive }) =>
                  `flex items-center text-sm font-medium rounded-lg px-4 py-3 mb-2 transition-colors duration-200 ${
                    isActive ? 'bg-green-50 text-green-700 font-semibold dark:bg-slate-700 dark:text-green-400' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {item.icon}
                <span className="ml-4">{item.label}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>
      <div className="p-4 text-center text-xs text-slate-400 border-t border-slate-200">
        © {new Date().getFullYear()} {companyName}. All Rights Reserved.
      </div>
    </div>
  );
};

export default Sidebar;