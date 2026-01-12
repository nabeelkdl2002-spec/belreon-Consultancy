import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { NewsItem } from '../types';
import Modal from '../components/Modal';
import { TrashIcon, PencilIcon } from '../components/icons';

const NewsForm: React.FC<{
    news: Omit<NewsItem, 'id'> | NewsItem | null;
    onSave: (data: Omit<NewsItem, 'id'>) => void;
    onCancel: () => void;
}> = ({ news, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: news?.title || '',
        summary: news?.summary || '',
        date: news?.date || new Date().toISOString().split('T')[0],
        url: news?.url || '',
        imageUrl: news?.imageUrl || '',
    });
    const [isUploading, setIsUploading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsUploading(true);
            const file = e.target.files[0];
            try {
                const base64String = await convertFileToBase64(file);
                setFormData(prev => ({ ...prev, imageUrl: base64String }));
            } catch (error) {
                console.error("Error converting file to base64", error);
                alert("Error uploading image.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.summary || !formData.date) {
            alert('Please fill required fields.');
            return;
        }
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Headline</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Publish Date</label>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Summary / Content</label>
                <textarea
                    name="summary"
                    rows={4}
                    value={formData.summary}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">External Link (Optional)</label>
                <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">News Image</label>
                {formData.imageUrl && (
                    <div className="mb-2">
                        <img src={formData.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                    </div>
                )}
                <label className="cursor-pointer block w-full text-center py-2 px-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                </label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">Save News</button>
            </div>
        </form>
    );
};

const NewsManagerPage: React.FC = () => {
    const { news, addNews, updateNews, deleteNews } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
    const [newsToDelete, setNewsToDelete] = useState<NewsItem | null>(null);

    const activeNews = news.filter(n => !n.isDeleted).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleSave = (data: Omit<NewsItem, 'id'>) => {
        if (editingNews) {
            updateNews({ ...data, id: editingNews.id });
        } else {
            addNews(data);
        }
        setIsModalOpen(false);
        setEditingNews(null);
    };

    const confirmDelete = () => {
        if (newsToDelete) {
            deleteNews(newsToDelete.id);
            setNewsToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Market News Management</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage the news feed displayed on the home page.</p>
                </div>
                <button onClick={() => { setEditingNews(null); setIsModalOpen(true); }} className="bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-800 transition-colors">
                    + Add News Item
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeNews.map(item => (
                    <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
                        <div className="h-40 bg-slate-200 relative">
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                            )}
                        </div>
                        <div className="p-4 flex-grow">
                            <div className="text-xs text-slate-500 mb-2">{item.date}</div>
                            <h3 className="font-bold text-slate-800 mb-2 line-clamp-2">{item.title}</h3>
                            <p className="text-sm text-slate-600 line-clamp-3">{item.summary}</p>
                            {item.url && <div className="mt-2 text-xs text-blue-600 truncate">{item.url}</div>}
                        </div>
                        <div className="p-4 bg-slate-50 border-t flex justify-end space-x-3">
                            <button onClick={() => { setEditingNews(item); setIsModalOpen(true); }} className="text-slate-500 hover:text-blue-600"><PencilIcon /></button>
                            <button onClick={() => setNewsToDelete(item)} className="text-slate-500 hover:text-red-600"><TrashIcon /></button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <Modal title={editingNews ? "Edit News" : "Add Market News"} onClose={() => setIsModalOpen(false)}>
                    <NewsForm news={editingNews} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
                </Modal>
            )}

            {newsToDelete && (
                <Modal title="Confirm Deletion" onClose={() => setNewsToDelete(null)}>
                    <div className="text-center">
                        <p>Are you sure you want to delete <strong>"{newsToDelete.title}"</strong>?</p>
                        <div className="flex justify-center space-x-4 mt-6">
                            <button onClick={() => setNewsToDelete(null)} className="px-4 py-2 bg-slate-200 rounded-lg">Cancel</button>
                            <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default NewsManagerPage;