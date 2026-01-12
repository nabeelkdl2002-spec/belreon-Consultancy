import { Project, Client, User, Transaction, Stock, NewsItem, ProjectStatus, UserRole, UserStatus, TransactionType, FinancialStatementItem, FinancialStatementCategory, AboutUsContent } from './types';

export const recentProjects: Project[] = [
  { clientName: 'Innovate Corp', service: 'Tech Growth Portfolio', assignedTo: 'Nabeel K.', status: ProjectStatus.Completed },
  { clientName: 'Future Solutions Ltd.', service: 'Energy Sector Analysis', assignedTo: 'Employee One', status: ProjectStatus.InProgress },
  { clientName: 'Global Ventures', service: 'Blue Chip Dividend', assignedTo: 'Employee Two', status: ProjectStatus.InProgress },
  { clientName: 'New Prospect Inc.', service: 'Crypto Derivatives', assignedTo: 'Admin', status: ProjectStatus.PendingApproval },
];

export const clients: Client[] = [
  { id: 1, userId: 'innovate', password: 'password', companyName: 'Innovate Corp', contactPerson: 'John Doe', email: 'john.doe@innovatecorp.com', service: 'Tech Growth Portfolio', projectStatus: ProjectStatus.Completed, submissionDate: '2025-07-15' },
  { id: 2, userId: 'future', password: 'password', companyName: 'Future Solutions Ltd.', contactPerson: 'Jane Smith', email: 'j.smith@futuresolutions.com', service: 'Energy Sector Analysis', projectStatus: ProjectStatus.InProgress, submissionDate: '2025-08-01' },
  { id: 3, userId: 'global', password: 'password', companyName: 'Global Ventures', contactPerson: 'Sam Wilson', email: 'sam.w@globalventures.net', service: 'Blue Chip Dividend', projectStatus: ProjectStatus.InProgress, submissionDate: '2025-08-05' },
  { id: 4, userId: 'datasys', password: 'password', companyName: 'Data Systems LLC', contactPerson: 'Emily White', email: 'emily.w@datasystems.com', service: 'Tech Growth Portfolio', projectStatus: ProjectStatus.PendingApproval, submissionDate: '2025-08-10' },
  { id: 5, userId: 'creative', password: 'password', companyName: 'Creative Minds', contactPerson: 'Michael Brown', email: 'mbrown@creative.com', service: 'Mid-Cap Value', projectStatus: ProjectStatus.Completed, submissionDate: '2025-06-20' },
  { id: 6, userId: 'newclient', password: 'password', companyName: '', contactPerson: '', email: 'new.client@example.com', service: '', projectStatus: ProjectStatus.New, submissionDate: '2025-08-12' },
];

export const users: User[] = [
  { id: 1, username: 'Belreon3434', password: 'Nabeel@2002', role: UserRole.PrimaryAdmin, permissions: ['All Access'], navPermissions: ['all'], status: UserStatus.Active },
  { id: 2, username: 'EmployeeOne', password: 'password123', role: UserRole.Employee, permissions: ['Financial Modelling'], navPermissions: ['/admin/dashboard', '/admin/clients'], status: UserStatus.Active },
  { id: 3, username: 'EmployeeTwo', password: 'password123', role: UserRole.Employee, permissions: ['HR Consulting', 'Business Analytics'], navPermissions: ['/admin/dashboard', '/admin/clients', '/admin/users'], status: UserStatus.Active },
  { id: 4, username: 'ExitingEmployee', password: 'password123', role: UserRole.Employee, permissions: ['Data Analytics'], navPermissions: [], status: UserStatus.Disabled },
];

export const transactions: Transaction[] = [
    { id: 1, date: '2025-08-12', description: 'Payment for Tech Portfolio Analysis', clientVendor: 'Innovate Corp', type: TransactionType.Inflow, amount: 15000 },
    { id: 2, date: '2025-08-11', description: 'Bloomberg Terminal Subscription', clientVendor: 'Bloomberg LP', type: TransactionType.Outflow, amount: -500 },
    { id: 3, date: '2025-08-10', description: 'Payment for Dividend Strategy', clientVendor: 'Global Ventures', type: TransactionType.Inflow, amount: 8500 },
    { id: 4, date: '2025-08-09', description: 'Office Supplies', clientVendor: 'Office Depot', type: TransactionType.Outflow, amount: -250 },
    { id: 5, date: '2025-08-05', description: 'Cloud Server Costs', clientVendor: 'AWS', type: TransactionType.Outflow, amount: -150 },
    { id: 6, date: '2025-08-01', description: 'Payment for Energy Sector Research', clientVendor: 'Future Solutions Ltd.', type: TransactionType.Inflow, amount: 12000 },
];

