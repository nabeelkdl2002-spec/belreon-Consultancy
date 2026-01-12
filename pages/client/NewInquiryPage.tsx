

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Client } from '../../types';

const NewInquiryPage: React.FC = () => {
    const { user, stocks, updateClientInquiry } = useAuth();
    const navigate = useNavigate();
    const client = user as Client;

    const [formData, setFormData] = useState({
        contactPerson: client?.contactPerson || '',
        email: client?.email || '',
        phone: client?.phone || '',
        companyName: client?.companyName || '',
        address: client?.address || '',
        service: client?.service || '',
        otherService: '',
        projectDescription: client?.projectDescription || '',
        budget: client?.budget || '',
        currency: client?.currency || 'USD',
        deadline: client?.deadline || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalService = formData.service === 'Other' ? formData.otherService : formData.service;
        
        if (!finalService) {
            alert("Please select a stock/package or specify one.");
            return;
        }
        
        updateClientInquiry(client.id, {
            ...formData,
            service: finalService,
        });

        navigate('/client/dashboard');
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-md">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Submit Investment Inquiry</h1>
            <p className="text-slate-500 mb-8">Tell us which stocks or investment packages you are interested in.</p>
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal & Company Details */}
                <div className="p-6 border border-slate-200 rounded-lg">
                    <h2 className="text-xl font-semibold text-slate-700 mb-6">Your Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="contactPerson" className="block text-sm font-medium text-slate-600 mb-2">Full Name</label>
                            <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="w-full px-4 py-3 border bg-white text-slate-900 border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-2">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border bg-white text-slate-900 border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-600 mb-2">Phone Number</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border bg-white text-slate-900 border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                        </div>
                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-slate-600 mb-2">Company Name <span className="text-slate-400">(Optional)</span></label>
                            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-4 py-3 border bg-white text-slate-900 border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                         <div className="md:col-span-2">
                            <label htmlFor="address" className="block text-sm font-medium text-slate-600 mb-2">Address</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 border bg-white text-slate-900 border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                        </div>
                    </div>
                </div>

                {/* Project Details */}
                 <div className="p-6 border border-slate-200 rounded-lg">
                    <h2 className="text-xl font-semibold text-slate-700 mb-6">Investment Interests</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="md:col-span-2">
                            <label htmlFor="service" className="block text-sm font-medium text-slate-600 mb-2">Interested Stock / Package</label>
                            <select name="service" value={formData.service} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-blue-500 focus:border-blue-500" required>
                                <option value="">-- Please Select --</option>
                                {stocks.map(s => (
                                  <option key={s.id} value={s.name}>{s.name} ({s.ticker})</option>
                                ))}
                                <option value="Other">Other / Custom Portfolio</option>
                            </select>
                         </div>
                         {formData.service === 'Other' && (
                             <div className="md:col-span-2">
                                <label htmlFor="otherService" className="block text-sm font-medium text-slate-600 mb-2">Please Specify</label>
                                <input type="text" name="otherService" value={formData.otherService} onChange={handleChange} className="w-full px-4 py-3 border bg-white text-slate-900 border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                            </div>
                         )}
                        <div className="md:col-span-2">
                            <label htmlFor="projectDescription" className="block text-sm font-medium text-slate-600 mb-2">Investment Goals / Notes</label>
                            <textarea name="projectDescription" rows={6} value={formData.projectDescription} onChange={handleChange} className="w-full px-4 py-3 border bg-white text-slate-900 border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Please describe your investment goals, risk tolerance, etc..." required></textarea>
                        </div>
                         <div>
                            <label htmlFor="budget" className="block text-sm font-medium text-slate-600 mb-2">Investable Capital</label>
                            <div className="flex items-center space-x-2">
                                <select name="currency" value={formData.currency} onChange={handleChange} className="px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-blue-500 focus:border-blue-500" required>
                                    <option value="USD">$ (USD)</option>
                                    <option value="EUR">€ (EUR)</option>
                                    <option value="GBP">£ (GBP)</option>
                                    <option value="INR">₹ (INR)</option>
                                </select>
                                <input 
                                    type="text" 
                                    name="budget" 
                                    value={formData.budget} 
                                    onChange={handleChange} 
                                    className="w-full px-4 py-3 border bg-white text-slate-900 border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                                    placeholder="e.g., 10000" 
                                    required 
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="deadline" className="block text-sm font-medium text-slate-600 mb-2">Investment Horizon Date</label>
                            <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full px-4 py-3 border bg-white text-slate-900 border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                        </div>
                    </div>
                 </div>

                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors">Submit Inquiry</button>
                </div>
            </form>
        </div>
    );
};

export default NewInquiryPage;