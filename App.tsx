



import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ClientLayout from './components/ClientLayout';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import UsersPage from './pages/UsersPage';
import FinancialsPage from './pages/FinancialsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import ClientLoginPage from './pages/ClientLoginPage';
import ClientRegisterPage from './pages/ClientRegisterPage';
import PaymentPage from './pages/PaymentPage';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import ClientDashboardPage from './pages/client/ClientDashboardPage';
import NewInquiryPage from './pages/client/NewInquiryPage';
import PublicLayout from './components/PublicLayout';
import ServicesPage from './pages/ServicesPage';
import TransactionsPage from './pages/TransactionsPage';
import DatabasePage from './pages/DatabasePage';
import TrashPage from './pages/TrashPage';
import { useAuth } from './contexts/AuthContext';
import AdvertisementManagerPage from './pages/AdvertisementManagerPage';
import AppModifyPage from './pages/AppModifyPage';
import NewsManagerPage from './pages/NewsManagerPage';


function App() {
  const { theme } = useAuth();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Route>

      {/* Standalone Login & Registration Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/client-login" element={<ClientLoginPage />} />
      <Route path="/client-register" element={<ClientRegisterPage />} />

      {/* Protected Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="financials" element={<FinancialsPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="database" element={<DatabasePage />} />
        <Route path="news" element={<NewsManagerPage />} />
        <Route path="app-modify" element={<AppModifyPage />} />
        <Route path="app-modify/services" element={<ServicesPage />} />
        <Route path="app-modify/about-us" element={<AdvertisementManagerPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="trash" element={<TrashPage />} />
      </Route>

      {/* Protected Client Routes */}
       <Route 
        path="/client" 
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/client/dashboard" replace />} />
        <Route path="dashboard" element={<ClientDashboardPage />} />
        <Route path="new-inquiry" element={<NewInquiryPage />} />
      </Route>

      {/* Not Found Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;