export const initialStocks: Stock[] = [
    {
        id: 1,
        imageUrl: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=2940&auto=format&fit=crop',
        name: 'Tech Giant Corp',
        ticker: 'TGC',
        description: 'Strong market leader in AI and cloud computing. Robust balance sheet with significant cash reserves.',
        currentPrice: 145.50,
        targetPrice: 180.00,
        intrinsicValue: 165.20,
        ratios: 'P/E: 25.4\nPEG: 1.2\nROE: 35%',
        currency: '$',
        isDemo: true,
        newsLink: 'https://finance.yahoo.com/quote/AAPL',
        chartLink: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=600&auto=format&fit=crop',
        tradingViewLink: 'https://www.tradingview.com/chart/?symbol=NASDAQ%3AAAPL'
    },
    {
        id: 2,
        imageUrl: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=2874&auto=format&fit=crop',
        name: 'Green Energy Solutions',
        ticker: 'GES',
        description: 'Leading the transition to renewable energy. High growth potential driven by government incentives.',
        currentPrice: 22.10,
        targetPrice: 45.00,
        intrinsicValue: 38.50,
        ratios: 'P/E: 45.1\nDebt/Eq: 0.8\nRev Growth: 22%',
        currency: '$',
        isDemo: false,
    },
    {
        id: 3,
        imageUrl: 'https://images.unsplash.com/photo-1563986768494-4dee46a38531?q=80&w=2934&auto=format&fit=crop',
        name: 'Global Finance Bank',
        ticker: 'GFB',
        description: 'Undervalued banking stock with high dividend yield. Benefiting from rising interest rate environment.',
        currentPrice: 55.75,
        targetPrice: 65.00,
        intrinsicValue: 68.00,
        ratios: 'P/B: 0.9\nDiv Yield: 4.5%\nP/E: 8.5',
        currency: '$',
        isDemo: false,
    },
    {
        id: 4,
        imageUrl: 'https://images.unsplash.com/photo-1620288627223-537a2b70f2fc?q=80&w=2848&auto=format&fit=crop',
        name: 'Future Auto Inc.',
        ticker: 'FAI',
        description: 'EV manufacturer gaining significant market share in Asia and Europe.',
        currentPrice: 210.00,
        targetPrice: 200.00,
        intrinsicValue: 195.00,
        ratios: 'P/E: 85\nBeta: 1.5\nProfit Margin: 12%',
        currency: '€',
        isDemo: false,
    },
];

export const initialNews: NewsItem[] = [
    {
        id: 1,
        title: "Fed Signals Potential Rate Cut in Q4",
        summary: "Federal Reserve officials have hinted at a possible interest rate reduction later this year as inflation indicators show signs of cooling.",
        date: "2025-08-15",
        imageUrl: "https://images.unsplash.com/photo-1621261314949-556156e50751?q=80&w=2834&auto=format&fit=crop",
        url: "https://www.federalreserve.gov",
    },
    {
        id: 2,
        title: "Tech Sector Rally Continues Despite Regulatory Concerns",
        summary: "Major technology stocks surged today, driving the Nasdaq to new highs, shrugging off recent antitrust announcements from the EU.",
        date: "2025-08-14",
        imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2940&auto=format&fit=crop",
    },
    {
        id: 3,
        title: "Oil Prices Stabilize After Weekly Drop",
        summary: "Global crude oil prices have found a floor at $75/barrel following a volatile week driven by supply chain disruptions in the Middle East.",
        date: "2025-08-12",
        imageUrl: "https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?q=80&w=2940&auto=format&fit=crop",
    }
];

export const chartOfAccounts = {
  assets: [
    'Cash in Bank', 'Petty Cash', 'Accounts Receivable', 'Inventory', 'Prepaid Rent', 'Prepaid Insurance', 'Office Supplies',
    'Office Equipment', 'Computers & Laptops', 'Vehicles', 'Furniture & Fixtures', 'Land & Building',
  ],
  liabilities: [
    'Accounts Payable', 'Unearned Revenue', 'Salaries Payable', 'Taxes Payable', 'Short-term Loan',
    'Bank Loan', 'Bonds Payable',
  ],
  equity: [
    'Share Capital', "Owner's Equity", 'Retained Earnings', "Owner's Drawings",
  ],
  revenue: [
    'Service Revenue', 'Sales Revenue', 'Consulting Fees', 'Commission Income', 'Interest Income',
  ],
  expenses: [
    'Cost of Goods Sold', 'Salaries & Wages', 'Office Rent', 'Utilities', 'Marketing & Advertising', 'Software Subscriptions',
    'IT Services', 'Bank Fees', 'Insurance Expense', 'Depreciation Expense', 'Commission Expense', 'Office Supplies Expense',
    'Travel Expense', 'Legal & Professional Fees',
  ],
};


export const initialProfitAndLossData: FinancialStatementItem[] = [
  { id: 1, date: '2025-08-01', particulars: 'Service Revenue', description: 'Consulting Fees - Innovate Corp', category: FinancialStatementCategory.Revenue, amount: 25000, transactionId: 'txn_005' },
  { id: 2, date: '2025-08-05', particulars: 'Service Revenue', description: 'HR Consulting - Global Ventures', category: FinancialStatementCategory.Revenue, amount: 18000, transactionId: 'txn_006' },
  { id: 3, date: '2025-08-10', particulars: 'Salaries & Wages', description: 'August Salaries', category: FinancialStatementCategory.Expense, amount: 15000, transactionId: 'txn_008' },
  { id: 4, date: '2025-08-12', particulars: 'Office Rent', description: 'August Rent', category: FinancialStatementCategory.Expense, amount: 5000, transactionId: 'txn_009' },
  { id: 5, date: '2025-08-15', particulars: 'Software Subscriptions', description: 'Monthly Adobe & CRM tools', category: FinancialStatementCategory.Expense, amount: 1200, transactionId: 'txn_010' },
  { id: 6, date: '2025-07-25', particulars: 'Service Revenue', description: 'Past Project Revenue', category: FinancialStatementCategory.Revenue, amount: 12000, transactionId: 'txn_007' },
  { id: 12, date: '2025-08-05', particulars: 'IT Services', description: 'Server Maintenance Contract', category: FinancialStatementCategory.Expense, amount: 8000, transactionId: 'txn_011' },
];

