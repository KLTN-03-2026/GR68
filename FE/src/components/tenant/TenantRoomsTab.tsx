import React from 'react';
import { motion } from 'motion/react';
import { 
  Building, Home, MapPin, User, Wallet, Calendar, Zap, Droplets, Wind, PlusCircle, Maximize2, MoreVertical, MessageSquare, Phone, Layers, ShieldCheck
} from 'lucide-react';

/**
 * Interface cho các thuộc tính (Props) của Tab Danh sách phòng
 */
interface TenantRoomsTabProps {
  danhSachPhong: any[];
  dangTaiPhong: boolean;
  onNavigate: any;
  xuLyBatDauChat: (ownerId: string) => void;
  dangKhoiTaoChat: boolean;
  user: any;
}

export const TenantRoomsTab = ({ 
  danhSachPhong, 
  dangTaiPhong, 
  onNavigate, 
  xuLyBatDauChat, 
  dangKhoiTaoChat, 
  user 
}: TenantRoomsTabProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Tiêu đề trang */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 font-display">Phòng của tôi</h2>
          <p className="text-slate-500 font-medium">Danh sách các phòng bạn đang thuê.</p>
        </div>
      </div>

      {/* Hiển thị trạng thái đang tải dữ liệu */}
      {dangTaiPhong ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : danhSachPhong.length === 0 ? (
        /* Trạng thái trống (Chưa có phòng) */
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-200 px-6">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
            <Home className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có phòng nào</h3>
          <p className="text-slate-500 max-w-sm">Bạn chưa được gán vào phòng nào. Vui lòng liên hệ chủ trọ để được thêm vào phòng.</p>
        </div>
      ) : (
        /* Danh sách phòng thực tế */
        <div className="grid grid-cols-1 gap-8">
          {danhSachPhong.map((room) => {
            // Tính toán thời gian hợp đồng
            const ngayBatDau = new Date(room.contract_start);
            const ngayKetThuc = new Date(room.contract_end);
            const ngayHienTai = new Date();
            
            // Tính tổng số ngày hợp đồng và số ngày đã trôi qua
            const tongSoNgay = Math.max(1, Math.ceil((ngayKetThuc.getTime() - ngayBatDau.getTime()) / (1000 * 60 * 60 * 24)));
            const ngayDaQua = Math.max(0, Math.ceil((ngayHienTai.getTime() - ngayBatDau.getTime()) / (1000 * 60 * 60 * 24)));
            const soNgayConLai = Math.max(0, tongSoNgay - ngayDaQua);
            const phanTramTienDo = Math.min(100, Math.max(0, (ngayDaQua / tongSoNgay) * 100));
            
            // Các trạng thái cảnh báo hợp đồng
            const sapHetHan = soNgayConLai > 0 && soNgayConLai <= 30;
            const daHetHan = soNgayConLai === 0;

            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[32px] border border-slate-200 shadow-xl shadow-primary/5 overflow-hidden transition-all group flex flex-col md:flex-row"
              >
                {/* Phần bên trái: Hình ảnh và thông tin chủ trọ */}
                <div className="relative md:w-1/3 shrink-0 overflow-hidden h-64 md:h-auto">
                  <img 
                    src={room.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600'}
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Badge trạng thái thuê */}
                  <div className="absolute top-6 left-6">
                    <span className={`${daHetHan ? 'bg-red-500/80 border-red-400' : 'bg-white/20 border-white/40'} backdrop-blur-md border text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-2xl flex items-center gap-2`}>
                      {!daHetHan && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>}
                      {daHetHan ? 'Hết hạn' : 'Đang thuê'}
                    </span>
                  </div>

                  {/* Thông tin chủ trọ & Nút liên hệ */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg text-white">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="text-white">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Chủ trọ</p>
                        <p className="font-bold">{room.landlord_name}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <button 
                        disabled={dangKhoiTaoChat}
                        onClick={() => xuLyBatDauChat(room.owner_id)}
                        className="flex-1 py-2.5 rounded-xl bg-primary/90 hover:bg-primary backdrop-blur-md text-white font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" /> Message
                      </button>
                      {room.landlord_phone && (
                        <a href={`tel:${room.landlord_phone}`} className="w-10 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all">
                          <Phone className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Phần bên phải: Chi tiết phòng và giá dịch vụ */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-black text-slate-900 font-display">{room.title}</h3>
                      <span className="text-2xl font-black text-primary font-display">{Number(room.price).toLocaleString()}đ<span className="text-sm text-slate-400 font-bold">/th</span></span>
                    </div>

                    {/* Đặc điểm phòng */}
                    <div className="flex flex-wrap items-center gap-2 mb-8">
                      {room.type && (
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" /> {room.type}
                        </span>
                      )}
                      {room.area && (
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1.5">
                          <Maximize2 className="w-3.5 h-3.5" /> {room.area} m²
                        </span>
                      )}
                    </div>

                    {/* Giá các loại dịch vụ */}
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Thông số dịch vụ</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-100/50">
                        <div className="flex items-center gap-2 mb-2 text-yellow-600 text-xs font-black uppercase tracking-widest">
                          <Zap className="w-4 h-4" /> Điện
                        </div>
                        <div className="font-black text-slate-900 text-sm">{Number(room.electricity_price || 3500).toLocaleString()}<span className="text-slate-400 font-bold text-[10px] ml-1">đ/kwh</span></div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100/50">
                        <div className="flex items-center gap-2 mb-2 text-blue-600 text-xs font-black uppercase tracking-widest">
                          <Droplets className="w-4 h-4" /> Nước
                        </div>
                        <div className="font-black text-slate-900 text-sm">{Number(room.water_price || 20000).toLocaleString()}<span className="text-slate-400 font-bold text-[10px] ml-1">đ/khối</span></div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100/50">
                        <div className="flex items-center gap-2 mb-2 text-green-600 text-xs font-black uppercase tracking-widest">
                          <ShieldCheck className="w-4 h-4" /> Dịch vụ
                        </div>
                        <div className="font-black text-slate-900 text-sm">{Number(room.service_fee || 150000).toLocaleString()}<span className="text-slate-400 font-bold text-[10px] ml-1">đ/tháng</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Thanh tiến trình thời gian hợp đồng */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 relative overflow-hidden">
                    {sapHetHan && (
                      <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nội dung Hợp đồng</p>
                      {room.deposit > 0 && (
                        <span className="text-xs font-bold text-slate-500">Cọc: <span className="font-black text-slate-900">{Number(room.deposit).toLocaleString()}đ</span></span>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-slate-900">{ngayBatDau.toLocaleDateString('vi-VN')}</span>
                        <span className={`${sapHetHan ? 'text-orange-600' : 'text-slate-900'}`}>{ngayKetThuc.toLocaleDateString('vi-VN')}</span>
                      </div>
                      
                      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden flex">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${phanTramTienDo}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className={`h-full rounded-full relative ${
                            sapHetHan ? 'bg-orange-500' : daHetHan ? 'bg-red-500' : 'bg-green-500'
                          }`}
                        >
                          <div className="absolute inset-0 bg-white/20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]"></div>
                        </motion.div>
                      </div>
                      
                      <div className="flex justify-end text-[10px] font-black uppercase tracking-widest">
                        {daHetHan ? (
                          <span className="text-red-500">Đã hết hạn</span>
                        ) : sapHetHan ? (
                          <span className="text-orange-500">Sắp hết hạn (Còn {soNgayConLai} ngày)</span>
                        ) : (
                          <span className="text-slate-400">Đã qua {ngayDaQua} ngày / Còn {soNgayConLai} ngày</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
