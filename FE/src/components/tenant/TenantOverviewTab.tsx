import React from 'react';
import { motion } from 'motion/react';
import { 
  PlusCircle, Clock, BadgeCheck, User, Building, Calendar, Wallet, Layers, CheckCircle, MapPin, MessageCircle, Search, Wrench
} from 'lucide-react';

/**
 * Interface cho các thuộc tính (Props) của Tab Tổng quan người thuê
 */
interface TenantOverviewTabProps {
  nguoiDung: any;
  danhSachPhong: any[];
  hopDongChoKy: any[];
  dangTaiPhong: boolean;
  dienNangTheoThang: any[];
  idHopDongDangKy: string | null;
  xuLyKyHopDong: (contract: any) => void;
  xuLyTuChoiHopDong: (contract: any) => void;
  onNavigate: any;
  danhSachHoTro?: any[];
  layDanhSachHoTro?: () => void;
  dangTaiHoTro?: boolean;
  setHienThiModalHoTro?: (show: boolean) => void;
  setFormYeuCauMoi?: any;
}

export const TenantOverviewTab = ({ 
  nguoiDung, 
  danhSachPhong, 
  hopDongChoKy, 
  dangTaiPhong, 
  dienNangTheoThang,
  idHopDongDangKy, 
  xuLyKyHopDong, 
  xuLyTuChoiHopDong, 
  onNavigate,
  danhSachHoTro = [],
  layDanhSachHoTro,
  dangTaiHoTro = false,
  setHienThiModalHoTro,
  setFormYeuCauMoi
}: TenantOverviewTabProps) => {
  const thangHienTai = new Date().getMonth() + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Phần lời chào */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Chào, {nguoiDung?.user_metadata?.full_name?.split(' ').pop() || 'bạn'}! 👋</h2>
          <p className="text-slate-500">Hôm nay là {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Danh sách lời mời ký hợp đồng mới */}
      {hopDongChoKy.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Lời mời ký hợp đồng mới ({hopDongChoKy.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hopDongChoKy.map((contract) => (
              <motion.div 
                key={contract.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-orange-50 border border-orange-200 rounded-[2rem] p-6 md:p-8 relative overflow-hidden group shadow-lg shadow-orange-100/50 flex flex-col md:col-span-2"
              >
                <div className="absolute top-0 right-0 p-6">
                  <BadgeCheck className="w-24 h-24 text-orange-200/30 group-hover:text-orange-300/40 transition-colors" />
                </div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="px-4 py-1.5 bg-white text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-orange-100 shadow-sm inline-block mb-3">Yêu cầu xác nhận</span>
                      <h4 className="text-xl md:text-3xl font-black text-slate-900 mb-1 font-display">Phòng: {contract.rooms?.title}</h4>
                      <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                        {contract.profiles?.avatar_url ? (
                          <img src={contract.profiles.avatar_url} alt="avt" className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                          <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center"><User className="w-3.5 h-3.5 text-slate-500" /></div>
                        )}
                        Theo yêu cầu của: <span className="text-slate-700">{contract.profiles?.full_name}</span> 
                        {contract.profiles?.phone && <span className="text-slate-400">({contract.profiles.phone})</span>}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tiền cọc yêu cầu</p>
                      <p className="text-2xl font-black text-primary">{Number(contract.deposit || 0).toLocaleString()}đ</p>
                    </div>
                  </div>

                  {/* Chi tiết điều khoản hợp đồng */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 flex-1">
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-orange-100 shadow-sm flex flex-col justify-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mb-1 flex items-center gap-1"><Building className="w-3 h-3"/> Loại phòng & Diện tích</p>
                      <p className="text-lg font-black text-slate-900">{contract.rooms?.type || 'Phòng trọ'} • {contract.rooms?.area}m²</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-orange-100 shadow-sm flex flex-col justify-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> Thời hạn hợp đồng</p>
                      <p className="text-[13px] font-bold text-slate-700 leading-tight">
                        Từ: <span className="text-slate-900">{new Date(contract.start_date || new Date()).toLocaleDateString('vi-VN')}</span><br/>
                        Đến: <span className="text-slate-900">{new Date(contract.end_date || new Date()).toLocaleDateString('vi-VN')}</span>
                      </p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-orange-100 shadow-sm flex flex-col justify-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mb-1 flex items-center gap-1"><Wallet className="w-3 h-3"/> Giá thuê / tháng</p>
                      <p className="text-xl font-black text-slate-900">{Number(contract.rooms?.price).toLocaleString()}đ</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-orange-100 shadow-sm flex flex-col justify-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-1"><Layers className="w-3 h-3"/> Phí dịch vụ mặc định</p>
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold text-slate-600 flex justify-between"><span>Điện:</span> <span className="text-slate-900">{Number(contract.rooms?.electricity_price || 3500).toLocaleString()}đ/kWh</span></p>
                        <p className="text-[11px] font-bold text-slate-600 flex justify-between"><span>Nước:</span> <span className="text-slate-900">{Number(contract.rooms?.water_price || 20000).toLocaleString()}đ/m³</span></p>
                        <p className="text-[11px] font-bold text-slate-600 flex justify-between"><span>Phí DV:</span> <span className="text-slate-900">{Number(contract.rooms?.service_fee || 150000).toLocaleString()}đ/tháng</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Nút thao tác */}
                  <div className="mt-auto flex justify-end gap-3 border-t border-orange-200/50 pt-6">
                    <button 
                      onClick={() => xuLyTuChoiHopDong(contract)}
                      disabled={idHopDongDangKy === contract.id}
                      className="px-6 py-4 bg-white text-slate-500 font-bold uppercase text-[11px] hover:text-red-600 rounded-2xl border border-orange-100 transition-all hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
                    >
                      Từ chối
                    </button>
                    <button 
                      onClick={() => xuLyKyHopDong(contract)}
                      disabled={idHopDongDangKy === contract.id}
                      className="bg-primary text-white px-8 font-black uppercase tracking-widest text-[11px] py-4 rounded-2xl hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn"
                    >
                      {idHopDongDangKy === contract.id ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : <CheckCircle className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />}
                      Xác nhận & Ký hợp đồng điện tử
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Danh sách phòng đang thuê (Dạng tóm tắt) */}
      {danhSachPhong.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Building className="w-4 h-4" />
            Phòng đang thuê ({danhSachPhong.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {danhSachPhong.map((room) => {
              const ngayKetThucHopDong = room.contract_end ? new Date(room.contract_end) : null;
              const homNay = new Date();
              const khoangCachThoiGian = ngayKetThucHopDong ? ngayKetThucHopDong.getTime() - homNay.getTime() : 0;
              const soNgayConLai = Math.ceil(khoangCachThoiGian / (1000 * 60 * 60 * 24));

              return (
                <div key={room.id} className="grid grid-cols-1 md:grid-cols-1 gap-6 md:col-span-3 lg:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Thông tin phòng */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                          <Building className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 dark:text-white font-display">{room.title}</h3>
                          <p className="text-sm font-bold text-slate-500">{room.type} • {room.area}m²</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">P. {room.title}, Tầng 2, Q. Liên Chiểu</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {[1, 2].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 overflow-hidden">
                              <img src={`https://i.pravatar.cc/100?u=${room.id}${i}`} alt="tenant" className="w-full h-full object-cover" />
                            </div>
                          ))}
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-black text-slate-400">
                            +1
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-400 ml-2">Bạn và 2 người khác</span>
                      </div>
                    </div>

                    {/* Thông tin tiền phòng */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-600">
                          <Wallet className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tiền thuê tháng {thangHienTai}</p>
                          <h3 className="text-2xl font-black dark:text-white font-display">{Number(room.price).toLocaleString()}đ</h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                        <User className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300 truncate">Chủ trọ: {room.landlord_name}</span>
                      </div>
                    </div>

                    {/* Thông tin hợp đồng */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-600">
                          <Calendar className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hết hạn hợp đồng</p>
                          <h3 className="text-xl font-black dark:text-white font-display">{ngayKetThucHopDong ? ngayKetThucHopDong.toLocaleDateString('vi-VN') : 'N/A'}</h3>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-slate-500">
                          Còn <strong className="text-slate-900 dark:text-primary text-lg">{soNgayConLai}</strong> ngày
                        </div>
                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[9px] font-black uppercase tracking-widest">Đang hiệu lực</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Trạng thái trống (Chưa có phòng & Chưa có lời mời) */}
      {danhSachPhong.length === 0 && hopDongChoKy.length === 0 && (
        <div className="bg-white dark:bg-slate-900 p-20 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-200 dark:text-slate-700 mb-8 ring-8 ring-slate-50/50">
            <Building className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 font-display">Bạn chưa thuê phòng nào</h3>
          <p className="text-slate-500 max-w-sm mb-10 font-medium leading-relaxed">Hiện tại bạn chưa được bàn giao phòng. Hãy cung cấp Số điện thoại cho chủ trọ để được thêm vào phòng và ký hợp đồng điện tử.</p>
          <button onClick={() => onNavigate('search')} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all flex items-center gap-3 shadow-2xl shadow-slate-200">
            <Search className="w-4 h-4" />
            Tìm kiếm phòng trọ
          </button>
        </div>
      )}

      {/* Biểu đồ tiêu thụ điện nước */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Biểu đồ điện */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold">Tiêu thụ Điện (kWh)</h3>
              <p className="text-sm text-slate-500">Trung bình 142 kWh/tháng</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">150</span>
              <span className="text-sm text-slate-400"> kWh</span>
            </div>
          </div>
          <div className="flex items-end justify-between h-48 gap-2">
            {dienNangTheoThang.map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1 group relative">
                <div 
                  className={`w-full rounded-t-lg transition-all ${item.isCurrent ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-primary/20 group-hover:bg-primary/40'}`} 
                  style={{ height: item.height }}
                ></div>
                <span className={`text-[10px] font-bold ${item.isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Biểu đồ nước */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold">Tiêu thụ Nước (m3)</h3>
              <p className="text-sm text-slate-500">Trung bình 10 m3/tháng</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">12</span>
              <span className="text-sm text-slate-400"> m3</span>
            </div>
          </div>
          <div className="relative h-48 w-full flex items-end">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0,80 Q20,20 40,60 T80,30 T100,50 L100,100 L0,100 Z" fill="rgba(255, 140, 0, 0.1)"></path>
              <path d="M0,80 Q20,20 40,60 T80,30 T100,50" fill="none" stroke="#FF8C00" strokeLinecap="round" strokeWidth="2"></path>
            </svg>
            <div className="absolute bottom-[-24px] w-full flex justify-between px-1">
              {dienNangTheoThang.map((item, i) => (
                <span key={i} className={`text-[10px] font-bold ${item.isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                  {item.month}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Support Requests */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold">Yêu cầu hỗ trợ gần đây</h3>
          <button 
            onClick={() => {
              if (danhSachPhong.length > 0) {
                setFormYeuCauMoi?.((f: any) => ({ ...f, roomId: danhSachPhong[0].id }));
              }
              setHienThiModalHoTro?.(true);
            }}
            className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <PlusCircle className="w-4 h-4" /> Gửi yêu cầu
          </button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {dangTaiHoTro ? (
            <div className="p-8 flex justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : danhSachHoTro.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-bold text-sm">Chưa có yêu cầu hỗ trợ nào.</div>
          ) : danhSachHoTro.slice(0, 5).map((req) => {
            const statusText = req.status === 'pending' ? 'Đã gửi' : req.status === 'processing' ? 'Đang xử lý' : 'Hoàn thành';
            const statusColor = req.status === 'pending' ? 'bg-slate-100 text-slate-700 border-slate-200' : req.status === 'processing' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-green-100 text-green-700 border-green-200';
            const iconBg = req.status === 'pending' ? 'bg-slate-100' : req.status === 'processing' ? 'bg-amber-100' : 'bg-green-100';
            const Icon = req.status === 'pending' ? MessageCircle : req.status === 'processing' ? Wrench : CheckCircle;
            const date = new Date(req.created_at).toLocaleDateString('vi-VN');
            
            return (
            <div key={req.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group cursor-pointer gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
                  <Icon className={`w-5 h-5 ${req.status === 'pending' ? 'text-slate-600' : req.status === 'processing' ? 'text-amber-600' : 'text-green-600'}`} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{req.title}</p>
                  <p className="text-xs text-slate-500">Phòng: {req.rooms?.title} &bull; {date}</p>
                </div>
              </div>
              <div className="flex items-center self-start md:self-auto shrink-0">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusColor}`}>
                  {statusText}
                </span>
              </div>
            </div>
          )})}
        </div>
      </div>
    </motion.div>
  );
};
