import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChartBarIcon, 
  BanknotesIcon, 
  UsersIcon, 
  BriefcaseIcon, 
  StarIcon,
  PencilSquareIcon,
  ChevronDownIcon,
  DownloadIcon
} from '../components/icons';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';

type TabType = 'overview' | 'clients' | 'enquiries' | 'subscriptions' | 'roadmap';

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  tasks: string[];
}

interface FinopsClient {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  plan: string;
  isTrial: boolean;
  trialStart?: string;
  trialEnd?: string;
  isPremium: boolean;
  status: 'Active' | 'Pending' | 'Cancelled' | 'Not Interested';
}

interface FinopsEnquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  plan: string;
  message: string;
  date: string;
  status: 'contacted' | 'pending' | 'closed';
}

const AdminFinopsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [editingClient, setEditingClient] = useState<FinopsClient | null>(null);
  const [viewingEnquiry, setViewingEnquiry] = useState<FinopsEnquiry | null>(null);
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([
    {
      id: 'profile',
      title: 'Company Profile Setup',
      description: 'Configure basic business identity and tax details.',
      status: 'current',
      tasks: ['Legal name & Address', 'Logo upload', 'Functional currency', 'Tax registration (GST/VAT)']
    },
    {
      id: 'coa',
      title: 'Chart of Accounts (COA)',
      description: 'Define your financial skeleton and categories.',
      status: 'upcoming',
      tasks: ['Retail Sales', 'Cost of Goods Sold (COGS)', 'Rent & Utilities', 'Payroll']
    },
    {
      id: 'inventory',
      title: 'Inventory & Product Catalog',
      description: 'Import stock list and define SKU thresholds.',
      status: 'upcoming',
      tasks: ['Import stock list', 'Define SKUs & Prices', 'Low Stock alerts']
    },
    {
      id: 'stakeholders',
      title: 'Stakeholder Onboarding',
      description: 'Add suppliers and build customer database.',
      status: 'upcoming',
      tasks: ['Vendor onboarding', 'Customer database', 'Loyalty tracking']
    },
    {
      id: 'balances',
      title: 'Opening Balances',
      description: 'Input "Day Zero" financial data.',
      status: 'upcoming',
      tasks: ['Bank balances', 'Stock on hand value', 'Outstanding debts/credits']
    },
    {
      id: 'transactions',
      title: 'Daily Transaction Recording',
      description: 'Begin live operations and log arrivals.',
      status: 'upcoming',
      tasks: ['Record sales', 'Expense receipts', 'Inventory arrivals']
    },
    {
      id: 'reporting',
      title: 'Automated Reporting & Review',
      description: 'Analyze performance and cash flow health.',
      status: 'upcoming',
      tasks: ['Profit & Loss statement', 'Product performance', 'Cash flow health']
    }
  ]);

  // Mock Data
  const [clients, setClients] = useState<FinopsClient[]>([
    { id: 1, name: 'Retail Corp', phone: '+1 234 567 890', email: 'contact@retailcorp.com', address: '123 Business Ave, NY', plan: 'Enterprise', isTrial: false, isPremium: true, status: 'Active' },
    { id: 2, name: 'Urban Threads', phone: '+1 987 654 321', email: 'sarah@urbanthreads.com', address: '456 Fashion St, LA', plan: 'Professional', isTrial: true, trialStart: '2026-04-01', trialEnd: '2026-04-15', isPremium: false, status: 'Pending' },
    { id: 3, name: 'TechStop', phone: '+1 555 000 111', email: 'mike@techstop.com', address: '789 Tech Hub, SF', plan: 'Starter', isTrial: false, isPremium: true, status: 'Active' },
    { id: 4, name: 'Fresh & Green', phone: '+1 111 222 333', email: 'elena@freshgreen.com', address: '321 Organic Way, CHI', plan: 'Professional', isTrial: false, isPremium: false, status: 'Cancelled' },
  ]);

  const [enquiries, setEnquiries] = useState<FinopsEnquiry[]>([
    { id: 1, name: 'Retail Corp', email: 'contact@retailcorp.com', phone: '+1 234 567 890', plan: 'Enterprise', message: 'Interested in multi-store management.', date: '2026-04-10', status: 'pending' },
    { id: 2, name: 'Urban Threads', email: 'sarah@urbanthreads.com', phone: '+1 987 654 321', plan: 'Professional', message: 'Need help with inventory import.', date: '2026-04-09', status: 'contacted' },
    { id: 3, name: 'TechStop', email: 'mike@techstop.com', phone: '+1 555 000 111', plan: 'Starter', message: 'Trialing the software.', date: '2026-04-08', status: 'closed' },
  ]);

  const subscriptions = [
    { id: 1, client: 'Urban Threads', plan: 'Professional', amount: '$79/mo', nextBilling: '2026-05-10', status: 'active' },
    { id: 2, client: 'TechStop', plan: 'Starter', amount: '$29/mo', nextBilling: '2026-05-08', status: 'active' },
    { id: 3, client: 'Fresh & Green', plan: 'Professional', amount: '$79/mo', nextBilling: '2026-05-07', status: 'active' },
  ];

  const updateClientStatus = (id: number, status: FinopsClient['status']) => {
    setClients(clients.map(c => c.id === id ? { ...c, status } : c));
    setEditingClient(null);
  };

  const updateEnquiryStatus = (id: number, status: FinopsEnquiry['status']) => {
    setEnquiries(enquiries.map(e => e.id === id ? { ...e, status } : e));
    setViewingEnquiry(null);
  };

  const handleExport = (type: TabType) => {
    let headers: string[] = [];
    let rows: any[][] = [];
    let filename = `finops_${type}_export.csv`;

    if (type === 'clients') {
      headers = ["Name", "Email", "Phone", "Address", "Plan", "Trial", "Premium", "Status"];
      rows = clients.map(c => [c.name, c.email, c.phone, c.address, c.plan, c.isTrial, c.isPremium, c.status]);
    } else if (type === 'enquiries') {
      headers = ["Name", "Email", "Phone", "Plan", "Date", "Status", "Message"];
      rows = enquiries.map(e => [e.name, e.email, e.phone, e.plan, e.date, e.status, e.message.replace(/,/g, ';')]);
    } else if (type === 'subscriptions') {
      headers = ["Client", "Plan", "Amount", "Next Billing", "Status"];
      rows = subscriptions.map(s => [s.client, s.plan, s.amount, s.nextBilling, s.status]);
    }

    if (headers.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">FinOps Management</h1>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          {[
            { id: 'overview', label: 'Overview', icon: <ChartBarIcon className="w-4 h-4" /> },
            { id: 'clients', label: 'Clients', icon: <UsersIcon className="w-4 h-4" /> },
            { id: 'enquiries', label: 'Enquiries', icon: <BriefcaseIcon className="w-4 h-4" /> },
            { id: 'subscriptions', label: 'Billing', icon: <BanknotesIcon className="w-4 h-4" /> },
            { id: 'roadmap', label: 'Roadmap', icon: <ChartBarIcon className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: '$124,500', change: '+12.5%', icon: <BanknotesIcon className="w-6 h-6" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Active Subscriptions', value: '842', change: '+5.2%', icon: <UsersIcon className="w-6 h-6" />, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Pending Enquiries', value: '24', change: '-12%', icon: <BriefcaseIcon className="w-6 h-6" />, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Conversion Rate', value: '18.4%', change: '+2.1%', icon: <ChartBarIcon className="w-6 h-6" />, color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map((stat, i) => (
                <Card key={i} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                      {stat.icon}
                    </div>
                    <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-tight">Recent Activity</h3>
                <div className="space-y-4">
                  {enquiries.slice(0, 3).map((enquiry, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{enquiry.name}</h4>
                        <p className="text-xs text-slate-500">{enquiry.email}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-900">{enquiry.plan}</div>
                        <div className={`text-[10px] font-black uppercase tracking-widest ${enquiry.status === 'pending' ? 'text-amber-600' : enquiry.status === 'contacted' ? 'text-blue-600' : 'text-slate-400'}`}>
                          {enquiry.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-tight">Subscription Distribution</h3>
                <div className="space-y-6">
                  {[
                    { label: 'Starter', count: 420, percentage: 50, color: 'bg-slate-400' },
                    { label: 'Professional', count: 340, percentage: 40, color: 'bg-emerald-500' },
                    { label: 'Enterprise', count: 82, percentage: 10, color: 'bg-slate-900' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{item.label}</span>
                        <span className="text-xs font-black text-slate-900">{item.count} ({item.percentage}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`${item.color} h-full`} style={{ width: `${item.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'clients' && (
          <motion.div 
            key="clients"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => handleExport('clients')}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all border border-emerald-100"
              >
                <DownloadIcon className="w-4 h-4" />
                Excel Export
              </button>
            </div>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <th className="px-6 py-4">Client Info</th>
                      <th className="px-6 py-4">Contact & Address</th>
                      <th className="px-6 py-4">Plan Details</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {clients.map((client) => (
                      <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="font-bold text-slate-900 text-sm">{client.name}</div>
                            {client.isPremium && (
                              <div className="text-amber-500" title="Premium Member">
                                <StarIcon className="w-4 h-4 fill-current" />
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">{client.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-slate-700 font-medium">{client.phone}</div>
                          <div className="text-xs text-slate-500 truncate max-w-[200px]">{client.address}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900">{client.plan}</span>
                            {client.isTrial && (
                              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-tighter">On Trial</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge 
                            status={
                              client.status === 'Active' ? 'active' : 
                              client.status === 'Pending' ? 'pending' : 
                              client.status === 'Cancelled' ? 'closed' : 'inactive'
                            } 
                            text={client.status} 
                          />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setEditingClient(client)}
                            className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                          >
                            <PencilSquareIcon className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'enquiries' && (
          <motion.div 
            key="enquiries"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => handleExport('enquiries')}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all border border-emerald-100"
              >
                <DownloadIcon className="w-4 h-4" />
                Excel Export
              </button>
            </div>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4">Plan</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {enquiries.map((enquiry) => (
                      <tr key={enquiry.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 text-sm">{enquiry.name}</div>
                          <div className="text-xs text-slate-500">{enquiry.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-slate-700">{enquiry.plan}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-slate-500">{enquiry.date}</span>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={enquiry.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setViewingEnquiry(enquiry)}
                            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-widest"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'subscriptions' && (
          <motion.div 
            key="subscriptions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => handleExport('subscriptions')}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all border border-emerald-100"
              >
                <DownloadIcon className="w-4 h-4" />
                Excel Export
              </button>
            </div>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4">Plan</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Next Billing</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {subscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 text-sm">{sub.client}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-slate-700">{sub.plan}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-slate-900 font-black">{sub.amount}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-slate-500">{sub.nextBilling}</span>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={sub.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'roadmap' && (
          <motion.div 
            key="roadmap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="max-w-4xl mx-auto">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Implementation Roadmap</h2>
                <p className="text-slate-500 font-medium">Follow these steps to fully configure your FinOps ecosystem.</p>
              </div>

              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-slate-100 hidden md:block"></div>

                <div className="space-y-12">
                  {roadmapSteps.map((step, idx) => (
                    <div key={step.id} className="relative flex flex-col md:flex-row gap-8 items-start">
                      {/* Step Indicator */}
                      <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg transition-all ${
                        step.status === 'completed' ? 'bg-emerald-500 text-white' :
                        step.status === 'current' ? 'bg-slate-900 text-white ring-4 ring-slate-100' :
                        'bg-white text-slate-300 border-2 border-slate-100'
                      }`}>
                        {step.status === 'completed' ? '✓' : idx + 1}
                      </div>

                      {/* Content Card */}
                      <Card className={`flex-1 p-8 transition-all border-2 ${
                        step.status === 'current' ? 'border-slate-900 shadow-xl' : 'border-transparent'
                      }`}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                          <div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{step.title}</h3>
                            <p className="text-slate-500 text-sm mt-1">{step.description}</p>
                          </div>
                          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            step.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                            step.status === 'current' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {step.status}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {step.tasks.map((task, tIdx) => (
                            <div key={tIdx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-slate-200 transition-colors cursor-pointer">
                              <div className="w-5 h-5 rounded-md border-2 border-slate-200 flex items-center justify-center group-hover:border-slate-400 transition-colors">
                                <div className="w-2 h-2 bg-slate-900 rounded-sm opacity-0 group-hover:opacity-10 transition-opacity"></div>
                              </div>
                              <span className="text-xs font-bold text-slate-700">{task}</span>
                            </div>
                          ))}
                        </div>

                        {step.status === 'current' && (
                          <button className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-200">
                            Configure Now
                          </button>
                        )}
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Client Status Modal */}
      <AnimatePresence>
        {editingClient && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Update Client Status</h3>
              <p className="text-slate-500 text-sm mb-6">Change the operational status for <span className="font-bold text-slate-900">{editingClient.name}</span>.</p>
              
              <div className="space-y-3">
                {['Active', 'Pending', 'Cancelled', 'Not Interested'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateClientStatus(editingClient.id, status as FinopsClient['status'])}
                    className={`w-full p-4 rounded-xl text-left font-bold transition-all border ${
                      editingClient.status === status 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setEditingClient(null)}
                className="w-full mt-6 py-3 text-slate-400 font-bold hover:text-slate-600 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Enquiry Details Modal */}
      <AnimatePresence>
        {viewingEnquiry && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Enquiry Details</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Received on {viewingEnquiry.date}</p>
                </div>
                <StatusBadge status={viewingEnquiry.status} />
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Client Name</p>
                    <p className="font-bold text-slate-900">{viewingEnquiry.name}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Requested Plan</p>
                    <p className="font-bold text-slate-900">{viewingEnquiry.plan}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Message</p>
                  <p className="text-slate-700 text-sm leading-relaxed">{viewingEnquiry.message}</p>
                </div>

                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Update Status</p>
                  <div className="flex gap-2">
                    {['contacted', 'pending', 'closed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateEnquiryStatus(viewingEnquiry.id, status as FinopsEnquiry['status'])}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
                          viewingEnquiry.status === status 
                          ? 'bg-slate-900 text-white border-slate-900' 
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setViewingEnquiry(null)}
                className="w-full mt-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
              >
                Close Details
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminFinopsPage;
