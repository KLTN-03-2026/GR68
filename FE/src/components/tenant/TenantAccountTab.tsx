import React from 'react';
import { motion } from 'motion/react';
import { 
  User, Camera, Edit3, Mail, Phone, MapPin, CreditCard, ShieldAlert, LogOut, Settings, Info, Ban, Save, PhoneCall, Zap, Home, ShieldCheck, DoorOpen,
  Lock as LockIcon, CheckCircle, Layers, Users, BadgeCheck, Calendar, Wallet
} from 'lucide-react';

interface PropsTabTaiKhoanNguoiThue {
  nguoiDung: any;
  danhSachPhong: any[];
  formHoSo: any;
  setFormHoSo: any;
  dangTaiHoSo: boolean;
  dangLuuHoSo: boolean;
  thongBaoLuuHoSo: string;
  xuLyLuuHoSo: () => void;
  formMatKhau: any;
  setFormMatKhau: any;
  dangDoiMatKhau: boolean;
  thongBaoMatKhau: string;
  hienThiMatKhau: boolean;
  setHienThiMatKhau: (show: boolean) => void;
  xuLyDoiMatKhau: (e: React.FormEvent) => void;
  xuLyDangXuat: () => void;
}

const InputField = ({ label, icon: Icon, type = 'text', placeholder = '', value, onChange }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
      <input 
        type={type} 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder}
        className={`w-full rounded-2xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 ${Icon ? 'pl-11' : ''} transition-all outline-none text-sm`} 
      />
    </div>
  </div>
);

