
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FinancialStatementItem, FinancialStatementCategory } from '../types';
import { TrashIcon, PlusIcon, DownloadIcon } from '../components/icons';
import Modal from '../components/Modal';

type ActiveTab = 'pnl' | 'balance-sheet';

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

// --- START: Visualization Components ---

const BarChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
    if (!data || data.length === 0 || data.every(d => d.value === 0)) return <div className="text-slate-500 w-full h-full flex items-center justify-center">No data for selected period.</div>;
    const maxValue = Math.max(...data.map(d => Math.abs(d.value)), 1); // Use 1 to avoid division by zero
    return (
        <div className="w-full h-full flex items-end justify-around gap-4 px-2 pt-8">
            {data.map(item => (
                <div key={item.label} className="flex-1 flex flex-col items-center justify-end text-center h-full">
                    <div className="relative w-full flex-grow flex items-end justify-center">
                        <div 
                            className="relative w-full rounded-t-md transition-all duration-500"
                            style={{ 
                                height: `${(Math.abs(item.value) / maxValue) * 100}%`,
                                backgroundColor: item.color 
                            }}
                            title={`${item.label}: ${formatCurrency(item.value)}`}
                        >
                            <div className="absolute bottom-full mb-1 w-full text-center text-xs font-bold text-black whitespace-nowrap">
                                {formatCurrency(item.value)}
                            </div>
                        </div>
                    </div>
                    <span 
                        className="text-xs font-bold text-black mt-2 w-full leading-tight break-words"
                        style={{ wordBreak: 'break-word', hyphens: 'auto' }}
                    >
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
};


const PieChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
    const positiveData = data.filter(d => d.value > 0);
    if (!positiveData || positiveData.length === 0) return <div className="text-slate-500 w-full h-full flex items-center justify-center">No positive data for pie chart.</div>;
    const total = positiveData.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return <div className="text-slate-500 w-full h-full flex items-center justify-center">No data to display.</div>;

    let cumulativePercent = 0;
    const gradientParts = positiveData.map(item => {
        const percent = (item.value / total) * 100;
        const part = `${item.color} ${cumulativePercent}% ${cumulativePercent + percent}%`;
        cumulativePercent += percent;
        return part;
    });

    return (
        <div className="w-full h-full flex items-center justify-center gap-8 p-4">
            <div className="w-40 h-40 rounded-full flex-shrink-0" style={{ background: `conic-gradient(${gradientParts.join(', ')})` }}></div>
            <div className="space-y-2 overflow-y-auto max-h-full">
                {positiveData.map(item => (
                    <div key={item.label} className="flex items-center">
                        <div className="w-4 h-4 rounded-sm mr-2 flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm font-bold text-black">{item.label}: {formatCurrency(item.value)} ({((item.value / total) * 100).toFixed(1)}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LineChart: React.FC<{ data: { date: string; value: number }[] }> = ({ data }) => {
    if (!data || data.length < 2) return <div className="text-slate-500 w-full h-full flex items-center justify-center">Not enough data for a trend line.</div>;

    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const width = 500;
    const height = 300;
    const padding = 40;

    const values = sortedData.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue;
    
    const minDate = new Date(sortedData[0].date).getTime();
    const maxDate = new Date(sortedData[sortedData.length - 1].date).getTime();
    const dateRange = maxDate - minDate;

    const getX = (dateStr: string) => padding + (dateRange > 0 ? ((new Date(dateStr).getTime() - minDate) / dateRange) * (width - 2 * padding) : (width - 2 * padding) / 2);
    const getY = (value: number) => (height - padding) - (valueRange > 0 ? ((value - minValue) / valueRange) * (height - 2 * padding) : (height - 2 * padding) / 2);

    const points = sortedData.map(d => `${getX(d.date)},${getY(d.value)}`).join(' ');

    return (
        <div className="w-full h-full flex flex-col items-center">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#d1d5db" />
                <text x={padding - 10} y={padding + 5} textAnchor="end" fontSize="10" className="font-bold text-black" fill="currentColor">{formatCurrency(maxValue)}</text>
                <text x={padding - 10} y={height - padding} textAnchor="end" fontSize="10" className="font-bold text-black" fill="currentColor">{formatCurrency(minValue)}</text>
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#d1d5db" />
                 <text x={padding} y={height - padding + 15} textAnchor="start" fontSize="10" className="font-bold text-black" fill="currentColor">{sortedData[0].date}</text>
                 <text x={width-padding} y={height - padding + 15} textAnchor="end" fontSize="10" className="font-bold text-black" fill="currentColor">{sortedData[sortedData.length - 1].date}</text>
                <polyline fill="none" stroke="#3b82f6" strokeWidth="2" points={points} />
            </svg>
        </div>
    );
};

// --- END: Visualization Components ---


const AddTransactionModal: React.FC<{
    onSave: (data: { entries: Omit<FinancialStatementItem, 'id' | 'transactionId'>[] }) => void;
    onClose: () => void;
    chartOfAccounts: ReturnType<typeof useAuth>['chartOfAccounts'];
}> = ({ onSave, onClose, chartOfAccounts }) => {
    const [transactionType, setTransactionType] = useState('income'); // income, expense, transfer, advance
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    const [revenueAccount, setRevenueAccount] = useState('');
    const [expenseAccount, setExpenseAccount] = useState('');
    const [fromAccount, setFromAccount] = useState('');
    const [toAccount, setToAccount] = useState('');

    const allBalanceSheetAccounts = [...chartOfAccounts.assets, ...chartOfAccounts.liabilities, ...chartOfAccounts.equity];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            alert("Please enter a valid, positive amount.");
            return;
        }

        let entries: Omit<FinancialStatementItem, 'id' | 'transactionId' | 'isDeleted'>[] = [];

        try {
            switch (transactionType) {
                case 'income':
                    if (!revenueAccount || !toAccount) throw new Error("Please select all accounts.");
                    entries.push({ date, particulars: revenueAccount, description, amount: numAmount, category: FinancialStatementCategory.Revenue });
                    entries.push({ date, particulars: toAccount, description, amount: numAmount, category: FinancialStatementCategory.Asset });
                    break;
                case 'expense':
                    if (!expenseAccount || !fromAccount) throw new Error("Please select all accounts.");
                    entries.push({ date, particulars: expenseAccount, description, amount: numAmount, category: FinancialStatementCategory.Expense });
                    entries.push({ date, particulars: fromAccount, description, amount: -numAmount, category: FinancialStatementCategory.Asset });
                    break;
                case 'advance':
                    if (!toAccount) throw new Error("Please select a deposit account.");
                    entries.push({ date, particulars: 'Unearned Revenue', description, amount: numAmount, category: FinancialStatementCategory.Liability });
                    entries.push({ date, particulars: toAccount, description, amount: numAmount, category: FinancialStatementCategory.Asset });
                    break;
                case 'transfer':
                    if (!fromAccount || !toAccount) throw new Error("Please select all accounts.");
                    entries.push({ date, particulars: fromAccount, description, amount: -numAmount, category: FinancialStatementCategory.Asset });
                    entries.push({ date, particulars: toAccount, description, amount: numAmount, category: FinancialStatementCategory.Asset });
                    break;
                default:
                     throw new Error("Invalid transaction type.");
            }
             onSave({ entries });
             onClose();
        } catch (error: any) {
            alert(error.message);
        }
    };

    const renderFormFields = () => {
        switch (transactionType) {
            case 'income':
                return <>
                    <AccountSelect listId="revenue-accounts" label="Revenue Account" value={revenueAccount} onChange={setRevenueAccount} options={chartOfAccounts.revenue} placeholder="Select or type revenue type" />
                    <AccountSelect listId="asset-accounts-deposit" label="Deposit To" value={toAccount} onChange={setToAccount} options={chartOfAccounts.assets} placeholder="Select or type asset account" />
                </>;
            case 'expense':
                return <>
                    <AccountSelect listId="expense-accounts" label="Expense Account" value={expenseAccount} onChange={setExpenseAccount} options={chartOfAccounts.expenses} placeholder="Select or type expense type" />
                    <AccountSelect listId="asset-accounts-paid" label="Paid From" value={fromAccount} onChange={setFromAccount} options={chartOfAccounts.assets} placeholder="Select or type asset account" />
                </>;
            case 'advance':
                 return <>
                    <AccountSelect listId="asset-accounts-advance" label="Deposit To" value={toAccount} onChange={setToAccount} options={chartOfAccounts.assets} placeholder="Select or type asset account" />
                    <div><p className="text-sm text-slate-500 p-2 bg-slate-100 dark:bg-slate-700/50 rounded-md">This will create a Liability ("Unearned Revenue") on your Balance Sheet until the work is completed.</p></div>
                </>;
            case 'transfer':
                 return <>
                    <AccountSelect listId="bs-accounts-from" label="From Account" value={fromAccount} onChange={setFromAccount} options={allBalanceSheetAccounts} placeholder="Select or type source account" />
                    <AccountSelect listId="bs-accounts-to" label="To Account" value={toAccount} onChange={setToAccount} options={allBalanceSheetAccounts} placeholder="Select or type destination account" />
                </>;
            default: return null;
        }
    };
    
    const AccountSelect: React.FC<{label: string, value: string, onChange: (val: string) => void, options: string[], placeholder: string, listId: string}> = ({label, value, onChange, options, placeholder, listId}) => (
        <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
            <input
                type="text"
                list={listId}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full form-input"
                required
            />
            <datalist id={listId}>
                {options.sort().map(opt => <option key={opt} value={opt} />)}
            </datalist>
        </div>
    );

    return (
        <Modal title="Add New Transaction" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Transaction Type</label>
                    <select value={transactionType} onChange={e => setTransactionType(e.target.value)} className="w-full form-input">
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                        <option value="advance">Advance Received</option>
                        <option value="transfer">Balance Sheet Transfer</option>
                    </select>
                </div>
                <div><label className="block text-sm font-medium text-slate-600 mb-1">Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full form-input" required /></div>
                <div><label className="block text-sm font-medium text-slate-600 mb-1">Description (e.g., Client Name, Invoice #)</label><input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full form-input" required /></div>
                <div><label className="block text-sm font-medium text-slate-600 mb-1">Amount</label><input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full form-input" required /></div>
                {renderFormFields()}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">Save Transaction</button>
                </div>
            </form>
        </Modal>
    );
};

// Main Page
const FinancialsPage: React.FC = () => {
    const { profitAndLossData, balanceSheetData, addFinancialTransaction, deleteFinancialTransaction, chartOfAccounts } = useAuth();
    const [activeTab, setActiveTab] = useState<ActiveTab>('pnl');
    const [filters, setFilters] = useState({ month: '', year: '', startDate: '', endDate: '' });
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<FinancialStatementItem | null>(null);
    const [vizOptions, setVizOptions] = useState({ statement: 'pnl', dataType: 'revenue-vs-expense', chartType: 'bar' });
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const clearFilters = () => setFilters({ month: '', year: '', startDate: '', endDate: '' });

    const filterData = useCallback((data: FinancialStatementItem[]) => {
        return data.filter(item => {
            if (item.isDeleted) return false;
            const itemDate = new Date(item.date);
            if (filters.startDate && filters.endDate) {
                return itemDate >= new Date(filters.startDate) && itemDate <= new Date(filters.endDate);
            }
            if (filters.year && item.date.substring(0, 4) !== filters.year) return false;
            if (filters.month && (itemDate.getMonth() + 1) !== parseInt(filters.month)) return false;
            return true;
        });
    }, [filters]);

    const filteredPnlData = useMemo(() => filterData(profitAndLossData), [profitAndLossData, filterData]);
    const filteredBalanceSheetData = useMemo(() => filterData(balanceSheetData), [balanceSheetData, filterData]);

    const pnlRevenue = useMemo(() => filteredPnlData.filter(i => i.category === FinancialStatementCategory.Revenue).reduce((sum, i) => sum + i.amount, 0), [filteredPnlData]);
    const pnlExpenses = useMemo(() => filteredPnlData.filter(i => i.category === FinancialStatementCategory.Expense).reduce((sum, i) => sum + i.amount, 0), [filteredPnlData]);
    const netProfit = pnlRevenue - pnlExpenses;
    const bsAssets = useMemo(() => filteredBalanceSheetData.filter(i => i.category === FinancialStatementCategory.Asset).reduce((sum, i) => sum + i.amount, 0), [filteredBalanceSheetData]);
    const bsLiabilities = useMemo(() => filteredBalanceSheetData.filter(i => i.category === FinancialStatementCategory.Liability).reduce((sum, i) => sum + i.amount, 0), [filteredBalanceSheetData]);

    const handleSaveTransaction = (data: { entries: Omit<FinancialStatementItem, 'id' | 'transactionId'>[] }) => {
        addFinancialTransaction(data);
    };
    
    const confirmDelete = () => {
        if (itemToDelete) {
          deleteFinancialTransaction(itemToDelete.transactionId);
          setItemToDelete(null);
        }
    };
    
    const exportToCSV = (data: FinancialStatementItem[], filename: string) => {
        const headers = ["Date", "Account", "Description", "Category", "Amount"];
        const rows = data.map(i => [i.date, i.particulars, i.description || '', i.category, i.amount]);
        let csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const years = [...new Set([...profitAndLossData, ...balanceSheetData].map(i => i.date.substring(0, 4)))].sort((a,b) => b.localeCompare(a));
    
    // Visualization Logic
    const handleVizChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setVizOptions(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const newDataType = vizOptions.statement === 'pnl' ? 'revenue-vs-expense' : 'assets-vs-liabilities';
        setVizOptions(prev => ({ ...prev, dataType: newDataType, chartType: 'bar' }));
    }, [vizOptions.statement]);

    useEffect(() => {
        const isTrend = vizOptions.dataType.includes('trend');
        if (isTrend && vizOptions.chartType !== 'line') {
            setVizOptions(prev => ({ ...prev, chartType: 'line' }));
        } else if (!isTrend && vizOptions.chartType === 'line') {
            setVizOptions(prev => ({ ...prev, chartType: 'bar' }));
        }
    }, [vizOptions.dataType]);

    const chartData = useMemo(() => {
        const groupByCategory = (data: FinancialStatementItem[], category: FinancialStatementCategory) => Object.entries(data.filter(i => i.category === category).reduce((acc, item) => {
            acc[item.particulars] = (acc[item.particulars] || 0) + item.amount;
            return acc;
        }, {} as Record<string, number>));
        
        const colors = ['#3b82f6', '#10b981', '#ef4444', '#f97316', '#8b5cf6', '#ec4899', '#64748b', '#f59e0b'];
        const mapToChartData = (data: [string, number][]) => data.map(([label, value], i) => ({ label, value, color: colors[i % colors.length] }));

        switch(vizOptions.dataType) {
            case 'revenue-vs-expense': return [{ label: 'Revenue', value: pnlRevenue, color: '#10b981' }, { label: 'Expenses', value: pnlExpenses, color: '#ef4444' }];
            case 'revenue-breakdown': return mapToChartData(groupByCategory(filteredPnlData, FinancialStatementCategory.Revenue));
            case 'expense-breakdown': return mapToChartData(groupByCategory(filteredPnlData, FinancialStatementCategory.Expense));
            case 'profit-trend': 
                const trend = filteredPnlData.reduce((acc, item) => {
                    const date = item.date;
                    const amount = item.category === FinancialStatementCategory.Revenue ? item.amount : -item.amount;
                    acc[date] = (acc[date] || 0) + amount;
                    return acc;
                }, {} as Record<string, number>);
                return Object.entries(trend).map(([date, value]) => ({ date, value }));
            case 'assets-vs-liabilities': return [{ label: 'Assets', value: bsAssets, color: '#3b82f6' }, { label: 'Liabilities', value: bsLiabilities, color: '#f97316' }];
            case 'asset-breakdown': return mapToChartData(groupByCategory(filteredBalanceSheetData, FinancialStatementCategory.Asset));
            case 'liability-breakdown': return mapToChartData(groupByCategory(filteredBalanceSheetData, FinancialStatementCategory.Liability));
            default: return [];
        }
    }, [vizOptions.dataType, filteredPnlData, filteredBalanceSheetData, pnlRevenue, pnlExpenses, bsAssets, bsLiabilities]);
    
    const chartTotal = useMemo(() => {
        switch(vizOptions.dataType) {
            case 'revenue-vs-expense': return { label: 'Net Profit', value: netProfit };
            case 'revenue-breakdown': return { label: 'Total Revenue', value: pnlRevenue };
            case 'expense-breakdown': return { label: 'Total Expenses', value: pnlExpenses };
            case 'assets-vs-liabilities': return { label: 'Net Assets (Assets - Liabilities)', value: bsAssets - bsLiabilities };
            case 'asset-breakdown': return { label: 'Total Assets', value: bsAssets };
            case 'liability-breakdown': return { label: 'Total Liabilities', value: bsLiabilities };
            case 'profit-trend': 
                const totalChange = (chartData as { date: string; value: number }[]).reduce((sum, item) => sum + item.value, 0);
                return { label: 'Total Net Change', value: totalChange };
            default: return null;
        }
    }, [vizOptions.dataType, netProfit, pnlRevenue, pnlExpenses, bsAssets, bsLiabilities, chartData]);

    const pnlDataOptions = [{ value: 'revenue-vs-expense', label: 'Revenue vs. Expenses' }, { value: 'revenue-breakdown', label: 'Revenue Breakdown' }, { value: 'expense-breakdown', label: 'Expense Breakdown' }, { value: 'profit-trend', label: 'Profit Trend' }];
    const bsDataOptions = [{ value: 'assets-vs-liabilities', label: 'Assets vs. Liabilities' }, { value: 'asset-breakdown', label: 'Asset Breakdown' }, { value: 'liability-breakdown', label: 'Liability Breakdown' }];
    const currentDataOptions = vizOptions.statement === 'pnl' ? pnlDataOptions : bsDataOptions;

    const renderChart = () => {
        const isTrend = vizOptions.dataType.includes('trend');
        switch (vizOptions.chartType) {
            case 'bar': return <BarChart data={isTrend ? [] : chartData as any} />;
            case 'pie': return <PieChart data={isTrend ? [] : chartData as any} />;
            case 'line': return <LineChart data={isTrend ? chartData as any : []} />;
            default: return null;
        }
    };
    
    const renderTable = (title: string, items: FinancialStatementItem[], total: number) => (
         <div className="mb-8">
            <h4 className="text-lg font-semibold text-slate-800 mb-2">{title}</h4>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-3 w-32">{item.date}</td>
                                <td className="px-6 py-3 font-medium text-slate-900">
                                    {item.particulars}
                                    {item.description && <span className="block text-xs text-slate-500 font-normal">{item.description}</span>}
                                </td>
                                <td className="px-6 py-3 text-right w-40">{formatCurrency(item.amount)}</td>
                                <td className="px-6 py-3 text-center w-28">
                                    <div className="flex items-center justify-center space-x-3">
                                        <button onClick={() => setItemToDelete(item)} className="text-slate-400 hover:text-red-600"><TrashIcon className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-slate-50 font-bold text-slate-800">
                            <td colSpan={2} className="px-6 py-3 text-right">Total {title}</td>
                            <td className="px-6 py-3 text-right">{formatCurrency(total)}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
    

  return (
    <>
      {isFormModalOpen && <AddTransactionModal onClose={() => setIsFormModalOpen(false)} onSave={handleSaveTransaction} chartOfAccounts={chartOfAccounts} />}
      {itemToDelete && (
        <Modal title="Confirm Transaction Deletion" onClose={() => setItemToDelete(null)}>
             <div className="text-center">
                <p className="text-slate-600 text-lg">Move the entire transaction related to <span className="font-bold text-slate-800">"{itemToDelete.description || itemToDelete.particulars}"</span> to trash?</p>
                <p className="text-sm text-slate-500 mt-2">Both sides of the entry will be deleted.</p>
                <div className="flex justify-center space-x-4 mt-8">
                    <button onClick={() => setItemToDelete(null)} className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300">Cancel</button>
                    <button onClick={confirmDelete} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Move to Trash</button>
                </div>
            </div>
        </Modal>
      )}

      <div className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Data Visualization</h3>
            <div className="flex flex-wrap items-end gap-4 mb-4 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border dark:border-slate-700">
                <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">Statement</label>
                    <select name="statement" value={vizOptions.statement} onChange={handleVizChange} className="form-input">
                        <option value="pnl">Profit & Loss</option>
                        <option value="balance-sheet">Balance Sheet</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">Data</label>
                    <select name="dataType" value={vizOptions.dataType} onChange={handleVizChange} className="form-input">
                       {currentDataOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">Chart Type</label>
                    <select name="chartType" value={vizOptions.chartType} onChange={handleVizChange} className="form-input">
                        <option value="bar" disabled={vizOptions.dataType.includes('trend')}>Bar Chart</option>
                        <option value="pie" disabled={vizOptions.dataType.includes('trend')}>Pie Chart</option>
                        <option value="line" disabled={!vizOptions.dataType.includes('trend')}>Trend Line</option>
                    </select>
                </div>
            </div>
            <div className="mt-4 w-full max-w-2xl mx-auto">
                {chartTotal && (
                     <div className="text-right -mb-4 relative z-10">
                         <span className="text-sm font-bold text-black block">{chartTotal.label}</span>
                         <span className={`text-2xl font-bold ${chartTotal.value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                             {formatCurrency(chartTotal.value)}
                         </span>
                    </div>
                )}
                <div className="h-64 w-full relative">
                   {renderChart()}
                </div>
            </div>
        </div>


        <div className="bg-white p-6 rounded-xl shadow-md">
            {/* Tabs */}
            <div className="flex border-b border-slate-200">
                <button onClick={() => setActiveTab('pnl')} className={`px-6 py-3 font-semibold ${activeTab === 'pnl' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}>Profit & Loss Account</button>
                <button onClick={() => setActiveTab('balance-sheet')} className={`px-6 py-3 font-semibold ${activeTab === 'balance-sheet' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}>Balance Sheet</button>
            </div>

            {/* Filters and Actions */}
            <div className="bg-slate-50 p-4 rounded-b-lg flex flex-wrap items-center gap-4 mb-6">
                <select name="month" value={filters.month} onChange={handleFilterChange} className="form-input w-32"><option value="">Month</option>{[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)}</select>
                <select name="year" value={filters.year} onChange={handleFilterChange} className="form-input w-28"><option value="">Year</option>{years.map(y => <option key={y} value={y}>{y}</option>)}</select>
                <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="form-input"/>
                <span className="text-slate-500">-</span>
                <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="form-input"/>
                <button onClick={clearFilters} className="text-sm text-slate-600 hover:text-blue-600">Till Date</button>
                <div className="ml-auto flex items-center gap-4">
                     <button onClick={() => setIsFormModalOpen(true)} className="flex items-center gap-2 bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-800"><PlusIcon className="w-5 h-5"/> Add Transaction</button>
                     <button onClick={() => exportToCSV(activeTab === 'pnl' ? filteredPnlData : filteredBalanceSheetData, activeTab === 'pnl' ? 'profit_and_loss' : 'balance_sheet')} className="flex items-center gap-2 bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700"><DownloadIcon className="w-5 h-5"/> Export</button>
                </div>
            </div>

            {/* Content */}
            <div className="mt-6">
                {activeTab === 'pnl' && (
                    <div>
                        {renderTable("Revenue", filteredPnlData.filter(i => i.category === FinancialStatementCategory.Revenue), pnlRevenue)}
                        {renderTable("Expenses", filteredPnlData.filter(i => i.category === FinancialStatementCategory.Expense), pnlExpenses)}
                        <div className="text-right mt-4 p-4 bg-blue-50 dark:bg-slate-700 rounded-lg">
                            <span className="text-lg font-bold text-blue-800 dark:text-blue-300">Net Profit / (Loss): {formatCurrency(netProfit)}</span>
                        </div>
                    </div>
                )}
                {activeTab === 'balance-sheet' && (
                    <div>
                        {renderTable("Assets", filteredBalanceSheetData.filter(i => i.category === FinancialStatementCategory.Asset), bsAssets)}
                        {renderTable("Liabilities & Equity", filteredBalanceSheetData.filter(i => i.category === FinancialStatementCategory.Liability), bsLiabilities)}
                    </div>
                )}
            </div>
        </div>
      </div>
      <style>{`
      .form-input {
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
        border-color: #9ca3af;
      }
      .dark .form-input {
        background-color: #334155 !important;
        color: #f1f5f9 !important;
        border-color: #475569 !important;
      }
      .dark .form-input:focus, .dark .form-input:focus-visible {
        border-color: #64748b !important;
      }
      .form-input:not(select) {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
      }
    `}</style>
    </>
  );
};

export default FinancialsPage;
