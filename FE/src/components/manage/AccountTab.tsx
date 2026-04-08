import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home, HomeIcon, Bed, Wallet, Plus, FileText, User, ChevronLeft, ChevronRight,
  AlertCircle, PhoneCall, Trash2, Edit3, Camera, BadgeCheck, Phone, Zap, Droplets,
  ShieldCheck, Clock, CheckCircle, X, Search, Wrench, Mail, MessageSquare, PlusCircle,
  Image as ImageIcon, MapPin, Users, Settings, Lock as LockIcon, LogOut, MoreVertical,
  MoreHorizontal, Filter, ArrowUpDown, Maximize2, Info, Layers, Construction, ArrowLeft,
  Calendar, Eye, EyeOff, Sparkles, FileClock, Shield, ShieldAlert, Ban, Download,
  MessageCircle, FileSignature, HelpCircle, UserX, UserCheck, Save, Send, Smile, Video,
  ChevronDown, RefreshCw
} from 'lucide-react';
import Messaging from '../shared/Messaging';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AccountTabProps {
  user: SupabaseUser | null;
  roomsData: any[];
  contractsData: any[];
  supabase: any;
}

export const AccountTab = ({ user, roomsData, contractsData, supabase }: AccountTabProps) => {
  const [profileForm, setProfileForm] = useState({
    full_name: '', phone: '', gender: '', birth_date: '',
    permanent_address: '',
    id_card_number: '', id_card_date: '', id_card_place: '',
    bank_name: '', bank_account_number: '', bank_account_name: '',
    zalo_phone: '', emergency_contact_name: '', emergency_contact_phone: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaveMsg, setProfileSaveMsg] = useState('');
  const [passwordForm, setPasswordForm] = useState({ old: '', new: '', confirm: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const InputField = ({ label, icon: Icon, type = 'text', placeholder = '', value, onChange }: any) => (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full rounded-2xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 ${Icon ? 'pl-11' : ''} transition-all outline-none text-sm`} />
      </div>
    </div>
  );

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) { setPasswordMsg('Mật khẩu xác nhận không khớp!'); return; }
    setPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({ password: passwordForm.new });
    setPasswordLoading(false);
    setPasswordMsg(error ? 'Lỗi: ' + error.message : 'Cập nhật mật khẩu thành công!');
    if (!error) setPasswordForm({ old: '', new: '', confirm: '' });
    setTimeout(() => setPasswordMsg(''), 3000);
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    setProfileSaving(true);
    const { error } = await supabase.from('profiles').update(profileForm).eq('id', user.id);
    setProfileSaving(false);
    setProfileSaveMsg(error ? 'Đã xảy ra lỗi, vui lòng thử lại!' : 'Lưu thành công!');
    setTimeout(() => setProfileSaveMsg(''), 3000);
  };

  const updateProfileField = (field: string, val: string) => {
    setProfileForm(f => ({ ...f, [field]: val }));
  };

  // Load profile data once
  React.useEffect(() => {
    if (!user?.id || profileForm.full_name) return;
    setProfileLoading(true);
    supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }: any) => {
      if (data) setProfileForm({
        full_name: data.full_name || '', phone: data.phone || '',
        gender: data.gender || '', birth_date: data.birth_date || '',
        permanent_address: data.permanent_address || '',
        id_card_number: data.id_card_number || '', id_card_date: data.id_card_date || '',
        id_card_place: data.id_card_place || '', bank_name: data.bank_name || '',
        bank_account_number: data.bank_account_number || '', bank_account_name: data.bank_account_name || '',
        zalo_phone: data.zalo_phone || '', emergency_contact_name: data.emergency_contact_name || '',
        emergency_contact_phone: data.emergency_contact_phone || ''
      });
      setProfileLoading(false);
    });
  }, [user?.id]);

  const activeTab = 'account';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto w-full flex flex-col gap-8 pb-20">
      {/* Profile Header Card */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative group">
          <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-slate-50 shadow-xl relative">
            <img src={user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-xl shadow-lg flex items-center justify-center hover:scale-110 transition-transform border-4 border-white"><Camera className="w-5 h-5" /></button>
        </div>
        <div className="text-center md:text-left flex-1 relative z-10">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
            <h2 className="text-3xl font-black text-slate-900 font-display">{profileForm.full_name || user?.user_metadata?.full_name || 'Chưa cập nhật tên'}</h2>
            <span className="bg-orange-100 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1"><BadgeCheck className="w-3 h-3" />Chủ trọ</span>
          </div>
          <p className="text-slate-500 font-bold text-sm mb-4">{user?.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-2 rounded-xl"><HomeIcon className="w-4 h-4" /> {roomsData.length} Phòng</div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-2 rounded-xl"><Users className="w-4 h-4" /> {contractsData.length} Hợp đồng</div>
          </div>
        </div>
      </div>

      {profileLoading ? (
        <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><User className="w-5 h-5" /></div>
                <div><h3 className="font-black text-slate-900 font-display">Thông tin cá nhân</h3><p className="text-xs text-slate-400 font-medium">Thông tin hiển thị trên hệ thống</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField label="Họ và tên" icon={User} field="full_name" placeholder="Nguyễn Văn A" value={profileForm.full_name} onChange={(v: string) => updateProfileField('full_name', v)} />
                <InputField label="Số điện thoại" icon={Phone} field="phone" type="tel" placeholder="0901 234 567" value={profileForm.phone} onChange={(v: string) => updateProfileField('phone', v)} />
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Giới tính</label>
                  <select value={profileForm.gender} onChange={e => updateProfileField('gender', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none text-sm"><option value="">Chọn giới tính</option><option value="Nam">Nam</option><option value="Nữ">Nữ</option><option value="Khác">Khác</option></select>
                </div>
                <InputField label="Ngày sinh" icon={Calendar} field="birth_date" type="date" value={profileForm.birth_date} onChange={(v: string) => updateProfileField('birth_date', v)} />
                <div className="md:col-span-2"><InputField label="Địa chỉ thường trú" icon={MapPin} field="permanent_address" placeholder="Số nhà, đường, phường/xã..." value={profileForm.permanent_address} onChange={(v: string) => updateProfileField('permanent_address', v)} /></div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600"><BadgeCheck className="w-5 h-5" /></div>
                <div><h3 className="font-black text-slate-900 font-display">Định danh pháp lý</h3><p className="text-xs text-slate-400 font-medium">Bắt buộc để ký hợp đồng điện tử</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField label="Số CCCD / CMND" icon={BadgeCheck} field="id_card_number" placeholder="012345678901" value={profileForm.id_card_number} onChange={(v: string) => updateProfileField('id_card_number', v)} />
                <InputField label="Ngày cấp" icon={Calendar} field="id_card_date" type="date" value={profileForm.id_card_date} onChange={(v: string) => updateProfileField('id_card_date', v)} />
                <div className="md:col-span-2"><InputField label="Nơi cấp" icon={MapPin} field="id_card_place" placeholder="Cục Cảnh sát QLHC về TTXH" value={profileForm.id_card_place} onChange={(v: string) => updateProfileField('id_card_place', v)} /></div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600"><Wallet className="w-5 h-5" /></div>
                <div><h3 className="font-black text-slate-900 font-display">Tài chính & Liên hệ</h3><p className="text-xs text-slate-400 font-medium">Thông tin thanh toán và khẩn cấp</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField label="Ngân hàng" icon={Shield} field="bank_name" placeholder="Vietcombank..." value={profileForm.bank_name} onChange={(v: string) => updateProfileField('bank_name', v)} />
                <InputField label="Số tài khoản" icon={LockIcon} field="bank_account_number" placeholder="123456..." value={profileForm.bank_account_number} onChange={(v: string) => updateProfileField('bank_account_number', v)} />
                <div className="md:col-span-2"><InputField label="Chủ tài khoản" icon={User} field="bank_account_name" placeholder="NGUYEN VAN A" value={profileForm.bank_account_name} onChange={(v: string) => updateProfileField('bank_account_name', v)} /></div>
                <InputField label="Số Zalo" icon={Phone} field="zalo_phone" placeholder="0901..." value={profileForm.zalo_phone} onChange={(v: string) => updateProfileField('zalo_phone', v)} />
                <InputField label="Người thân khẩn cấp" icon={Users} field="emergency_contact_name" placeholder="Tên người thân" value={profileForm.emergency_contact_name} onChange={(v: string) => updateProfileField('emergency_contact_name', v)} />
                <div className="md:col-span-2"><InputField label="SĐT người thân khẩn cấp" icon={PhoneCall} field="emergency_contact_phone" type="tel" placeholder="0901..." value={profileForm.emergency_contact_phone} onChange={(v: string) => updateProfileField('emergency_contact_phone', v)} /></div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={handleSaveProfile} disabled={profileSaving} className="bg-primary text-white font-black uppercase tracking-widest text-xs px-10 py-5 rounded-2xl hover:bg-primary/90 transition-all flex items-center gap-2 shadow-xl shadow-orange-100 hover:-translate-y-1 disabled:opacity-60">
                {profileSaving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang lưu...</> : <><CheckCircle className="w-4 h-4" /> Lưu thông tin hồ sơ</>}
              </button>
              {profileSaveMsg && <span className={`text-sm font-bold ${profileSaveMsg.includes('lỗi') ? 'text-red-500' : 'text-green-600'}`}>{profileSaveMsg}</span>}
            </div>
          </div>

          {/* Right Column: Security */}
          <div className="flex flex-col gap-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm overflow-hidden relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center"><LockIcon className="w-5 h-5" /></div>
                <div><h3 className="font-black text-slate-900 font-display">Bảo mật</h3><p className="text-xs text-slate-400 font-medium">Đổi mật khẩu tài khoản</p></div>
              </div>
              <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu mới</label>
                  <div className="relative"><LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type={showPassword ? 'text' : 'password'} value={passwordForm.new} onChange={e => setPasswordForm(f => ({ ...f, new: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 p-4 pl-11 transition-all outline-none text-sm" placeholder="••••••••" /></div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Xác nhận mật khẩu</label>
                  <div className="relative"><LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type={showPassword ? 'text' : 'password'} value={passwordForm.confirm} onChange={e => setPasswordForm(f => ({ ...f, confirm: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 p-4 pl-11 transition-all outline-none text-sm" placeholder="••••••••" /></div>
                </div>
                <button type="submit" disabled={passwordLoading} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-lg disabled:opacity-60">{passwordLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}</button>
                {passwordMsg && <p className={`text-[10px] font-bold text-center ${passwordMsg.includes('Cập nhật') ? 'text-green-600' : 'text-red-500'}`}>{passwordMsg}</p>}
              </form>
            </div>

            <div className="bg-red-50/50 rounded-3xl border border-red-100 p-8">
              <div className="flex items-center gap-3 mb-4 text-red-600"><Shield className="w-5 h-5" /><h3 className="font-black font-display">Vùng nguy hiểm</h3></div>
              <p className="text-[10px] font-bold text-red-400 mb-6 leading-relaxed">Xóa tài khoản sẽ xóa vĩnh viễn tất cả dữ liệu phòng trọ và hợp đồng. Hành động này không thể hoàn tác!</p>
              <button className="w-full py-3 rounded-xl border-2 border-red-200 text-red-600 font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">Xóa tài khoản vĩnh viễn</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
