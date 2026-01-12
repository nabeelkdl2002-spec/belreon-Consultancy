import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between h-20 px-8">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        <div className="flex items-center">
          <div className="text-right mr-4">
            <p className="font-semibold text-slate-700">{user && 'username' in user ? user.username : ''}</p>
            <p className="text-xs text-slate-500">{user && 'role' in user ? user.role : ''}</p>
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

export default Header;