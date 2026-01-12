

import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import { User, Client, Stock, NewsItem, Transaction, UserRole, ProjectStatus, FinancialStatementItem, FinancialStatementCategory, AboutUsContent, UserStatus } from '../types';
import { users as mockUsers, clients as mockClients, initialStocks, initialNews, transactions as mockTransactions, initialProfitAndLossData, initialBalanceSheetData, chartOfAccounts as mockChartOfAccounts, initialAboutUsContent } from '../constants';

// This is a partial type for the new client registration form
type NewClientData = Pick<Client, 'userId' | 'email' | 'password'>;
type ClientInquiryData = Omit<Client, 'id' | 'userId' | 'password' | 'projectStatus'>;
type Theme = 'light' | 'dark';

interface AuthContextType {
  user: User | Client | null;
  userType: 'admin' | 'client' | null;
  isAuthenticated: boolean;
  clients: Client[];
  users: User[];
  transactions: Transaction[];
  stocks: Stock[];
  news: NewsItem[];
  profitAndLossData: FinancialStatementItem[];
  balanceSheetData: FinancialStatementItem[];
  chartOfAccounts: typeof mockChartOfAccounts;
  aboutUsContent: AboutUsContent;
  companyName: string;
  companyLogo: string;
  theme: Theme;
  login: (identity: string, password?: string, userType?: 'admin' | 'client') => boolean;
  logout: () => void;
  registerClient: (data: NewClientData) => { success: boolean; message: string; };
  updateClientInquiry: (clientId: number, data: ClientInquiryData) => void;
  updateClientStatus: (clientId: number, status: ProjectStatus) => void;
  updateClientDetails: (clientId: number, data: Partial<Client>) => void;
  addClient: (data: Partial<Client>) => void;
  addUser: (data: Omit<User, 'id'|'isDeleted'>) => void;
  updateUser: (userId: number, data: Partial<User>) => void;
  addStock: (stock: Omit<Stock, 'id'>) => void;
  updateStock: (stock: Stock) => void;
  addNews: (news: Omit<NewsItem, 'id'>) => void;
  updateNews: (news: NewsItem) => void;
  updateAboutUsContent: (newContent: AboutUsContent) => void;
  setCompanyName: (name: string) => void;
  setCompanyLogo: (url: string) => void;
  setTheme: (theme: Theme) => void;
  // Financials
  addFinancialTransaction: (transaction: { entries: Omit<FinancialStatementItem, 'id' | 'transactionId'>[] }) => void;
  deleteFinancialTransaction: (transactionId: string) => void;
  // Soft delete
  deleteStock: (stockId: number) => void;
  deleteNews: (newsId: number) => void;
  deleteClient: (clientId: number) => void;
  deleteUser: (userId: number) => void;
  deleteTransaction: (transactionId: number) => void;
  deleteAboutUsFeature: (featureId: number) => void;
  // Restore
  restoreStock: (stockId: number) => void;
  restoreNews: (newsId: number) => void;
  restoreClient: (clientId: number) => void;
  restoreUser: (userId: number) => void;
  restoreTransaction: (transactionId: number) => void;
  restoreAboutUsFeature: (featureId: number) => void;
  // Permanent delete
  permanentlyDeleteStock: (stockId: number) => void;
  permanentlyDeleteNews: (newsId: number) => void;
  permanentlyDeleteClient: (clientId: number) => void;
  permanentlyDeleteUser: (userId: number) => void;
  permanentlyDeleteTransaction: (transactionId: number) => void;
  permanentlyDeleteAboutUsFeature: (featureId: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | Client | null>(null);
  const [userType, setUserType] = useState<'admin' | 'client' | null>(null);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [stocks, setStocks] = useState<Stock[]>(initialStocks);
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [profitAndLossData, setProfitAndLossData] = useState<FinancialStatementItem[]>(initialProfitAndLossData);
  const [balanceSheetData, setBalanceSheetData] = useState<FinancialStatementItem[]>(initialBalanceSheetData);
  const [chartOfAccounts] = useState(mockChartOfAccounts);
  const [aboutUsContent, setAboutUsContent] = useState<AboutUsContent>(initialAboutUsContent);
  const [companyName, setCompanyName] = useState<string>('Belreon');
  const [companyLogo, setCompanyLogo] = useState<string>('https://image2url.com/images/1755352385981-db5dd9de-70de-4e0b-a458-8588a342a9c8.jpg');
  const [theme, setTheme] = useState<Theme>('light');

  const login = useCallback((identity: string, password?: string, type: 'admin' | 'client' = 'admin') => {
    if (type === 'admin') {
      const foundUser = users.find(u => u.username === identity && u.password === password);
      if (foundUser && foundUser.status === UserStatus.Active && !foundUser.isDeleted) {
        setCurrentUser(foundUser);
        setUserType('admin');
        return true;
      }
    } else if (type === 'client') {
      const foundClient = clients.find(c => c.userId === identity && c.password === password);
      if (foundClient && !foundClient.isDeleted) {
        setCurrentUser(foundClient);
        setUserType('client');
        return true;
      }
    }
    return false;
  }, [users, clients]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setUserType(null);
  }, []);
  
