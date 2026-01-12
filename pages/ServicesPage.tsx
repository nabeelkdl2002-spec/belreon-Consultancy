import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Stock } from '../types';
import Modal from '../components/Modal';
import { TrashIcon, ArrowLeftIcon, ChartPieIcon } from '../components/icons';
import { Link } from 'react-router-dom';

const PriceComparisonChart: React.FC<{ current: number; target: number; currency: string }> = ({ current, target, currency }) => {
    const maxVal = Math.max(current, target) * 1.1; // 10% buffer
    const currentPercent = (current / maxVal) * 100;
    const targetPercent = (target / maxVal) * 100;
    const isUpside = target > current;

    return (
        <div className="w-full mt-3">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>0</span>
                <span>Actual vs Target</span>
                <span>{currency}{maxVal.toFixed(0)}</span>
            </div>
            <div className="relative h-4 bg-slate-200 rounded-full w-full overflow-hidden">
                <div 
                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-full z-10"
                    style={{ width: `${currentPercent}%` }}
                    title={`Current: ${currency}${current}`}
                ></div>
                 <div 
                    className={`absolute top-0 bottom-0 w-1 z-20 ${isUpside ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ left: `${targetPercent}%` }}
                    title={`Target: ${currency}${target}`}
                ></div>
            </div>
             <div className="flex justify-between text-xs mt-1">
                <span className="text-blue-600 font-bold">{currency}{current}</span>
                <span className={`${isUpside ? 'text-green-600' : 'text-red-600'} font-bold`}>{currency}{target}</span>
            </div>
        </div>
    );
};

const StockForm: React.FC<{
  stock: Omit<Stock, 'id'> | Stock | null;
  onSave: (data: Omit<Stock, 'id'>) => void;
  onCancel: () => void;
}> = ({ stock, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: stock?.name || '',
    ticker: stock?.ticker || '',
    description: stock?.description || '',
    imageUrl: stock?.imageUrl || '',
    currentPrice: stock?.currentPrice || 0,
    targetPrice: stock?.targetPrice || 0,
    intrinsicValue: stock?.intrinsicValue || 0,
    ratios: stock?.ratios || '',
    currency: stock?.currency || '$',
    isDemo: stock?.isDemo || false,
    newsLink: stock?.newsLink || '',
    tradingViewLink: stock?.tradingViewLink || '',
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const autoGenerateTradingView = () => {
    if (!formData.ticker) {
        alert("Please enter a ticker symbol first.");
        return;
    }
    const link = `https://www.tradingview.com/symbols/${formData.ticker.toUpperCase()}/`;
    setFormData(prev => ({ ...prev, tradingViewLink: link }));
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
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.ticker || !formData.description || !formData.imageUrl) {
        alert('Please fill out all required fields.');
        return;
    }
    onSave({
        ...formData,
        currentPrice: Number(formData.currentPrice),
        targetPrice: Number(formData.targetPrice),
        intrinsicValue: Number(formData.intrinsicValue),
    });
  };

  const priceLeft = Math.max(0, Number(formData.targetPrice) - Number(formData.currentPrice));

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-1">
      <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Company Name</label>
            <input name="name" type="text" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg" required />
        </div>
        <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Ticker Symbol</label>
            <input name="ticker" type="text" value={formData.ticker} onChange={handleChange} className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg uppercase" required />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 items-center">
         <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Currency</label>
            <select name="currency" value={formData.currency} onChange={handleChange} className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg">
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
                <option value="₹">INR (₹)</option>
            </select>
         </div>
         <div className="flex items-center pt-4">
            <input id="isDemo" name="isDemo" type="checkbox" checked={formData.isDemo} onChange={handleChange} className="w-5 h-5 text-blue-600 border-gray-300 rounded" />
            <label htmlFor="isDemo" className="ml-2 block text-sm font-bold text-slate-700 underline decoration-yellow-400">Set as Public Demo Pick</label>
         </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 border-b pb-2">Analysis Data Labels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">current price -</label>
                <input name="currentPrice" type="number" step="0.01" value={formData.currentPrice} onChange={handleChange} className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg font-mono" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">target price -</label>
                <input name="targetPrice" type="number" step="0.01" value={formData.targetPrice} onChange={handleChange} className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg font-mono" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">intrinsic value -</label>
                <input name="intrinsicValue" type="number" step="0.01" value={formData.intrinsicValue} onChange={handleChange} className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg font-mono" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">price left for target -</label>
                <div className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-green-600 flex items-center">
                    {formData.currency}{priceLeft.toFixed(2)}
                </div>
              </div>
          </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 border-b pb-2">External Links</h3>
          <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">latest News -</label>
                <input name="newsLink" type="url" value={formData.newsLink} onChange={handleChange} placeholder="https://..." className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg text-sm" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-bold text-slate-700">TradingView Link (Auto-generated if empty) -</label>
                    <button type="button" onClick={autoGenerateTradingView} className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 font-bold uppercase tracking-widest">Generate Preview</button>
                </div>
                <input name="tradingViewLink" type="url" value={formData.tradingViewLink} onChange={handleChange} placeholder="Automatic based on Ticker" className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg text-sm" />
                <p className="text-[10px] text-slate-400 mt-1 italic">If left blank, clients will be redirected to TradingView's standard chart for {formData.ticker || 'the ticker'}.</p>
              </div>
          </div>
      </div>

      <div>
        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Key Ratios</label>
        <textarea name="ratios" rows={3} value={formData.ratios} onChange={handleChange} placeholder="P/E: 25.4&#10;ROE: 15%" className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg text-sm" />
      </div>

      <div>
        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Analysis Summary</label>
        <textarea name="description" rows={5} value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg text-sm leading-relaxed" required />
      </div>

      <div>
        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Thumbnail Image</label>
        {formData.imageUrl && (
            <div className="mb-3 rounded-lg overflow-hidden h-40 border border-slate-200">
                <img src={formData.imageUrl} alt="preview" className="w-full h-full object-cover" />
            </div>
        )}
        <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center w-full transition-colors">
            {isUploading ? <span>Uploading...</span> : <span>{formData.imageUrl ? 'Change Thumbnail' : 'Upload Thumbnail Image'}</span>}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t sticky bottom-0 bg-white">
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-slate-200 text-slate-800 font-bold rounded-lg hover:bg-slate-300">Cancel</button>
        <button type="submit" className="px-6 py-2 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 shadow-lg">Save Analysis</button>
      </div>
    </form>
  );
};

