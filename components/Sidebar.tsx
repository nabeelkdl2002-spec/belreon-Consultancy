

import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { ChartPieIcon, UsersIcon, BriefcaseIcon, BanknotesIcon, Cog6ToothIcon, Squares2X2Icon, DatabaseIcon, ArrowsRightLeftIcon, TrashBinIcon, PencilSquareIcon, CodeBracketSquareIcon, NewspaperIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <ChartPieIcon /> },
  { to: '/admin/clients', label: 'Clients', icon: <BriefcaseIcon /> },
  { to: '/admin/users', label: 'User Management', icon: <UsersIcon /> },
  { to: '/admin/financials', label: 'Financial Reports', icon: <BanknotesIcon /> },
  { to: '/admin/transactions', label: 'Transactions', icon: <ArrowsRightLeftIcon /> },
  { to: '/admin/database', label: 'Database', icon: <DatabaseIcon /> },
  { to: '/admin/news', label: 'Market News', icon: <NewspaperIcon /> },
  { to: '/admin/app-modify', label: 'App Modify', icon: <CodeBracketSquareIcon /> },
  { to: '/admin/settings', label: 'Settings', icon: <Cog6ToothIcon /> },
  { to: '/admin/trash', label: 'Trash', icon: <TrashBinIcon /> },
];

const Sidebar: React.FC = () => {
  const { companyName, user } = useAuth();
  
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
        return user.navPermissions.includes(item.to);
    });
  }, [user]);
  
  return (
    <div className="w-64 bg-white text-slate-600 flex flex-col h-full fixed border-r border-slate-200">
      <div className="flex items-center justify-center h-20 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 tracking-widest uppercase">{companyName}</h2>
      </div>
      <nav className="flex-1 p-4">
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
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
        ))}
      </nav>
      <div className="p-4 text-center text-xs text-slate-400 border-t border-slate-200">
        © {new Date().getFullYear()} {companyName}. All Rights Reserved.
      </div>
    </div>
  );
};

export default Sidebar;