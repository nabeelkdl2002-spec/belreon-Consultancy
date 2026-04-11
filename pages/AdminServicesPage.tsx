import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Service, AboutUsIcon } from '../types';
import Modal from '../components/Modal';
import { TrashIcon, ChartPieIcon, BanknotesIcon, Cog6ToothIcon, CalculatorIcon, LightbulbIcon, Squares2X2Icon, DatabaseIcon, BriefcaseIcon, UsersIcon } from '../components/icons';

const iconOptions: { label: string; value: AboutUsIcon; icon: React.ReactNode }[] = [
  { label: 'Analysis', value: 'ChartPieIcon', icon: <ChartPieIcon className="w-5 h-5" /> },
  { label: 'Valuation', value: 'BanknotesIcon', icon: <BanknotesIcon className="w-5 h-5" /> },
  { label: 'Controlling', value: 'Cog6ToothIcon', icon: <Cog6ToothIcon className="w-5 h-5" /> },
  { label: 'Modelling', value: 'CalculatorIcon', icon: <CalculatorIcon className="w-5 h-5" /> },
  { label: 'Insights', value: 'LightbulbIcon', icon: <LightbulbIcon className="w-5 h-5" /> },
  { label: 'Database', value: 'DatabaseIcon', icon: <DatabaseIcon className="w-5 h-5" /> },
  { label: 'Business', value: 'BriefcaseIcon', icon: <BriefcaseIcon className="w-5 h-5" /> },
  { label: 'Team', value: 'UsersIcon', icon: <UsersIcon className="w-5 h-5" /> },
  { label: 'General', value: 'Squares2X2Icon', icon: <Squares2X2Icon className="w-5 h-5" /> },
];

const ServiceForm: React.FC<{
  service: Service | null;
  onSave: (data: Service | Omit<Service, 'id'>) => void;
  onCancel: () => void;
}> = ({ service, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Service, 'id'>>({
    title: service?.title || '',
    description: service?.description || '',
    imageUrl: service?.imageUrl || '',
    icon: service?.icon || 'ChartPieIcon',
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (service) {
      onSave({ ...formData, id: service.id });
    } else {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Service Title</label>
        <input name="title" type="text" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg" required />
      </div>

      <div>
        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Description</label>
        <textarea name="description" rows={4} value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg text-sm" required />
      </div>

      <div>
        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Icon</label>
        <div className="grid grid-cols-3 gap-2">
          {iconOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, icon: opt.value }))}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${formData.icon === opt.value ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
            >
              {opt.icon}
              <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Service Image</label>
        {formData.imageUrl && (
          <div className="mb-3 rounded-lg overflow-hidden h-40 border border-slate-200">
            <img src={formData.imageUrl} alt="preview" className="w-full h-full object-cover" />
          </div>
        )}
        <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center w-full transition-colors">
          {isUploading ? <span>Uploading...</span> : <span>{formData.imageUrl ? 'Change Image' : 'Upload Service Image'}</span>}
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-slate-200 text-slate-800 font-bold rounded-lg hover:bg-slate-300">Cancel</button>
        <button type="submit" className="px-6 py-2 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 shadow-lg">Save Service</button>
      </div>
    </form>
  );
};

const AdminServicesPage: React.FC = () => {
  const { services, addService, updateService, deleteService } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const activeServices = services.filter(s => !s.isDeleted);

  const handleAddNew = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleSave = (data: Service | Omit<Service, 'id'>) => {
    if ('id' in data) {
      updateService(data as Service);
    } else {
      addService(data as Omit<Service, 'id'>);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Our Services</h1>
          <p className="text-sm text-slate-500 mt-1">Manage the services displayed on the home page.</p>
        </div>
        <button onClick={handleAddNew} className="w-full md:w-auto bg-blue-700 text-white font-black px-8 py-3 rounded-lg hover:bg-blue-800 transition-all shadow-lg">
          + ADD NEW SERVICE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeServices.map((service) => (
          <div key={service.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all hover:shadow-xl relative group">
            <div className="h-48 overflow-hidden">
              <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="p-6 flex-grow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center">
                  {iconOptions.find(o => o.value === service.icon)?.icon || <Squares2X2Icon className="w-5 h-5" />}
                </div>
                <h3 className="text-xl font-black text-slate-800 leading-tight">{service.title}</h3>
              </div>
              <p className="text-sm text-slate-500 line-clamp-3">{service.description}</p>
            </div>
            <div className="p-4 bg-slate-50/50 border-t flex justify-end items-center space-x-6">
              <button onClick={() => handleEdit(service)} className="text-xs font-black text-blue-700 hover:text-blue-900 uppercase tracking-widest">Edit Service</button>
              <button onClick={() => deleteService(service.id)} className="text-slate-300 hover:text-red-600 transition-colors"><TrashIcon className="w-5 h-5" /></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Modal title={editingService ? 'Edit Service' : 'Add New Service'} onClose={() => setIsModalOpen(false)}>
          <ServiceForm service={editingService} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default AdminServicesPage;