const ServicesPage: React.FC = () => {
  const { stocks, addStock, updateStock, deleteStock } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [stockToDelete, setStockToDelete] = useState<Stock | null>(null);

  const activeStocks = stocks.filter(s => !s.isDeleted);

  const handleAddNew = () => {
    setEditingStock(null);
    setIsModalOpen(true);
  };

  const handleEdit = (stock: Stock) => {
    setEditingStock(stock);
    setIsModalOpen(true);
  };
  
  const handleDeleteClick = (stock: Stock) => {
    setStockToDelete(stock);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (stockToDelete) {
      deleteStock(stockToDelete.id);
      setStockToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  const handleSave = (stockData: Omit<Stock, 'id'>) => {
    if (editingStock) {
      updateStock({ ...stockData, id: editingStock.id });
    } else {
      addStock(stockData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
        <Link to="/admin/app-modify" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors">
            <ArrowLeftIcon className="w-5 h-5" /> Back to App Modify
        </Link>
        <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Investment Picks</h1>
                <p className="text-sm text-slate-500 mt-1">Manage valuation models, price targets, and TradingView analysis.</p>
            </div>
            <button onClick={handleAddNew} className="w-full md:w-auto bg-blue-700 text-white font-black px-8 py-3 rounded-lg hover:bg-blue-800 transition-all shadow-lg">
            + CREATE NEW RECOMMENDATION
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeStocks.map((stock) => (
            <div key={stock.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all hover:shadow-xl hover:-translate-y-1 relative group">
                 {stock.isDemo && (
                    <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-[10px] font-black px-3 py-1 rounded-full z-10 shadow-sm">DEMO PICK</div>
                )}
                <div className="aspect-video overflow-hidden">
                    <img src={stock.imageUrl} alt={stock.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-black text-slate-800 leading-tight">{stock.name}</h3>
                            <span className="text-xs font-black text-slate-400 tracking-widest uppercase">{stock.ticker}</span>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-black text-blue-700">{stock.currency}{stock.currentPrice}</div>
                        </div>
                    </div>
                    
                    <PriceComparisonChart current={stock.currentPrice} target={stock.targetPrice} currency={stock.currency} />

                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider mb-1">Target Gap</span>
                            <span className="font-mono font-bold text-green-600">{stock.currency}{(stock.targetPrice - stock.currentPrice).toFixed(2)}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider mb-1">Intrinsic</span>
                            <span className="font-mono font-bold text-purple-600">{stock.currency}{stock.intrinsicValue}</span>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-slate-50/50 border-t flex justify-end items-center space-x-6">
                    <button onClick={() => handleEdit(stock)} className="text-xs font-black text-blue-700 hover:text-blue-900 uppercase tracking-widest">Edit Analysis</button>
                    <button onClick={() => handleDeleteClick(stock)} className="text-slate-300 hover:text-red-600 transition-colors"><TrashIcon className="w-5 h-5" /></button>
                </div>
            </div>
            ))}
        </div>

        {isModalOpen && (
            <Modal title={editingStock ? 'Edit Analysis Model' : 'New Stock Recommendation'} onClose={() => setIsModalOpen(false)}>
                <StockForm stock={editingStock} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        )}

        {isConfirmModalOpen && stockToDelete && (
            <Modal title="Confirm Deletion" onClose={() => setIsConfirmModalOpen(false)}>
                <div className="text-center p-4">
                    <p className="text-slate-600 text-lg">Move <span className="font-black text-slate-900">"{stockToDelete.name}"</span> to trash?</p>
                    <p className="text-sm text-slate-400 mt-2">Analysis data will be hidden from public view.</p>
                    <div className="flex justify-center space-x-4 mt-10">
                        <button onClick={() => setIsConfirmModalOpen(false)} className="px-8 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors">Cancel</button>
                        <button onClick={confirmDelete} className="px-8 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-lg transition-all">Move to Trash</button>
                    </div>
                </div>
            </Modal>
        )}
    </div>
  );
};

export default ServicesPage;