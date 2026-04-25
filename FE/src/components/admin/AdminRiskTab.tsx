import React from 'react';
import { motion } from 'motion/react';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Droplets, 
  Zap, 
  ExternalLink,
  Loader2,
  ShieldAlert,
  CheckCircle
} from 'lucide-react';

interface CanhBaoRuiRo {
  id: string;
  room_id: string;
  risk_type: 'dien' | 'nuoc';
  risk_level: 'thap' | 'trung_binh' | 'cao';
  details: string;
  detected_at: string;
  thongTinPhong?: {
    id: string;
    title: string;
    location?: string;
  };
}

interface ThongSoTabRuiRoAdmin {
  danhSachRuiRo: CanhBaoRuiRo[];
  dangTai: boolean;
  xuLyChuyenHuongDenPhong: (roomId: string) => void;
}

export const TabRuiRoAdmin = ({ danhSachRuiRo, dangTai, xuLyChuyenHuongDenPhong }: ThongSoTabRuiRoAdmin) => {
  const layMauMucDoRuiRo = (level: string) => {
    switch (level) {
      case 'cao': return 'bg-rose-100 text-rose-600 border-rose-200';
      case 'trung_binh': return 'bg-amber-100 text-amber-600 border-amber-200';
      default: return 'bg-emerald-100 text-emerald-600 border-emerald-200';
    }
  };

  const layIconRuiRo = (type: string) => {
    return type === 'dien' ? <Zap className="w-4 h-4" /> : <Droplets className="w-4 h-4" />;
  };

  const [boLoc, datBoLoc] = React.useState<'all' | 'cao' | 'dien' | 'nuoc'>('all');

  const thongKe = {
    tongCong: danhSachRuiRo.length,
    cao: danhSachRuiRo.filter(r => r.risk_level === 'cao').length,
    dien: danhSachRuiRo.filter(r => r.risk_type === 'dien').length,
    nuoc: danhSachRuiRo.filter(r => r.risk_type === 'nuoc').length
  };

  const danhSachRuiRoDaLoc = danhSachRuiRo.filter(r => {
    if (boLoc === 'all') return true;
    if (boLoc === 'cao') return r.risk_level === 'cao';
    if (boLoc === 'dien') return r.risk_type === 'dien';
    if (boLoc === 'nuoc') return r.risk_type === 'nuoc';
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col w-full h-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <ShieldAlert className="text-rose-500 w-8 h-8" />
            Giám sát Rủi ro AI
          </h2>
          <p className="text-slate-500 mt-1">Phân tích và cảnh báo bất thường trong tiêu thụ năng lượng toàn hệ thống.</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 shrink-0">
        <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${boLoc === 'all' ? 'border-primary ring-1 ring-primary' : 'border-slate-200'}`}
             onClick={() => datBoLoc('all')}>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Tổng cảnh báo</p>
            <p className="text-2xl font-black text-slate-900">{dangTai ? '-' : thongKe.tongCong}</p>
          </div>
        </div>
        
        <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${boLoc === 'cao' ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200'}`}
             onClick={() => datBoLoc('cao')}>
          <div className="p-3 bg-rose-100 text-rose-600 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Rủi ro cao</p>
            <p className="text-2xl font-black text-slate-900">{dangTai ? '-' : thongKe.cao}</p>
          </div>
        </div>

        <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${boLoc === 'dien' ? 'border-amber-500 ring-1 ring-amber-500' : 'border-slate-200'}`}
             onClick={() => datBoLoc('dien')}>
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Vấn đề điện</p>
            <p className="text-2xl font-black text-slate-900">{dangTai ? '-' : thongKe.dien}</p>
          </div>
        </div>

        <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${boLoc === 'nuoc' ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200'}`}
             onClick={() => datBoLoc('nuoc')}>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Vấn đề nước</p>
            <p className="text-2xl font-black text-slate-900">{dangTai ? '-' : thongKe.nuoc}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex-1 flex flex-col min-h-0">
        <div className="flex border-b border-slate-200 px-6 shrink-0 bg-slate-50/50">
          <div className="py-4 font-black text-sm uppercase text-slate-900 tracking-wider">
            Danh sách cảnh báo hệ thống
          </div>
        </div>
        <div className="overflow-auto flex-1">
          {dangTai ? (
            <div className="p-20 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-slate-500 font-black uppercase text-xs tracking-widest">Đang phân tích rủi ro...</p>
            </div>
          ) : danhSachRuiRoDaLoc.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-slate-500 font-black uppercase text-xs">Hệ thống hiện tại an toàn.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 sticky top-0 z-10 text-slate-500 text-xs font-black uppercase tracking-wider">
                  <th className="px-6 py-4">Loại & Mức độ</th>
                  <th className="px-6 py-4">Phòng & Vị trí</th>
                  <th className="px-6 py-4">Chi tiết cảnh báo</th>
                  <th className="px-6 py-4">Thời gian</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {danhSachRuiRoDaLoc.map((ruiRo) => (
                  <tr key={ruiRo.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                          {layIconRuiRo(ruiRo.risk_type)}
                          <span className="capitalize">{ruiRo.risk_type === 'dien' ? 'Điện năng' : 'Nước'}</span>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${layMauMucDoRuiRo(ruiRo.risk_level)}`}>
                          {ruiRo.risk_level}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <p className="text-sm font-bold text-slate-900">{ruiRo.thongTinPhong?.title || 'Phòng không xác định'}</p>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {ruiRo.thongTinPhong?.location || 'Đà Nẵng'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="max-w-xs">
                        <p className="text-sm text-slate-600 line-clamp-2 italic">"{ruiRo.details}"</p>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(ruiRo.detected_at).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <button 
                        onClick={() => xuLyChuyenHuongDenPhong(ruiRo.room_id)}
                        className="p-2 hover:bg-primary/10 text-slate-400 hover:text-primary rounded-xl transition-all group"
                        title="Xem chi tiết phòng"
                      >
                        <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </button>
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
