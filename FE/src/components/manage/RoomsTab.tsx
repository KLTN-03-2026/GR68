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


interface RoomsTabProps {
  roomsData: any[];
  contractsData: any[];
  listingsData: any[];
  roomFilter: string;
  setRoomFilter: (f: string) => void;
  openAddRoomModal: () => void;
  openEditRoomModal: (id: string) => void;
  handleDeleteRoom: (id: string, title: string) => void;
  setSelectedRoom: (r: any) => void;
  setShowRoomDetailModal: (v: boolean) => void;
}

export const RoomsTab = ({
  roomsData, contractsData, listingsData,
  roomFilter, setRoomFilter,
  openAddRoomModal, openEditRoomModal, handleDeleteRoom,
  setSelectedRoom, setShowRoomDetailModal
}: RoomsTabProps) => {
  const rooms = roomsData.map(r => {
    const activeContract = contractsData.find(c => c.room_id === r.id && c.status === 'active');
    let profileName = null, tenantPhone = null, tenantAvatar = null;
    let contractStart = null, contractEnd = null, contractDeposit = null;
    if (activeContract) {
      const p = Array.isArray(activeContract.profiles) ? activeContract.profiles[0] : activeContract.profiles;
      if (p) { profileName = p.full_name; tenantPhone = p.phone; tenantAvatar = p.avatar_url; }
      contractStart = activeContract.start_date;
      contractEnd   = activeContract.end_date;
      contractDeposit = activeContract.deposit;
    }
    return {
      id: r.id, title: r.title,
      price: `${Number(r.price).toLocaleString()}đ`,
      type: r.type || 'Phòng trọ',
      area: `${r.area} m²`,
      tenant: profileName, tenantPhone, tenantAvatar,
      contractStart, contractEnd, contractDeposit,
      status: r.status,
      statusLabel: r.status === 'occupied' ? 'Đang thuê' : r.status === 'repairing' ? 'Đang sửa' : r.status === 'pending' ? 'Chờ ký' : 'Trống',
      statusColor: r.status === 'occupied' ? 'bg-green-100 text-green-700' : r.status === 'repairing' ? 'bg-amber-100 text-amber-700' : r.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-orange-100 text-orange-700',
      image: r.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400',
      note: r.note, electricity_price: r.electricity_price,
      water_price: r.water_price, service_fee: r.service_fee
    };
  });

  const filteredRooms = roomFilter === 'all' ? rooms : rooms.filter(r => r.status === roomFilter);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 font-display">Danh sách phòng ({rooms.length})</h2>
          <p className="text-slate-500 font-medium">Quản lý và xem trạng thái các phòng trọ của bạn.</p>
        </div>
        <button onClick={openAddRoomModal} className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-100">
          <Plus className="w-5 h-5" />
          Thêm phòng mới
        </button>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-4">
        {[
          { id: 'all', label: 'Tất cả' },
          { id: 'empty', label: 'Trống' },
          { id: 'occupied', label: 'Đang thuê' },
          { id: 'pending', label: 'Chờ ký HĐ' },
          { id: 'repairing', label: 'Đang sửa' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setRoomFilter(filter.id)}
            className={`px-4 py-2 text-sm font-bold rounded-full transition-all ${
              roomFilter === filter.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 mt-4">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 shadow-sm">
            <Home className="w-12 h-12 opacity-80" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-3 font-display">Bạn chưa có phòng nào!</h3>
          <p className="text-slate-500 max-w-md mb-8 font-medium">Chào mừng bạn đến với hệ thống quản lý. Hãy bắt đầu bằng việc tạo căn phòng đầu tiên cho khu trọ của bạn nhé.</p>
          <button onClick={openAddRoomModal} className="bg-primary text-white font-black uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-100 hover:-translate-y-1">
            <Plus className="w-5 h-5" />
            Thêm phòng đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map(room => (
            <div key={room.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all group flex flex-col">
              <div className="h-48 relative overflow-hidden bg-slate-100">
                <img src={room.image} alt={room.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 text-xs font-black rounded-lg shadow-sm ${room.statusColor}`}>
                    {room.statusLabel}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-slate-900 text-lg truncate pr-2">{room.title}</h3>
                  <div className="font-black text-primary text-lg shrink-0">{room.price}</div>
                </div>
                
                <div className="space-y-3 mb-6 flex-1">
                  {room.tenant ? (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <img src={room.tenantAvatar || `https://ui-avatars.com/api/?name=${room.tenant}`} alt={room.tenant} className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="text-sm font-bold text-slate-900 line-clamp-1">{room.tenant}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{room.tenantPhone}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-400"><UserX className="w-4 h-4" /></div>
                      <p className="text-sm font-bold text-slate-400">Trống - Chưa có người thuê</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md"><Maximize2 className="w-3 h-3" /> {room.area}</span>
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md"><HomeIcon className="w-3 h-3" /> {room.type}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <button onClick={() => { setSelectedRoom(room); setShowRoomDetailModal(true); }} className="py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">Xem chi tiết</button>
                  <button onClick={() => openEditRoomModal(room.id)} className="py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">Chỉnh sửa</button>
                </div>
              </div>
            </div>
          ))}
          {filteredRooms.length === 0 && (
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
              <p className="font-bold text-slate-400">Không có phòng nào phù hợp với bộ lọc hiện tại.</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
