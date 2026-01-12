



import React, { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const getPageTitle = (pathname: string): string => {
  if (pathname.endsWith('/app-modify/services')) return 'Stock Recommendations';
  if (pathname.endsWith('/app-modify/about-us')) return "Manage 'About Us' Page";

  const path = pathname.split('/').pop() || 'dashboard';
  switch (path) {
    case 'dashboard':
    case '':
      return 'Admin Dashboard';
    case 'clients':
      return 'Client Management';
    case 'users':
      return 'User Management';
    case 'financials':
      return 'Financial Overview';
    case 'transactions':
      return 'Transactions';
    case 'database':
      return 'Client Database';
    case 'news':
      return 'Market News & Updates';
    case 'app-modify':
      return 'App Modification';
    case 'settings':
      return 'Settings';
    case 'trash':
      return 'Trash';
    default:
      return 'Belreon';
  }
};

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const pageTitle = getPageTitle(location.pathname);

  // Permission Check
  const hasAccess = useMemo(() => {
    if (!user || !('navPermissions' in user)) return false; 
    if (user.role === UserRole.PrimaryAdmin || user.navPermissions.includes('all')) return true;

    if (location.pathname === '/admin' && user.navPermissions.includes('/admin/dashboard')) {
      return true;
    }
    
    return user.navPermissions.some(permission => location.pathname.startsWith(permission));
  }, [user, location.pathname]);


  return (
    <div className="flex h-screen bg-slate-100 text-slate-800">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <Header title={pageTitle} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-8">
          <div className="max-w-7xl mx-auto">
             {hasAccess ? (
              <Outlet />
            ) : (
              <div className="bg-white p-12 rounded-xl shadow-md text-center">
                <h2 className="text-3xl font-bold text-red-600">Access Denied</h2>
                <p className="mt-4 text-slate-600 text-lg">You do not have permission to view this page.</p>
                <p className="mt-2 text-sm text-slate-500">Please contact your administrator if you believe this is an error.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;