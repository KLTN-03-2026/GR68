import React, { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, User, LogOut, Menu, X, Heart, MessageSquare, Plus, ShoppingBag, Phone, LayoutDashboard, Bed, Shield, Crown, Sparkles } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { NotificationBell } from '../shared/NotificationBell';
import { supabase } from '../../lib/supabase';

import { useAuth } from '../../context/AuthContext';

export type Page = 'home' | 'login' | 'register' | 'store' | 'manage' | 'contact' | 'search' | 'tenant' | 'admin' | 'listing-detail' | 'my-store';

interface HeaderProps {
  user: SupabaseUser | null;
  onLogout: () => void;
  onNavigate: (page: Page, params?: any) => void;
  activePath?: Page;
  children?: ReactNode;
}

export const Header = ({ user, onLogout, onNavigate, activePath, children }: HeaderProps) => {
  const { role: currentRole } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'pro' | 'enterprise'>('free');

  useEffect(() => {
    if (!user || currentRole !== 'landlord') {
      setSubscriptionTier('free');
      return;
    }
    const fetchTier = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();
      if (data?.subscription_tier) {
        setSubscriptionTier(data.subscription_tier as any);
      }
    };
    fetchTier();
  }, [user, currentRole]);

  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setUnreadMessagesCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const { data: convs, error: convError } = await supabase
          .from('conversations')
          .select('id')
          .or(`tenant_id.eq.${user.id},landlord_id.eq.${user.id}`);

        if (convError) throw convError;
        if (!convs || convs.length === 0) {
          setUnreadMessagesCount(0);
          return;
        }

        const convIds = convs.map((c: any) => c.id);

        const { count, error: msgError } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .in('conversation_id', convIds)
          .is('read_at', null)
          .neq('sender_id', user.id);

        if (msgError) throw msgError;
        setUnreadMessagesCount(count || 0);
      } catch (err) {
        console.error('Error fetching unread message count:', err);
      }
    };

    fetchUnreadCount();

    const channel = supabase
      .channel('header-unread-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload) => {
          const newMsg = payload.new;
          if (newMsg && newMsg.sender_id !== user.id) {
            const { data } = await supabase
              .from('conversations')
              .select('id')
              .eq('id', newMsg.conversation_id)
              .or(`tenant_id.eq.${user.id},landlord_id.eq.${user.id}`)
              .maybeSingle();

            if (data) {
              setUnreadMessagesCount((prev) => prev + 1);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleNavigateToMessages = () => {
    if (currentRole === 'landlord') {
      onNavigate('manage', { tab: 'messages' });
    } else if (currentRole === 'admin') {
      onNavigate('admin', { tab: 'messages' });
    } else {
      onNavigate('tenant', { tab: 'messages' });
    }
  };

  return (
    <>
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
                className={`flex items-center gap-1.5 text-sm ${activePath === 'home' ? 'font-bold text-primary border-b-2 border-primary pb-1' : 'font-semibold text-slate-600 hover:text-primary transition-colors'}`} 
                href="#" 
                onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
              >
                <Home className="w-4 h-4" />
                <span>Trang chủ</span>
              </a>
              <a 
                className={`flex items-center gap-1.5 text-sm ${activePath === 'store' ? 'font-bold text-primary border-b-2 border-primary pb-1' : 'font-semibold text-slate-600 hover:text-primary transition-colors'}`} 
                href="#" 
                onClick={(e) => { e.preventDefault(); onNavigate('store'); }}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Cửa hàng</span>
              </a>
              <a 
                className={`flex items-center gap-1.5 text-sm ${activePath === 'contact' ? 'font-bold text-primary border-b-2 border-primary pb-1' : 'font-semibold text-slate-600 hover:text-primary transition-colors'}`} 
                href="#" 
                onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}
              >
                <Phone className="w-4 h-4" />
                <span>Liên hệ</span>
              </a>
              {currentRole === 'landlord' && (
                <a 
                  className={`flex items-center gap-1.5 text-sm ${activePath === 'manage' ? 'font-bold text-primary border-b-2 border-primary pb-1' : 'font-semibold text-slate-600 hover:text-primary transition-colors'}`} 
                  href="#"
                  onClick={(e) => { e.preventDefault(); onNavigate('manage'); }}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Quản lý</span>
                </a>
              )}
              {currentRole === 'tenant' && (
                <a 
                  className={`flex items-center gap-1.5 text-sm ${activePath === 'tenant' ? 'font-bold text-primary border-b-2 border-primary pb-1' : 'font-semibold text-slate-600 hover:text-primary transition-colors'}`} 
                  href="#"
                  onClick={(e) => { e.preventDefault(); onNavigate('tenant'); }}
                >
                  <Bed className="w-4 h-4" />
                  <span>Phòng của tôi</span>
                </a>
              )}
              {currentRole === 'admin' && (
                <a 
                  className={`flex items-center gap-1.5 text-sm ${activePath === 'admin' ? 'font-bold text-primary border-b-2 border-primary pb-1' : 'font-semibold text-slate-600 hover:text-primary transition-colors'}`} 
                  href="#"
                  onClick={(e) => { e.preventDefault(); onNavigate('admin'); }}
                >
                  <Shield className="w-4 h-4" />
                  <span>Quản trị</span>
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
              <div className="flex items-center gap-2 md:gap-4 ml-2">
                {currentRole === 'landlord' && (
                  <button
                    onClick={() => onNavigate('manage', { tab: 'listings', action: 'add-listing' })}
                    className="h-10 px-4 rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:from-orange-600 hover:to-orange-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all duration-200 border border-orange-400/20 shrink-0"
                    title="Đăng bài phòng mới"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden md:inline">Đăng bài</span>
                  </button>
                )}
                {currentRole === 'tenant' && (
                  <button
                    onClick={() => onNavigate('tenant', { tab: 'favorites' })}
                    className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-100 hover:scale-105 shadow-sm shrink-0"
                    title="Tin đăng đã lưu"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                )}
                <button
                  onClick={handleNavigateToMessages}
                  className="relative w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all border border-slate-100 hover:scale-105 shadow-sm shrink-0"
                  title="Tin nhắn"
                >
                  <MessageSquare className="w-4 h-4" />
                  {unreadMessagesCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center px-1 text-[8px] font-black text-white"
                    >
                      {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                    </motion.span>
                  )}
                </button>
                <NotificationBell user={user} onNavigate={onNavigate} />
                <div className="flex items-center gap-2 cursor-pointer group" onClick={() => {
                  if (currentRole === 'tenant') onNavigate('tenant');
                  else if (currentRole === 'landlord') onNavigate('manage');
                  else if (currentRole === 'admin') onNavigate('admin');
                }}>
                  <div className={`relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all border shrink-0 ${
                    subscriptionTier === 'enterprise'
                      ? 'bg-amber-50 text-amber-600 border-amber-300 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500'
                      : subscriptionTier === 'pro'
                        ? 'bg-orange-50 text-orange-500 border-orange-300 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500'
                        : 'bg-primary/10 text-primary border-primary/20 group-hover:bg-primary group-hover:text-white'
                  }`}>
                    <User className="w-5 h-5" />
                    {subscriptionTier === 'enterprise' && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md shadow-amber-500/30 border border-white">
                        <Crown className="w-2.5 h-2.5 text-white fill-current" />
                      </span>
                    )}
                    {subscriptionTier === 'pro' && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-md shadow-orange-500/30 border border-white">
                        <Sparkles className="w-2.5 h-2.5 text-white fill-current" />
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:flex flex-col leading-none">
                    <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                    {subscriptionTier === 'enterprise' && (
                      <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-0.5 mt-0.5">
                        <Crown className="w-2.5 h-2.5 fill-current" /> ĐỐI TÁC
                      </span>
                    )}
                    {subscriptionTier === 'pro' && (
                      <span className="text-[9px] font-black uppercase tracking-widest text-orange-500 flex items-center gap-0.5 mt-0.5">
                        <Sparkles className="w-2.5 h-2.5 fill-current" /> VIP PRO
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={onLogout}
                  className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all border border-slate-100 hidden sm:flex shrink-0"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3.5 ml-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="h-10 px-4 rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:from-orange-600 hover:to-orange-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all duration-200 border border-orange-400/20 shrink-0 hidden sm:flex"
                >
                  <Plus className="w-4 h-4" />
                  <span>Đăng tin miễn phí</span>
                </button>
                <button onClick={() => onNavigate('login')} className="text-sm font-bold text-slate-600 hover:text-primary transition-colors hidden sm:block">Đăng nhập</button>
                <button onClick={() => onNavigate('register')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold px-5 py-2.5 rounded-2xl transition-all border border-slate-200 hover:scale-105 active:scale-95 hidden sm:block">Đăng ký</button>
              </div>
            )}

            {/* Mobile Hamburger menu toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors border border-slate-100 shadow-sm shrink-0"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-[100]">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            {/* Drawer Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-80 bg-white p-6 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setIsMobileMenuOpen(false); onNavigate('home'); }}>
                  <Home className="w-6 h-6 text-primary" />
                  <span className="font-bold text-slate-900 font-display text-lg">Trọ Pro</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Navigation Links */}
              <nav className="flex flex-col gap-4 flex-grow overflow-y-auto pr-1">
                <a 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activePath === 'home' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`} 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); onNavigate('home'); }}
                >
                  <Home className="w-5 h-5" />
                  <span>Trang chủ</span>
                </a>
                <a 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activePath === 'store' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`} 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); onNavigate('store'); }}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Cửa hàng</span>
                </a>
                <a 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activePath === 'contact' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`} 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); onNavigate('contact'); }}
                >
                  <Phone className="w-5 h-5" />
                  <span>Liên hệ</span>
                </a>
                
                {/* Role specific links in mobile menu */}
                {currentRole === 'landlord' && (
                  <>
                    <button 
                      onClick={() => { setIsMobileMenuOpen(false); onNavigate('manage', { tab: 'listings', action: 'add-listing' }); }}
                      className="mx-4 my-2 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:from-orange-600 hover:to-orange-500 text-white font-bold text-sm transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Đăng bài phòng mới</span>
                    </button>
                    <a 
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activePath === 'manage' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`} 
                      href="#"
                      onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); onNavigate('manage'); }}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span>Quản lý Chủ trọ</span>
                    </a>
                  </>
                )}
                {currentRole === 'tenant' && (
                  <a 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activePath === 'tenant' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`} 
                    href="#"
                    onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); onNavigate('tenant'); }}
                  >
                    <Bed className="w-5 h-5" />
                    <span>Phòng của tôi</span>
                  </a>
                )}
                {currentRole === 'admin' && (
                  <a 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activePath === 'admin' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`} 
                    href="#"
                    onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); onNavigate('admin'); }}
                  >
                    <Shield className="w-5 h-5" />
                    <span>Quản trị Hệ thống</span>
                  </a>
                )}
              </nav>

              {/* Footer inside mobile menu */}
              <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 break-all">
                          {user.user_metadata?.full_name || user.email?.split('@')[0]}
                        </span>
                        <span className="text-xs text-slate-400 capitalize">
                          {currentRole === 'landlord' ? 'Chủ trọ' : currentRole === 'tenant' ? 'Người thuê' : currentRole === 'admin' ? 'Quản trị' : 'Thành viên'}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 font-bold text-sm transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => { setIsMobileMenuOpen(false); onNavigate('login'); }}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-orange-500 text-white font-black text-sm transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Đăng tin miễn phí</span>
                    </button>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button 
                        onClick={() => { setIsMobileMenuOpen(false); onNavigate('login'); }}
                        className="w-full py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-bold text-xs transition-all text-center border border-slate-200"
                      >
                        Đăng nhập
                      </button>
                      <button 
                        onClick={() => { setIsMobileMenuOpen(false); onNavigate('register'); }}
                        className="w-full py-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-all text-center border border-slate-200"
                      >
                        Đăng ký
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
