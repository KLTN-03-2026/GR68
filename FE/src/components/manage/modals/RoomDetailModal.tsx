import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Zap, 
  Droplets, 
  ShieldCheck, 
  Info, 
  Users, 
  Phone, 
  MessageSquare, 
  Clock, 
  FileText, 
  Construction, 
  Sparkles, 
  Plus, 
  MapPin, 
  Settings, 
  Trash2 
} from 'lucide-react';

interface RoomDetailModalProps {
  show: boolean;
  onClose: () => void;
  room: any;
  onEdit: (roomId: string) => void;
  onDelete: (roomId: string, title: string) => void;
  onNavigateToTab: (tab: string) => void;
  onCreateListing: (room: any) => void;
}

export const RoomDetailModal = ({ 
  show, 
  onClose, 
  room, 
  onEdit, 
  onDelete, 
  onNavigateToTab, 
  onCreateListing 
}: RoomDetailModalProps) => {
  return (
    <AnimatePresence>
      {show && room && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl w-full max-w-4xl flex flex-col md:flex-row shadow-2xl overflow-hidden max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Left side - Cover Image */}
            <div className="md:w-2/5 shrink-0 relative h-64 md:h-auto bg-slate-100">
              <img src={room.image} alt={room.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <button onClick={onClose} className="absolute top-4 left-4 p-2 rounded-xl bg-white/20 hover:bg-white/40 backdrop-blur-md text-white md:hidden z-10"><X className="w-5 h-5" /></button>
              <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                <span className={`inline-block mb-3 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${room.statusColor}`}>
                  {room.statusLabel}
                </span>
                <h2 className="text-3xl font-black font-display leading-tight shadow-black/50 text-shadow-sm">{room.title}</h2>
              </div>
            </div>

            {/* Right side - Information */}
            <div className="md:w-3/5 flex-1 flex flex-col overflow-y-auto bg-white">
              {/* Header strip */}
              <div className="flex justify-between items-center px-6 md:px-8 py-5 border-b border-slate-100 shrink-0">
                <h3 className="text-xl font-black text-slate-900 font-display">Chi tiết phòng</h3>
                <button onClick={onClose} className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hidden md:block"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-6">

                {/* Price + Quick Stats */}
                <div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-black text-primary font-display">{room.price}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/ Tháng</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-2xl p-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Loại phòng</p>
                      <p className="font-black text-slate-900 text-sm">{room.type}</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Diện tích</p>
                      <p className="font-black text-slate-900 text-sm">{room.area}</p>
                    </div>
                  </div>
                </div>

                {/* Utilities */}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Zap className="w-3.5 h-3.5" />Chi phí dịch vụ</p>
                  <div className="bg-slate-50 rounded-2xl divide-y divide-slate-100">
                    <div className="flex items-center justify-between p-3 text-sm">
                      <div className="flex items-center gap-2 text-slate-600 font-bold"><Zap className="w-4 h-4 text-yellow-500" />Giá điện</div>
                      <span className="font-black text-slate-900">{room.electricity_price?.toLocaleString() || '3,500'}đ<span className="text-slate-400 font-normal text-xs"> /kWh</span></span>
                    </div>
                    <div className="flex items-center justify-between p-3 text-sm">
                      <div className="flex items-center gap-2 text-slate-600 font-bold"><Droplets className="w-4 h-4 text-blue-500" />Giá nước</div>
                      <span className="font-black text-slate-900">{room.water_price?.toLocaleString() || '20,000'}đ<span className="text-slate-400 font-normal text-xs"> /m³</span></span>
                    </div>
                    <div className="flex items-center justify-between p-3 text-sm">
                      <div className="flex items-center gap-2 text-slate-600 font-bold"><ShieldCheck className="w-4 h-4 text-green-500" />Phí dịch vụ</div>
                      <span className="font-black text-slate-900">{room.service_fee?.toLocaleString() || '150,000'}đ<span className="text-slate-400 font-normal text-xs"> /tháng</span></span>
                    </div>
                  </div>
                </div>

                {/* Note */}
                {room.note && (
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Info className="w-3.5 h-3.5" />Ghi chú</p>
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                      <p className="text-sm font-medium text-amber-800 leading-relaxed">{room.note}</p>
                    </div>
                  </div>
                )}

                {/* Tenant / Status Section */}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Users className="w-3.5 h-3.5" />Tình trạng khai thác</p>

                  {room.tenant ? (
                    <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-orange-50 to-orange-100/30 overflow-hidden">
                      {/* Tenant Info */}
                      <div className="flex items-center gap-4 p-4">
                        <img
                          src={room.tenantAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(room.tenant)}&background=random`}
                          alt="avatar"
                          className="w-12 h-12 rounded-2xl object-cover shadow-sm border border-white"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-black text-slate-900 truncate">{room.tenant}</p>
                          <p className="text-xs font-bold text-primary mt-0.5">{room.tenantPhone || 'Chưa cập nhật SĐT'}</p>
                        </div>
                        <button
                          onClick={() => { onClose(); onNavigateToTab('contracts'); }}
                          className="text-[10px] font-black px-3 py-2 bg-white text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm uppercase tracking-widest flex-shrink-0"
                        >Hợp đồng</button>
                      </div>

                      {/* Contract Details */}
                      <div className="bg-white/60 mx-4 mb-4 rounded-xl p-3 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold text-slate-500">Bắt đầu</span>
                          <span className="font-black text-slate-800">{room.contractStart ? new Date(room.contractStart).toLocaleDateString('vi-VN') : '—'}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="font-bold text-slate-500">Kết thúc</span>
                          <span className="font-black text-slate-800">{room.contractEnd ? new Date(room.contractEnd).toLocaleDateString('vi-VN') : '—'}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="font-bold text-slate-500">Tiền cọc</span>
                          <span className="font-black text-primary">{room.contractDeposit ? Number(room.contractDeposit).toLocaleString() + 'đ' : '0đ'}</span>
                        </div>

                        {/* Contract Progress Bar */}
                        {room.contractStart && room.contractEnd && (() => {
                          const start = new Date(room.contractStart).getTime();
                          const end = new Date(room.contractEnd).getTime();
                          const now = Date.now();
                          const total = end - start;
                          const elapsed = now - start;
                          const pct = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
                          const daysLeft = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
                          const color = daysLeft <= 30 ? 'bg-red-500' : daysLeft <= 90 ? 'bg-orange-400' : 'bg-green-500';
                          return (
                            <div>
                              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                                <span>Tiến độ HĐ</span>
                                <span className={daysLeft <= 30 ? 'text-red-500' : daysLeft <= 90 ? 'text-orange-500' : 'text-green-600'}>{daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Đã hết hạn'}</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2 px-4 pb-4">
                        <a href={room.tenantPhone ? `tel:${room.tenantPhone}` : '#'} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-orange-100/50 hover:bg-primary-hover transition-all">
                          <Phone className="w-3.5 h-3.5" />Gọi ngay
                        </a>
                        <button onClick={() => { onClose(); onNavigateToTab('messages'); }} className="flex-1 py-2.5 bg-white text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm hover:bg-slate-50 transition-all">
                          <MessageSquare className="w-3.5 h-3.5" />Nhắn tin
                        </button>
                      </div>
                    </div>

                  ) : room.status === 'pending' ? (
                    <div className="p-5 rounded-2xl bg-orange-50 border border-orange-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center"><Clock className="w-5 h-5" /></div>
                        <div>
                          <p className="text-sm font-black text-orange-900">Chờ người thuê ký hợp đồng</p>
                          <p className="text-xs font-bold text-orange-600 mt-0.5">Hợp đồng đã gửi, đang chờ xác nhận</p>
                        </div>
                      </div>
                      <button onClick={() => { onClose(); onNavigateToTab('contracts'); }} className="w-full py-2.5 border border-orange-300 text-orange-700 bg-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-50 transition-all">
                        <FileText className="w-4 h-4" />Xem hợp đồng chờ ký
                      </button>
                    </div>

                  ) : room.status === 'repairing' ? (
                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center"><Construction className="w-5 h-5" /></div>
                        <div>
                          <p className="text-sm font-black text-amber-900">Đang sửa chữa / Nâng cấp</p>
                          <p className="text-xs font-bold text-amber-700/80 leading-relaxed">{room.note || 'Phòng đang được bảo trì.'}</p>
                        </div>
                      </div>
                    </div>

                  ) : (
                    <div className="p-5 rounded-2xl bg-green-50/50 border border-green-200/50 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 shrink-0"><Sparkles className="w-5 h-5" /></div>
                        <div>
                          <p className="text-sm font-black text-green-800">Phòng đang trống — Sẵn sàng cho thuê</p>
                          <p className="text-xs font-bold text-green-700/70">Dọn sạch sẽ, đón khách vào ở ngay.</p>
                        </div>
                      </div>
                      <button onClick={() => { onClose(); onNavigateToTab('contracts'); }} className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-green-100 transition-all">
                        <Plus className="w-4 h-4" />Tạo Hợp Đồng Ngay
                      </button>
                      <button onClick={() => { onClose(); onCreateListing(room); }} className="w-full py-2.5 bg-white hover:bg-green-50 text-green-700 border border-green-200 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                        <MapPin className="w-4 h-4" />Đăng Marketing Tìm Khách
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Footer Actions */}
              <div className="border-t border-slate-100 px-6 md:px-8 py-4 flex items-center justify-between shrink-0">
                <button
                  onClick={() => { onClose(); onEdit(room.id); }}
                  className="px-5 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-600 bg-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm hover:shadow"
                >
                  <Settings className="w-3.5 h-3.5" />Sửa thông số
                </button>
                <button
                  onClick={() => { onClose(); onDelete(room.id, room.title); }}
                  className="p-2.5 text-slate-300 hover:text-white hover:bg-red-500 rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
