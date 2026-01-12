



import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Client, User, Stock, NewsItem, Transaction, AboutUsFeature, UserRole } from '../types';
import { RestoreIcon, TrashIcon } from '../components/icons';
import Modal from '../components/Modal';

const TrashPage: React.FC = () => {
    const {
        user: currentUser,
        clients, users, stocks, news, transactions, aboutUsContent,
        restoreClient, permanentlyDeleteClient,
        restoreUser, permanentlyDeleteUser,
        restoreStock, permanentlyDeleteStock,
        restoreNews, permanentlyDeleteNews,
        restoreTransaction, permanentlyDeleteTransaction,
        restoreAboutUsFeature, permanentlyDeleteAboutUsFeature,
    } = useAuth();

    const [itemToAction, setItemToAction] = useState<{ type: string; id: number; name: string; action: 'restore' | 'delete' } | null>(null);

    const deletedClients = clients.filter(c => c.isDeleted);
    const deletedUsers = users.filter(u => u.isDeleted);
    const deletedStocks = stocks.filter(s => s.isDeleted);
    const deletedNews = news.filter(n => n.isDeleted);
    const deletedTransactions = transactions.filter(t => t.isDeleted);
    const deletedAboutUsFeatures = aboutUsContent.features.filter(f => f.isDeleted);
    
    const hasPermission = (path: string) => {
        if (!currentUser || !('navPermissions' in currentUser)) return false;
        if (currentUser.role === UserRole.PrimaryAdmin || currentUser.navPermissions.includes('all')) return true;
        return currentUser.navPermissions.includes(path);
    };

    const canSeeAppModifyTrash = hasPermission('/admin/app-modify');
    const canSeeNewsTrash = hasPermission('/admin/news');
    const canSeeClientsTrash = hasPermission('/admin/clients');
    const canSeeUsersTrash = hasPermission('/admin/users');
    const canSeeTransactionsTrash = hasPermission('/admin/transactions');

    const anyTrashToShow =
        (canSeeAppModifyTrash && (deletedAboutUsFeatures.length > 0 || deletedStocks.length > 0)) ||
        (canSeeNewsTrash && deletedNews.length > 0) ||
        (canSeeClientsTrash && deletedClients.length > 0) ||
        (canSeeUsersTrash && deletedUsers.length > 0) ||
        (canSeeTransactionsTrash && deletedTransactions.length > 0);


    const handleRestoreClick = (type: string, id: number, name: string) => {
        setItemToAction({ type, id, name, action: 'restore' });
    };

    const handlePermanentDeleteClick = (type: string, id: number, name: string) => {
        setItemToAction({ type, id, name, action: 'delete' });
    };

    const handleConfirmAction = () => {
        if (!itemToAction) return;

        const { type, id, action } = itemToAction;

        if (action === 'restore') {
            switch (type) {
                case 'client': restoreClient(id); break;
                case 'user': restoreUser(id); break;
                case 'stock': restoreStock(id); break;
                case 'news': restoreNews(id); break;
                case 'transaction': restoreTransaction(id); break;
                case 'feature': restoreAboutUsFeature(id); break;
            }
        } else if (action === 'delete') {
            switch (type) {
                case 'client': permanentlyDeleteClient(id); break;
                case 'user': permanentlyDeleteUser(id); break;
                case 'stock': permanentlyDeleteStock(id); break;
                case 'news': permanentlyDeleteNews(id); break;
                case 'transaction': permanentlyDeleteTransaction(id); break;
                case 'feature': permanentlyDeleteAboutUsFeature(id); break;
            }
        }

        setItemToAction(null); // Close modal
    };

    const handleCancelAction = () => {
        setItemToAction(null);
    };
    
    const renderActions = (type: string, id: number, name: string) => (
        <div className="flex items-center justify-center space-x-4">
            <button onClick={() => handleRestoreClick(type, id, name)} className="text-green-600 hover:text-green-800 flex items-center text-sm" title="Restore">
                <RestoreIcon className="w-5 h-5 mr-1" /> Restore
            </button>
            <button onClick={() => handlePermanentDeleteClick(type, id, name)} className="text-red-600 hover:text-red-800 flex items-center text-sm" title="Delete Permanently">
                <TrashIcon className="w-5 h-5 mr-1" /> Delete Forever
            </button>
        </div>
    );

    const getModalTitle = () => {
        if (!itemToAction) return '';
        return itemToAction.action === 'restore' ? 'Confirm Restore' : 'Confirm Permanent Deletion';
    };

    const getModalContent = () => {
        if (!itemToAction) return null;
        if (itemToAction.action === 'restore') {
            return (
                <p>Are you sure you want to restore <span className="font-bold text-slate-800">"{itemToAction.name}"</span>?</p>
            );
        }
        return (
            <>
                <p>Are you sure you want to permanently delete <span className="font-bold text-slate-800">"{itemToAction.name}"</span>?</p>
                <p className="text-sm text-red-600 font-semibold mt-2">This action cannot be undone.</p>
            </>
        );
    };

    return (
        <div className="space-y-8">
            {!anyTrashToShow && (
                 <div className="bg-white p-10 rounded-xl shadow-md text-center">
                    <h2 className="text-2xl font-bold text-slate-800">Trash is Empty</h2>
                    <p className="mt-2 text-slate-500">There are no deleted items for you to view.</p>
                </div>
            )}
            
            {canSeeAppModifyTrash && deletedAboutUsFeatures.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Deleted 'About Us' Features</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                             <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Feature Title</th>
                                    <th scope="col" className="px-6 py-3">Description</th>
                                    <th scope="col" className="px-6 py-3">Deleted By</th>
                                    <th scope="col" className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deletedAboutUsFeatures.map((feature: AboutUsFeature) => (
                                    <tr key={`feature-${feature.id}`} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900">{feature.title}</td>
                                        <td className="px-6 py-4">{feature.description}</td>
                                        <td className="px-6 py-4">{feature.deletedBy || 'N/A'}</td>
                                        <td className="px-6 py-4">{renderActions('feature', feature.id, feature.title)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {canSeeAppModifyTrash && deletedStocks.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Deleted Stocks</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                             <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Stock Name</th>
                                    <th scope="col" className="px-6 py-3">Description</th>
                                    <th scope="col" className="px-6 py-3">Deleted By</th>
                                    <th scope="col" className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deletedStocks.map((stock: Stock) => (
                                    <tr key={`stock-${stock.id}`} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900">{stock.name}</td>
                                        <td className="px-6 py-4">{stock.description}</td>
                                        <td className="px-6 py-4">{stock.deletedBy || 'N/A'}</td>
                                        <td className="px-6 py-4">{renderActions('stock', stock.id, stock.name)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {canSeeNewsTrash && deletedNews.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Deleted Market News</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                             <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Headline</th>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Deleted By</th>
                                    <th scope="col" className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deletedNews.map((newsItem: NewsItem) => (
                                    <tr key={`news-${newsItem.id}`} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900">{newsItem.title}</td>
                                        <td className="px-6 py-4">{newsItem.date}</td>
                                        <td className="px-6 py-4">{newsItem.deletedBy || 'N/A'}</td>
                                        <td className="px-6 py-4">{renderActions('news', newsItem.id, newsItem.title)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {canSeeClientsTrash && deletedClients.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                 <h2 className="text-xl font-bold text-slate-800 mb-4">Deleted Clients</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                             <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Company Name</th>
                                    <th scope="col" className="px-6 py-3">Contact Person</th>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Deleted By</th>
                                    <th scope="col" className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deletedClients.map((client: Client) => (
                                    <tr key={`client-${client.id}`} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900">{client.companyName || '-'}</td>
                                        <td className="px-6 py-4">{client.contactPerson || '-'}</td>
                                        <td className="px-6 py-4">{client.email}</td>
                                        <td className="px-6 py-4">{client.deletedBy || 'N/A'}</td>
                                        <td className="px-6 py-4">{renderActions('client', client.id, client.companyName || client.contactPerson || client.email)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {canSeeUsersTrash && deletedUsers.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                 <h2 className="text-xl font-bold text-slate-800 mb-4">Deleted Users</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                             <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Username</th>
                                    <th scope="col" className="px-6 py-3">Role</th>
                                    <th scope="col" className="px-6 py-3">Deleted By</th>
                                    <th scope="col" className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deletedUsers.map((user: User) => (
                                    <tr key={`user-${user.id}`} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900">{user.username}</td>
                                        <td className="px-6 py-4">{user.role}</td>
                                        <td className="px-6 py-4">{user.deletedBy || 'N/A'}</td>
                                        <td className="px-6 py-4">{renderActions('user', user.id, user.username)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {canSeeTransactionsTrash && deletedTransactions.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                 <h2 className="text-xl font-bold text-slate-800 mb-4">Deleted Transactions</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                             <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Description</th>
                                    <th scope="col" className="px-6 py-3">Client/Vendor</th>
                                    <th scope="col" className="px-6 py-3 text-right">Amount</th>
                                    <th scope="col" className="px-6 py-3">Deleted By</th>
                                    <th scope="col" className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deletedTransactions.map((t: Transaction) => (
                                    <tr key={`transaction-${t.id}`} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-6 py-4">{t.date}</td>
                                        <td className="px-6 py-4">{t.description}</td>
                                        <td className="px-6 py-4">{t.clientVendor}</td>
                                        <td className="px-6 py-4 text-right">{t.amount}</td>
                                        <td className="px-6 py-4">{t.deletedBy || 'N/A'}</td>
                                        <td className="px-6 py-4">{renderActions('transaction', t.id, t.description)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {itemToAction && (
                <Modal title={getModalTitle()} onClose={handleCancelAction}>
                    <div className="text-center">
                        <div className="text-slate-600 text-lg">
                            {getModalContent()}
                        </div>
                        <div className="flex justify-center space-x-4 mt-8">
                            <button
                                onClick={handleCancelAction}
                                className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAction}
                                className={`px-6 py-2 text-white rounded-lg transition-colors ${
                                    itemToAction.action === 'restore' 
                                    ? 'bg-green-600 hover:bg-green-700' 
                                    : 'bg-red-600 hover:bg-red-700'
                                }`}
                            >
                                {itemToAction.action === 'restore' ? 'Yes, Restore' : 'Yes, Delete Permanently'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default TrashPage;