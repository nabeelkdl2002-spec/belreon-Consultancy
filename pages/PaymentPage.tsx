import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const PaymentPage: React.FC = () => {
  const { companyLogo } = useAuth();
  const handleClick = () => {
    alert('Payment confirmation received. A receipt will be sent to your email shortly. Thank you!');
  };

  return (
    <div className="bg-white py-16">
        <div className="container mx-auto px-4">
            <div className="w-full max-w-lg mx-auto p-10 rounded-2xl text-center">
                <img src={companyLogo} alt="Company Logo" className="w-full max-w-md mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-slate-800">Complete Your Payment</h2>
                <p className="text-slate-500 mt-2 mb-6 leading-relaxed">Scan the QR code below using any UPI-enabled application to complete your payment securely.</p>
                
                <div className="p-5 border-2 border-dashed border-slate-300 rounded-xl inline-block mb-4">
                <img src="https://i.ibb.co/M9j71t7/gpay-qr-code.png" alt="GPay QR Code" className="w-64 h-64" />
                <p className="font-semibold text-slate-800 mt-3">UPI ID: nabeel123ghn@oksbi</p>
                </div>
                
                <button 
                onClick={handleClick}
                className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                >
                Click here after payment is successful
                </button>
                <p className="text-xs text-slate-400 mt-4">A confirmation receipt will be sent to your email.</p>
            </div>
        </div>
    </div>
  );
};

export default PaymentPage;