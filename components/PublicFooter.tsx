import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicFooter: React.FC = () => {
    const { companyName, companyLogo } = useAuth();
    return (
        <footer className="bg-slate-900 text-slate-400">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <div className="mb-6 md:mb-0">
                        <Link to="/" className="inline-block">
                            <img src={companyLogo} alt="Company Logo" className="h-32" />
                        </Link>
                         <p className="text-sm mt-2 max-w-xs">Expert consulting for a new era of business.</p>
                         <div className="mt-4">
                             <h3 className="text-md font-semibold text-white uppercase tracking-wider mb-2">Contact Us</h3>
                             <a href="mailto:belreonconsultancy@gmail.com" className="text-slate-300 hover:text-white transition-colors duration-300">
                                 belreonconsultancy@gmail.com
                             </a>
                         </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-700 text-center text-sm">
                    © {new Date().getFullYear()} {companyName}. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;