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


interface ContractsTabProps {
  contractsData: any[];
}

export const ContractsTab = ({ contractsData }: ContractsTabProps) => {
  const [contractFilter, setContractFilter] = useState('all');

  const contracts = contractsData.map(c => ({
    id: c.id,
    tenant: c.profiles?.full_name || 'N/A',
    initials: (c.profiles?.full_name || 'NA').split(' ').map((n: any) => n[0]).join('').toUpperCase().slice(0, 2),
    room: c.rooms?.title || 'N/A',
    period: `${new Date(c.start_date).toLocaleDateString('vi-VN')} - ${new Date(c.end_date).toLocaleDateString('vi-VN')}`,
    deposit: `${Number(c.deposit).toLocaleString()}đ`,
    status: c.status,
    statusLabel: c.status === 'active' ? 'Đang hiệu lực' : c.status === 'pending' ? 'Chờ ký' : c.status === 'expired' ? 'Đã hết hạn' : 'Đã chấm dứt',
    statusColor: c.status === 'active' ? 'bg-green-100 text-green-700' : c.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600',
    profiles: c.profiles
  }));

  const filteredContracts = contractFilter === 'all' ? contracts : contracts.filter(c => c.status === contractFilter);
  const activeTab = 'contracts';

  return (
    <>
      {activeTab === 'contracts' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 font-display">Quản lý Hợp đồng</h2>
                  <p className="text-slate-500 font-medium">Xem và quản lý tất cả các hợp đồng thuê phòng của bạn.</p>
                </div>
                <button className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-100">
                  <Plus className="w-5 h-5" />
                  Tạo hợp đồng mới
                </button>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Đang hiệu lực', value: contractsData.filter(c => c.status === 'active').length.toString(), sub: '+0 hợp đồng mới', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
                  { label: 'Chờ ký', value: contractsData.filter(c => c.status === 'pending').length.toString(), sub: 'Cần xử lý trong tuần', icon: FileClock, color: 'text-orange-600', bg: 'bg-orange-100' },
                  { label: 'Sắp hết hạn', value: contractsData.filter(c => {
                    const endDate = new Date(c.end_date);
                    const today = new Date();
                    const diffTime = endDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays > 0 && diffDays <= 30;
                  }).length.toString(), sub: 'Dưới 30 ngày', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-500 text-xs font-black uppercase tracking-widest">{stat.label}</span>
                      <div className={`${stat.bg} ${stat.color} p-2 rounded-xl`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900 font-display">{stat.value}</div>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">{stat.sub}</p>
                  </div>
                ))}
              </div>

              {/* Filters & Table Section */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-wrap items-center gap-4">
                  <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Bộ lọc:</span>
                  <div className="flex gap-2">
                    {[
                      { id: 'all', label: 'Tất cả' },
                      { id: 'active', label: 'Đang hiệu lực' },
                      { id: 'pending', label: 'Chờ ký' },
                      { id: 'expired', label: 'Đã hết hạn' },
                    ].map((filter) => (
                      <button 
                        key={filter.id}
                        onClick={() => setContractFilter(filter.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                          contractFilter === filter.id 
                            ? 'bg-primary text-white shadow-md shadow-orange-100' 
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <button className="p-2.5 border border-slate-200 rounded-xl text-slate-400 hover:text-primary hover:border-primary transition-all">
                      <Filter className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 border border-slate-200 rounded-xl text-slate-400 hover:text-primary hover:border-primary transition-all">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Khách thuê</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Phòng</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Thời gian</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Tiền cọc</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Người thân</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Trạng thái</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredContracts.map((contract) => (
                        <tr key={contract.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                                {contract.initials}
                              </div>
                              <div className="text-sm font-bold text-slate-900">{contract.tenant}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-[10px] font-black text-slate-700 tracking-widest uppercase">
                              {contract.room}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-500">
                            {contract.period}
                          </td>
                          <td className="px-6 py-4 text-sm font-black text-slate-900">
                            {contract.deposit}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-slate-900">{contract.profiles?.emergency_contact_phone || '---'}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{contract.profiles?.emergency_contact_name || 'Chưa cập nhật'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${contract.statusColor}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                contract.status === 'active' ? 'bg-green-500' : 
                                contract.status === 'pending' ? 'bg-primary' : 'bg-slate-400'
                              }`}></span>
                              {contract.statusLabel}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-slate-300 hover:text-primary transition-colors">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Hiển thị 1-{filteredContracts.length} trên tổng số {contractsData.length} hợp đồng
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="p-2 border border-slate-200 rounded-xl text-slate-300 hover:bg-slate-50 disabled:opacity-50 transition-all" disabled>
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-xl font-black text-sm shadow-md shadow-orange-100">1</button>
                    <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-xl font-black text-sm transition-all">2</button>
                    <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-xl font-black text-sm transition-all">3</button>
                    <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
    </>
  );
};
