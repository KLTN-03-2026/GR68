import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header, Page } from './Header';
import { Footer } from './Footer';
import ProBot from '../shared/ProBot';
import { useAuth } from '../../context/AuthContext';

export const MainLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Chuyển đổi pathname sang Page format cho Header
  const getActivePath = (): Page => {
    const path = location.pathname.substring(1) || 'home';
    return path as Page;
  };

  const handleNavigate = (page: Page, params?: any) => {
    let url = page === 'home' ? '/' : `/${page}`;
    if (params) {
      const searchParams = new URLSearchParams(params).toString();
      url += `?${searchParams}`;
    }
    navigate(url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const path = getActivePath();
  const isPortal = ['manage', 'tenant', 'admin', 'my-store'].includes(path);
  const isStoreRelated = ['store', 'store-detail', 'checkout'].includes(path);

  // If we are on a portal page but user is null (e.g. during logout transition), 
  // return null to avoid flashing stale UI while waiting for redirect.
  if (isPortal && !user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header 
        user={user} 
        onLogout={async () => {
          await logout();
          navigate('/');
        }} 
        onNavigate={handleNavigate} 
        activePath={path} 
      />
      <main className={`flex-grow ${isPortal ? 'bg-slate-50' : ''}`}>
        <Outlet />
      </main>
      {!isPortal && <Footer />}
      {!isPortal && !isStoreRelated && <ProBot onNavigate={handleNavigate} />}
    </div>
  );
};
