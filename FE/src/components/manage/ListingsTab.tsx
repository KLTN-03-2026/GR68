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


interface ListingsTabProps {
  listingsData: any[];
  setShowAddListingModal: (v: boolean) => void;
}

export const ListingsTab = ({ listingsData, setShowAddListingModal }: ListingsTabProps) => {
  const activeTab = 'listings';

  return (
    <>
      {activeTab === 'listings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 font-display">Quản lý bài đăng</h2>
                  <p className="text-slate-500 font-medium">Các tin đăng quảng bá phòng trọ của bạn trên hệ thống.</p>
                </div>
                <button
                  onClick={() => setShowAddListingModal(true)}
                  className="bg-primary text-white font-black uppercase tracking-widest text-xs py-4 px-8 rounded-2xl hover:bg-primary-hover transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Tạo bài đăng mới
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {listingsData.map((listing) => (
                  <div key={listing.id} className="bg-white rounded-[32px] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        src={listing.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400'} 
                        alt={listing.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${listing.is_active ? 'bg-green-500 text-white' : 'bg-slate-500 text-white'}`}>
                        {listing.is_active ? 'Đang hiển thị' : 'Tạm ẩn'}
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-lg font-black text-slate-900 font-display mb-2 group-hover:text-primary transition-colors">{listing.title}</h3>
                      <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-2">{listing.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-primary font-display">{Number(listing.price).toLocaleString()}đ</span>
                        <div className="flex gap-2">
                          <button className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-primary transition-all">
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 transition-all">
                            <Ban className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
    </>
  );
};