export const initialBalanceSheetData: FinancialStatementItem[] = [
    { id: 7, date: '2025-01-01', particulars: 'Office Equipment', description: 'Initial Office Setup', category: FinancialStatementCategory.Asset, amount: 50000, transactionId: 'txn_003' },
    { id: 8, date: '2025-01-01', particulars: 'Computers & Laptops', description: 'Employee Laptops Purchase', category: FinancialStatementCategory.Asset, amount: 25000, transactionId: 'txn_004' },
    { id: 9, date: '2025-01-15', particulars: 'Bank Loan', description: 'Startup Business Loan', category: FinancialStatementCategory.Liability, amount: 40000, transactionId: 'txn_001' },
    { id: 10, date: '2025-03-10', particulars: 'Share Capital', description: 'Initial Investment', category: FinancialStatementCategory.Liability, amount: 100000, transactionId: 'txn_002' },
    { id: 11, date: '2025-08-05', particulars: 'Accounts Payable', description: 'IT Supplier Invoice', category: FinancialStatementCategory.Liability, amount: 8000, transactionId: 'txn_011' },
    { id: 13, date: '2025-01-15', particulars: 'Cash in Bank', description: 'from loan', category: FinancialStatementCategory.Asset, amount: 40000, transactionId: 'txn_001' },
    { id: 14, date: '2025-03-10', particulars: 'Cash in Bank', description: 'from share capital', category: FinancialStatementCategory.Asset, amount: 100000, transactionId: 'txn_002' },
    { id: 15, date: '2025-01-01', particulars: 'Cash in Bank', description: 'paid for equipment', category: FinancialStatementCategory.Asset, amount: -50000, transactionId: 'txn_003' },
    { id: 16, date: '2025-01-01', particulars: 'Cash in Bank', description: 'paid for computers', category: FinancialStatementCategory.Asset, amount: -25000, transactionId: 'txn_004' },
    { id: 17, date: '2025-08-01', particulars: 'Cash in Bank', description: 'from Innovate Corp', category: FinancialStatementCategory.Asset, amount: 25000, transactionId: 'txn_005' },
    { id: 18, date: '2025-08-05', particulars: 'Cash in Bank', description: 'from Global Ventures', category: FinancialStatementCategory.Asset, amount: 18000, transactionId: 'txn_006' },
    { id: 19, date: '2025-07-25', particulars: 'Cash in Bank', description: 'from past project', category: FinancialStatementCategory.Asset, amount: 12000, transactionId: 'txn_007' },
    { id: 20, date: '2025-08-10', particulars: 'Cash in Bank', description: 'paid salaries', category: FinancialStatementCategory.Asset, amount: -15000, transactionId: 'txn_008' },
    { id: 21, date: '2025-08-12', particulars: 'Cash in Bank', description: 'paid rent', category: FinancialStatementCategory.Asset, amount: -5000, transactionId: 'txn_009' },
    { id: 22, date: '2025-08-15', particulars: 'Cash in Bank', description: 'paid subscriptions', category: FinancialStatementCategory.Asset, amount: -1200, transactionId: 'txn_010' },
];

export const initialAboutUsContent: AboutUsContent = {
  mainImages: [
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=3132&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556742212-0526869a4DEF?q=80&w=2940&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2940&auto=format&fit=crop',
  ],
  heading: 'Pioneering Progress, Together',
  paragraph: "At Belreon, we are more than just consultants; we are architects of growth and dedicated partners in your success. Founded on the principle of delivering tangible results, we blend deep industry expertise with cutting-edge analytics to unlock your business's full potential. Our mission is to empower organizations to navigate complexity with clarity, turn ambitious goals into achievements, and build lasting capabilities for a competitive future.",
  features: [
    {
      id: 1,
      icon: 'LightbulbIcon',
      title: 'Strategic Innovation',
      description: 'We leverage data-driven insights and creative thinking to forge new paths to success beyond conventional solutions.',
    },
    {
      id: 2,
      icon: 'UsersIcon',
      title: 'Collaborative Partnership',
      description: 'We integrate seamlessly with your team, fostering a shared sense of purpose to overcome challenges together.',
    },
    {
      id: 3,
      icon: 'BriefcaseIcon',
      title: 'Unwavering Excellence',
      description: 'We are relentless in our pursuit of quality, delivering measurable outcomes that exceed expectations and drive sustainable growth.',
    },
  ],
};