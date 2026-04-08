import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Droplets, ShieldCheck } from 'lucide-react';

interface RoomEditForm {
  title: string;
  price: string;
  type: string;
  area: string;
  status: string;
  note: string;
  image_url: string;
  electricity_price: number;
  water_price: number;
  service_fee: number;
}

interface EditRoomModalProps {
  show: boolean;
  onClose: () => void;
  form: RoomEditForm;
  setForm: React.Dispatch<React.SetStateAction<RoomEditForm>>;
  onSubmit: () => void;
  loading: boolean;
}

export const EditRoomModal = ({ 
  show, 
  onClose, 
  form, 
  setForm, 
  onSubmit, 
  loading 
}: EditRoomModalProps) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 font-display">
                  Chỉnh sửa phòng
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-1">
                  Cập nhật thông tin, giá thuê và chi phí phụ
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <div className="px-8 py-6 overflow-y-auto flex-1">
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Title */}
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên phòng *</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none"
                    />
                  </div>

                  {/* Price */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Giá thuê (VNĐ) *</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none"
                    />
                  </div>

                  {/* Area */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Diện tích (m²)</label>
                    <input
                      type="number"
                      value={form.area}
                      onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none"
                    />
                  </div>

                  {/* Type */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Loại phòng</label>
                    <select
                      value={form.type}
                      onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none appearance-none"
                    >
                      <option value="Phòng trọ">Phòng trọ</option>
                      <option value="Chung cư mini">Chung cư mini</option>
                      <option value="Căn hộ">Căn hộ</option>
                      <option value="Nhà nguyên căn">Nhà nguyên căn</option>
                      <option value="Ký túc xá">Ký túc xá</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Trạng thái</label>
                    <select
                      value={form.status}
                      onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none appearance-none"
                    >
                      <option value="empty">Trống</option>
                      <option value="occupied">Đang thuê</option>
                      <option value="repairing">Đang sửa chữa</option>
                    </select>
                  </div>

                  {/* Utilities */}
                  <div className="md:col-span-2 pt-4 border-t border-slate-100 mt-2">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-5 h-5 text-primary" />
                      <h4 className="font-black text-slate-900">Chi phí phụ & Phân tích rủi ro</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Giá điện (đ/kwh)</label>
                        <div className="relative">
                          <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500" />
                          <input
                            type="number"
                            value={form.electricity_price}
                            onChange={e => setForm(f => ({ ...f, electricity_price: Number(e.target.value) }))}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 pl-11 transition-all outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Giá nước (đ/khối)</label>
                        <div className="relative">
                          <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                          <input
                            type="number"
                            value={form.water_price}
                            onChange={e => setForm(f => ({ ...f, water_price: Number(e.target.value) }))}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 pl-11 transition-all outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phí dịch vụ (đ/tháng)</label>
                        <div className="relative">
                          <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                          <input
                            type="number"
                            value={form.service_fee}
                            onChange={e => setForm(f => ({ ...f, service_fee: Number(e.target.value) }))}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 pl-11 transition-all outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image URL */}
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL Hình ảnh</label>
                    <input
                      type="url"
                      value={form.image_url}
                      onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                      placeholder="https://..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none"
                    />
                  </div>

                  {/* Note */}
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ghi chú thêm</label>
                    <textarea
                      value={form.note}
                      onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                      placeholder="VD: Phòng mới sửa chữa 2024..."
                      rows={2}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all bg-slate-200 text-slate-500 hover:bg-slate-300"
              >
                Hủy
              </button>
              <button
                onClick={onSubmit}
                disabled={loading || !form.title || !form.price}
                className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-white hover:bg-primary-hover shadow-lg shadow-orange-100 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Lưu thay đổi'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
