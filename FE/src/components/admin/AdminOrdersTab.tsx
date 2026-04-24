import React from 'react';
import { motion } from 'motion/react';
import { 
  Package, 
  Search, 
  Eye, 
  Truck, 
  CheckCircle, 
  XCircle, 
  CreditCard, 
  Banknote,
  Clock,
  ChevronRight,
  Loader2,
  Trash2
} from 'lucide-react';

interface DonHang {
  id: string;
  user_id: string;
  items: any[];
  total_amount: number;
  phone: string;
  address: string;
  payment_method: 'vnpay' | 'cod';
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
  seller_note?: string;
  buyerInfo?: {
    full_name: string;
    avatar_url: string;
  };
}

interface AdminOrdersTabProps {
  danhSachDonHang: DonHang[];
  dangTai: boolean;
  dangTaiThaoTac: string | null;
  xuLyCapNhatTrangThaiDonHang: (id: string, status: string) => void;
  xuLyCapNhatChiTietDonHang: (order: DonHang) => void;
  dinhDangNgay: (date: string) => string;
  layChuCaiDau: (name?: string) => string;
}

export const AdminOrdersTab = ({ 
  danhSachDonHang, 
  dangTai, 
  dangTaiThaoTac, 
  xuLyCapNhatTrangThaiDonHang, 
  xuLyCapNhatChiTietDonHang,
  dinhDangNgay,
  layChuCaiDau
}: AdminOrdersTabProps) => {

  const layKieuTrangThai = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'shipping': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'cancelled':
      case 'failed': return 'bg-rose-100 text-rose-600 border-rose-200';
      case 'confirmed': return 'bg-purple-100 text-purple-600 border-purple-200';
      default: return 'bg-orange-100 text-orange-600 border-orange-200';
    }
  };

  const layNhanTrangThai = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      shipping: 'Đang giao',
      delivered: 'Đã giao',
      completed: 'Hoàn tất',
      failed: 'Lỗi/Thất bại',
      cancelled: 'Đã hủy'
    };
    return labels[status] || status;
  };

  const thongKe = {
    total: danhSachDonHang.length,
    pending: danhSachDonHang.filter(o => o.status === 'pending' || o.status === 'confirmed').length,
    completed: danhSachDonHang.filter(o => o.status === 'completed' || o.status === 'delivered').length,
    failed: danhSachDonHang.filter(o => o.status === 'cancelled' || o.status === 'failed').length
  };

  const [tabHienTai, setTabHienTai] = React.useState('all');

  const donHangDaLoc = danhSachDonHang.filter(o => {
    if (tabHienTai === 'all') return true;
    if (tabHienTai === 'pending') return o.status === 'pending' || o.status === 'confirmed';
    if (tabHienTai === 'completed') return o.status === 'completed' || o.status === 'delivered';
    if (tabHienTai === 'failed') return o.status === 'cancelled' || o.status === 'failed';
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col w-full h-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="text-primary w-8 h-8" />
            Quản lý Đơn hàng
          </h2>
          <p className="text-slate-500 mt-1">Theo dõi giao dịch và trạng thái vận chuyển hàng hóa.</p>
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 shrink-0">
        <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${tabHienTai === 'all' ? 'border-primary ring-1 ring-primary' : 'border-slate-200'}`}
             onClick={() => setTabHienTai('all')}>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Tổng đơn hàng</p>
            <p className="text-2xl font-black text-slate-900">{dangTai ? '-' : thongKe.total}</p>
          </div>
        </div>
        
        <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${tabHienTai === 'pending' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200'}`}
             onClick={() => setTabHienTai('pending')}>
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Chờ xử lý</p>
            <p className="text-2xl font-black text-slate-900">{dangTai ? '-' : thongKe.pending}</p>
          </div>
        </div>

        <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${tabHienTai === 'completed' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200'}`}
             onClick={() => setTabHienTai('completed')}>
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Thành công</p>
            <p className="text-2xl font-black text-slate-900">{dangTai ? '-' : thongKe.completed}</p>
          </div>
        </div>

        <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${tabHienTai === 'failed' ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200'}`}
             onClick={() => setTabHienTai('failed')}>
          <div className="p-3 bg-rose-100 text-rose-600 rounded-lg">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Đã hủy/Lỗi</p>
            <p className="text-2xl font-black text-slate-900">{dangTai ? '-' : thongKe.failed}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex-1 flex flex-col min-h-0">
        <div className="flex border-b border-slate-200 px-6 shrink-0 bg-slate-50/50">
          {['all', 'pending', 'completed', 'failed'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setTabHienTai(tab)}
              className={`py-4 px-6 border-b-2 font-black text-sm whitespace-nowrap uppercase transition-all ${
                tabHienTai === tab 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 font-bold'
              }`}
            >
              {tab === 'all' ? 'Tất cả đơn' : tab === 'pending' ? 'Đang xử lý' : tab === 'completed' ? 'Thành công' : 'Đã hủy'}
            </button>
          ))}
        </div>

        <div className="overflow-auto flex-1">
          {dangTai ? (
            <div className="p-20 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-slate-500 font-black uppercase text-xs">Đang tải dữ liệu...</p>
            </div>
          ) : donHangDaLoc.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Package className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-black uppercase text-xs">Không tìm thấy đơn hàng nào.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 sticky top-0 z-10 text-slate-500 text-xs font-black uppercase tracking-wider">
                  <th className="px-6 py-4">Đơn hàng</th>
                  <th className="px-6 py-4">Người mua</th>
                  <th className="px-6 py-4">Thanh toán</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Tổng tiền</th>
                  <th className="px-4 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donHangDaLoc.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-black text-slate-900 uppercase">#{order.id.substring(0,8)}</span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                          <Clock className="w-3 h-3" />
                          {dinhDangNgay(order.created_at)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                          {order.buyerInfo?.avatar_url ? (
                            <img src={order.buyerInfo.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                          ) : (
                            layChuCaiDau(order.buyerInfo?.full_name)
                          )}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-bold text-slate-900">{order.buyerInfo?.full_name || 'Khách vãng lai'}</p>
                          <p className="text-xs text-slate-400">{order.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        {order.payment_method === 'vnpay' ? (
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-black uppercase tracking-wider border border-blue-100">
                            <CreditCard className="w-3 h-3" />
                            VNPay
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 text-slate-600 rounded text-[10px] font-black uppercase tracking-wider border border-slate-200">
                            <Banknote className="w-3 h-3" />
                            COD
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${layKieuTrangThai(order.status)}`}>
                        {layNhanTrangThai(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-sm font-black text-slate-900">
                        {order.total_amount.toLocaleString('vi-VN')}đ
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{order.items?.length || 0} sản phẩm</p>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => xuLyCapNhatTrangThaiDonHang(order.id, 'remind')}
                            disabled={dangTaiThaoTac === order.id}
                            className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 rounded-lg text-xs font-bold transition-all"
                            title="Gửi thông báo nhắc nhở người bán xử lý đơn"
                          >
                            <Clock className="w-4 h-4" />
                            Nhắc nhở
                          </button>
                        )}
                        <button 
                          onClick={() => xuLyCapNhatChiTietDonHang(order)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                          title="Xem chi tiết đơn hàng"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </motion.div>
  );
};
