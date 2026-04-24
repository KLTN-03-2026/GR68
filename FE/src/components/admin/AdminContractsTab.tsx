import React from 'react';
import { motion } from 'motion/react';
import { 
  FileSignature, 
  Calendar, 
  User, 
  Home, 
  DollarSign, 
  FileText, 
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Loader2
} from 'lucide-react';

interface HopDong {
  id: string;
  room_id: string;
  tenant_id: string;
  owner_id: string;
  start_date: string;
  end_date: string;
  tienThueHangThang?: number;
  deposit: number;
  status: 'active' | 'terminated' | 'expired';
  contract_url?: string;
  thongTinPhong?: { title: string };
  thongTinNguoiThue?: { full_name: string; avatar_url: string };
  thongTinChuTro?: { full_name: string; avatar_url: string };
}

interface PropsAdminContractsTab {
  danhSachHopDong: HopDong[];
  dangTai: boolean;
  dinhDangNgay: (date: string) => string;
  layChuCaiDau: (name?: string) => string;
}

export const AdminContractsTab = ({ 
  danhSachHopDong, dangTai, dinhDangNgay, layChuCaiDau 
}: PropsAdminContractsTab) => {

  const layTrangThai = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-600 border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            Đang hiệu lực
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-600 border border-amber-200">
            <AlertCircle className="w-3 h-3" />
            Đã hết hạn
          </span>
        );
      case 'terminated':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
            <FileText className="w-3 h-3" />
            Đã thanh lý
          </span>
        );
      default:
        return status;
    }
  };

  const [tabHienTai, setTabHienTai] = React.useState('all');

  const thongKe = {
    tongSo: danhSachHopDong.length,
    dangHieuLuc: danhSachHopDong.filter(c => c.status === 'active').length,
    daHetHan: danhSachHopDong.filter(c => c.status === 'expired').length,
    daThanhLy: danhSachHopDong.filter(c => c.status === 'terminated').length
  };

  const danhSachHopDongDaLoc = danhSachHopDong.filter(c => {
    if (tabHienTai === 'all') return true;
    return c.status === tabHienTai;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col w-full h-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileSignature className="text-primary w-8 h-8" />
            Quản lý Hợp đồng
          </h2>
          <p className="text-slate-500 mt-1">Giám sát các cam kết thuê phòng và giao dịch đặt cọc.</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 shrink-0">
        <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${tabHienTai === 'all' ? 'border-primary ring-1 ring-primary' : 'border-slate-200'}`}
             onClick={() => setTabHienTai('all')}>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <FileSignature className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Tổng hợp đồng</p>
            <p className="text-2xl font-black text-slate-900">{dangTai ? '-' : thongKe.tongSo}</p>
          </div>
        </div>
        
        <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${tabHienTai === 'active' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200'}`}
             onClick={() => setTabHienTai('active')}>
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Đang hiệu lực</p>
            <p className="text-2xl font-black text-slate-900">{dangTai ? '-' : thongKe.dangHieuLuc}</p>
          </div>
        </div>

        <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${tabHienTai === 'expired' ? 'border-amber-500 ring-1 ring-amber-500' : 'border-slate-200'}`}
             onClick={() => setTabHienTai('expired')}>
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Đã hết hạn</p>
            <p className="text-2xl font-black text-slate-900">{dangTai ? '-' : thongKe.daHetHan}</p>
          </div>
        </div>

        <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${tabHienTai === 'terminated' ? 'border-slate-500 ring-1 ring-slate-500' : 'border-slate-200'}`}
             onClick={() => setTabHienTai('terminated')}>
          <div className="p-3 bg-slate-100 text-slate-600 rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Đã thanh lý</p>
            <p className="text-2xl font-black text-slate-900">{dangTai ? '-' : thongKe.daThanhLy}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex-1 flex flex-col min-h-0">
        <div className="flex border-b border-slate-200 px-6 shrink-0 bg-slate-50/50">
          {['all', 'active', 'expired', 'terminated'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setTabHienTai(tab)}
              className={`py-4 px-6 border-b-2 font-black text-sm whitespace-nowrap uppercase transition-all ${
                tabHienTai === tab 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 font-bold'
              }`}
            >
              {tab === 'all' ? 'Tất cả' : tab === 'active' ? 'Đang hiệu lực' : tab === 'expired' ? 'Đã hết hạn' : 'Đã thanh lý'}
            </button>
          ))}
        </div>

        <div className="overflow-auto flex-1">
          {dangTai ? (
            <div className="p-20 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-slate-500 font-black uppercase text-xs">Đang tải danh sách...</p>
            </div>
          ) : danhSachHopDongDaLoc.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <FileSignature className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-black uppercase text-xs">Không tìm thấy hợp đồng nào.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 sticky top-0 z-10 text-slate-500 text-xs font-black uppercase tracking-wider">
                  <th className="px-6 py-4">Thông tin Hợp đồng</th>
                  <th className="px-6 py-4">Bên cho thuê</th>
                  <th className="px-6 py-4">Bên thuê</th>
                  <th className="px-6 py-4">Giá thuê & Cọc</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-4 py-4 text-right">Tài liệu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {danhSachHopDongDaLoc.map((contract) => (
                  <tr key={contract.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-black text-slate-900 line-clamp-1">{contract.thongTinPhong?.title || 'Phòng không xác định'}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                          <Calendar className="w-3 h-3" />
                          {dinhDangNgay(contract.start_date).split(' ')[0]} - {dinhDangNgay(contract.end_date).split(' ')[0]}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600 overflow-hidden border border-blue-100">
                          {contract.thongTinChuTro?.avatar_url ? (
                            <img src={contract.thongTinChuTro.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                          ) : (
                            layChuCaiDau(contract.thongTinChuTro?.full_name)
                          )}
                        </div>
                        <p className="text-xs font-bold text-slate-700">{contract.thongTinChuTro?.full_name || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-[10px] font-bold text-emerald-600 overflow-hidden border border-emerald-100">
                          {contract.thongTinNguoiThue?.avatar_url ? (
                            <img src={contract.thongTinNguoiThue.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                          ) : (
                            layChuCaiDau(contract.thongTinNguoiThue?.full_name)
                          )}
                        </div>
                        <p className="text-xs font-bold text-slate-700">{contract.thongTinNguoiThue?.full_name || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <p className="text-sm font-black text-primary">{(contract.tienThueHangThang || 0).toLocaleString('vi-VN')} đ</p>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold italic">
                          <DollarSign className="w-2.5 h-2.5" />
                          Cọc: {(contract.deposit || 0).toLocaleString('vi-VN')} đ
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      {layTrangThai(contract.status)}
                    </td>
                    <td className="px-6 py-6 text-right">
                      {contract.contract_url ? (
                        <a 
                          href={contract.contract_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                        >
                          Xem PDF
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-300 italic">Chưa có bản số</span>
                      )}
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
