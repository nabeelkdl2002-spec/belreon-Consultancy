
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Client, ProjectStatus } from '../../types';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import { Link } from 'react-router-dom';

const NewClientView: React.FC<{ client: Client }> = ({ client }) => (
    <div className="text-center bg-white p-10 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Welcome, {client.userId}!
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto mb-8">
            Thank you for creating an account with Belreon. To get started, please tell us about your project needs by submitting an inquiry.
        </p>
        <Link 
            to="/client/new-inquiry"
            className="inline-block bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
            Submit a Project Inquiry
        </Link>
    </div>
);

const PendingApprovalView: React.FC<{ client: Client }> = ({ client }) => (
     <div className="text-center bg-white p-10 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Inquiry Submitted!
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto mb-2">
            Thank you, {client.contactPerson}. We have received your project inquiry for <span className="font-semibold">{client.service}</span>.
        </p>
         <p className="text-slate-600 max-w-2xl mx-auto">
            Our team is reviewing the details and we will be in touch with you shortly.
        </p>
        <div className="mt-6">
            <StatusBadge status={ProjectStatus.PendingApproval} />
        </div>
    </div>
);

const ApprovedClientView: React.FC<{ client: Client }> = ({ client }) => (
     <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
            Welcome, {client.contactPerson}!
        </h1>
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="Company" value={client.companyName} />
                <Card title="Primary Contact" value={client.contactPerson} />
                <Card title="Contact Email" value={client.email} />
            </div>

            <Card title="Project Overview">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-slate-600">Service</h4>
                        <p className="text-lg text-slate-800">{client.service}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-slate-600">Project Status</h4>
                        <div className="mt-1"><StatusBadge status={client.projectStatus} /></div>
                    </div>
                </div>
            </Card>
            
             <Card title="Invoices & Payments">
                <div className="text-center p-8 text-slate-500">
                    <p className="text-lg">No recent invoices.</p>
                    <p>Your payment history will appear here.</p>
                </div>
            </Card>
        </div>
    </div>
);


const ClientDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const client = user as Client;
    
    if (!client) {
        return <div>Loading client data...</div>;
    }

    switch (client.projectStatus) {
        case ProjectStatus.New:
            return <NewClientView client={client} />;
        case ProjectStatus.PendingApproval:
            return <PendingApprovalView client={client} />;
        default:
            return <ApprovedClientView client={client} />;
    }
};

export default ClientDashboardPage;