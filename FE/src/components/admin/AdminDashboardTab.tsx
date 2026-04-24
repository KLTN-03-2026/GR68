import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, BarChart as ChartIcon, FileText, CheckCircle, Wallet, ShoppingCart, Shield, Clock 
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AdminDashboardTabProps {
  tongQuanThongKe: any;
  dangTai: boolean;
  datCheDoXem: (v: any) => void;
  datCheDoTinDang: (m: any) => void;
}

export const AdminDashboardTab = ({ tongQuanThongKe, dangTai, datCheDoXem, datCheDoTinDang }: AdminDashboardTabProps) => {
  // Dữ liệu Biểu đồ
  const duLieuBieuDoDuong = {
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    datasets: [
      {
        label: 'Tin đăng mới',
        data: [12, 19, 15, 22, 18, 24, 20],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Sản phẩm mới',
        data: [8, 12, 20, 14, 16, 10, 18],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ],
  };

  const duLieuBieuDoTron = {
    labels: ['Tin Phòng', 'Sản phẩm Đồ cũ'],
    datasets: [
      {
        data: [tongQuanThongKe.totalListings, tongQuanThongKe.totalProducts],
        backgroundColor: ['#3b82f6', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  const duLieuTruyCap = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    datasets: [
      {
        label: 'Số lượt truy cập',
        data: [2500, 3200, 3800, 4500, 4200, 5600, 7800, 9200, 8500, 9800, 11500, 12800],
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
        borderRadius: 8,
      }
    ]
  };

  const tuyChonBieuDo = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { font: { weight: 'bold' as any, family: 'Inter' } }
      },
    },
    scales: {
      y: { beginAtZero: true, grid: { display: false } },
      x: { grid: { display: false } }
    }
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col w-full h-full">
                <div className="mb-8 shrink-0">
                  <h2 className="text-2xl font-bold text-slate-900">Bảng điều khiển Hệ thống</h2>
                  <p className="text-slate-500">Phân tích dữ liệu tổng thể và hiệu suất kinh doanh.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-primary transition-colors"
                       onClick={() => { datCheDoXem('listings'); datCheDoTinDang('room'); }}>
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-500 mb-1">Tin Thuê Phòng</p>
                    <p className="text-3xl font-black text-slate-900">{dangTai ? '...' : tongQuanThongKe.totalListings}</p>
                    <div className="mt-2 text-xs text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded inline-block">Listings</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-primary transition-colors"
                       onClick={() => { datCheDoXem('listings'); datCheDoTinDang('product'); }}>
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-500 mb-1">Sản phẩm Bán</p>
                    <p className="text-3xl font-black text-slate-900">{dangTai ? '...' : tongQuanThongKe.totalProducts}</p>
                    <div className="mt-2 text-xs text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded inline-block">Store</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-primary transition-colors"
                       onClick={() => datCheDoXem('users')}>
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                      <Users className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-500 mb-1">Thành viên</p>
                    <p className="text-3xl font-black text-slate-900">{dangTai ? '...' : tongQuanThongKe.totalUsers}</p>
                    <div className="mt-2 text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded inline-block">Users</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-500 mb-1">Hợp đồng thuê</p>
                    <p className="text-3xl font-black text-slate-900">{dangTai ? '...' : tongQuanThongKe.activeContracts}</p>
                    <div className="mt-2 text-xs text-purple-600 font-bold bg-purple-50 px-2 py-1 rounded inline-block">Running</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center mb-4">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-500 mb-1">Doanh thu (Ước tính)</p>
                    <p className="text-2xl font-black text-slate-900">{dangTai ? '...' : tongQuanThongKe.totalRevenue.toLocaleString('vi-VN')} đ</p>
                    <div className="mt-2 text-xs text-slate-600 font-bold bg-slate-50 px-2 py-1 rounded inline-block">Payment Based</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-[400px]">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Tăng trưởng Tin đăng</h3>
                    <div className="h-[300px]">
                      <Line data={duLieuBieuDoDuong} options={tuyChonBieuDo} />
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 font-display">Cơ cấu Nội dung</h3>
                    <div className="flex-1 flex items-center justify-center">
                      <Pie data={duLieuBieuDoTron} options={{ ...tuyChonBieuDo, plugins: { ...tuyChonBieuDo.plugins, legend: { position: 'bottom' } } }} />
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-[400px]">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <ChartIcon className="w-6 h-6 text-indigo-500" />
                        Thống kê lượng truy cập Website
                    </h3>
                    <div className="h-[280px]">
                        <Bar 
                            data={duLieuTruyCap} 
                            options={{
                                ...tuyChonBieuDo,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: { color: 'rgba(0,0,0,0.05)' }
                                    },
                                    x: {
                                        grid: { display: false }
                                    }
                                }
                            }} 
                        />
                    </div>
                </div>
              </motion.div>
    </>
  );
};
