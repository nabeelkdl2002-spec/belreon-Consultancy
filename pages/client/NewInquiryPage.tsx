

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Client } from '../../types';

const NewInquiryPage: React.FC = () => {
    const { user, stocks, services, updateClientInquiry } = useAuth();
    const navigate = useNavigate();
    const client = user as Client;

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        contactPerson: client?.contactPerson || '',
        email: client?.email || '',
        phone: client?.phone || '',
        companyName: client?.companyName || '',
        address: client?.address || '',
        service: client?.service || '',
        projectDescription: client?.projectDescription || '',
        budget: client?.budget || '',
        currency: client?.currency || 'USD',
        deadline: client?.deadline || '',
        selectedStock: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        if (step === 1) {
            if (!formData.contactPerson || !formData.email || !formData.phone || !formData.address) {
                alert("Please fill in all required personal details.");
                return;
            }
        }
        if (step === 2) {
            if (!formData.service) {
                alert("Please select a service.");
                return;
            }
        }
        setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const submissionData = {
            ...formData,
            // For stock market, we might want to store the selected stock in the service field or description
            service: formData.service,
            projectDescription: formData.service === 'Stock Market Recommendations' 
                ? `Interested in: ${formData.selectedStock}. ${formData.projectDescription}`
                : formData.projectDescription
        };

        updateClientInquiry(client.id, submissionData);
        navigate('/client/dashboard');
    };

    const isStockMarket = formData.service === 'Stock Market Recommendations';

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Common Enquiry Portal</h1>
                        <span className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-bold">Step {step} of 3</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                            className="bg-blue-600 h-full transition-all duration-500" 
                            style={{ width: `${(step / 3) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="border-b border-slate-100 pb-4">
                                <h2 className="text-xl font-bold text-slate-800">Personal Information</h2>
                                <p className="text-slate-500 text-sm">Please provide your contact details to start the enquiry.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                                    <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="w-full px-4 py-3 border bg-white text-slate-900 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="John Doe" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border bg-white text-slate-900 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="john@example.com" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Phone Number</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border bg-white text-slate-900 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="+1 (555) 000-0000" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Company Name (Optional)</label>
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-4 py-3 border bg-white text-slate-900 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Acme Inc." />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Address</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 border bg-white text-slate-900 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="123 Business St, City, Country" required />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <button type="button" onClick={nextStep} className="bg-blue-700 text-white font-bold px-10 py-3 rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-200">Next: Choose Service</button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="border-b border-slate-100 pb-4">
                                <h2 className="text-xl font-bold text-slate-800">Select Service</h2>
                                <p className="text-slate-500 text-sm">Which of our expert services are you interested in?</p>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {services.map(s => (
                                    <label 
                                        key={s.id} 
                                        className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                                            formData.service === s.title 
                                            ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-50' 
                                            : 'border-slate-100 hover:border-slate-200 bg-slate-50'
                                        }`}
                                    >
                                        <input 
                                            type="radio" 
                                            name="service" 
                                            value={s.title} 
                                            checked={formData.service === s.title} 
                                            onChange={handleChange} 
                                            className="hidden" 
                                        />
                                        <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                                            formData.service === s.title ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                                        }`}>
                                            {formData.service === s.title && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{s.title}</div>
                                            <div className="text-xs text-slate-500">{s.description}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <div className="flex justify-between pt-4">
                                <button type="button" onClick={prevStep} className="text-slate-600 font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-all">Back</button>
                                <button type="button" onClick={nextStep} className="bg-blue-700 text-white font-bold px-10 py-3 rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-200">Next: Details</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="border-b border-slate-100 pb-4">
                                <h2 className="text-xl font-bold text-slate-800">
                                    {isStockMarket ? 'Investment Interest Details' : 'Service Requirements'}
                                </h2>
                                <p className="text-slate-500 text-sm">
                                    {isStockMarket 
                                        ? 'Provide details about your stock market investment goals.' 
                                        : 'Tell us more about what you need for this service.'}
                                </p>
                            </div>

                            {isStockMarket ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Interested Stock / Package</label>
                                        <select name="selectedStock" value={formData.selectedStock} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" required>
                                            <option value="">-- Please Select --</option>
                                            {stocks.map(s => (
                                                <option key={s.id} value={s.name}>{s.name} ({s.ticker})</option>
                                            ))}
                                            <option value="Custom Portfolio">Other / Custom Portfolio</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Investable Capital</label>
                                        <div className="flex gap-2">
                                            <select name="currency" value={formData.currency} onChange={handleChange} className="w-24 px-3 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                                <option value="USD">$ USD</option>
                                                <option value="EUR">€ EUR</option>
                                                <option value="GBP">£ GBP</option>
                                            </select>
                                            <input type="text" name="budget" value={formData.budget} onChange={handleChange} className="flex-1 px-4 py-3 border bg-white text-slate-900 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. 50,000" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Investment Horizon Date</label>
                                        <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full px-4 py-3 border bg-white text-slate-900 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Additional Notes</label>
                                        <textarea name="projectDescription" rows={4} value={formData.projectDescription} onChange={handleChange} className="w-full px-4 py-3 border bg-white text-slate-900 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Any specific requirements or risk preferences?"></textarea>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Description of Service Needed</label>
                                        <textarea 
                                            name="projectDescription" 
                                            rows={8} 
                                            value={formData.projectDescription} 
                                            onChange={handleChange} 
                                            className="w-full px-4 py-3 border bg-white text-slate-900 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                                            placeholder="Please describe your requirements in detail so we can better assist you..." 
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between pt-4">
                                <button type="button" onClick={prevStep} className="text-slate-600 font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-all">Back</button>
                                <button type="submit" className="bg-green-600 text-white font-bold px-12 py-3 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200">Submit Enquiry</button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default NewInquiryPage;