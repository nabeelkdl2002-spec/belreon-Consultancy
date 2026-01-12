import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Client } from '../types';

const ClientHeader: React.FC = () => {
    const { user, logout, companyLogo } = useAuth();
    const navigate = useNavigate();
    const clientUser = user as Client;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="flex items-center justify-between h-32 px-8 max-w-7xl mx-auto">
                <img src={companyLogo} alt="Company Logo" className="h-28" />
                <div className="flex items-center">
                    <div className="text-right mr-4">
                        <p className="font-semibold text-slate-700">{clientUser?.companyName}</p>
                        <p className="text-xs text-slate-500">Client Portal</p>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};


const ClientLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <ClientHeader />
      <main className="p-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;