import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, RocketLaunchIcon, ArrowLeftIcon } from '../components/icons';

const FinopsAuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Left Side: Branding & Info */}
      <div className="lg:w-1/2 bg-slate-900 p-12 lg:p-24 flex flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        
        <div className="relative z-10">
          <Link to="/finops" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12">
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Website</span>
          </Link>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tighter mb-6 uppercase">
            Belreon <span className="text-emerald-400">FinOps</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            The intelligent accounting platform designed specifically for retailers and small businesses.
          </p>
        </div>

        <div className="relative z-10 space-y-8 mt-12">
          {[
            { title: "Real-time Inventory", desc: "Never lose track of your stock again." },
            { title: "Automated Invoicing", desc: "Get paid faster with smart reminders." },
            { title: "Tax Compliance", desc: "Stay audit-ready with zero effort." }
          ].map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="mt-1">
                <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{item.title}</h4>
                <p className="text-slate-500 text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 mt-12 pt-12 border-t border-slate-800">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            © 2026 Belreon FinOps. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="lg:w-1/2 p-8 lg:p-24 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-500 text-sm">
              {isLogin ? 'Enter your credentials to access your dashboard.' : 'Start your 14-day free trial today.'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            )}
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Work Email</label>
              <input type="email" placeholder="john@company.com" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                {isLogin && (
                  <button className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700">Forgot Password?</button>
                )}
              </div>
              <input type="password" placeholder="••••••••" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <button className="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2">
              {isLogin ? 'Sign In' : 'Create Account'}
              <RocketLaunchIcon className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-bold text-emerald-600 hover:text-emerald-700"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FinopsAuthPage;
