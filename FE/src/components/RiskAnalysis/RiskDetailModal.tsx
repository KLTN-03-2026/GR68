import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, Zap, Droplets, Phone, MessageSquare, CheckCircle, Ban, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';

interface RiskDetailModalProps {
  show: boolean;
  onClose: () => void;
  alert: any;
  onResolve: (id: string) => void;
  onNavigate?: (page: string, params?: any) => void;
}

export const RiskDetailModal = ({ show, onClose, alert, onResolve, onNavigate }: RiskDetailModalProps) => {
  const [tenantInfo, setTenantInfo] = useState<any>(null);
  const [usageStats, setUsageStats] = useState<{ current: number, previous: number }>({ current: 0, previous: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && alert?.room_id) {
      fetchExtraDetails();
    }
  }, [show, alert]);

  const fetchExtraDetails = async () => {
    setLoading(true);
    try {
      // Fetch Room's Tenant Info
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select(`
          title,
          contracts!inner (
            tenant_id
          )
        `)
        .eq('id', alert.room_id)
        .eq('contracts.status', 'active')
        .single();
        
      if (!roomError && roomData?.contracts?.[0]?.tenant_id) {
        const tenantId = roomData.contracts[0].tenant_id;
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name, phone')
          .eq('id', tenantId)
          .single();
        setTenantInfo(profile);
      } else {
         setTenantInfo(null);
      }

      // Fetch last 2 invoices to compare stats
      const { data: invoices } = await supabase
        .from('invoices')
        .select('electricity_usage, water_usage, created_at')
        .eq('room_id', alert.room_id)
        .order('created_at', { ascending: false })
        .limit(2);

      if (invoices && invoices.length > 0) {
        const current = invoices[0];
        const previous = invoices.length > 1 ? invoices[1] : null;

        if (alert.risk_type === 'dien') {
          setUsageStats({
            current: current.electricity_usage || 0,
            previous: previous?.electricity_usage || 0
          });
        } else {
          setUsageStats({
            current: current.water_usage || 0,
            previous: previous?.water_usage || 0
          });
        }
      }
    } catch (error) {
      console.error('Lỗi lấy detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!alert) return null;

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header: Định danh */}
            <div className={`px-8 py-6 border-b border-white/10 flex flex-col gap-1 text-white ${
              alert.risk_level === 'cao' ? 'bg-red-600' :
              alert.risk_level === 'trung_binh' ? 'bg-orange-500' :
              'bg-yellow-500'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                    {alert.risk_type === 'dien' ? <Zap className="w-6 h-6 text-white" /> : <Droplets className="w-6 h-6 text-white" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black font-display uppercase tracking-wider">
                      Cảnh báo sự cố {alert.risk_type === 'dien' ? 'Điện' : 'Nước'}
                    </h3>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mt-4 text-sm font-medium text-white/90">
                <span className="bg-black/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-white ${alert.risk_level === 'cao' ? 'animate-ping' : ''}`}></div>
                  Phòng: {alert.rooms?.title || alert.room_id.slice(0, 8)}
                </span>
                <span className="bg-black/20 px-3 py-1.5 rounded-lg">
                  Phát hiện: {format(new Date(alert.detected_at), 'HH:mm - dd/MM/yyyy')}
                </span>
                <span className="bg-black/20 px-3 py-1.5 rounded-lg uppercase tracking-widest text-[10px] font-black">
                  Cấp: {alert.risk_level}
                </span>
              </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
              
              {/* Khối 2: AI Record */}
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Báo cáo kỹ thuật AI
                </h4>
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <p className="text-sm text-slate-700 font-medium leading-loose">
                    "{alert.details}"
                  </p>
                </div>
              </div>

              {/* Khối 3: Trực quan hóa */}
              {loading ? (
                <div className="animate-pulse h-24 bg-slate-100 rounded-2xl"></div>
              ) : (
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Biến động tiêu thụ
                  </h4>
                  <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-8">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                        <span>Tháng trước</span>
                        <span>{usageStats.previous} {alert.risk_type === 'dien' ? 'kWh' : 'khối'}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div className="bg-slate-300 h-full rounded-full w-1/4"></div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                        <span className="text-primary font-black">Tháng này</span>
                        <span className="text-primary">{usageStats.current} {alert.risk_type === 'dien' ? 'kWh' : 'khối'}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${alert.risk_level === 'cao' ? 'bg-red-500 w-full' : 'bg-orange-400 w-3/4'}`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Khối 4: Call To Action */}
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  Thao tác xử lý nhanh
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tenantInfo ? (
                    <>
                      <a href={`tel:${tenantInfo.phone}`} className="flex items-center gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-bold">
                        <Phone className="w-5 h-5" />
                        Gọi ngay ({tenantInfo.phone})
                      </a>
                      <button 
                        onClick={() => {
                          onClose();
                          if (onNavigate) {
                            onNavigate('manage', { tab: 'messages', activeChat: tenantInfo.id });
                          }
                        }}
                        className="flex items-center gap-3 p-4 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors font-bold text-left"
                      >
                        <MessageSquare className="w-5 h-5" />
                        Trò chuyện qua TROPRO
                      </button>
                    </>
                  ) : (
                    <div className="col-span-2 p-4 rounded-xl bg-slate-50 text-slate-500 font-medium text-sm flex items-center justify-center border border-slate-200 border-dashed">
                      Phòng trống, không có dữ liệu liên hệ người thuê.
                    </div>
                  )}
                </div>

                {alert.risk_level !== 'thap' && (
                  <div className="flex items-center gap-3 mt-4">
                    <button 
                      onClick={() => {
                        onResolve(alert.id);
                        onClose();
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-4 bg-green-500 hover:bg-green-600 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-md shadow-green-500/20"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Đã xử lý sự cố
                    </button>
                    <button 
                      onClick={() => {
                        onResolve(alert.id);
                        onClose();
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black uppercase tracking-widest text-xs rounded-xl transition-all"
                    >
                      <Ban className="w-5 h-5" />
                      Báo động nhầm ẩn đi
                    </button>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
