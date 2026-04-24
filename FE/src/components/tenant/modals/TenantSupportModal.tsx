import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2 } from 'lucide-react';

interface TenantSupportModalProps {
  hienThiModalHoTro: boolean;
  setHienThiModalHoTro: (show: boolean) => void;
  formYeuCauMoi: any;
  setFormYeuCauMoi: any;
  danhSachPhong: any[];
  dangGuiYeuCau: boolean;
  xuLyGuiYeuCau: () => void;
}

export const TenantSupportModal = ({ 
  hienThiModalHoTro, setHienThiModalHoTro, formYeuCauMoi, setFormYeuCauMoi, 
  danhSachPhong, dangGuiYeuCau, xuLyGuiYeuCau 
}: TenantSupportModalProps) => {
  return (
    <AnimatePresence>
      {hienThiModalHoTro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setHienThiModalHoTro(false)}
            className="absolute inset-0"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 font-display">Gửi yêu cầu hỗ trợ</h3>
                <p className="text-xs font-bold text-slate-400 mt-1">Thông báo sửa chữa, sự cố đến chủ trọ</p>
              </div>
              <button 
                onClick={() => setHienThiModalHoTro(false)} 
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-8 py-6 overflow-y-auto max-h-[70vh]">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phòng gặp sự cố *</label>
                  <select
                    value={formYeuCauMoi.roomId}
                    onChange={e => setFormYeuCauMoi((f: any) => ({ ...f, roomId: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none appearance-none"
                  >
                    <option value="">Chọn phòng...</option>
                    {danhSachPhong.map(room => (
                      <option key={room.id} value={room.id}>{room.title}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tiêu đề *</label>
                  <input
                    type="text"
                    value={formYeuCauMoi.title}
                    onChange={e => setFormYeuCauMoi((f: any) => ({ ...f, title: e.target.value }))}
                    placeholder="VD: Hư bóng đèn nhà tắm"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mô tả chi tiết *</label>
                  <textarea
                    value={formYeuCauMoi.description}
                    onChange={e => setFormYeuCauMoi((f: any) => ({ ...f, description: e.target.value }))}
                    placeholder="Mô tả cụ thể tình trạng sự cố để chủ trọ dễ dàng nắm bắt..."
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-4">
              <button
                onClick={() => setHienThiModalHoTro(false)}
                className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all bg-slate-200 text-slate-500 hover:bg-slate-300"
              >
                Hủy
              </button>
              <button
                onClick={xuLyGuiYeuCau}
                disabled={dangGuiYeuCau || !formYeuCauMoi.roomId || !formYeuCauMoi.title || !formYeuCauMoi.description}
                className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-white hover:bg-primary-hover shadow-lg shadow-orange-100 flex justify-center items-center gap-2"
              >
                {dangGuiYeuCau ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : 'Gửi yêu cầu'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
