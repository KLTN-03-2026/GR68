import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { 
  AlertTriangle, 
  Zap, 
  Droplet, 
  CheckCircle, 
  RefreshCw, 
  Trash2,
  Filter,
  Download,
  Eye,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { RiskDetailModal } from './RiskDetailModal';

interface Alert {
  id: string;
  room_id: string;
  risk_type: 'dien' | 'nuoc';
  risk_level: 'thap' | 'trung_binh' | 'cao';
  details: string;
  detected_at: string;
  rooms?: { title: string };
}

export const RiskAlerts: React.FC<{ onNavigate?: (page: string, params?: any) => void; hasRooms?: boolean; role?: 'landlord' | 'tenant' }> = ({ onNavigate, hasRooms = true, role = 'landlord' }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const taiDuLieuCanhBao = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('risk_alerts')
        .select('*, rooms(title)')
        .order('detected_at', { ascending: false });

      if (error) throw error;
      setAlerts(data as Alert[] || []);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu cảnh báo:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    taiDuLieuCanhBao();
  }, []);

  const xacNhanDaXuLyCanhBao = async (id: string) => {
    try {
      const { error } = await supabase.from('risk_alerts').delete().eq('id', id);
      if (error) throw error;
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Lỗi khi xoá cảnh báo:', error);
    }
  };

  const filteredAlerts = activeFilter === 'all' 
    ? alerts 
    : alerts.filter(a => a.risk_level === activeFilter);

  const stats = [
    { label: 'Tổng lượt quét AI', value: alerts.length, icon: ShieldAlert, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Nguy cơ Cao', value: alerts.filter(a => a.risk_level === 'cao').length, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Trung Bình', value: alerts.filter(a => a.risk_level === 'trung_binh').length, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'An Toàn', value: alerts.filter(a => a.risk_level === 'thap').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 font-display">Phân Tích & Cảnh Báo Rủi Ro Điện Nước</h2>
          <p className="text-slate-500 font-medium">Hệ thống phân tích độ lệch chuẩn dựa trên lịch sử để cảnh báo rò rỉ, cháy nổ.</p>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-200">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có cảnh báo rủi ro</h3>
          <p className="text-slate-500 max-w-sm">Hệ thống AI đang giám sát dữ liệu điện nước của bạn. Các dấu hiệu bất thường sẽ được hiển thị tại đây.</p>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 text-xs font-black uppercase tracking-widest">{stat.label}</span>
                  <div className={`${stat.bg} ${stat.color} p-2 rounded-xl`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 font-display">{stat.value}</div>
                <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">AI Phân tích</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-left">
            <div className="p-6 border-b border-slate-100 flex flex-wrap items-center gap-4">
              <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Bộ lọc Mức độ:</span>
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'cao', label: 'Nguy cơ Cao' },
                  { id: 'trung_binh', label: 'Trung Bình' },
                  { id: 'thap', label: 'Thấp' },
                ].map((filter) => (
                  <button 
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      activeFilter === filter.id 
                        ? 'bg-primary text-white shadow-md shadow-primary/20' 
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">#</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Phòng</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Dịch vụ</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Cơ sở lý luận (AI Detail)</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Cảnh báo lúc</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Mức độ</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Tác vụ</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filteredAlerts.map((alert, index) => (
                  <tr key={alert.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-bold text-slate-400">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-[10px] font-black text-slate-700 tracking-widest uppercase">
                        {alert.rooms?.title || 'Phòng Unk'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {alert.risk_type === 'dien' ? (
                          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                            <Zap className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Droplet className="w-4 h-4" />
                          </div>
                        )}
                        <span className="text-sm font-bold text-slate-700">
                          {alert.risk_type === 'dien' ? 'Điện' : 'Nước'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-medium text-slate-500 max-w-sm leading-relaxed line-clamp-2" title={alert.details}>
                        {alert.details}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-500">
                      {format(new Date(alert.detected_at), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        alert.risk_level === 'cao' ? 'bg-red-100 text-red-700' :
                        alert.risk_level === 'trung_binh' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          alert.risk_level === 'cao' ? 'bg-red-500 animate-pulse' :
                          alert.risk_level === 'trung_binh' ? 'bg-orange-500' :
                          'bg-yellow-500'
                        }`}></span>
                        Mức {alert.risk_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {role === 'landlord' && alert.risk_level !== 'thap' && (
                          <button 
                            onClick={() => xacNhanDaXuLyCanhBao(alert.id)}
                            title="Đánh dấu đã xử lý"
                            className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-green-500 hover:border-green-500 hover:bg-green-50 transition-all"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            setSelectedAlert(alert as Alert);
                            setIsModalOpen(true);
                          }}
                          className="text-slate-300 hover:text-primary transition-colors p-2"
                          title="Xem chi tiết phân tích"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </>
      )}

      <RiskDetailModal 
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        alert={selectedAlert}
        onResolve={xacNhanDaXuLyCanhBao}
        onNavigate={onNavigate}
      />
    </motion.div>
  );
};
