
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ClientRegisterPage: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { registerClient, login, companyLogo } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }

    const result = registerClient({ userId, email, password });

    if (result.success) {
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => {
          if (login(userId, password, 'client')) {
             navigate('/client/dashboard');
          } else {
             navigate('/client-login');
          }
      }, 1500);
    } else {
      setError(result.message);
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
              <h1 className="text-4xl font-bold tracking-tight">Become a Client</h1>
              <p className="mt-4 text-sky-200 text-lg">
                Create an account to submit project inquiries and partner with us for your business needs.
              </p>
            </div>
            <p className="text-xs text-sky-300">© {new Date().getFullYear()} Belreon. All Rights Reserved.</p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Create Account</h2>
          <p className="text-slate-500 mb-6">Fill in the details below to get started.</p>
          
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center mb-4">{error}</p>}
          {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg text-sm text-center mb-4">{success}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-slate-600 mb-2">User ID</label>
              <input type="text" id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} className="w-full px-4 py-3 border bg-slate-50 text-slate-900 border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-2">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border bg-slate-50 text-slate-900 border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" required />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-600 mb-2">Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border bg-slate-50 text-slate-900 border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" required />
            </div>
             <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-600 mb-2">Confirm Password</label>
              <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 border bg-slate-50 text-slate-900 border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" required />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            >
              Create Account
            </button>
            <div className="text-center text-sm pt-4 space-y-2">
               <p className="text-slate-600">
                  Already have an account?{' '}
                  <Link to="/client-login" className="font-semibold text-blue-600 hover:underline">
                      Login here
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

export default ClientRegisterPage;
