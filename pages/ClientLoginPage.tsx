

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ClientLoginPage: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, companyLogo } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(userId, password, 'client')) {
      navigate('/client/dashboard');
    } else {
      setError('Invalid User ID or Password.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100 p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 grid-cols-1 bg-white shadow-2xl rounded-2xl overflow-hidden">
        
        {/* Left Panel - Visual */}
        <div 
          className="hidden md:block relative p-12 text-white"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1618005198919-d3d4b5a92b50?q=80&w=2864&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-sky-800 opacity-70"></div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl mb-8 inline-block">
                <img src={companyLogo} alt="Company Logo" className="w-40" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Client Portal</h1>
              <p className="mt-4 text-sky-200 text-lg">
                Access your project dashboard, view updates, and manage your inquiries.
              </p>
            </div>
            <p className="text-xs text-sky-300">© {new Date().getFullYear()} Belreon. All Rights Reserved.</p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Client Login</h2>
          <p className="text-slate-500 mb-8">Welcome back! Please log in to your account.</p>
          
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center mb-6">{error}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-slate-600 mb-2">User ID</label>
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-3 border bg-slate-50 text-slate-900 border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-600 mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border bg-slate-50 text-slate-900 border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            >
              Login
            </button>
            <div className="text-center text-sm pt-4 space-y-2">
               <p className="text-slate-600">
                  Don't have an account?{' '}
                  <Link to="/client-register" className="font-semibold text-blue-600 hover:underline">
                      Create one here
                  </Link>
               </p>
               <Link to="/" className="inline-block font-medium text-slate-600 hover:text-blue-600">
                  &larr; Back to Home
               </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientLoginPage;