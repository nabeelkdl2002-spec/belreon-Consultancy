

import React, { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { Client, ProjectStatus, Stock } from '../types';
import { SearchIcon, TrashIcon, PencilIcon } from '../components/icons';
import Modal from '../components/Modal';

const ClientDetailsModal: React.FC<{ client: Client; onClose: () => void; onApprove: (id: number) => void; onReject: (id: number) => void; }> = ({ client, onClose, onApprove, onReject }) => {
    return (
        <Modal title="Client Inquiry Details" onClose={onClose}>
            <div className="space-y-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><h4 className="font-semibold text-slate-500">Contact Person</h4><p className="text-slate-800">{client.contactPerson}</p></div>
                    <div><h4 className="font-semibold text-slate-500">Company Name</h4><p className="text-slate-800">{client.companyName || 'N/A'}</p></div>
                    <div><h4 className="font-semibold text-slate-500">Email</h4><p className="text-slate-800">{client.email}</p></div>
                    <div><h4 className="font-semibold text-slate-500">Phone</h4><p className="text-slate-800">{client.phone}</p></div>
                    <div className="md:col-span-2"><h4 className="font-semibold text-slate-500">Address</h4><p className="text-slate-800">{client.address}</p></div>
                </div>
                <hr className="my-4"/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><h4 className="font-semibold text-slate-500">Investment Interest</h4><p className="text-slate-800 font-medium">{client.service}</p></div>
                    <div><h4 className="font-semibold text-slate-500">Project Status</h4><StatusBadge status={client.projectStatus} /></div>
                    <div className="md:col-span-2"><h4 className="font-semibold text-slate-500">Description / Goals</h4><p className="text-slate-800 whitespace-pre-wrap bg-slate-50 p-3 rounded-md">{client.projectDescription}</p></div>
                    <div><h4 className="font-semibold text-slate-500">Capital</h4><p className="text-slate-800">{client.currency ? `${client.currency} ${client.budget}` : client.budget || 'N/A'}</p></div>
                    <div><h4 className="font-semibold text-slate-500">Horizon Date</h4><p className="text-slate-800">{client.deadline}</p></div>
                </div>
            </div>
             {client.projectStatus === ProjectStatus.PendingApproval && (
                <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
                    <button onClick={() => { onReject(client.id); onClose(); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Reject</button>
                    <button onClick={() => { onApprove(client.id); onClose(); }} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Approve Project</button>
                </div>
            )}
        </Modal>
    );
};

const StatusUpdateModal: React.FC<{ client: Client; onClose: () => void; onSave: (id: number, status: ProjectStatus) => void; }> = ({ client, onClose, onSave }) => {
    const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>(client.projectStatus);
    return (
        <Modal title={`Update Status for ${client.companyName || client.contactPerson}`} onClose={onClose}>
            <div className="space-y-4">
                <p className="text-slate-600">Select the new project status:</p>
                <div className="space-y-2">
                    {Object.values(ProjectStatus).map(status => (
                        <label key={status} className="flex items-center p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                            <input type="radio" name="status" value={status} checked={selectedStatus === status} onChange={() => setSelectedStatus(status)} className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
                            <span className="ml-3 text-slate-700">{status}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300">Cancel</button>
                <button onClick={() => { onSave(client.id, selectedStatus); onClose(); }} className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">Save Status</button>
            </div>
        </Modal>
    );
};

const ClientEditModal: React.FC<{ client: Client; onClose: () => void; onSave: (id: number, data: Partial<Client>) => void; }> = ({ client, onClose, onSave }) => {
    const [formData, setFormData] = useState(client);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    return (
        <Modal title={`Edit Details for ${client.companyName || client.contactPerson}`} onClose={onClose}>
            <form className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-slate-600 mb-1">Contact Person</label><input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg"/></div>
                    <div><label className="block text-sm font-medium text-slate-600 mb-1">Company Name</label><input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg"/></div>
                    <div><label className="block text-sm font-medium text-slate-600 mb-1">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg"/></div>
                    <div><label className="block text-sm font-medium text-slate-600 mb-1">Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg"/></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-600 mb-1">Address</label><input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg"/></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-600 mb-1">Project Description</label><textarea name="projectDescription" rows={4} value={formData.projectDescription} onChange={handleChange} className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg"></textarea></div>
                </div>
            </form>
             <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300">Cancel</button>
                <button onClick={() => { onSave(client.id, formData); onClose(); }} className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">Save Changes</button>
            </div>
        </Modal>
    );
};

const AddClientModal: React.FC<{ stocks: Stock[]; onClose: () => void; onSave: (data: Partial<Client>) => void; }> = ({ stocks, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        service: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = () => {
        if (!formData.companyName || !formData.contactPerson || !formData.email) {
            alert('Company Name, Contact Person, and Email are required.');
            return;
        }
        onSave(formData);
        onClose();
    };

    return (
        <Modal title="Add New Client" onClose={onClose}>
            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
                <div><label className="block text-sm font-medium text-slate-600 mb-1">Company Name</label><input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg" required/></div>
                <div><label className="block text-sm font-medium text-slate-600 mb-1">Contact Person</label><input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg" required/></div>
                <div><label className="block text-sm font-medium text-slate-600 mb-1">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg" required/></div>
                <div><label className="block text-sm font-medium text-slate-600 mb-1">Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg"/></div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Interested Stock / Package</label>
                    <select name="service" value={formData.service} onChange={handleChange} className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg">
                        <option value="">Select a stock (optional)</option>
                        {stocks.map(s => <option key={s.id} value={s.name}>{s.name} ({s.ticker})</option>)}
                    </select>
                </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300">Cancel</button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">Add Client</button>
            </div>
        </Modal>
    );
};


const ClientsPage: React.FC = () => {
    const { clients, stocks, updateClientStatus, updateClientDetails, deleteClient, addClient } = useAuth();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [statusUpdateClient, setStatusUpdateClient] = useState<Client | null>(null);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [filters, setFilters] = useState({ month: '', year: '', service: '', status: '' });
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const clearFilters = () => setFilters({ month: '', year: '', service: '', status: '' });

    const filteredClients = useMemo(() => {
        let activeClients = clients.filter(c => !c.isDeleted);
        
        if (searchTerm) {
            activeClients = activeClients.filter(c =>
                c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filters.status) activeClients = activeClients.filter(c => c.projectStatus === filters.status);
        if (filters.service) activeClients = activeClients.filter(c => c.service === filters.service);
        if (filters.year) activeClients = activeClients.filter(c => c.submissionDate && c.submissionDate.startsWith(filters.year));
        if (filters.month) activeClients = activeClients.filter(c => c.submissionDate && new Date(c.submissionDate).getMonth() + 1 === parseInt(filters.month));

        return activeClients;
    }, [searchTerm, clients, filters]);

    const handleExport = () => {
        const headers = ["Company Name", "Contact Person", "Email", "Stock/Service", "Submission Date", "Project Status"];
        const rows = filteredClients.map(c => [
            c.companyName || '-',
            c.contactPerson || '-',
            c.email,
            c.service || '-',
            c.submissionDate || '-',
            c.projectStatus
        ]);

        let csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "clients_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const confirmDelete = () => {
        if (clientToDelete) {
          deleteClient(clientToDelete.id);
          setClientToDelete(null);
        }
    };

    const years = ([...new Set(clients.map(c => c.submissionDate?.substring(0, 4)).filter((y): y is string => !!y))] as string[]).sort((a,b) => b.localeCompare(a));

  return (
    <>
      {selectedClient && <ClientDetailsModal client={selectedClient} onClose={() => setSelectedClient(null)} onApprove={(id) => updateClientStatus(id, ProjectStatus.InProgress)} onReject={(id) => updateClientStatus(id, ProjectStatus.Rejected)} />}
      {statusUpdateClient && <StatusUpdateModal client={statusUpdateClient} onClose={() => setStatusUpdateClient(null)} onSave={updateClientStatus} />}
      {editingClient && <ClientEditModal client={editingClient} onClose={() => setEditingClient(null)} onSave={updateClientDetails} />}
      {isAddModalOpen && <AddClientModal stocks={stocks} onClose={() => setIsAddModalOpen(false)} onSave={(data) => { addClient(data); setIsAddModalOpen(false); }} />}
      {clientToDelete && (
        <Modal title="Confirm Deletion" onClose={() => setClientToDelete(null)}>
            <div className="text-center">
                <p className="text-slate-600 text-lg">
                    Are you sure you want to move client <span className="font-bold text-slate-800">"{clientToDelete.companyName || clientToDelete.contactPerson}"</span> to the trash?
                </p>
                <p className="text-sm text-slate-500 mt-2">You can restore them later from the Trash page.</p>
                <div className="flex justify-center space-x-4 mt-8">
                    <button onClick={() => setClientToDelete(null)} className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors">Cancel</button>
                    <button onClick={confirmDelete} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Move to Trash</button>
                </div>
            </div>
        </Modal>
      )}
      
      <div className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
        {/* Search and Actions */}
        <div className="flex justify-between items-center mb-4">
          <div className="relative"><input type="text" placeholder="Search for a client..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg w-80 focus:ring-blue-500 focus:border-blue-500"/><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="h-5 w-5 text-slate-400" /></div></div>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-800 transition-colors">+ Add New Client</button>
        </div>
        
        {/* Filters */}
        <div className="bg-slate-50 p-4 rounded-lg flex flex-wrap items-center gap-4 mb-6">
            <select name="month" value={filters.month} onChange={handleFilterChange} className="filter-select"><option value="">All Months</option>{[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)}</select>
            <select name="year" value={filters.year} onChange={handleFilterChange} className="filter-select"><option value="">All Years</option>{years.map(y => <option key={y} value={y}>{y}</option>)}</select>
            <select name="service" value={filters.service} onChange={handleFilterChange} className="filter-select"><option value="">All Stocks</option>{stocks.map(s=><option key={s.id} value={s.name}>{s.name}</option>)}</select>
            <select name="status" value={filters.status} onChange={handleFilterChange} className="filter-select"><option value="">All Statuses</option>{Object.values(ProjectStatus).map(s=><option key={s} value={s}>{s}</option>)}</select>
            <button onClick={clearFilters} className="text-sm text-slate-600 hover:text-blue-600">Clear Filters</button>
            <button onClick={handleExport} className="ml-auto text-sm bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">Export to Excel</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3">Company Name</th>
                <th scope="col" className="px-6 py-3">Contact</th>
                <th scope="col" className="px-6 py-3">Investment Interest</th>
                <th scope="col" className="px-6 py-3">Date of Submission</th>
                <th scope="col" className="px-6 py-3">Project Status</th>
                <th scope="col" className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client: Client) => (
                <tr key={client.id} className="bg-white border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{client.companyName || '-'}</td>
                  <td className="px-6 py-4">{client.contactPerson || '-'}<br/><span className="text-xs text-slate-400">{client.email}</span></td>
                  <td className="px-6 py-4">{client.service || '-'}</td>
                  <td className="px-6 py-4">{client.submissionDate || '-'}</td>
                  <td className="px-6 py-4"><button onClick={() => setStatusUpdateClient(client)} className="w-full text-left"><StatusBadge status={client.projectStatus} /></button></td>
                  <td className="px-6 py-4 text-center">
                     <div className="flex items-center justify-center space-x-4">
                        <button onClick={() => setSelectedClient(client)} className="font-medium text-blue-600 hover:underline text-sm">
                            {client.projectStatus === ProjectStatus.PendingApproval ? 'Review' : 'View'}
                        </button>
                        <button onClick={() => setEditingClient(client)} className="text-slate-400 hover:text-blue-600" title="Edit Client"><PencilIcon className="w-4 h-4" /></button>
                        <button onClick={() => setClientToDelete(client)} className="text-slate-400 hover:text-red-600" title="Move to Trash"><TrashIcon className="w-5 h-5" /></button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`.filter-select { background-color: white; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; }`}</style>
    </>
  );
};

export default ClientsPage;