import React from 'react';
import { motion } from 'motion/react';
import { Home as HomeIcon, Bed, Wallet, Plus, FileText, User } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface OverviewTabProps {
  user: SupabaseUser | null;
  roomsData: any[];
  invoicesData: any[];
  listingsData: any[];
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  chartData: any[];
}

export const OverviewTab = ({
  user,
  roomsData,
  invoicesData,
  listingsData,
  selectedYear,
  setSelectedYear,
  chartData
}: OverviewTabProps) => {
  const stats = [
    { 
      label: 'Tổng số phòng', 
      value: roomsData.length.toString(), 
      change: '+0%', 
      trend: 'up', 
      icon: HomeIcon,
      color: 'bg-primary/10 text-primary',
      badge: 'bg-green-100 text-green-700'
    },
    { 
      label: 'Phòng đang trống', 
      value: roomsData.filter((r: any) => r.status === 'empty').length.toString(), 
      change: `${roomsData.filter((r: any) => r.status === 'empty').length} trống`, 
      trend: 'neutral', 
      icon: Bed,
      color: 'bg-orange-100 text-orange-600',
      badge: 'bg-orange-100 text-orange-700'
    },
    { 
      label: 'Doanh thu tháng này', 
      value: `${invoicesData.filter((inv: any) => inv.status === 'paid').reduce((acc: number, inv: any) => acc + Number(inv.amount), 0).toLocaleString()}đ`, 
      change: '+0%', 
      trend: 'up', 
      icon: Wallet,
      color: 'bg-emerald-100 text-emerald-600',
      badge: 'bg-green-100 text-green-700'
    },
  ];

  const recentListings = listingsData.slice(0, 3).map((l: any) => ({
    id: l.id,
    title: l.title,
    price: `${Number(l.price).toLocaleString()}đ`,
    status: l.is_active ? 'Đang hiển thị' : 'Tạm ẩn',
    statusColor: l.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600',
    image: l.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=200'
  }));

  const quickActions = [
    { label: 'Thêm phòng mới', icon: Plus },
    { label: 'Lập hợp đồng', icon: FileText },
    { label: 'Xuất hóa đơn', icon: Wallet },
    { label: 'Quản lý người ở', icon: User },
  ];

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 font-display">
          Chào buổi sáng, {user?.user_metadata?.full_name?.split(' ').pop() || 'Thành'}!
        </h2>
        <p className="text-slate-500 font-medium">Dưới đây là thống kê tình hình kinh doanh của bạn hôm nay.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.badge}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-3xl font-black mt-1 text-slate-900 font-display">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart Mockup */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-bold text-slate-900 font-display">Doanh thu 6 tháng gần nhất ({selectedYear})</h3>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="text-sm font-bold bg-slate-50 border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="2024">Năm 2024</option>
              <option value="2023">Năm 2023</option>
              <option value="2022">Năm 2022</option>
            </select>
          </div>
          
          <div className="relative h-[300px] w-full flex items-end justify-between px-4">
            {chartData.map((data: any, i: number) => (
              <div key={i} className="flex flex-col items-center gap-4 w-12 md:w-16">
                <div className="w-full bg-slate-50 rounded-t-2xl h-full relative overflow-hidden group">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${data.height}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="absolute bottom-0 left-0 right-0 bg-primary/20 rounded-t-2xl"
                  />
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${data.height * 0.7}%` }}
                    transition={{ duration: 1.2, delay: i * 0.1 }}
                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-2xl shadow-[0_-4px_10px_rgba(255,152,0,0.3)]"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 flex items-center justify-center">
                    <span className="bg-white text-primary text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                      {data.displayValue}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400">{data.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Listings */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900 font-display">Tin đăng gần đây</h3>
            <button className="text-primary text-sm font-bold hover:underline">Xem tất cả</button>
          </div>
          
          <div className="space-y-6 flex-1">
            {recentListings.map((listing: any) => (
              <div key={listing.id} className="flex gap-4 group cursor-pointer">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                  <img 
                    src={listing.image} 
                    alt={listing.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{listing.title}</p>
                  <p className="text-xs font-bold text-primary mt-0.5">{listing.price}</p>
                  <span className={`inline-flex mt-2 items-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${listing.statusColor}`}>
                    {listing.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-8 w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-bold text-sm hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Tạo tin mới
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-10 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-8 font-display">Thao tác nhanh</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {quickActions.map((action, i) => (
            <button 
              key={i}
              className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-slate-50 hover:bg-primary/10 hover:text-primary transition-all group border border-transparent hover:border-primary/20"
            >
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <action.icon className="w-7 h-7" />
              </div>
              <span className="text-sm font-bold text-slate-700 group-hover:text-primary">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