export const TabTaiKhoanNguoiThue = ({ 
  nguoiDung, danhSachPhong, formHoSo, setFormHoSo, dangTaiHoSo, dangLuuHoSo, thongBaoLuuHoSo, xuLyLuuHoSo,
  formMatKhau, setFormMatKhau, dangDoiMatKhau, thongBaoMatKhau, hienThiMatKhau, setHienThiMatKhau,
  xuLyDoiMatKhau, xuLyDangXuat
}: PropsTabTaiKhoanNguoiThue) => {

  const capNhatTruongHoSo = (field: string, val: string) => {
    setFormHoSo((f: any) => ({ ...f, [field]: val }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto w-full flex flex-col gap-8 pb-20">
      {/* Card hiển thị tổng quan thông tin người dùng */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative group">
          <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-slate-50 shadow-xl relative">
            <img src={nguoiDung?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-xl shadow-lg flex items-center justify-center hover:scale-110 transition-transform border-4 border-white"><Camera className="w-5 h-5" /></button>
        </div>
        <div className="text-center md:text-left flex-1 relative z-10">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
            <h2 className="text-3xl font-black text-slate-900 font-display">{formHoSo.full_name || nguoiDung?.user_metadata?.full_name || 'Khách thuê'}</h2>
            <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1"><BadgeCheck className="w-3 h-3" />Người thuê</span>
          </div>
          <p className="text-slate-500 font-bold text-sm mb-4">{nguoiDung?.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-2 rounded-xl"><Home className="w-4 h-4" /> {danhSachPhong.length} Phòng đang thuê</div>
          </div>
        </div>
      </div>

      {dangTaiHoSo ? (
        <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Box nhập liệu thông tin cá nhân cơ bản */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><User className="w-5 h-5" /></div>
                <div><h3 className="font-black text-slate-900 font-display">Thông tin cá nhân</h3><p className="text-xs text-slate-400 font-medium">Thông tin hiển thị trên hệ thống</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField label="Họ và tên" icon={User} field="full_name" placeholder="Nguyễn Văn A" value={formHoSo.full_name} onChange={(v: string) => capNhatTruongHoSo('full_name', v)} />
                <InputField label="Số điện thoại" icon={Phone} field="phone" type="tel" placeholder="0901 234 567" value={formHoSo.phone} onChange={(v: string) => capNhatTruongHoSo('phone', v)} />
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Giới tính</label>
                  <select value={formHoSo.gender} onChange={e => capNhatTruongHoSo('gender', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none text-sm"><option value="">Chọn giới tính</option><option value="Nam">Nam</option><option value="Nữ">Nữ</option><option value="Khác">Khác</option></select>
                </div>
                <InputField label="Ngày sinh" icon={Calendar} field="birth_date" type="date" value={formHoSo.birth_date} onChange={(v: string) => capNhatTruongHoSo('birth_date', v)} />
                <div className="md:col-span-2"><InputField label="Địa chỉ thường trú" icon={MapPin} field="permanent_address" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" value={formHoSo.permanent_address} onChange={(v: string) => capNhatTruongHoSo('permanent_address', v)} /></div>
              </div>
            </div>

            {/* Box nhập liệu số CCCD/CMND */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600"><CheckCircle className="w-5 h-5" /></div>
                <div><h3 className="font-black text-slate-900 font-display">Định danh pháp lý</h3><p className="text-xs text-slate-400 font-medium">Bắt buộc để ký hợp đồng điện tử</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField label="Số CCCD / CMND" icon={Layers} field="id_card_number" placeholder="012345678901" value={formHoSo.id_card_number} onChange={(v: string) => capNhatTruongHoSo('id_card_number', v)} />
                <InputField label="Ngày cấp" icon={Calendar} field="id_card_date" type="date" value={formHoSo.id_card_date} onChange={(v: string) => capNhatTruongHoSo('id_card_date', v)} />
                <div className="md:col-span-2"><InputField label="Nơi cấp" icon={MapPin} field="id_card_place" placeholder="Cục Cảnh sát QLHC về TTXH" value={formHoSo.id_card_place} onChange={(v: string) => capNhatTruongHoSo('id_card_place', v)} /></div>
              </div>
            </div>

            {/* Box nhập liệu thanh toán ngân hàng */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600"><Wallet className="w-5 h-5" /></div>
                <div><h3 className="font-black text-slate-900 font-display">Tài chính & Liên hệ</h3><p className="text-xs text-slate-400 font-medium">Thông tin thanh toán và khẩn cấp</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField label="Tên ngân hàng" icon={ShieldCheck} field="bank_name" placeholder="Vietcombank, MB Bank..." value={formHoSo.bank_name} onChange={(v: string) => capNhatTruongHoSo('bank_name', v)} />
                <InputField label="Số tài khoản" icon={Home} field="bank_account_number" placeholder="1234567890" value={formHoSo.bank_account_number} onChange={(v: string) => capNhatTruongHoSo('bank_account_number', v)} />
                <div className="md:col-span-2"><InputField label="Tên chủ tài khoản" icon={User} field="bank_account_name" placeholder="NGUYEN VAN A" value={formHoSo.bank_account_name} onChange={(v: string) => capNhatTruongHoSo('bank_account_name', v)} /></div>
                <InputField label="Số Zalo" icon={Phone} field="zalo_phone" type="tel" placeholder="0901 234 567" value={formHoSo.zalo_phone} onChange={(v: string) => capNhatTruongHoSo('zalo_phone', v)} />
                <InputField label="Tên người thân (khẩn cấp)" icon={Users} field="emergency_contact_name" placeholder="Nguyễn Văn B" value={formHoSo.emergency_contact_name} onChange={(v: string) => capNhatTruongHoSo('emergency_contact_name', v)} />
                <div className="md:col-span-2"><InputField label="SĐT người thân (khẩn cấp)" icon={PhoneCall} field="emergency_contact_phone" type="tel" placeholder="0901 234 567" value={formHoSo.emergency_contact_phone} onChange={(v: string) => capNhatTruongHoSo('emergency_contact_phone', v)} /></div>
              </div>
            </div>

            {/* Nút lưu hồ sơ */}
            <div className="flex items-center gap-4">
              <button onClick={xuLyLuuHoSo} disabled={dangLuuHoSo} className="bg-primary text-white font-black uppercase tracking-widest text-xs px-10 py-5 rounded-2xl hover:bg-primary-hover transition-all flex items-center gap-2 shadow-xl shadow-orange-100 hover:-translate-y-1 disabled:opacity-60">{dangLuuHoSo ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang lưu...</> : <><CheckCircle className="w-4 h-4" /> Lưu thông tin hồ sơ</>}</button>
              {thongBaoLuuHoSo && <span className={`text-sm font-bold ${thongBaoLuuHoSo.includes('lỗi') || thongBaoLuuHoSo.includes('Lỗi') ? 'text-red-500' : 'text-green-600'}`}>{thongBaoLuuHoSo}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-8">
             {/* Box đổi mật khẩu */}
             <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm overflow-hidden relative">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center"><LockIcon className="w-5 h-5" /></div>
                 <div><h3 className="font-black text-slate-900 font-display">Bảo mật</h3><p className="text-xs text-slate-400 font-medium">Đổi mật khẩu tài khoản</p></div>
               </div>
               <form onSubmit={xuLyDoiMatKhau} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu mới</label>
                    <div className="relative">
                      <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type={hienThiMatKhau ? 'text' : 'password'} value={formMatKhau.moi} onChange={e => setFormMatKhau((f: any) => ({ ...f, moi: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 p-4 pl-11 transition-all outline-none text-sm" placeholder="••••••••" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Xác nhận mật khẩu</label>
                    <div className="relative">
                      <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type={hienThiMatKhau ? 'text' : 'password'} value={formMatKhau.xac_nhan} onChange={e => setFormMatKhau((f: any) => ({ ...f, xac_nhan: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 p-4 pl-11 transition-all outline-none text-sm" placeholder="••••••••" />
                    </div>
                  </div>
                  <button type="submit" disabled={dangDoiMatKhau} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-lg shadow-slate-100 disabled:opacity-60">{dangDoiMatKhau ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}</button>
                  {thongBaoMatKhau && <p className={`text-[10px] font-bold text-center ${thongBaoMatKhau.includes('thành công') ? 'text-green-600' : 'text-red-500'}`}>{thongBaoMatKhau}</p>}
               </form>
             </div>

             {/* Box xoá dữ liệu vĩnh viễn */}
             <div className="bg-red-50/50 rounded-3xl border border-red-100 p-8">
               <div className="flex items-center gap-3 mb-4 text-red-600">
                 <ShieldAlert className="w-5 h-5" />
                 <h3 className="font-black font-display">Vùng nguy hiểm</h3>
               </div>
               <p className="text-[10px] font-bold text-red-400 mb-6 leading-relaxed">Xóa tài khoản sẽ xóa vĩnh viễn tất cả dữ liệu phòng trọ và hợp đồng. Hành động này không thể hoàn tác!</p>
               <button className="w-full py-3 rounded-xl border-2 border-red-200 text-red-600 font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">Xóa tài khoản vĩnh viễn</button>
             </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
