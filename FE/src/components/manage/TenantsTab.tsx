import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home, HomeIcon, Bed, Wallet as WalletIcon, Plus, FileText, User, ChevronLeft, ChevronRight,
  AlertCircle, PhoneCall, Trash2, Edit3, Camera, BadgeCheck, Phone, Zap, Droplets,
  ShieldCheck, Clock, CheckCircle, X, Search, Wrench, Mail, MessageSquare, PlusCircle,
  Image as ImageIcon, MapPin, Users, Settings, Lock as LockIcon, LogOut, MoreVertical,
  MoreHorizontal, Filter, ArrowUpDown, Maximize2, Info, Layers, Construction, ArrowLeft,
  Calendar, Eye, EyeOff, Sparkles, FileClock, Shield, ShieldAlert, Ban, Download,
  MessageCircle, FileSignature, HelpCircle, UserX, UserCheck, Save, Wallet
} from 'lucide-react';
import Messaging from '../shared/Messaging';


interface TenantsTabProps {
  contractsData: any[];
  setActiveTab: (tab: string) => void;
}

export const TenantsTab = ({ contractsData, setActiveTab }: TenantsTabProps) => {
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [showTenantProfile, setShowTenantProfile] = useState(false);
  const [sendingProfileReminder, setSendingProfileReminder] = useState(false);
  const [profileReminderSent, setProfileReminderSent] = useState(false);

  const activeTenantsMap = new Map();
  contractsData.forEach(c => {
    if (c.status === 'active' && c.profiles && !activeTenantsMap.has(c.tenant_id)) {
      const p = c.profiles;
      activeTenantsMap.set(c.tenant_id, {
        id: c.tenant_id, name: p.full_name || 'Người thuê', phone: p.phone,
        avatar: p.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.full_name || 'U')}&background=random`,
        room: c.rooms?.title || 'Chưa thuê', gender: p.gender, birth_date: p.birth_date,
        permanent_address: p.permanent_address, id_card_number: p.id_card_number,
        id_card_date: p.id_card_date, id_card_place: p.id_card_place, zalo_phone: p.zalo_phone,
        bank_name: p.bank_name, bank_account_number: p.bank_account_number,
        bank_account_name: p.bank_account_name, emergency_contact_name: p.emergency_contact_name,
        emergency_contact_phone: p.emergency_contact_phone, contract_start: c.start_date,
        contract_end: c.end_date, deposit: c.deposit, contract_id: c.id
      });
    }
  });
  const tenants = Array.from(activeTenantsMap.values());

  const handleViewProfile = (tenant: any) => { setSelectedTenant(tenant); setShowTenantProfile(true); };

  const handleRequestProfileUpdate = async (tenant: any) => {
    setSendingProfileReminder(true);
    setTimeout(() => {
      setProfileReminderSent(true);
      setSendingProfileReminder(false);
      setTimeout(() => setProfileReminderSent(false), 4000);
    }, 1000);
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 font-display">Người thuê ({tenants.length})</h2>
          <p className="text-slate-500 font-medium">Theo dõi thông tin và hồ sơ của người thuê hiện tại.</p>
        </div>

        {tenants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-200">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
              <Users className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có người thuê</h3>
            <p className="text-slate-500 max-w-sm mb-6">Người thuê sẽ xuất hiện khi bạn tạo Hợp đồng thuê phòng đang có hiệu lực.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenants.map(tenant => (
              <div key={tenant.id} className="bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-xl transition-all flex flex-col group relative">
                <div className="flex items-center gap-4 mb-6">
                  <img src={tenant.avatar} alt={tenant.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm bg-slate-100 border border-slate-100" referrerPolicy="no-referrer" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-slate-900 text-lg truncate group-hover:text-primary transition-colors">{tenant.name}</h3>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest bg-slate-100 inline-block px-2 py-0.5 rounded-md">{tenant.room}</p>
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="font-bold text-slate-700 truncate">{tenant.phone || 'Chưa cập nhật SĐT'}</span>
                  </div>
                  
                  {tenant.id_card_number ? (
                    <div className="flex items-center gap-3 text-sm">
                      <BadgeCheck className="w-4 h-4 text-green-500" />
                      <span className="font-bold text-slate-700">Đã định danh CCCD</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-sm">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-amber-600">Hồ sơ chưa đầy đủ</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100">
                  <button onClick={() => handleViewProfile(tenant)} className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">
                    Hồ sơ
                  </button>
                  <button onClick={() => setActiveTab('messages')} className="flex-1 py-2.5 bg-primary/10 text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/20 transition-colors flex justify-center items-center gap-1">
                    <MessageSquare className="w-4 h-4" /> Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Tenant Profile Modal */}
          <AnimatePresence>
          {showTenantProfile && selectedTenant && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowTenantProfile(false)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 flex-shrink-0">
                  <button onClick={() => setShowTenantProfile(false)} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl flex-shrink-0">
                      <img src={selectedTenant.avatar} alt={selectedTenant.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white font-display">{selectedTenant.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-black text-primary bg-primary/20 px-3 py-1 rounded-full uppercase tracking-widest">{selectedTenant.room}</span>
                        {selectedTenant.gender && <span className="text-[10px] font-bold text-white/60 bg-white/10 px-3 py-1 rounded-full">{selectedTenant.gender}</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="overflow-y-auto flex-1 p-8 space-y-6">

                  {/* Profile Completeness Warning */}
                  {(() => {
                    const missingFields: string[] = [];
                    if (!selectedTenant.id_card_number) missingFields.push('Số CCCD/CMND');
                    if (!selectedTenant.permanent_address) missingFields.push('Địa chỉ thường trú');
                    if (!selectedTenant.birth_date) missingFields.push('Ngày sinh');
                    if (!selectedTenant.emergency_contact_name) missingFields.push('Liên hệ khẩn cấp');
                    if (missingFields.length === 0) return null;
                    return (
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-black text-amber-800 text-sm mb-1">Hồ sơ chưa đầy đủ</p>
                            <p className="text-amber-700 text-xs font-medium">Thiếu: <span className="font-bold">{missingFields.join(', ')}</span></p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Section: Liên hệ */}
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Phone className="w-3.5 h-3.5" />Thông tin liên hệ</p>
                    <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">Số điện thoại</span>
                        <span className="font-bold text-slate-900">{selectedTenant.phone || <span className="text-slate-400">Chưa có</span>}</span>
                      </div>
                      {selectedTenant.zalo_phone && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 font-medium">Zalo</span>
                          <span className="font-bold text-slate-900">{selectedTenant.zalo_phone}</span>
                        </div>
                      )}
                      {selectedTenant.permanent_address && (
                        <div className="flex justify-between text-sm gap-4">
                          <span className="text-slate-500 font-medium flex-shrink-0">Địa chỉ thường trú</span>
                          <span className="font-bold text-slate-900 text-right">{selectedTenant.permanent_address}</span>
                        </div>
                      )}
                      {selectedTenant.birth_date && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 font-medium">Ngày sinh</span>
                          <span className="font-bold text-slate-900">{new Date(selectedTenant.birth_date).toLocaleDateString('vi-VN')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section: CCCD */}
                  {(selectedTenant.id_card_number || selectedTenant.id_card_date || selectedTenant.id_card_place) && (
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><BadgeCheck className="w-3.5 h-3.5" />Định danh pháp lý (CCCD/CMND)</p>
                      <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                        {selectedTenant.id_card_number && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Số CCCD</span>
                            <span className="font-bold text-slate-900 font-mono">{selectedTenant.id_card_number}</span>
                          </div>
                        )}
                        {selectedTenant.id_card_date && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Ngày cấp</span>
                            <span className="font-bold text-slate-900">{new Date(selectedTenant.id_card_date).toLocaleDateString('vi-VN')}</span>
                          </div>
                        )}
                        {selectedTenant.id_card_place && (
                          <div className="flex justify-between text-sm gap-4">
                            <span className="text-slate-500 font-medium flex-shrink-0">Nơi cấp</span>
                            <span className="font-bold text-slate-900 text-right">{selectedTenant.id_card_place}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Section: Liên hệ khẩn cấp */}
                  {(selectedTenant.emergency_contact_name || selectedTenant.emergency_contact_phone) && (
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><PhoneCall className="w-3.5 h-3.5" />Liên hệ khẩn cấp</p>
                      <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                        {selectedTenant.emergency_contact_name && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Người thân</span>
                            <span className="font-bold text-slate-900">{selectedTenant.emergency_contact_name}</span>
                          </div>
                        )}
                        {selectedTenant.emergency_contact_phone && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">SĐT liên hệ</span>
                            <a href={`tel:${selectedTenant.emergency_contact_phone}`} className="font-bold text-primary hover:underline">{selectedTenant.emergency_contact_phone}</a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Section: Hợp đồng */}
                  {selectedTenant.contract_start && (
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><FileText className="w-3.5 h-3.5" />Thông tin Hợp đồng</p>
                      <div className="bg-primary/5 rounded-2xl p-4 space-y-3 border border-primary/10">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 font-medium">Thời hạn</span>
                          <span className="font-bold text-slate-900">{new Date(selectedTenant.contract_start).toLocaleDateString('vi-VN')} → {new Date(selectedTenant.contract_end).toLocaleDateString('vi-VN')}</span>
                        </div>
                        {selectedTenant.deposit > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Tiền cọc</span>
                            <span className="font-black text-primary">{Number(selectedTenant.deposit).toLocaleString()}đ</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Section: Ngân hàng */}
                  {(selectedTenant.bank_name || selectedTenant.bank_account_number) && (
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Wallet className="w-3.5 h-3.5" />Thông tin ngân hàng</p>
                      <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                        {selectedTenant.bank_name && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Ngân hàng</span>
                            <span className="font-bold text-slate-900">{selectedTenant.bank_name}</span>
                          </div>
                        )}
                        {selectedTenant.bank_account_number && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Số tài khoản</span>
                            <span className="font-bold text-slate-900 font-mono">{selectedTenant.bank_account_number}</span>
                          </div>
                        )}
                        {selectedTenant.bank_account_name && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Chủ tài khoản</span>
                            <span className="font-bold text-slate-900">{selectedTenant.bank_account_name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>

                {/* Modal Footer */}
                <div className="border-t border-slate-100 p-6 space-y-3 flex-shrink-0">
                  {/* Nhắc điền hồ sơ - chỉ hiện nếu thiếu thông tin */}
                  {(!selectedTenant.id_card_number || !selectedTenant.permanent_address || !selectedTenant.birth_date || !selectedTenant.emergency_contact_name) && (
                    <button
                      onClick={() => handleRequestProfileUpdate(selectedTenant)}
                      disabled={sendingProfileReminder || profileReminderSent}
                      className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                        profileReminderSent
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                      } disabled:opacity-60`}
                    >
                      {profileReminderSent ? (
                        <><CheckCircle className="w-4 h-4" /><span>Đã gửi nhắc nhở!</span></>
                      ) : sendingProfileReminder ? (
                        <><div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /><span>Đang gửi...</span></>
                      ) : (
                        <><AlertCircle className="w-4 h-4" /><span>Nhắc người thuê bổ sung hồ sơ</span></>
                      )}
                    </button>
                  )}
                  <div className="flex gap-3">
                    {selectedTenant.phone && (
                      <a href={`tel:${selectedTenant.phone}`} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                        <Phone className="w-4 h-4" />Gọi điện
                      </a>
                    )}
                    <button onClick={() => { setShowTenantProfile(false); setActiveTab('messages'); }} className="flex-1 py-3 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                      <MessageSquare className="w-4 h-4" />Nhắn tin
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
          </AnimatePresence>
    </>
  );
};
