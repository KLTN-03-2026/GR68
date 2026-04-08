import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap } from 'lucide-react';

interface ListingForm {
  title: string;
  description: string;
  price: string;
  area: string;
  type: string;
  location: string;
  street: string;
  image_url: string;
  electricity_price: number;
  water_price: number;
  service_fee: number;
  deposit: string;
}

interface AddListingModalProps {
  show: boolean;
  onClose: () => void;
  form: ListingForm;
  setForm: React.Dispatch<React.SetStateAction<ListingForm>>;
  onSubmit: () => void;
  loading: boolean;
}

export const AddListingModal = ({ 
  show, 
  onClose, 
  form, 
  setForm, 
  onSubmit, 
  loading 
}: AddListingModalProps) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
              <div>
                <h3 className="text-xl font-black text-slate-900 font-display">Tạo bài đăng mới</h3>
                <p className="text-xs font-bold text-slate-400 mt-1">Bài đăng chỉ để quảng cáo, không tự tạo phòng quản lý</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"><X className="w-5 h-5" /></button>
            </div>

            {/* Content */}
            <div className="px-8 py-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Title */}
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tiêu đề bài đăng *</label>
                  <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="VD: Phòng trọ cao cấp trung tâm Hải Châu..." className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none" />
                </div>

                {/* Description */}
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mô tả chi tiết</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Mô tả phòng trọ, tiện ích, vị trí..." rows={4} className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none resize-none" />
                </div>

                {/* Price */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Giá thuê (VNĐ/tháng) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="3000000" className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none" />
                </div>

                {/* Area */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Diện tích (m²)</label>
                  <input type="number" value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} placeholder="25" className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none" />
                </div>

                {/* Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Loại phòng</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none appearance-none">
                    <option value="Phòng trọ">Phòng trọ</option>
                    <option value="Chung cư mini">Chung cư mini</option>
                    <option value="Căn hộ">Căn hộ</option>
                    <option value="Căn hộ mini">Căn hộ mini</option>
                    <option value="Nhà nguyên căn">Nhà nguyên căn</option>
                  </select>
                </div>

                {/* Deposit */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tiền cọc (VNĐ)</label>
                  <input type="number" value={form.deposit} onChange={e => setForm(f => ({ ...f, deposit: e.target.value }))} placeholder="Bằng tiền thuê nếu bỏ trống" className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none" />
                </div>

                {/* Location */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quận/Huyện</label>
                  <select value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none appearance-none">
                    <option value="">Chọn quận/huyện...</option>
                    <option value="Hải Châu">Hải Châu</option>
                    <option value="Thanh Khê">Thanh Khê</option>
                    <option value="Sơn Trà">Sơn Trà</option>
                    <option value="Ngũ Hành Sơn">Ngũ Hành Sơn</option>
                    <option value="Liên Chiểu">Liên Chiểu</option>
                    <option value="Cẩm Lệ">Cẩm Lệ</option>
                    <option value="Hòa Vang">Hòa Vang</option>
                  </select>
                </div>

                {/* Street */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Địa chỉ đường</label>
                  <input type="text" value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} placeholder="VD: 45 Trần Phú" className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none" />
                </div>

                {/* Image URL */}
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL Hình ảnh</label>
                  <input type="url" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none" />
                  {form.image_url && (
                    <div className="w-full h-40 rounded-2xl overflow-hidden border border-slate-100 mt-1">
                      <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                </div>

                {/* Utilities */}
                <div className="md:col-span-2 pt-4 border-t border-slate-100 mt-2">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-primary" />
                    <h4 className="font-black text-slate-900">Chi phí phụ</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Giá điện (đ/kwh)</label>
                      <input type="number" value={form.electricity_price} onChange={e => setForm(f => ({ ...f, electricity_price: Number(e.target.value) }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Giá nước (đ/khối)</label>
                      <input type="number" value={form.water_price} onChange={e => setForm(f => ({ ...f, water_price: Number(e.target.value) }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phí dịch vụ (đ/tháng)</label>
                      <input type="number" value={form.service_fee} onChange={e => setForm(f => ({ ...f, service_fee: Number(e.target.value) }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-4">
              <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all bg-slate-200 text-slate-500 hover:bg-slate-300">Hủy</button>
              <button onClick={onSubmit} disabled={loading || !form.title || !form.price} className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-white hover:bg-primary-hover shadow-lg shadow-orange-100 flex justify-center items-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Đăng bài'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
