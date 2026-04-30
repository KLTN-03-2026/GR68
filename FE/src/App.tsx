import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useSearchParams, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ManagePage } from './pages/ManagePage';
import { StorePage } from './pages/StorePage';
import { SearchPage } from './pages/SearchPage';
import { ContactPage } from './pages/ContactPage';
import { TenantPage } from './pages/TenantPage';
import { AdminPage } from './pages/AdminPage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { PaymentResultPage } from './pages/PaymentResultPage';
import { StoreDetailPage } from './pages/StoreDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { MyStorePage } from './pages/MyStorePage';

import { MainLayout } from './components/layout/MainLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';

// Helper component to pass legacy props to pages
const LegacyPageWrapper = ({ Component, requireAuth, allowedRoles }: { Component: any, requireAuth?: boolean, allowedRoles?: string[] }) => {
  const { user, role, logout, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const location = useLocation();

  const handleNavigate = (page: string, navParams?: any) => {
    let url = page === 'home' ? '/' : `/${page}`;
    if (navParams) {
      const serializableParams = { ...navParams };
      for (const key in serializableParams) {
        if (typeof serializableParams[key] === 'object' && serializableParams[key] !== null) {
          serializableParams[key] = JSON.stringify(serializableParams[key]);
        }
      }
      const sp = new URLSearchParams(serializableParams).toString();
      if (sp) url += `?${sp}`;
    }
    navigate(url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const rawParams = Object.fromEntries(searchParams.entries());
  const params: Record<string, any> = {};
  for (const key in rawParams) {
    try {
      if (rawParams[key].startsWith('{') || rawParams[key].startsWith('[')) {
        params[key] = JSON.parse(rawParams[key]);
      } else {
        params[key] = rawParams[key];
      }
    } catch (e) {
      params[key] = rawParams[key];
    }
  }

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Only navigate and show toast if we're not already heading to login
        if (location.pathname !== '/login') {
          navigate('/login', { replace: true });
          showToast('Vui lòng đăng nhập để tiếp tục', 'warning');
        }
      } else if (allowedRoles && role && !allowedRoles.includes(role)) {
        if (location.pathname !== '/') {
          navigate('/', { replace: true });
          showToast('Bạn không có quyền truy cập trang này', 'error');
        }
      }
    }
  }, [loading, user, role, requireAuth, allowedRoles, navigate, showToast, location.pathname]);

  if (loading || (requireAuth && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Component 
        onNavigate={handleNavigate} 
        user={user} 
        role={role}
        onLogout={logout} 
        params={params} 
        initialParams={params}
      />
    </motion.div>
  );
};

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes with AuthLayout (No Header/Footer) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LegacyPageWrapper Component={LoginPage} />} />
          <Route path="/register" element={<LegacyPageWrapper Component={RegisterPage} />} />
          <Route path="/forgot-password" element={<LegacyPageWrapper Component={ForgotPasswordPage} />} />
        </Route>

        {/* Routes with MainLayout (Has Header/Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LegacyPageWrapper Component={HomePage} />} />
          <Route path="/listing-detail" element={<LegacyPageWrapper Component={ListingDetailPage} />} />
          <Route path="/search" element={<LegacyPageWrapper Component={SearchPage} />} />
          <Route path="/contact" element={<LegacyPageWrapper Component={ContactPage} />} />
          
          <Route path="/store" element={<LegacyPageWrapper Component={StorePage} />} />
          <Route path="/store-detail" element={<LegacyPageWrapper Component={StoreDetailPage} />} />
          <Route path="/checkout" element={<LegacyPageWrapper Component={CheckoutPage} />} />
          <Route path="/payment-result" element={<LegacyPageWrapper Component={PaymentResultPage} />} />
          
          {/* Protected Routes */}
          <Route 
            path="/manage" 
            element={<LegacyPageWrapper Component={ManagePage} requireAuth allowedRoles={['landlord', 'admin']} />} 
          />
          <Route 
            path="/tenant" 
            element={<LegacyPageWrapper Component={TenantPage} requireAuth allowedRoles={['tenant', 'admin']} />} 
          />
          <Route 
            path="/admin" 
            element={<LegacyPageWrapper Component={AdminPage} requireAuth allowedRoles={['admin']} />} 
          />
          
          <Route 
            path="/my-store" 
            element={<LegacyPageWrapper Component={MyStorePage} requireAuth allowedRoles={['tenant', 'landlord', 'admin']} />} 
          />
          
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
