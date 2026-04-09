import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  Home as IconChuTro, 
  UserCircle as IconNguoiThue,
  Smartphone
} from 'lucide-react';
import { AuthIllustration } from '../components/auth/AuthIllustration';
import { supabase } from '../lib/supabase';

// Component Trang Đăng Ký
export const RegisterPage = ({ onNavigate }: { onNavigate: (trang: string) => void }) => {
  // --- Khai báo Trạng thái ---
  const [vaiTro, setVaiTro] = useState<'landlord' | 'tenant'>('landlord');
  const [hoTen, setHoTen] = useState('');
  const [soDienThoai, setSoDienThoai] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState('');

  const [dangTai, setDangTai] = useState(false);
  const [loiNhan, setLoiNhan] = useState<string | null>(null);
  const [thanhCong, setThanhCong] = useState(false);

  const [buocHienTai, setBuocHienTai] = useState<'bieu_mau' | 'otp'>('bieu_mau');
  const [maOTP, setMaOTP] = useState('');

  // --- Hàm chuẩn hóa số điện thoại ---
  const chuanHoaSDT = (sdt: string) => {
    const sdtSach = sdt.trim();
    if (sdtSach.startsWith('0')) return `+84${sdtSach.slice(1)}`;
    if (sdtSach.startsWith('+')) return sdtSach;
    return `+84${sdtSach}`;
  };

  // --- Hàm xử lý Đăng ký ---
  const xuLyDangKy = async (e: React.FormEvent) => {
    e.preventDefault();
    setDangTai(true);
    setLoiNhan(null);

    if (matKhau !== xacNhanMatKhau) {
      setLoiNhan('Mật khẩu xác nhận không khớp');
      setDangTai(false);
      return;
    }

    try {
      const sdtDaChuanHoa = chuanHoaSDT(soDienThoai);
      
      const { data: duLieuAuth, error: loiAuth } = await supabase.auth.signUp({
        phone: sdtDaChuanHoa,
        password: matKhau,
        options: {
          data: {
            full_name: hoTen,
            phone: sdtDaChuanHoa,
            role: vaiTro,
          }
        }
      });

      if (loiAuth) throw loiAuth;

      setBuocHienTai('otp');
    } catch (err: any) {
      setLoiNhan('Số điện thoại đã được đăng ký hoặc sai định dạng');
    } finally {
      setDangTai(false);
    }
  };

  // --- Hàm xử lý Xác thực OTP ---
  const xuLyXacThucOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setDangTai(true);
    setLoiNhan(null);

    try {
      const sdtDaChuanHoa = chuanHoaSDT(soDienThoai);
      
      const { data: duLieuXacThuc, error: loiOTP } = await supabase.auth.verifyOtp({
        phone: sdtDaChuanHoa,
        token: maOTP,
        type: 'sms'
      });

      if (loiOTP) throw loiOTP;

      // Tạo hồ sơ người dùng trong database
      if (duLieuXacThuc.user) {
        const { error: loiProfile } = await supabase
          .from('profiles')
          .upsert({
            id: duLieuXacThuc.user.id,
            full_name: hoTen,
            phone: sdtDaChuanHoa,
            role: vaiTro,
          }, { onConflict: 'id' });

        if (loiProfile) {
          console.error('Lỗi tạo hồ sơ:', loiProfile);
        }
      }

      setThanhCong(true);
      setTimeout(() => onNavigate('home'), 2000);
    } catch (err: any) {
      setLoiNhan('Mã xác thực không hợp lệ hoặc đã hết hạn.');
    } finally {
      setDangTai(false);
    }
  };

  // --- Giao diện ---
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col p-8 md:p-16 lg:p-24 bg-white overflow-y-auto">
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-primary mb-8 cursor-pointer"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-xl">
            <Home className="text-primary w-6 h-6" />
          </div>
          <h2 className="text-slate-900 text-2xl font-bold tracking-tight font-display">Trọ Pro</h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-auto my-auto bg-white rounded-2xl shadow-[0_20px_50px_rgba(255,159,67,0.12)] p-8 md:p-10 border border-orange-50 ring-4 ring-orange-50/50"
        >
          <div className="mb-8">
            <h1 className="text-slate-900 text-3xl font-black leading-tight tracking-tight mb-2 font-display">Tạo tài khoản mới</h1>
            <p className="text-slate-500 text-base font-normal">Vui lòng điền thông tin để bắt đầu quản lý phòng trọ của bạn</p>
          </div>

          {loiNhan && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
              {loiNhan}
            </div>
          )}

          {thanhCong && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-600 rounded-xl text-sm font-medium">
              Đăng ký và xác thực thành công! Đang chuyển hướng...
            </div>
          )}

          {buocHienTai === 'bieu_mau' ? (
            <form className="flex flex-col gap-5" onSubmit={xuLyDangKy}>
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 text-sm font-semibold">Họ và tên</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 w-5 h-5" />
                  <input 
                    className="flex w-full rounded-lg border border-slate-300 bg-white h-12 pl-10 pr-4 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                    placeholder="Nhập họ và tên của bạn" 
                    type="text"
                    value={hoTen}
                    onChange={(e) => setHoTen(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-700 text-sm font-semibold">Số điện thoại</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 w-5 h-5" />
                  <input 
                    className="flex w-full rounded-lg border border-slate-300 bg-white h-12 pl-10 pr-4 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                    placeholder="0901 234 567" 
                    type="tel"
                    value={soDienThoai}
                    onChange={(e) => setSoDienThoai(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-700 text-sm font-semibold">Bạn là</label>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setVaiTro('landlord')}
                    className={`flex-1 flex flex-col items-center justify-center p-3 border rounded-lg transition-all ${vaiTro === 'landlord' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 hover:bg-slate-50 text-slate-500'}`}
                  >
                    <IconChuTro className="mb-1 w-5 h-5" />
                    <span className="text-sm font-medium">Chủ trọ</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setVaiTro('tenant')}
                    className={`flex-1 flex flex-col items-center justify-center p-3 border rounded-lg transition-all ${vaiTro === 'tenant' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 hover:bg-slate-50 text-slate-500'}`}
                  >
                    <IconNguoiThue className="mb-1 w-5 h-5" />
                    <span className="text-sm font-medium">Người thuê</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-700 text-sm font-semibold">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 w-5 h-5" />
                  <input 
                    className="flex w-full rounded-lg border border-slate-300 bg-white h-12 pl-10 pr-4 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                    placeholder="••••••••" 
                    type="password"
                    value={matKhau}
                    onChange={(e) => setMatKhau(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-700 text-sm font-semibold">Xác nhận mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 w-5 h-5" />
                  <input 
                    className="flex w-full rounded-lg border border-slate-300 bg-white h-12 pl-10 pr-4 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                    placeholder="••••••••" 
                    type="password"
                    value={xacNhanMatKhau}
                    onChange={(e) => setXacNhanMatKhau(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <button 
                  disabled={dangTai || thanhCong}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 px-4 rounded-xl transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span>{dangTai ? 'Đang xử lý...' : 'Đăng ký ngay'}</span>
                  {!dangTai && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-slate-500 text-sm">
                  Đã có tài khoản? 
                  <button 
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="text-secondary font-bold hover:underline ml-1"
                  >
                    Đăng nhập
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form className="flex flex-col gap-5" onSubmit={xuLyXacThucOTP}>
              <div className="p-4 bg-orange-50 rounded-xl mb-4 border border-orange-100">
                <p className="text-sm text-slate-700 text-center">
                  Mã xác nhận gồm 6 chữ số đã được gửi tới số điện thoại<br/>
                  <span className="font-bold text-primary">{soDienThoai}</span>
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 text-sm font-semibold text-center">Nhập mã xác nhận (OTP)</label>
                <div className="relative mx-auto w-48">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 w-5 h-5" />
                  <input 
                    className="flex w-full rounded-lg border border-slate-300 bg-white h-14 pl-10 pr-4 text-slate-900 text-center text-xl tracking-[0.2em] font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                    placeholder="000000" 
                    type="text"
                    maxLength={6}
                    value={maOTP}
                    onChange={(e) => setMaOTP(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <button 
                  disabled={dangTai || maOTP.length < 6}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 px-4 rounded-xl transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span>{dangTai ? 'Đang xác thực...' : 'Hoàn tất Đăng ký'}</span>
                  {!dangTai && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>

              <div className="mt-4 text-center">
                <button 
                  type="button"
                  onClick={() => {
                    setBuocHienTai('bieu_mau');
                    setMaOTP('');
                    setLoiNhan(null);
                  }}
                  className="text-slate-500 font-medium hover:text-slate-800 transition-colors text-sm"
                >
                  Quay lại
                </button>
              </div>
            </form>
          )}
          
        </motion.div>
        

     
      </div>

      <div className="hidden md:flex flex-1 relative flat-illustration border-l border-orange-100 overflow-hidden items-center justify-center p-12">
        <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-yellow-100/60 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[10%] w-80 h-80 bg-green-100/60 rounded-full blur-3xl"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center bg-white p-12 rounded-2xl shadow-xl border-2 border-yellow-100 max-w-lg"
        >
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 bg-accent/20 rounded-2xl">
            <Smartphone className="text-accent w-12 h-12" />
          </div>
          <h2 className="text-slate-900 text-4xl font-black mb-6 leading-tight font-display">Bắt đầu hành trình cùng Trọ Pro</h2>
          <p className="text-slate-600 text-lg mx-auto leading-relaxed">
            Đăng ký tài khoản để trải nghiệm dịch vụ quản lý thông minh và chuyên nghiệp nhất hiện nay.
          </p>
        </motion.div>
      </div>
    </div>
  );
};