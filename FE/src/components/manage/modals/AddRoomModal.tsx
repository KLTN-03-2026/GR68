import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ArrowLeft, 
  Plus, 
  Search, 
  Clock, 
  ArrowRight, 
  UserPlus, 
  Zap, 
  Droplets, 
  ShieldCheck, 
  CheckCircle,
  ImageIcon
} from 'lucide-react';

interface NewRoomForm {
  title: string;
  price: string;
  type: string;
  area: string;
  status: string;
  note: string;
  image_url: string;
  tenant_id: string;
  electricity_price: number;
  water_price: number;
  service_fee: number;
  tenant_deposit: string;
  tenant_start_date: string;
  tenant_end_date: string;
}

interface AddRoomModalProps {
  show: boolean;
  onClose: () => void;
  step: 1 | 2;
  setStep: (step: 1 | 2) => void;
  listings: any[];
  onSelectListing: (listing: any) => void;
  onSkipToManual: () => void;
  form: NewRoomForm;
  setForm: React.Dispatch<React.SetStateAction<NewRoomForm>>;
  onSubmit: () => void;
  loading: boolean;
  searchPhone: string;
  setSearchPhone: (phone: string) => void;
  onSearchTenant: () => void;
  searchingTenant: boolean;
  foundTenant: any;
  searchError: string;
}

