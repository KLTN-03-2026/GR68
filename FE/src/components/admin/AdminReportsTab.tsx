import React from 'react';
import { motion } from 'motion/react';
import { 
  AlertCircle, Eye, CheckCircle, Trash2, Loader2
} from 'lucide-react';

interface AdminReportsTabProps {
  boLocBaoCao: 'all' | 'pending' | 'resolved';
  datBoLocBaoCao: (filter: 'all' | 'pending' | 'resolved') => void;
  danhSachBaoCaoHienTai: any[];
  dangTai: boolean;
  dangTaiThaoTac: string | null;
  xuLyCapNhatTrangThaiBaoCao: (id: string, status: 'resolved') => void;
  xuLyXoaBaoCao: (id: string) => void;
  datIdTinDangNoiBat: (id: string | null) => void;
  datCheDoXemHienTai: (view: any) => void;
  layChuCaiDau: (name?: string) => string;
  dinhDangNgay: (date: string) => string;
}

export const AdminReportsTab = ({ 
  boLocBaoCao, datBoLocBaoCao, danhSachBaoCaoHienTai, dangTai, dangTaiThaoTac,
  xuLyCapNhatTrangThaiBaoCao, xuLyXoaBaoCao, datIdTinDangNoiBat, datCheDoXemHienTai,
  layChuCaiDau, dinhDangNgay
}: AdminReportsTabProps) => {
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col w-full h-full">
                <div className="mb-8 shrink-0">
                  <h2 className="text-2xl font-bold text-slate-900">Báo cáo và phản hồi</h2>
                  <p className="text-slate-500">Phản hồi và khiếu nại từ người dùng về các bài đăng vi phạm.</p>
                </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
          <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${boLocBaoCao === 'all' ? 'border-primary ring-1 ring-primary' : 'border-slate-200'}`}
               onClick={() => datBoLocBaoCao('all')}>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Tổng báo cáo</p>
              <p className="text-2xl font-black text-slate-900">{dangTai ? '-' : danhSachBaoCaoHienTai.length + (boLocBaoCao === 'all' ? 0 : 5)}</p> {/* Ước tính nếu không có allReports */}
            </div>
          </div>
          
          <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${boLocBaoCao === 'pending' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200'}`}
               onClick={() => datBoLocBaoCao('pending')}>
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
              <Loader2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Chờ xử lý</p>
              <p className="text-2xl font-black text-slate-900">{dangTai ? '-' : (boLocBaoCao === 'pending' ? danhSachBaoCaoHienTai.length : '...')}</p>
            </div>
          </div>

          <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${boLocBaoCao === 'resolved' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200'}`}
               onClick={() => datBoLocBaoCao('resolved')}>
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Đã giải quyết</p>
              <p className="text-2xl font-black text-slate-900">{dangTai ? '-' : (boLocBaoCao === 'resolved' ? danhSachBaoCaoHienTai.length : '...')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col flex-1 min-h-0">
          <div className="flex border-b border-slate-200 px-6 shrink-0 bg-slate-50/50">
            {['all', 'pending', 'resolved'].map((filter) => (
              <button 
                key={filter}
                onClick={() => datBoLocBaoCao(filter as any)}
                className={`py-4 px-6 border-b-2 font-black text-sm whitespace-nowrap uppercase transition-all ${
                  boLocBaoCao === filter 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 font-bold'
                }`}
              >
                {filter === 'all' ? 'Tất cả' : filter === 'pending' ? 'Chưa xử lý' : 'Đã giải quyết'}
              </button>
            ))}
          </div>
          <div className="overflow-auto flex-1">
            {dangTai ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="font-black uppercase text-xs">Đang tải danh sách...</p>
              </div>
            ) : danhSachBaoCaoHienTai.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400 text-center p-8">
                <CheckCircle className="w-12 h-12 mb-4 text-emerald-100 mx-auto" />
                <p className="font-black uppercase text-xs">Tuyệt vời! Không có báo cáo nào cần xử lý.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 sticky top-0 z-10 text-slate-500 text-xs font-black uppercase tracking-wider">
                    <th className="px-6 py-4">Người báo cáo</th>
                    <th className="px-6 py-4">Nội dung báo cáo</th>
                    <th className="px-6 py-4">Đối tượng</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                        <tbody className="divide-y divide-slate-200">
                          {danhSachBaoCaoHienTai.map((baoCao) => (
                            <tr key={baoCao.id} className="hover:bg-slate-50">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 overflow-hidden">
                                    {baoCao.thongTinNguoiBaoCao?.avatar_url ? (
                                      <img src={baoCao.thongTinNguoiBaoCao.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                                    ) : (
                                      layChuCaiDau(baoCao.thongTinNguoiBaoCao?.full_name)
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-slate-900">{baoCao.thongTinNguoiBaoCao?.full_name || 'N/A'}</p>
                                    <p className="text-[10px] text-slate-400 font-medium">@user_{baoCao.reporter_id.substring(0,4)}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm font-bold text-slate-800 line-clamp-1">{baoCao.reason}</p>
                                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{baoCao.details || 'Không có mô tả chi tiết.'}</p>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase">
                                  {baoCao.target_type === 'listing' ? 'Tin đăng' : 'Người dùng'}
                                </span>
                                <p className="text-[10px] text-slate-400 font-mono mt-1">{baoCao.target_id.substring(0,8)}...</p>
                              </td>
                              <td className="px-6 py-4">
                                {baoCao.status === 'pending' ? (
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-orange-100 text-orange-600">Chờ lệnh</span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-600">Đã xong</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  {baoCao.target_type === 'listing' && (
                                    <button 
                                      onClick={() => {
                                        datIdTinDangNoiBat(baoCao.target_id);
                                        datCheDoXemHienTai('listings');
                                        // Auto scroll to top to see listings
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                      }}
                                      className="p-1.5 text-primary hover:bg-primary/10 rounded" 
                                      title="Xem tin đăng bị báo cáo"
                                    >
                                      <Eye className="w-5 h-5" />
                                    </button>
                                  )}
                                  {baoCao.status === 'pending' && (
                                    <button onClick={() => xuLyCapNhatTrangThaiBaoCao(baoCao.id, 'resolved')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded" title="Đánh dấu đã giải quyết">
                                      <CheckCircle className="w-5 h-5" />
                                    </button>
                                  )}
                                  <button onClick={() => xuLyXoaBaoCao(baoCao.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Xóa báo cáo">
                                    <Trash2 className="w-5 h-5" />
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
    </>
  );
};
