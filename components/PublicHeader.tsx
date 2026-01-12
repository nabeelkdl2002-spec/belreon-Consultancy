import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicHeader: React.FC = () => {
  const { companyLogo } = useAuth();
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4">
          <img src={companyLogo} alt="Company Logo" className="h-20 w-auto object-contain" />
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-black leading-none tracking-tight">Belreon</span>
            <span className="text-lg font-medium text-yellow-600 leading-tight tracking-widest uppercase">Investments</span>
          </div>
        </Link>
        <div className="flex items-center space-x-2">
          <NavLink 
            to="/" 
            className={({ isActive }) => `text-sm font-medium px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-100 text-blue-700' : 'text-slate-700 hover:bg-slate-100'}`} 
            end
          >
            Home
          </NavLink>
          <Link to="/client-login" className="text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors">
            Client Login
          </Link>
          <Link to="/login" className="text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors">
            Team Login
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default PublicHeader;