export const AddRoomModal = ({
  show,
  onClose,
  step,
  setStep,
  listings,
  onSelectListing,
  onSkipToManual,
  form,
  setForm,
  onSubmit,
  loading,
  searchPhone,
  setSearchPhone,
  onSearchTenant,
  searchingTenant,
  foundTenant,
  searchError
}: AddRoomModalProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* ... header ... content ... footer ... */}
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center gap-3">
                {step === 2 && (
                  <button onClick={() => setStep(1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-700">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h3 className="text-xl font-black text-slate-900 font-display">
                    {step === 1 ? 'Thêm phòng mới' : 'Thông tin phòng'}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mt-1">
                    {step === 1 ? 'Chọn từ bài đăng hoặc nhập thủ công' : 'Xác nhận và chỉnh sửa thông tin trước khi tạo'}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto">
              {step === 1 ? (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-8"
                >
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Chọn từ bài đăng đang hoạt động</h4>
                  <div className="space-y-4">
                    {listings.filter(l => l.is_active).map(listing => (
                      <button
                        key={listing.id}
                        onClick={() => onSelectListing(listing)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-primary hover:bg-primary/5 transition-all group text-left"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                          {listing.image_url ? (
                            <img src={listing.image_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-slate-900 truncate">{listing.title}</p>
                          <p className="text-xs font-bold text-primary mt-1">{Number(listing.price).toLocaleString()}đ / Tháng</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                      </button>
                    ))}

                    {listings.filter(l => l.is_active).length === 0 && (
                      <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-sm font-bold text-slate-400">Không có bài đăng nào đang hoạt động</p>
                      </div>
                    )}

                    <div className="pt-4">
                      <button
                        onClick={onSkipToManual}
                        className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 font-bold hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Nhập thông tin thủ công
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-8 space-y-8"
                >
                  {/* Basic Info Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Title */}
                    <div className="md:col-span-2 flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên phòng *</label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        placeholder="VD: Phòng 201 - Tầng 2"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none"
                      />
                    </div>

                    {/* Price & Area */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Giá thuê (VNĐ) *</label>
                      <input
                        type="number"
                        value={form.price}
                        onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                        placeholder="3500000"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Diện tích (m²)</label>
                      <input
                        type="number"
                        value={form.area}
                        onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
                        placeholder="25"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none"
                      />
                    </div>

                    {/* Type */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Loại hình</label>
                      <select
                        value={form.type}
                        onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary p-4 outline-none appearance-none cursor-pointer"
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
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Trạng thái hiện tại</label>
                      <select
                        value={form.status}
                        disabled={!!form.tenant_id}
                        onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary p-4 outline-none appearance-none cursor-pointer disabled:opacity-50"
                      >
                        <option value="empty">Trống</option>
                        <option value="occupied">Đang thuê</option>
                        <option value="repairing">Đang sửa chữa</option>
                      </select>
                    </div>
                  </div>

                  {/* Tenant Section */}
                  <div className="pt-8 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        <UserPlus className="w-4 h-4" />
                      </div>
                      <h4 className="font-black text-slate-900 font-display">Gán người thuê & Hợp đồng</h4>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số điện thoại người thuê</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="tel"
                              value={searchPhone}
                              onChange={e => setSearchPhone(e.target.value)}
                              placeholder="Nhập SĐT để tìm người thuê..."
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary p-4 pl-11 outline-none"
                              onKeyDown={e => e.key === 'Enter' && onSearchTenant()}
                            />
                          </div>
                          <button
                            onClick={onSearchTenant}
                            disabled={searchingTenant || !searchPhone}
                            className="px-6 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                          >
                            {searchingTenant ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Tìm'}
                          </button>
                        </div>
                        {searchError && <p className="text-xs font-bold text-red-500 ml-1">{searchError}</p>}
                      </div>

                      {foundTenant && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-2xl bg-green-50 border border-green-100 flex items-center gap-4"
                        >
                          <div className="w-12 h-12 rounded-xl bg-white border border-green-200 overflow-hidden shrink-0">
                            <img src={foundTenant.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(foundTenant.full_name)}&background=random`} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-slate-900 truncate">{foundTenant.full_name}</p>
                            <p className="text-xs font-bold text-green-600">Đã tìm thấy người dùng • {foundTenant.phone}</p>
                          </div>
                          <CheckCircle className="w-6 h-6 text-green-500" />
                          <button onClick={() => { setForm(f => ({ ...f, tenant_id: '' })); }} className="p-2 text-slate-400 hover:text-red-500">
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      )}

                      {foundTenant && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tiền cọc (VNĐ)</label>
                            <input
                              type="number"
                              value={form.tenant_deposit}
                              onChange={e => setForm(f => ({ ...f, tenant_deposit: e.target.value }))}
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary p-4 outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ngày bắt đầu</label>
                            <input
                              type="date"
                              value={form.tenant_start_date}
                              onChange={e => setForm(f => ({ ...f, tenant_start_date: e.target.value }))}
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary p-4 outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ngày kết thúc (Dự kiến)</label>
                            <input
                              type="date"
                              value={form.tenant_end_date}
                              onChange={e => setForm(f => ({ ...f, tenant_end_date: e.target.value }))}
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary p-4 outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Settings Section */}
                  <div className="pt-8 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                        <Zap className="w-4 h-4" />
                      </div>
                      <h4 className="font-black text-slate-900 font-display">Chi phí dịch vụ mặc định</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Giá điện (đ/kwh)</label>
                        <div className="relative">
                          <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                          <input
                            type="number"
                            value={form.electricity_price}
                            onChange={e => setForm(f => ({ ...f, electricity_price: Number(e.target.value) }))}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary p-4 pl-11 outline-none"
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
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary p-4 pl-11 outline-none"
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
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary p-4 pl-11 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-6">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL Hình ảnh</label>
                      <input
                        type="url"
                        value={form.image_url}
                        onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                        placeholder="https://..."
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary p-4 outline-none"
                      />
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-2 mt-6">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ghi chú</label>
                      <textarea
                        value={form.note}
                        onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                        placeholder="Ghi chú thêm về phòng (tùy chọn)"
                        rows={3}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary p-4 outline-none resize-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Modal Footer */}
            {step === 2 && (
              <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={onSubmit}
                  disabled={loading || !form.title || !form.price}
                  className="bg-primary text-white font-black uppercase tracking-widest text-xs py-4 px-8 rounded-2xl hover:bg-primary-hover transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Tạo phòng
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
