import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Receipt, Zap, Droplets, ShieldCheck, Home, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface ModalChiTietHoaDonProps {
  hienThi: boolean;
  dongModal: () => void;
  hoaDon: any;
  xuLyThanhToan?: () => void;
  dangTai?: boolean;
}

export const InvoiceDetailModal = ({ hienThi, dongModal, hoaDon, xuLyThanhToan, dangTai }: ModalChiTietHoaDonProps) => {
  const [danhSachCanhBao, datCanhBao] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (hienThi && hoaDon?.room_id) {
      const layDanhSachCanhBao = async () => {
        const { data } = await supabase
          .from('risk_alerts')
          .select('*')
          .eq('room_id', hoaDon.room_id)
          .order('detected_at', { ascending: false })
          .limit(2);
        
        if (data && data.length > 0) {
          datCanhBao(data);
        } else {
          datCanhBao([]);
        }
      };
      layDanhSachCanhBao();
    }
  }, [hienThi, hoaDon]);

  if (!hoaDon) return null;

  return (
    <AnimatePresence>
      {hienThi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dongModal}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 font-display">
                    Chi tiết hóa đơn
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mt-1">
                    {hoaDon.title} - {hoaDon.rooms?.title}
                  </p>
                </div>
              </div>
              <button 
                onClick={dongModal} 
                className="p-2 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors text-slate-500 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content & Breakdown */}
            <div className="px-8 py-6 overflow-y-auto flex-1 space-y-6">
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hạn thanh toán</span>
                  <span className="font-bold text-slate-700">
                    {new Date(hoaDon.due_date).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</span>
                  <span className={`font-black uppercase tracking-widest text-xs ${
                    hoaDon.status === 'paid' ? 'text-green-600' :
                    hoaDon.status === 'pending_verification' ? 'text-blue-600' : 'text-orange-600'
                  }`}>
                    {hoaDon.status === 'paid' ? 'Đã thanh toán' :
                     hoaDon.status === 'pending_verification' ? 'Chờ xác nhận' : 'Chưa thanh toán'}
                  </span>
                </div>
              </div>

               {/* Phí phòng cố định */}
              <div>
                <h4 className="text-sm font-black text-slate-900 font-display mb-4">Chi phí cố định</h4>
                <div className="space-y-3">
                   <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <Home className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-700">Tiền phòng</p>
                        </div>
                      </div>
                      <span className="font-black text-slate-900">{(hoaDon.rent_fee || 0).toLocaleString()} đ</span>
                   </div>

                   <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-700">Phí dịch vụ chung</p>
                        </div>
                      </div>
                      <span className="font-black text-slate-900">{(hoaDon.service_fee || 0).toLocaleString()} đ</span>
                   </div>
                </div>
              </div>

              {/* Điện */}
              <div>
                <h4 className="text-sm font-black text-slate-900 font-display mb-4">Mức tiêu thụ</h4>
                <div className="space-y-3">
                   <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-500 flex items-center justify-center">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-700">Tiền điện</p>
                          <p className="text-[10px] font-bold text-slate-400">
                             Cũ: {hoaDon.electricity_old ?? '-'} → Mới: {hoaDon.electricity_new ?? '-'} (Tiêu thụ: {hoaDon.electricity_usage || 0} kwh)
                          </p>
                        </div>
                      </div>
                      <span className="font-black text-slate-900">{(hoaDon.electricity_fee || 0).toLocaleString()} đ</span>
                   </div>

                   <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center">
                          <Droplets className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-700">Tiền nước</p>
                          <p className="text-[10px] font-bold text-slate-400">
                             Cũ: {hoaDon.water_old ?? '-'} → Mới: {hoaDon.water_new ?? '-'} (Tiêu thụ: {hoaDon.water_usage || 0} khối)
                          </p>
                        </div>
                      </div>
                      <span className="font-black text-slate-900">{(hoaDon.water_fee || 0).toLocaleString()} đ</span>
                   </div>
                </div>
              </div>

            </div>

            {/* AI Alert Section */}
            {danhSachCanhBao && danhSachCanhBao.length > 0 && (() => {
              const coRuiRoCao = danhSachCanhBao.some((a: any) => a.risk_level === 'cao');
              const coRuiRoTrungBinh = danhSachCanhBao.some((a: any) => a.risk_level === 'trung_binh');
              const mucDoRuiRoTongThe = coRuiRoCao ? 'cao' : coRuiRoTrungBinh ? 'trung_binh' : 'thap';

              return (
                <div className="px-8 pb-6">
                  <div className={`p-4 rounded-2xl border flex gap-4 shadow-sm ${
                    mucDoRuiRoTongThe === 'cao' ? 'bg-red-50 border-red-200' :
                    mucDoRuiRoTongThe === 'trung_binh' ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'
                  }`}>
                    <div className="mt-1">
                      {mucDoRuiRoTongThe !== 'thap' ? (
                        <AlertTriangle className={`w-5 h-5 ${
                          mucDoRuiRoTongThe === 'cao' ? 'text-red-600 animate-pulse' : 'text-orange-600'
                        }`} />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <h5 className={`font-bold text-sm ${
                        mucDoRuiRoTongThe === 'cao' ? 'text-red-800' :
                        mucDoRuiRoTongThe === 'trung_binh' ? 'text-orange-800' : 'text-green-800'
                      }`}>
                        {mucDoRuiRoTongThe !== 'thap' ? 'Cảnh báo' : 'Thông báo trạng thái'}
                      </h5>
                      <div className="mt-2 space-y-1">
                        {danhSachCanhBao.map((alert: any) => (
                          <p key={alert.id} className={`text-xs font-medium leading-relaxed ${
                            mucDoRuiRoTongThe === 'cao' ? 'text-red-700' :
                            mucDoRuiRoTongThe === 'trung_binh' ? 'text-orange-700' : 'text-green-700'
                          }`}>
                          
                            {alert.details}
                          </p>
                        ))}
                      </div>
                      
                      {mucDoRuiRoTongThe !== 'thap' && (
                        <p className={`mt-3 text-[10px] font-bold uppercase tracking-widest ${
                          mucDoRuiRoTongThe === 'cao' ? 'text-red-500' :
                          mucDoRuiRoTongThe === 'trung_binh' ? 'text-orange-500' : 'text-green-500'
                        }`}>
                          Vui lòng liên hệ với chủ trọ để xử lý trước khi thanh toán!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Footer Summary */}
            <div className="p-6 border-t border-slate-100 bg-slate-900 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng thanh toán</p>
                <p className="text-3xl font-black text-white font-display">
                  {(hoaDon.amount || 0).toLocaleString()} <span className="text-xl text-slate-400">VNĐ</span>
                </p>
              </div>
              {hoaDon.status === 'unpaid' && xuLyThanhToan && (
                <button
                  onClick={xuLyThanhToan}
                  disabled={dangTai}
                  className="bg-primary hover:bg-primary-hover text-white font-black uppercase tracking-widest text-sm py-4 px-8 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {dangTai ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Đã CK'}
                </button>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