  const registerClient = useCallback((data: NewClientData) => {
    if (clients.some(c => c.userId === data.userId)) {
      return { success: false, message: 'User ID already exists.' };
    }
    if (clients.some(c => c.email === data.email)) {
      return { success: false, message: 'Email already registered.' };
    }

    const newClient: Client = {
      id: clients.length + 1,
      userId: data.userId,
      password: data.password,
      email: data.email,
      companyName: '',
      contactPerson: '',
      projectStatus: ProjectStatus.New,
      submissionDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };
    
    setClients(prevClients => [...prevClients, newClient]);
    return { success: true, message: 'Registration successful!' };
  }, [clients]);

  const updateClientInquiry = useCallback((clientId: number, data: ClientInquiryData) => {
      setClients(prevClients => 
          prevClients.map(client => {
              if (client.id === clientId) {
                  const updatedClient = {
                      ...client,
                      ...data,
                      projectStatus: ProjectStatus.PendingApproval,
                      submissionDate: client.submissionDate || new Date().toISOString().split('T')[0],
                  };
                  // Also update the current user if they are the one making the change
                  if (currentUser && 'id' in currentUser && currentUser.id === clientId) {
                      setCurrentUser(updatedClient);
                  }
                  return updatedClient;
              }
              return client;
          })
      );
  }, [currentUser]);

  const updateClientStatus = useCallback((clientId: number, status: ProjectStatus) => {
    setClients(prevClients => 
        prevClients.map(client => 
            client.id === clientId ? { ...client, projectStatus: status } : client
        )
    );
  }, []);

  const updateClientDetails = useCallback((clientId: number, data: Partial<Client>) => {
    setClients(prevClients =>
        prevClients.map(client =>
            client.id === clientId ? { ...client, ...data } : client
        )
    );
  }, []);
  
  const addClient = useCallback((data: Partial<Client>) => {
    setClients(prevClients => {
        const newClient: Client = {
            id: prevClients.length > 0 ? Math.max(...prevClients.map(c => c.id)) + 1 : 1,
            userId: (data.companyName?.toLowerCase().replace(/\s/g, '') || `client${Date.now()}`).slice(0, 15),
            email: data.email || '',
            companyName: data.companyName || '',
            contactPerson: data.contactPerson || '',
            projectStatus: ProjectStatus.New,
            submissionDate: new Date().toISOString().split('T')[0],
            phone: data.phone,
            service: data.service,
            ...data, // allow overriding defaults for other fields
        };
        return [...prevClients, newClient];
    });
}, []);

 const addUser = useCallback((userData: Omit<User, 'id'|'isDeleted'>) => {
    setUsers(prev => {
        const newUser: User = {
            ...userData,
            id: prev.length > 0 ? Math.max(...prev.map(u => u.id)) + 1 : 1,
            isDeleted: false,
        };
        return [...prev, newUser];
    });
  }, []);

  const updateUser = useCallback((userId: number, data: Partial<User>) => {
    setUsers(prev =>
        prev.map(user => {
            if (user.id === userId) {
                // Don't update password if it's an empty string or undefined
                const { password, ...rest } = data;
                const updatedUser = { ...user, ...rest };
                if (password) {
                    updatedUser.password = password;
                }
                return updatedUser;
            }
            return user;
        })
    );
  }, []);

