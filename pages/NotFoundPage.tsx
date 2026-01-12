
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NotFoundPage: React.FC = () => {
  const { companyLogo } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
      <img src={companyLogo} alt="Company Logo" className="w-56 mx-auto mb-8 opacity-50" />
      <h1 className="text-6xl font-bold text-blue-500">404</h1>
      <p className="text-2xl mt-4 text-slate-300">Page Not Found</p>
      <p className="mt-2 text-slate-400">Sorry, the page you are looking for does not exist.</p>
      <Link 
        to="/"
        className="mt-8 px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
