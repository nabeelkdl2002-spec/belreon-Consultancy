

import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { User, UserRole, UserStatus } from '../types';
import { TrashIcon, PencilIcon, SearchIcon } from '../components/icons';
import Modal from '../components/Modal';

const adminNavPermissions = [
  { path: '/admin/dashboard', label: 'Dashboard' },
  { path: '/admin/clients', label: 'Clients' },
  { path: '/admin/users', label: 'User Management' },
  { path: '/admin/financials', label: 'Financial Reports' },
  { path: '/admin/transactions', label: 'Transactions' },
  { path: '/admin/database', label: 'Database' },
  { path: '/admin/app-modify', label: 'App Modify' },
  { path: '/admin/settings', label: 'Settings' },
  { path: '/admin/trash', label: 'Trash' },
];


const UserModal: React.FC<{
  user: User | null;
  onClose: () => void;
  onSave: (data: Omit<User, 'id' | 'isDeleted'> | (Partial<User> & { id: number })) => void;
}> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    password: '',
    role: user?.role || UserRole.Employee,
    status: user?.status || UserStatus.Active,
  });
  const [selectedNavPermissions, setSelectedNavPermissions] = useState<string[]>(user?.navPermissions || []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNavPermissionChange = (path: string) => {
    setSelectedNavPermissions(prev =>
      prev.includes(path)
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username) {
        alert("Username is required.");
        return;
    }
    if (!user && !formData.password) {
        alert("Password is required for new users.");
        return;
    }

    const dataToSave: any = {
      ...formData,
      permissions: [], // Reset old permissions if they were used for something else
      navPermissions: selectedNavPermissions,
    };
    
    if (user) {
        dataToSave.id = user.id;
        if (!formData.password) {
            delete dataToSave.password;
        }
    }
    
    onSave(dataToSave);
    onClose();
  };

  return (
    <Modal title={user ? `Edit User: ${user.username}` : 'Create New User'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full form-input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full form-input" placeholder={user ? 'Leave blank to keep current password' : ''} required={!user} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Role</label>
          <select name="role" value={formData.role} onChange={handleChange} className="w-full form-input bg-slate-100" disabled>
            <option value={UserRole.Employee}>{UserRole.Employee}</option>
          </select>
           <p className="text-xs text-slate-500 mt-1">Only 'Employee' role can be assigned. Primary Admin cannot be changed.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full form-input">
            <option value={UserStatus.Active}>Active</option>
            <option value={UserStatus.Disabled}>Disabled</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Admin Panel Access</label>
          <div className="grid grid-cols-2 gap-2 p-3 border rounded-lg bg-white">
            {adminNavPermissions.map(perm => (
              <label key={perm.path} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedNavPermissions.includes(perm.path)}
                  onChange={() => handleNavPermissionChange(perm.path)}
                />
                <span>{perm.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">Save User</button>
        </div>
      </form>
    </Modal>
  );
};


const UsersPage: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() => {
    const activeUsers = users.filter(u => !u.isDeleted);
    if (!searchTerm) {
      return activeUsers;
    }
    return activeUsers.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleAddNew = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
  };
  
  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      setUserToDelete(null);
    }
  };

  const handleSave = (data: Omit<User, 'id' | 'isDeleted'> | (Partial<User> & { id: number })) => {
    if ('id' in data && data.id) {
      updateUser(data.id, data);
    } else {
      addUser(data as Omit<User, 'id' | 'isDeleted'>);
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  return (
    <>
      {isModalOpen && (
        <UserModal 
          user={editingUser} 
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }} 
          onSave={handleSave} 
        />
      )}
      {userToDelete && (
        <Modal title="Confirm Deletion" onClose={() => setUserToDelete(null)}>
            <div className="text-center">
                <p className="text-slate-600 text-lg">
                    Are you sure you want to move user <span className="font-bold text-slate-800">"{userToDelete.username}"</span> to the trash?
                </p>
                <p className="text-sm text-slate-500 mt-2">Their access will be revoked. You can restore them later from the Trash page.</p>
                <div className="flex justify-center space-x-4 mt-8">
                    <button onClick={() => setUserToDelete(null)} className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors">Cancel</button>
                    <button onClick={confirmDelete} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Move to Trash</button>
                </div>
            </div>
        </Modal>
      )}

      <div className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
        <div className="flex justify-between items-center mb-6">
           <div className="relative">
            <input 
              type="text" 
              placeholder="Search by username..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="pl-10 pr-4 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg w-80 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-slate-400" />
            </div>
          </div>
          <button onClick={handleAddNew} className="bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-800 transition-colors">+ Create New User</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3">Username</th>
                <th scope="col" className="px-6 py-3">Role</th>
                <th scope="col" className="px-6 py-3">Admin Panel Access</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: User) => (
                <tr key={user.id} className="bg-white border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{user.username}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">
                     {user.navPermissions.includes('all') ? (
                        <span className="inline-block bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">All Access</span>
                    ) : (
                        (user.navPermissions || []).map((path) => {
                            const label = adminNavPermissions.find(p => p.path === path)?.label || path;
                            return (
                                <span key={path} className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 mb-1 px-2.5 py-0.5 rounded-full">{label}</span>
                            )
                        })
                    )}
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                  <td className="px-6 py-4">
                    {user.role !== UserRole.PrimaryAdmin ? (
                      <div className="flex items-center justify-center space-x-4">
                        <button onClick={() => handleEdit(user)} className="text-slate-400 hover:text-blue-600" title="Edit User">
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(user)} className="text-slate-400 hover:text-red-600" title="Move to Trash">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-xs text-slate-400 italic">N/A</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
      .form-input {
        width: 100%;
        background-color: white;
        border: 1px solid #cbd5e1;
        border-radius: 0.5rem;
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out;
      }
      .form-input:focus, .form-input:focus-visible {
        outline: none !important;
        box-shadow: none !important;
        border-color: #3b82f6;
      }
      .dark .form-input {
        background-color: #334155 !important;
        color: #f1f5f9 !important;
        border-color: #475569 !important;
      }
      `}</style>
    </>
  );
};

export default UsersPage;