import React, { ReactNode, useState } from 'react';
import { Home, User, LogOut, Menu, X } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { NotificationBell } from '../shared/NotificationBell';

export type Page = 'home' | 'login' | 'register' | 'store' | 'manage' | 'contact' | 'search' | 'tenant' | 'admin' | 'listing-detail' | 'my-store';

interface HeaderProps {
  user: SupabaseUser | null;
  onLogout: () => void;
  onNavigate: (page: Page, params?: any) => void;
  activePath?: Page;
  children?: ReactNode;
}

export const Header = ({ user, onLogout, onNavigate, activePath, children }: HeaderProps) => {
  const [dbRole, setDbRole] = React.useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    if (user?.id) {
      import('../../lib/supabase').then(({ supabase }) => {
        supabase.from('profiles').select('role').eq('id', user.id).single()
          .then(({ data, error }) => {
             if (!error && data) setDbRole(data.role);
          });
      });
    } else {
      setDbRole(null);
    }
  }, [user?.id]);

  const currentRole = dbRole || user?.user_metadata?.role;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 md:px-10 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="text-primary">
              <Home className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-primary font-display">Trọ Pro</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a 
              className={`text-sm ${activePath === 'home' ? 'font-bold text-primary border-b-2 border-primary pb-1' : 'font-semibold text-slate-600 hover:text-primary transition-colors'}`} 
              href="#" 
              onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            >
              Trang chủ
            </a>
            <a 
              className={`text-sm ${activePath === 'store' ? 'font-bold text-primary border-b-2 border-primary pb-1' : 'font-semibold text-slate-600 hover:text-primary transition-colors'}`} 
              href="#" 
              onClick={(e) => { e.preventDefault(); onNavigate('store'); }}
            >
              Cửa hàng
            </a>
            <a 
              className={`text-sm ${activePath === 'contact' ? 'font-bold text-primary border-b-2 border-primary pb-1' : 'font-semibold text-slate-600 hover:text-primary transition-colors'}`} 
              href="#" 
              onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}
            >
              Liên hệ
            </a>
            {currentRole === 'landlord' && (
              <a 
                className={`text-sm ${activePath === 'manage' ? 'font-bold text-primary border-b-2 border-primary pb-1' : 'font-semibold text-slate-600 hover:text-primary transition-colors'}`} 
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigate('manage'); }}
              >
                Quản lý
              </a>
            )}
            {currentRole === 'tenant' && (
              <a 
                className={`text-sm ${activePath === 'tenant' ? 'font-bold text-primary border-b-2 border-primary pb-1' : 'font-semibold text-slate-600 hover:text-primary transition-colors'}`} 
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigate('tenant'); }}
              >
                Phòng của tôi
              </a>
            )}
            {currentRole === 'admin' && (
              <a 
                className={`text-sm ${activePath === 'admin' ? 'font-bold text-primary border-b-2 border-primary pb-1' : 'font-semibold text-slate-600 hover:text-primary transition-colors'}`} 
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigate('admin'); }}
              >
                Quản trị
              </a>
            )}
          </nav>
        </div>
        
        {children && (
          <div className="flex-1 max-w-md mx-8 hidden lg:block">
            {children}
          </div>
        )}
        
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4 ml-2">
              <NotificationBell user={user} onNavigate={onNavigate} />
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all border border-primary/20">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors hidden sm:block">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
              </div>
              <button 
                onClick={onLogout}
                className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all border border-slate-100"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 ml-2">
              <button onClick={() => onNavigate('login')} className="text-sm font-bold text-slate-600 hover:text-primary transition-colors hidden sm:block">Đăng nhập</button>
              <button onClick={() => onNavigate('register')} className="bg-primary text-white text-sm font-bold px-4 py-2 sm:px-6 sm:py-3 rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">Đăng ký</button>
            </div>
          )}

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg ml-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden border-t border-slate-100 mt-4 pt-4 pb-2 flex flex-col gap-4 px-2 animate-in slide-in-from-top-2">
          <a className={`text-base block p-2 rounded-lg ${activePath === 'home' ? 'font-bold bg-primary/10 text-primary' : 'font-semibold text-slate-600 hover:bg-slate-50'}`} onClick={(e) => { e.preventDefault(); onNavigate('home'); setIsMobileMenuOpen(false); }}>Trang chủ</a>
          <a className={`text-base block p-2 rounded-lg ${activePath === 'store' ? 'font-bold bg-primary/10 text-primary' : 'font-semibold text-slate-600 hover:bg-slate-50'}`} onClick={(e) => { e.preventDefault(); onNavigate('store'); setIsMobileMenuOpen(false); }}>Cửa hàng</a>
          <a className={`text-base block p-2 rounded-lg ${activePath === 'contact' ? 'font-bold bg-primary/10 text-primary' : 'font-semibold text-slate-600 hover:bg-slate-50'}`} onClick={(e) => { e.preventDefault(); onNavigate('contact'); setIsMobileMenuOpen(false); }}>Liên hệ</a>
          {currentRole === 'landlord' && <a className={`text-base block p-2 rounded-lg ${activePath === 'manage' ? 'font-bold bg-primary/10 text-primary' : 'font-semibold text-slate-600 hover:bg-slate-50'}`} onClick={(e) => { e.preventDefault(); onNavigate('manage'); setIsMobileMenuOpen(false); }}>Quản lý</a>}
          {currentRole === 'tenant' && <a className={`text-base block p-2 rounded-lg ${activePath === 'tenant' ? 'font-bold bg-primary/10 text-primary' : 'font-semibold text-slate-600 hover:bg-slate-50'}`} onClick={(e) => { e.preventDefault(); onNavigate('tenant'); setIsMobileMenuOpen(false); }}>Phòng của tôi</a>}
          {currentRole === 'admin' && <a className={`text-base block p-2 rounded-lg ${activePath === 'admin' ? 'font-bold bg-primary/10 text-primary' : 'font-semibold text-slate-600 hover:bg-slate-50'}`} onClick={(e) => { e.preventDefault(); onNavigate('admin'); setIsMobileMenuOpen(false); }}>Quản trị</a>}
          {!user && (
             <a className="text-base block p-2 rounded-lg font-semibold text-slate-600 sm:hidden mt-2 border-t pt-4" onClick={(e) => { e.preventDefault(); onNavigate('login'); setIsMobileMenuOpen(false); }}>Đăng nhập</a>
          )}
        </nav>
      )}
    </header>
  );
};
