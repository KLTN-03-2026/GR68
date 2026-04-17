import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Wrench, Clock, CheckCircle, MessageSquare, PlusCircle, User, Home as HomeIcon
} from 'lucide-react';

interface TenantSupportTabProps {
  danhSachHoTro: any[];
  dangTaiDuLieu: boolean;
  danhSachPhong: any[];
  setHienThiModalThem: (show: boolean) => void;
  setFormYeuCauMoi: any;
}

export const TenantSupportTab = ({ 
  danhSachHoTro, 
  dangTaiDuLieu, 
  danhSachPhong, 
  setHienThiModalThem, 
  setFormYeuCauMoi 
}: TenantSupportTabProps) => {
  const [boLocHienTai, setBoLocHienTai] = useState('all');

  const thongKe = [
    { label: 'Đã gửi', value: danhSachHoTro.filter(r => r.status === 'pending').length, sub: 'Chờ tiếp nhận', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Đang xử lý', value: danhSachHoTro.filter(r => r.status === 'processing').length, sub: 'Đang sửa chữa', icon: Wrench, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Hoàn thành', value: danhSachHoTro.filter(r => r.status === 'resolved').length, sub: 'Đã giải quyết', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Tổng số', value: danhSachHoTro.length, sub: 'Tất cả yêu cầu', icon: MessageSquare, color: 'text-slate-600', bg: 'bg-slate-100' }
  ];

  const danhSachYeuCauDaLoc = boLocHienTai === 'all' 
    ? danhSachHoTro 
    : danhSachHoTro.filter(r => r.status === boLocHienTai);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 w-full"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 font-display">Hỗ Trợ & Sửa Chữa</h2>
          <p className="text-slate-500 font-medium">Gửi yêu cầu hỗ trợ tới chủ trọ khi gặp sự cố.</p>
        </div>
        <button 
          onClick={() => {
            if (danhSachPhong.length > 0) {
              setFormYeuCauMoi((f: any) => ({ ...f, roomId: danhSachPhong[0].id }));
            }
            setHienThiModalThem(true);
          }}
          className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          Gửi yêu cầu mới
        </button>
      </div>

      {danhSachHoTro.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {thongKe.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon className="w-16 h-16" />
              </div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                <div className={`${stat.bg} ${stat.color} p-2 rounded-xl`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 font-display relative z-10">{stat.value}</div>
              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter relative z-10">{stat.sub}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Bộ lọc:</span>
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'pending', label: 'Đã gửi' },
                { id: 'processing', label: 'Đang sửa' },
                { id: 'resolved', label: 'Hoàn thành' },
              ].map((filter) => (
                <button 
                  key={filter.id}
                  onClick={() => setBoLocHienTai(filter.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    boLocHienTai === filter.id 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8 flex flex-col gap-4">
          {dangTaiDuLieu ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-bold uppercase tracking-widest">Đang tải yêu cầu...</p>
            </div>
          ) : danhSachYeuCauDaLoc.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-8 ring-8 ring-slate-50/50">
                <Wrench className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 font-display">
                {boLocHienTai === 'all' ? 'Không có yêu cầu nào' : 'Không có yêu cầu trong mục này'}
              </h3>
              <p className="text-slate-500 max-w-sm font-medium leading-relaxed">
                {boLocHienTai === 'all' 
                  ? 'Mọi thứ trong phòng của bạn có vẻ đang hoạt động rất tốt!' 
                  : 'Hãy thử đổi bộ lọc khác để xem thêm kết quả.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {danhSachYeuCauDaLoc.map(req => {
                const statusText = req.status === 'pending' ? 'Đã gửi' : req.status === 'processing' ? 'Đang sửa' : 'Hoàn thành';
                const statusColor = req.status === 'pending' ? 'bg-orange-100 text-orange-700' : req.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700';
                const Icon = req.status === 'pending' ? Clock : req.status === 'processing' ? Wrench : CheckCircle;
                const date = new Date(req.created_at).toLocaleDateString('vi-VN');

                return (
                  <div key={req.id} className="p-8 rounded-[2rem] border border-slate-100 hover:border-primary/20 hover:bg-primary/[0.02] hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8 group">
                    <div className="flex items-start gap-6 flex-1">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border-2 border-white ${
                        req.status === 'pending' ? 'bg-orange-50 text-orange-500' : 
                        req.status === 'processing' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'
                      }`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-black text-xl text-slate-900 group-hover:text-primary transition-colors font-display">{req.title}</h4>
                        <p className="text-slate-500 font-medium leading-relaxed">{req.description}</p>
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">
                            <HomeIcon className="w-3.5 h-3.5" /> {req.rooms?.title}
                          </span>
                          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">
                            <Clock className="w-3.5 h-3.5" /> {date}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${statusColor}`}>
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                          req.status === 'pending' ? 'bg-orange-500' : 
                          req.status === 'processing' ? 'bg-blue-500' : 'bg-green-500'
                        }`}></div>
                        {statusText}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
