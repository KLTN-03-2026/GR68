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


interface SupportTabProps {
  supportRequestsData: any[];
  handleUpdateSupportRequest: (id: string, status: string) => void;
}

export const SupportTab = ({ supportRequestsData, handleUpdateSupportRequest }: SupportTabProps) => {
  const activeTab = 'support';

  return (
    <>
      {activeTab === 'support' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 max-w-5xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 font-display">Yêu cầu hỗ trợ</h2>
                  <p className="text-slate-500">Tiếp nhận và xử lý sự cố từ người thuê</p>
                </div>
              </div>

              {supportRequestsData.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                    <Wrench className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có yêu cầu nào</h3>
                  <p className="text-slate-500 max-w-sm">Mọi thứ đang hoạt động tốt. Các yêu cầu sửa chữa từ người thuê sẽ hiện tại đây.</p>
                </div>
              ) : (
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 overflow-hidden flex flex-col gap-4">
                  {supportRequestsData.map(req => {
                    const statusText = req.status === 'pending' ? 'Chờ xử lý' : req.status === 'processing' ? 'Đang sửa' : 'Hoàn thành';
                    const statusColor = req.status === 'pending' ? 'bg-orange-100 text-orange-700' : req.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700';
                    const Icon = req.status === 'pending' ? Clock : req.status === 'processing' ? Wrench : CheckCircle;
                    const date = new Date(req.created_at).toLocaleDateString('vi-VN');

                    return (
                      <div key={req.id} className="p-6 rounded-3xl border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                        <div className="flex items-start gap-4 flex-1">
                          <img 
                            src={req.profiles?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} 
                            alt={req.profiles?.full_name || 'Người thuê'} 
                            className="w-12 h-12 rounded-full object-cover shrink-0" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="space-y-1">
                            <h4 className="font-black text-lg text-slate-900 group-hover:text-primary transition-colors">{req.title}</h4>
                            <p className="text-sm text-slate-500">{req.description}</p>
                            <div className="flex items-center gap-3 pt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {req.profiles?.full_name || 'Người thuê'}</span>
                              <span className="flex items-center gap-1"><HomeIcon className="w-3.5 h-3.5" /> {req.rooms?.title}</span>
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {date}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3 shrink-0">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1.5 ${statusColor}`}>
                            <Icon className="w-4 h-4" /> {statusText}
                          </span>
                          
                          {req.status !== 'resolved' && (
                            <div className="flex gap-2">
                              {req.status === 'pending' && (
                                <button
                                  onClick={() => handleUpdateSupportRequest(req.id, 'processing')}
                                  className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs hover:bg-blue-600 hover:text-white transition-all"
                                >
                                  Tiếp nhận
                                </button>
                              )}
                              <button
                                onClick={() => handleUpdateSupportRequest(req.id, 'resolved')}
                                className="px-4 py-2 rounded-xl bg-green-50 text-green-600 font-bold text-xs hover:bg-green-600 hover:text-white transition-all"
                              >
                                Đã giải quyết
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
    </>
  );
};