  const addStock = useCallback((stockData: Omit<Stock, 'id'>) => {
      setStocks(prev => [...prev, { ...stockData, id: Date.now() }]);
  }, []);

  const updateStock = useCallback((updatedStock: Stock) => {
      setStocks(prev => prev.map(s => s.id === updatedStock.id ? updatedStock : s));
  }, []);
  
  const addNews = useCallback((newsData: Omit<NewsItem, 'id'>) => {
    setNews(prev => [...prev, { ...newsData, id: Date.now() }]);
  }, []);

  const updateNews = useCallback((updatedNews: NewsItem) => {
    setNews(prev => prev.map(n => n.id === updatedNews.id ? updatedNews : n));
  }, []);

  const updateAboutUsContent = useCallback((newContent: AboutUsContent) => {
    setAboutUsContent(newContent);
  }, []);

  // Financials
  const addFinancialTransaction = useCallback((transaction: { entries: Omit<FinancialStatementItem, 'id' | 'transactionId'>[] }) => {
    const transactionId = `txn_${Date.now()}`;
    let lastId = Date.now();

    const newEntries = transaction.entries.map(entry => ({
      ...entry,
      id: lastId++,
      transactionId,
    }));

    newEntries.forEach(entry => {
       if ([FinancialStatementCategory.Revenue, FinancialStatementCategory.Expense].includes(entry.category)) {
          setProfitAndLossData(prev => [...prev, entry]);
      } else {
          setBalanceSheetData(prev => [...prev, entry]);
      }
    });
  }, []);
  
  const deleteFinancialTransaction = useCallback((transactionId: string) => {
    const deletor = currentUser && 'username' in currentUser ? currentUser.username : 'System';
    setProfitAndLossData(p => p.map(item => item.transactionId === transactionId ? { ...item, isDeleted: true, deletedBy: deletor } : item));
    setBalanceSheetData(p => p.map(item => item.transactionId === transactionId ? { ...item, isDeleted: true, deletedBy: deletor } : item));
  }, [currentUser]);


  // Soft Delete
  const deleteStock = useCallback((id: number) => {
    const deletor = currentUser && 'username' in currentUser ? currentUser.username : 'System';
    setStocks(p => p.map(s => s.id === id ? { ...s, isDeleted: true, deletedBy: deletor } : s));
  }, [currentUser]);

  const deleteNews = useCallback((id: number) => {
    const deletor = currentUser && 'username' in currentUser ? currentUser.username : 'System';
    setNews(p => p.map(n => n.id === id ? { ...n, isDeleted: true, deletedBy: deletor } : n));
  }, [currentUser]);

  const deleteClient = useCallback((id: number) => {
    const deletor = currentUser && 'username' in currentUser ? currentUser.username : 'System';
    setClients(p => p.map(c => c.id === id ? { ...c, isDeleted: true, deletedBy: deletor } : c));
  }, [currentUser]);

  const deleteUser = useCallback((id: number) => {
    const deletor = currentUser && 'username' in currentUser ? currentUser.username : 'System';
    setUsers(p => p.map(u => u.id === id ? { ...u, isDeleted: true, deletedBy: deletor } : u));
  }, [currentUser]);
  
  const deleteTransaction = useCallback((id: number) => {
    const deletor = currentUser && 'username' in currentUser ? currentUser.username : 'System';
    setTransactions(p => p.map(t => t.id === id ? { ...t, isDeleted: true, deletedBy: deletor } : t));
  }, [currentUser]);
  
  const deleteAboutUsFeature = useCallback((featureId: number) => {
    const deletor = currentUser && 'username' in currentUser ? currentUser.username : 'System';
    setAboutUsContent(prev => ({
        ...prev,
        features: prev.features.map(f => f.id === featureId ? { ...f, isDeleted: true, deletedBy: deletor } : f)
    }));
  }, [currentUser]);

