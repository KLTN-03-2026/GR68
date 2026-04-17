import React from 'react';
import { motion } from 'motion/react';
import { Wallet, Info, FileText, CheckCircle, CreditCard, ChevronRight } from 'lucide-react';

interface TabHoaDonNguoiThueProps {
  danhSachHoaDon: any[];
  xuLyXemChiTiet: (hoaDon: any) => void;
  xuLyThanhToan: (idHoaDon: string) => void;
}

/**
 * Component hiển thị danh sách hóa đơn theo tháng của người thuê
 * Chuẩn hóa trạng thái và logic thanh toán
 */
export const TenantInvoicesTab = ({ danhSachHoaDon, xuLyXemChiTiet, xuLyThanhToan }: TabHoaDonNguoiThueProps) => {
  // Chuẩn hóa dữ liệu hóa đơn để dễ mapping
  const danhSachHoaDonChuanHoa = danhSachHoaDon.map(hoaDon => ({
    id: hoaDon.id,
    title: hoaDon.title,
    room: hoaDon.rooms?.title || 'Unknown Room',
    amount: `${Number(hoaDon.amount).toLocaleString()}đ`,
    dueDate: new Date(hoaDon.due_date).toLocaleDateString('vi-VN'),
    status: hoaDon.status,
    statusLabel: hoaDon.status === 'paid' ? 'Đã thanh toán' : 
                 hoaDon.status === 'unpaid' ? 'Chưa thanh toán' : 
                 hoaDon.status === 'pending_verification' ? 'Chờ xác nhận' : 'Quá hạn',
    statusColor: hoaDon.status === 'paid' ? 'bg-green-100 text-green-700' : 
                 hoaDon.status === 'unpaid' ? 'bg-orange-100 text-orange-700' : 
                 hoaDon.status === 'pending_verification' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700',
    raw: hoaDon
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 font-display">Hóa đơn của tôi</h2>
          <p className="text-slate-500 font-medium">Theo dõi và thanh toán hóa đơn hàng tháng.</p>
        </div>
      </div>

      {danhSachHoaDonChuanHoa.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-200 px-6">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
            <FileText className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có hóa đơn nào</h3>
          <p className="text-slate-500 max-w-sm">Mọi thứ đều sạch sẽ. Bạn sẽ thấy hóa đơn ở đây khi đến kỳ thanh toán.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-left">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tiêu đề (Phòng)</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hạn thanh toán</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng tiền</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {danhSachHoaDonChuanHoa.map((hoaDon) => (
                  <tr key={hoaDon.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-slate-900 font-display">{hoaDon.title}</span>
                        <span className="text-xs font-bold text-primary">{hoaDon.room}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-slate-500">{hoaDon.dueDate}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-black text-slate-900">{hoaDon.amount}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${hoaDon.statusColor}`}>
                        {hoaDon.statusLabel}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => xuLyXemChiTiet(hoaDon.raw)}
                          className="p-2 text-slate-400 hover:text-primary bg-slate-50 hover:bg-primary/10 rounded-xl transition-colors"
                          title="Xem chi tiết"
                        >
                          <Info className="w-5 h-5" />
                        </button>
                        
                        {hoaDon.status === 'unpaid' && (
                          <button
                            onClick={() => xuLyThanhToan(hoaDon.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary-hover transition-colors"
                          >
                            <CreditCard className="w-4 h-4" />
                            Đã CK
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};
