import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  ChartBarIcon, 
  CpuChipIcon, 
  ShieldCheckIcon, 
  RocketLaunchIcon, 
  ChevronDownIcon,
  BanknotesIcon,
  UsersIcon,
  BriefcaseIcon
} from '../components/icons';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const chartData = [
  { name: 'Mon', sales: 4000, expenses: 2400 },
  { name: 'Tue', sales: 3000, expenses: 1398 },
  { name: 'Wed', sales: 2000, expenses: 9800 },
  { name: 'Thu', sales: 2780, expenses: 3908 },
  { name: 'Fri', sales: 1890, expenses: 4800 },
  { name: 'Sat', sales: 2390, expenses: 3800 },
  { name: 'Sun', sales: 3490, expenses: 4300 },
];

const currencies = [
  { code: 'USD', symbol: '$', rate: 1, name: 'US Dollar' },
  { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro' },
  { code: 'GBP', symbol: '£', rate: 0.79, name: 'British Pound' },
  { code: 'INR', symbol: '₹', rate: 83.30, name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', rate: 151.70, name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', rate: 1.52, name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', rate: 1.36, name: 'Canadian Dollar' },
  { code: 'AED', symbol: 'د.إ', rate: 3.67, name: 'UAE Dirham' },
  { code: 'SAR', symbol: 'ر.س', rate: 3.75, name: 'Saudi Riyal' },
];

const faqs = [
  {
    question: "Is my financial data secure?",
    answer: "Absolutely. We use bank-grade 256-bit SSL encryption and multi-factor authentication to ensure your data is always protected."
  },
  {
    question: "Can I import data from my current software?",
    answer: "Yes, Belreon FinOps supports easy CSV/Excel imports for inventory, customers, and historical transactions from most major platforms."
  },
  {
    question: "Do you support multiple store locations?",
    answer: "Yes! Our Professional and Enterprise plans are specifically designed for multi-location management with consolidated reporting."
  },
  {
    question: "Is there a free trial available?",
    answer: "We offer a 14-day full-featured free trial on all plans. No credit card is required to start."
  },
  {
    question: "Can my accountant access my books?",
    answer: "Yes, you can invite your accountant as a specialized user with dedicated permissions to review and finalize your accounts."
  }
];

const BelreonFinopsPage: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const convertPrice = (usdPrice: number) => {
    if (isNaN(usdPrice)) return 'Custom';
    const converted = usdPrice * selectedCurrency.rate;
    return `${selectedCurrency.symbol}${Math.round(converted).toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Contact Sales Modal */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-xl w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setIsContactModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="text-center mb-8">
                <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-6">
                  <BriefcaseIcon className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Contact Enterprise Sales</h2>
                <p className="text-slate-500">Tailored solutions for large-scale retail operations.</p>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Work Email</label>
                    <input type="email" placeholder="john@company.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Company Name</label>
                  <input type="text" placeholder="Retail Corp" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Message</label>
                  <textarea rows={4} placeholder="Tell us about your business needs..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"></textarea>
                </div>
                <button className="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg">
                  Send Inquiry
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-r from-lime-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent uppercase"
          >
            Belreon FinOps
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto font-medium"
          >
            The Intelligent Accounting Platform for Modern Retailers and SMBs. Simplify your books, track your stock, and grow your profit.
          </motion.p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Smart Invoicing",
              desc: "Create professional invoices in seconds and get paid faster with automated payment reminders.",
              icon: <ChartBarIcon className="w-8 h-8" />,
              color: "bg-blue-500"
            },
            {
              title: "Retail Inventory",
              desc: "Real-time stock tracking across multiple locations with automated low-stock alerts.",
              icon: <CpuChipIcon className="w-8 h-8" />,
              color: "bg-emerald-500"
            },
            {
              title: "Expense Tracking",
              desc: "Snap receipts and categorize expenses automatically. Stay audit-ready all year round.",
              icon: <ShieldCheckIcon className="w-8 h-8" />,
              color: "bg-purple-500"
            },
            {
              title: "Profit Insights",
              desc: "Deep-dive reports into your most profitable products and seasonal sales trends.",
              icon: <RocketLaunchIcon className="w-8 h-8" />,
              color: "bg-amber-500"
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group"
            >
              <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-24 bg-slate-900 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight uppercase">Powerful Dashboard, Simple Interface</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Get a 360-degree view of your retail business. Real-time data, actionable insights, and effortless control.</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto bg-slate-800 rounded-[2.5rem] p-4 md:p-8 shadow-2xl border border-slate-700 relative"
          >
            {/* Browser Header Mockup */}
            <div className="flex items-center gap-2 mb-6 px-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <div className="ml-4 bg-slate-700 rounded-lg px-4 py-1 text-[10px] text-slate-400 font-mono">app.belreon.com/dashboard</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sidebar Mockup */}
              <div className="hidden lg:block lg:col-span-2 space-y-4">
                {[
                  { icon: <ChartBarIcon className="w-4 h-4" />, label: "Overview", active: true },
                  { icon: <BanknotesIcon className="w-4 h-4" />, label: "Sales" },
                  { icon: <BriefcaseIcon className="w-4 h-4" />, label: "Inventory" },
                  { icon: <UsersIcon className="w-4 h-4" />, label: "Customers" },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${item.active ? 'bg-emerald-500 text-slate-900' : 'text-slate-400 hover:bg-slate-700'}`}>
                    {item.icon}
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Main Content Mockup */}
              <div className="lg:col-span-10 space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: "Total Revenue", value: "$124,500", change: "+12.5%", color: "text-emerald-400" },
                    { label: "Active Stock", value: "1,240 Items", change: "-2.1%", color: "text-amber-400" },
                    { label: "Net Profit", value: "$42,800", change: "+8.4%", color: "text-blue-400" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-slate-700/50 p-6 rounded-2xl border border-slate-600/50">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                      <div className="flex items-end justify-between">
                        <h4 className="text-2xl font-black text-white">{stat.value}</h4>
                        <span className={`text-[10px] font-bold ${stat.color}`}>{stat.change}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart Area */}
                <div className="bg-slate-700/50 p-6 rounded-2xl border border-slate-600/50 h-[300px]">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-bold text-white">Sales vs Expenses</h4>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] text-slate-400">Sales</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-[10px] text-slate-400">Expenses</span>
                      </div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#10b981" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
                      <Area type="monotone" dataKey="expenses" stroke="#3b82f6" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">Trusted by Modern Retailers</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Join thousands of businesses that have transformed their operations with Belreon FinOps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "Belreon FinOps changed everything for us. We finally have a real-time view of our stock across all three branches.",
                author: "Sarah Jenkins",
                role: "Owner, Urban Threads Boutique",
                image: "https://picsum.photos/seed/retail1/100/100"
              },
              {
                quote: "The automated tax reporting saves me at least 10 hours every month. It's the best investment I've made for my business.",
                author: "Michael Chen",
                role: "Founder, TechStop Electronics",
                image: "https://picsum.photos/seed/retail2/100/100"
              },
              {
                quote: "Simple, intuitive, and powerful. My staff learned to use it in less than an hour. Highly recommended for any SMB.",
                author: "Elena Rodriguez",
                role: "Manager, Fresh & Green Market",
                image: "https://picsum.photos/seed/retail3/100/100"
              }
            ].map((testimonial, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 relative"
              >
                <div className="text-emerald-500 mb-6">
                  <svg className="w-10 h-10 fill-current opacity-20" viewBox="0 0 32 32">
                    <path d="M10 8v8h6v-8h-6zM22 8v8h6v-8h-6zM10 18v8h6v-8h-6zM22 18v8h6v-8h-6z" />
                  </svg>
                </div>
                <p className="text-slate-700 text-lg font-medium mb-8 italic leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{testimonial.author}</h4>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight uppercase">Enterprise-Grade Security</h2>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                Your financial data is your most valuable asset. We protect it with the same rigor as global financial institutions, ensuring 99.9% uptime and total privacy.
              </p>
              <div className="space-y-6">
                {[
                  { title: "256-bit AES Encryption", desc: "All data is encrypted at rest and in transit using industry-leading standards." },
                  { title: "Automatic Backups", desc: "Your records are backed up every hour across multiple secure cloud regions." },
                  { title: "Role-Based Access", desc: "Granular permissions ensure staff only see what they need to see." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1">
                      <ShieldCheckIcon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 text-center">
                <div className="text-4xl font-black text-emerald-400 mb-2">99.9%</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Uptime SLA</div>
              </div>
              <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 text-center">
                <div className="text-4xl font-black text-blue-400 mb-2">24/7</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Monitoring</div>
              </div>
              <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 text-center col-span-2">
                <div className="flex justify-center gap-8 items-center">
                  <div className="text-slate-400 font-black text-xl tracking-tighter italic opacity-50">ISO 27001</div>
                  <div className="text-slate-400 font-black text-xl tracking-tighter italic opacity-50">SOC2 TYPE II</div>
                  <div className="text-slate-400 font-black text-xl tracking-tighter italic opacity-50">GDPR</div>
                </div>
                <div className="mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Compliance Standards</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Roadmap Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">Your Path to Financial Clarity</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Follow these 7 essential steps to fully automate your retail accounting with Belreon FinOps.</p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 gap-12 relative">
              {/* Vertical Line for Desktop */}
              <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2"></div>
              
              {[
                {
                  step: "01",
                  title: "Company Profile Setup",
                  desc: "Configure your business details, local currency, and tax registration (GST/VAT) settings.",
                  side: "left"
                },
                {
                  step: "02",
                  title: "Chart of Accounts",
                  desc: "Customize your financial structure or use our retail-optimized templates for income and expenses.",
                  side: "right"
                },
                {
                  step: "03",
                  title: "Inventory Catalog",
                  desc: "Import your product list, set opening stock levels, and define reorder points for every item.",
                  side: "left"
                },
                {
                  step: "04",
                  title: "Stakeholder Onboarding",
                  desc: "Add your regular vendors and customer database to streamline future invoicing and purchasing.",
                  side: "right"
                },
                {
                  step: "05",
                  title: "Opening Balances",
                  desc: "Enter your current bank balances and outstanding payables/receivables to start with a clean slate.",
                  side: "left"
                },
                {
                  step: "06",
                  title: "Daily Transactions",
                  desc: "Begin recording sales, logging expenses, and processing purchases in real-time.",
                  side: "right"
                },
                {
                  step: "07",
                  title: "Automated Reporting",
                  desc: "Generate your first monthly Profit & Loss statement and review your business performance.",
                  side: "left"
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: item.side === 'left' ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`flex flex-col md:flex-row items-center ${item.side === 'right' ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="w-full md:w-1/2 px-8 mb-4 md:mb-0 text-center md:text-left">
                    <div className={`inline-block px-4 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold mb-3 uppercase tracking-widest`}>Step {item.step}</div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 text-white font-black z-10 shadow-xl border-4 border-white">
                    {item.step}
                  </div>
                  <div className="w-full md:w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">Simple, Transparent Pricing</h2>
            <p className="text-slate-600 max-w-2xl mx-auto mb-8">Choose the plan that fits your business scale. No hidden fees, cancel anytime.</p>
            
            {/* Currency Selector */}
            <div className="flex items-center justify-center gap-4">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Select Currency:</span>
              <div className="relative inline-block text-left">
                <select 
                  value={selectedCurrency.code}
                  onChange={(e) => {
                    const found = currencies.find(c => c.code === e.target.value);
                    if (found) setSelectedCurrency(found);
                  }}
                  className="appearance-none bg-slate-100 border border-slate-200 text-slate-900 text-sm font-bold py-2 px-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {currencies.map(c => (
                    <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <ChevronDownIcon className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Starter",
                usdPrice: 29,
                desc: "Perfect for single-store retailers just getting started.",
                features: ["Up to 500 Invoices/mo", "Basic Inventory Tracking", "1 User Access", "Email Support"],
                highlight: false,
                buttonClass: "bg-slate-100 text-slate-900 hover:bg-slate-200"
              },
              {
                name: "Professional",
                usdPrice: 79,
                desc: "Ideal for growing businesses with multiple locations.",
                features: ["Unlimited Invoices", "Multi-store Inventory", "5 User Access", "Priority Support", "Basic AI Insights"],
                highlight: true,
                buttonClass: "bg-gradient-to-r from-lime-400 to-emerald-500 text-slate-900"
              },
              {
                name: "Enterprise",
                usdPrice: NaN,
                desc: "Advanced features for large-scale retail operations.",
                features: ["Custom Integrations", "Dedicated Account Manager", "Unlimited Users", "Advanced AI Forecasting", "On-site Training"],
                highlight: false,
                buttonClass: "bg-slate-900 text-white hover:bg-slate-800"
              }
            ].map((plan, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-10 rounded-[2.5rem] border ${plan.highlight ? 'border-emerald-200 shadow-2xl scale-105 relative z-10 bg-white' : 'border-slate-100 bg-slate-50'}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Most Popular</div>
                )}
                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black text-slate-900">{convertPrice(plan.usdPrice)}</span>
                  {!isNaN(plan.usdPrice) && <span className="text-slate-500 font-medium">/mo</span>}
                </div>
                <p className="text-slate-600 text-sm mb-8 leading-relaxed">{plan.desc}</p>
                <ul className="space-x-0 space-y-4 mb-10">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                      <ShieldCheckIcon className="w-5 h-5 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {isNaN(plan.usdPrice) ? (
                  <button 
                    onClick={() => setIsContactModalOpen(true)}
                    className={`w-full py-4 rounded-2xl font-black transition-all hover:scale-[1.02] ${plan.buttonClass}`}
                  >
                    Contact Sales
                  </button>
                ) : (
                  <Link 
                    to="/finops/auth"
                    className={`w-full py-4 rounded-2xl font-black transition-all hover:scale-[1.02] text-center block ${plan.buttonClass}`}
                  >
                    Start Free Trial
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog/Resources Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">Retail Insights & Resources</h2>
              <p className="text-slate-600">Expert advice on accounting, inventory management, and scaling your retail business.</p>
            </div>
            <button className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              View All Articles <RocketLaunchIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "5 Inventory Mistakes That Are Killing Your Profit",
                category: "Inventory",
                date: "April 10, 2026",
                image: "https://picsum.photos/seed/blog1/600/400"
              },
              {
                title: "How to Prepare Your Retail Business for Tax Season",
                category: "Accounting",
                date: "April 05, 2026",
                image: "https://picsum.photos/seed/blog2/600/400"
              },
              {
                title: "The Future of Retail: AI and Automated Bookkeeping",
                category: "Technology",
                date: "March 28, 2026",
                image: "https://picsum.photos/seed/blog3/600/400"
              }
            ].map((post, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-[2rem] mb-6 aspect-[3/2]">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900">
                    {post.category}
                  </div>
                </div>
                <div className="px-2">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">{post.date}</p>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">
                    {post.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">Frequently Asked Questions</h2>
            <p className="text-slate-600">Everything you need to know about Belreon FinOps.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                >
                  <span className="text-lg font-bold text-slate-900">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDownIcon className="w-5 h-5 text-slate-400" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-8 pb-6 text-slate-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px]"></div>
            
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Transform Your Retail Business Today</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">Join thousands of retailers using Belreon FinOps to automate their accounting and focus on growth.</p>
            <Link 
              to="/finops/auth"
              className="inline-block bg-gradient-to-r from-lime-400 to-emerald-500 text-slate-900 font-black px-12 py-5 rounded-2xl hover:scale-105 transition-transform shadow-xl"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BelreonFinopsPage;