  // Restore
  const restoreStock = useCallback((id: number) => setStocks(p => p.map(s => {
    if (s.id === id) { const { deletedBy, ...rest } = s; return { ...rest, isDeleted: false }; }
    return s;
  })), []);
  const restoreNews = useCallback((id: number) => setNews(p => p.map(n => {
    if (n.id === id) { const { deletedBy, ...rest } = n; return { ...rest, isDeleted: false }; }
    return n;
  })), []);
  const restoreClient = useCallback((id: number) => setClients(p => p.map(c => {
    if (c.id === id) { const { deletedBy, ...rest } = c; return { ...rest, isDeleted: false }; }
    return c;
  })), []);
  const restoreUser = useCallback((id: number) => setUsers(p => p.map(u => {
    if (u.id === id) { const { deletedBy, ...rest } = u; return { ...rest, isDeleted: false }; }
    return u;
  })), []);
  const restoreTransaction = useCallback((id: number) => setTransactions(p => p.map(t => {
    if (t.id === id) { const { deletedBy, ...rest } = t; return { ...rest, isDeleted: false }; }
    return t;
  })), []);
  const restoreAboutUsFeature = useCallback((featureId: number) => {
    setAboutUsContent(prev => ({
        ...prev,
        features: prev.features.map(f => {
            if (f.id === featureId) {
                const { deletedBy, ...rest } = f;
                return { ...rest, isDeleted: false };
            }
            return f;
        })
    }));
  }, []);
  
  // Permanent Delete
  const permanentlyDeleteStock = useCallback((id: number) => setStocks(p => p.filter(s => s.id !== id)), []);
  const permanentlyDeleteNews = useCallback((id: number) => setNews(p => p.filter(n => n.id !== id)), []);
  const permanentlyDeleteClient = useCallback((id: number) => setClients(p => p.filter(c => c.id !== id)), []);
  const permanentlyDeleteUser = useCallback((id: number) => setUsers(p => p.filter(u => u.id !== id)), []);
  const permanentlyDeleteTransaction = useCallback((id: number) => setTransactions(p => p.filter(t => t.id !== id)), []);
  const permanentlyDeleteAboutUsFeature = useCallback((featureId: number) => {
    setAboutUsContent(prev => ({
        ...prev,
        features: prev.features.filter(f => f.id !== featureId)
    }));
  }, []);


  const authContextValue = useMemo(() => ({
    user: currentUser,
    userType,
    isAuthenticated: !!currentUser,
    clients,
    users,
    transactions,
    stocks,
    news,
    profitAndLossData,
    balanceSheetData,
    chartOfAccounts,
    aboutUsContent,
    companyName,
    companyLogo,
    theme,
    login,
    logout,
    registerClient,
    updateClientInquiry,
    updateClientStatus,
    updateClientDetails,
    addClient,
    addUser,
    updateUser,
    addStock,
    updateStock,
    addNews,
    updateNews,
    updateAboutUsContent,
    setCompanyName,
    setCompanyLogo,
    setTheme,
    addFinancialTransaction,
    deleteFinancialTransaction,
    deleteStock,
    deleteNews,
    deleteClient,
    deleteUser,
    deleteTransaction,
    deleteAboutUsFeature,
    restoreStock,
    restoreNews,
    restoreClient,
    restoreUser,
    restoreTransaction,
    restoreAboutUsFeature,
    permanentlyDeleteStock,
    permanentlyDeleteNews,
    permanentlyDeleteClient,
    permanentlyDeleteUser,
    permanentlyDeleteTransaction,
    permanentlyDeleteAboutUsFeature,
  }), [currentUser, userType, clients, users, transactions, stocks, news, profitAndLossData, balanceSheetData, chartOfAccounts, aboutUsContent, companyName, companyLogo, theme, login, logout, registerClient, updateClientInquiry, updateClientStatus, updateClientDetails, addClient, addUser, updateUser, addStock, updateStock, addNews, updateNews, updateAboutUsContent, addFinancialTransaction, deleteFinancialTransaction, deleteStock, deleteNews, deleteClient, deleteUser, deleteTransaction, deleteAboutUsFeature, restoreStock, restoreNews, restoreClient, restoreUser, restoreTransaction, restoreAboutUsFeature, permanentlyDeleteStock, permanentlyDeleteNews, permanentlyDeleteClient, permanentlyDeleteUser, permanentlyDeleteTransaction, permanentlyDeleteAboutUsFeature]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};