import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';
import {
  CheckCircle, FileClock, AlertCircle, Eye, Download, Edit3, X, FileSignature, ChevronLeft, ChevronRight
} from 'lucide-react';

interface ThuocTinhTabHopDong {
  duLieuHopDong: any[];
  duLieuPhong: any[];
  lamMoiDuLieu?: () => void;
}

export const ContractsTab = ({ duLieuHopDong, duLieuPhong, lamMoiDuLieu }: ThuocTinhTabHopDong) => {
  const [boLocHopDong, setBoLocHopDong] = useState('all');
  const [hopDongDangSua, setHopDongDangSua] = useState<any | null>(null);
  const [hopDongDangXem, setHopDongDangXem] = useState<any | null>(null);
  const [dangXuLy, setDangXuLy] = useState(false);
  const { showToast } = useToast();
  const [hoSoChuTro, setHoSoChuTro] = useState<any>(null);

  React.useEffect(() => {
    const layThongTinChuTro = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setHoSoChuTro(data);
      }
    };
    layThongTinChuTro();
  }, []);

  const xuLyCapNhatHopDong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hopDongDangSua) return;
    
    setDangXuLy(true);
    try {
      const { error } = await supabase
        .from('contracts')
        .update({
          deposit: hopDongDangSua.giaTriTienCoc,
          start_date: hopDongDangSua.ngayBatDau,
          end_date: hopDongDangSua.ngayKetThuc,
          status: hopDongDangSua.trangThai
        })
        .eq('id', hopDongDangSua.id);

      if (error) throw error;
      
      showToast('Cập nhật hợp đồng thành công', 'success');
      setHopDongDangSua(null);
      if (lamMoiDuLieu) lamMoiDuLieu();
    } catch (error: any) {
      showToast('Lỗi cập nhật hợp đồng: ' + error.message, 'error');
    } finally {
      setDangXuLy(false);
    }
  };

  const xuLyTaiHopDong = (contract: any) => {
    setHopDongDangXem(contract);
    // Wait for modal to render then print
    setTimeout(() => {
      const printContents = document.getElementById('contract-printable')?.innerHTML;
      if (!printContents) return;
      
      const originalContents = document.body.innerHTML;
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      printWindow.document.write(`
        <html>
          <head>
            <title>Hop_Dong_Thue_Phong_${contract.phong.replace(/\s+/g, '_')}</title>
            <style>
              body { font-family: "Times New Roman", Times, serif; line-height: 1.6; color: #000; padding: 40px; }
              .text-center { text-center: center; text-align: center; }
              .font-bold { font-weight: bold; }
              .font-black { font-weight: 900; }
              .text-3xl { font-size: 24pt; }
              .text-xl { font-size: 18pt; }
              .text-lg { font-size: 14pt; }
              .mb-10 { margin-bottom: 30pt; }
              .mb-8 { margin-bottom: 20pt; }
              .mb-4 { margin-bottom: 12pt; }
              .space-y-8 > * + * { margin-top: 24pt; }
              .space-y-4 > * + * { margin-top: 12pt; }
              .grid { display: flex; justify-content: space-between; }
              .grid-cols-2 > div { width: 45%; }
              .bg-slate-50\\/50 { background: #f8fafc; padding: 15pt; border-radius: 8pt; border: 1pt solid #e2e8f0; margin-bottom: 15pt; }
              .border-b { border-bottom: 1pt solid #e2e8f0; }
              .pb-2 { padding-bottom: 6pt; }
              .mt-12 { margin-top: 40pt; }
              .pt-8 { padding-top: 20pt; }
              .mb-24 { margin-bottom: 80pt; }
              .underline { text-decoration: underline; }
              @media print {
                body { padding: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            ${printContents}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }, 100);
  };

  const dinhDangSoDienThoai = (phone?: string) => {
    if (!phone) return '...........................................';
    return phone.startsWith('+84') ? '0' + phone.slice(3) : phone;
  };

  const danhSachHopDong = duLieuHopDong.map(c => ({
    id: c.id,
    khachThue: c.profiles?.full_name || 'N/A',
    chuCaiDau: (c.profiles?.full_name || 'NA').split(' ').map((n: any) => n[0]).join('').toUpperCase().slice(0, 2),
    phong: c.rooms?.title || 'N/A',
    thoiHan: `${new Date(c.start_date).toLocaleDateString('vi-VN')} - ${new Date(c.end_date).toLocaleDateString('vi-VN')}`,
    tienCocChinh: `${Number(c.deposit).toLocaleString()}đ`,
    trangThai: c.status,
    nhanTrangThai: c.status === 'active' ? 'Đang hiệu lực' : c.status === 'pending' ? 'Chờ ký' : c.status === 'expired' ? 'Đã hết hạn' : 'Đã chấm dứt',
    mauTrangThai: c.status === 'active' ? 'bg-green-100 text-green-700' : c.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600',
    hoSo: c.profiles,
    ngayBatDau: c.start_date ? c.start_date.split('T')[0] : '',
    ngayKetThuc: c.end_date ? c.end_date.split('T')[0] : '',
    giaTriTienCoc: c.deposit
  }));

  const hopDongDaLoc = boLocHopDong === 'all' ? danhSachHopDong : danhSachHopDong.filter(c => c.trangThai === boLocHopDong);
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
              </div>

              {/* Empty state when no rooms yet */}
              {duLieuPhong.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-200">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
                    <FileSignature className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có phòng nào</h3>
                  <p className="text-slate-500 max-w-sm">Hợp đồng sẽ xuất hiện sau khi bạn thêm phòng và gán người thuê.</p>
                </div>
              ) : (<>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Đang hiệu lực', value: duLieuHopDong.filter(c => c.status === 'active').length.toString(), sub: '+0 hợp đồng mới', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
                  { label: 'Chờ ký', value: duLieuHopDong.filter(c => c.status === 'pending').length.toString(), sub: 'Cần xử lý trong tuần', icon: FileClock, color: 'text-orange-600', bg: 'bg-orange-100' },
                  { label: 'Sắp hết hạn', value: duLieuHopDong.filter(c => {
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
                        onClick={() => setBoLocHopDong(filter.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                          boLocHopDong === filter.id 
                            ? 'bg-primary text-white shadow-md shadow-orange-100' 
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {hopDongDaLoc.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center border-t border-slate-100">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
                      <FileSignature className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có hợp đồng nào</h3>
                    <p className="text-slate-500 max-w-sm mb-6">Không tìm thấy hợp đồng phù hợp với bộ lọc hiện tại.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 whitespace-nowrap">Khách thuê</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 whitespace-nowrap">Phòng</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 whitespace-nowrap">Thời gian</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 whitespace-nowrap">Tiền cọc</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 whitespace-nowrap">Người thân</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 whitespace-nowrap">Trạng thái</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right whitespace-nowrap">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {hopDongDaLoc.map((contract) => (
                        <tr key={contract.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                                {contract.chuCaiDau}
                              </div>
                              <div className="text-sm font-bold text-slate-900">{contract.khachThue}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-[10px] font-black text-slate-700 tracking-widest uppercase">
                              {contract.phong}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-500 whitespace-nowrap">
                            {contract.thoiHan}
                          </td>
                          <td className="px-6 py-4 text-sm font-black text-slate-900 whitespace-nowrap">
                            {contract.tienCocChinh}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-slate-900">{contract.hoSo?.emergency_contact_phone || '---'}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{contract.hoSo?.emergency_contact_name || 'Chưa cập nhật'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${contract.mauTrangThai}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                contract.trangThai === 'active' ? 'bg-green-500' : 
                                contract.trangThai === 'pending' ? 'bg-primary' : 'bg-slate-400'
                              }`}></span>
                              {contract.nhanTrangThai}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => setHopDongDangXem(contract)}
                                className="text-slate-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-orange-50"
                                title="Xem chi tiết hợp đồng"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => xuLyTaiHopDong(contract)}
                                className="text-slate-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-orange-50"
                                title="Tải xuống hợp đồng (PDF)"
                              >
                                <Download className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => setHopDongDangSua(contract)}
                                className="text-slate-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-orange-50"
                                title="Chỉnh sửa hợp đồng"
                              >
                                <Edit3 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                )}

                {/* Pagination */}
                {hopDongDaLoc.length > 0 && (
                  <div className="p-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Hiển thị 1-{hopDongDaLoc.length} trên tổng số {duLieuHopDong.length} hợp đồng
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
                )}
              </div>
              </>)}
            </motion.div>
          )}

          {/* Edit Modal */}
          <AnimatePresence>
            {hopDongDangSua && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                  <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 font-display">Chỉnh sửa hợp đồng</h3>
                      <p className="text-sm font-bold text-slate-500">Mã: {hopDongDangSua.id.slice(0, 8)}</p>
                    </div>
                    <button 
                      onClick={() => setHopDongDangSua(null)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto">
                    <form id="edit-contract-form" onSubmit={xuLyCapNhatHopDong} className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Tiền cọc (VNĐ)</label>
                        <input 
                          type="number" 
                          required
                          value={hopDongDangSua.giaTriTienCoc}
                          onChange={(e) => setHopDongDangSua({...hopDongDangSua, giaTriTienCoc: Number(e.target.value)})}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold text-slate-700"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Ngày bắt đầu</label>
                          <input 
                            type="date" 
                            required
                            value={hopDongDangSua.ngayBatDau}
                            onChange={(e) => setHopDongDangSua({...hopDongDangSua, ngayBatDau: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold text-slate-700"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Ngày kết thúc</label>
                          <input 
                            type="date" 
                            required
                            value={hopDongDangSua.ngayKetThuc}
                            onChange={(e) => setHopDongDangSua({...hopDongDangSua, ngayKetThuc: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold text-slate-700"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Trạng thái</label>
                        <select 
                          value={hopDongDangSua.trangThai}
                          onChange={(e) => setHopDongDangSua({...hopDongDangSua, trangThai: e.target.value})}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold text-slate-700 appearance-none"
                        >
                          <option value="active">Đang hiệu lực</option>
                          <option value="pending">Chờ ký</option>
                          <option value="expired">Đã hết hạn</option>
                          <option value="terminated">Đã chấm dứt</option>
                        </select>
                      </div>
                    </form>
                  </div>
                  
                  <div className="p-6 border-t border-slate-100 flex gap-3 justify-end mt-auto bg-slate-50">
                    <button 
                      type="button"
                      onClick={() => setHopDongDangSua(null)}
                      className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Hủy
                    </button>
                    <button 
                      type="submit"
                      form="edit-contract-form"
                      disabled={dangXuLy}
                      className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {dangXuLy ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* View Details Modal */}
          <AnimatePresence>
            {hopDongDangXem && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                  <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 font-display">Chi tiết hợp đồng</h3>
                      <p className="text-sm font-bold text-slate-500">Phòng: {hopDongDangXem.phong}</p>
                    </div>
                    <button 
                      onClick={() => setHopDongDangXem(null)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="p-4 sm:p-8 overflow-y-auto bg-slate-50">
                    <div id="contract-printable" className="bg-white p-4 sm:p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 mx-auto max-w-3xl overflow-x-auto">

                      <div className="text-center mb-8 sm:mb-10 min-w-[500px]">
                        <h4 className="font-bold text-lg">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
                        <p className="font-bold text-sm underline decoration-slate-400 underline-offset-4 mb-8">Độc lập - Tự do - Hạnh phúc</p>
                        <h2 className="text-3xl font-black mt-8 mb-2 text-slate-900">HỢP ĐỒNG THUÊ PHÒNG TRỌ</h2>
                        <p className="text-slate-500 italic text-sm">Mã hợp đồng: {hopDongDangXem.id.toUpperCase()}</p>
                      </div>
                      
                      <div className="space-y-8 text-slate-800 leading-relaxed text-sm md:text-base">
                        <p className="italic">Hôm nay, ngày {new Date(hopDongDangXem.ngayBatDau).getDate()} tháng {new Date(hopDongDangXem.ngayBatDau).getMonth() + 1} năm {new Date(hopDongDangXem.ngayBatDau).getFullYear()}, tại địa chỉ phòng trọ, chúng tôi gồm có:</p>
                        
                        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                          <h3 className="font-black text-lg mb-4 text-primary flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">A</span>
                            BÊN CHO THUÊ (BÊN A)
                          </h3>
                          <ul className="space-y-3">
                            <li className="flex gap-2"><span className="font-bold min-w-[150px]">Họ và tên:</span> <span>{hoSoChuTro?.full_name || '...........................................'}</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[150px]">Số CCCD:</span> <span>{hoSoChuTro?.id_card_number || '...........................................'}</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[150px]">Số điện thoại:</span> <span>{dinhDangSoDienThoai(hoSoChuTro?.phone)}</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[150px]">Địa chỉ thường trú:</span> <span>{hoSoChuTro?.permanent_address || '...........................................'}</span></li>
                          </ul>
                        </div>

                        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                          <h3 className="font-black text-lg mb-4 text-primary flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">B</span>
                            BÊN THUÊ (BÊN B)
                          </h3>
                          <ul className="space-y-3">
                            <li className="flex gap-2"><span className="font-bold min-w-[150px]">Họ và tên:</span> <span>{hopDongDangXem.hoSo?.full_name || '...........................................'}</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[150px]">Số CCCD:</span> <span>{hopDongDangXem.hoSo?.id_card_number || '...........................................'}</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[150px]">Số điện thoại:</span> <span>{dinhDangSoDienThoai(hopDongDangXem.hoSo?.phone)}</span></li>
                            <li className="flex gap-2"><span className="font-bold min-w-[150px]">Địa chỉ thường trú:</span> <span>{hopDongDangXem.hoSo?.permanent_address || '...........................................'}</span></li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-black text-lg mb-4 text-slate-900 border-b border-slate-200 pb-2">NỘI DUNG THỎA THUẬN</h3>
                          <div className="space-y-4">
                            <p><strong>Điều 1:</strong> Bên A đồng ý cho Bên B thuê phòng trọ mang tên/số: <span className="font-black text-primary">{hopDongDangXem.phong}</span>.</p>
                            <p><strong>Điều 2:</strong> Thời gian thuê phòng là từ ngày <strong>{new Date(hopDongDangXem.ngayBatDau).toLocaleDateString('vi-VN')}</strong> đến ngày <strong>{new Date(hopDongDangXem.ngayKetThuc).toLocaleDateString('vi-VN')}</strong>.</p>
                            <p><strong>Điều 3:</strong> Tiền đặt cọc: <span className="font-black">{hopDongDangXem.tienCocChinh}</span>.</p>
                            <p><strong>Điều 4:</strong> Trách nhiệm của các bên:</p>
                            <ul className="list-disc pl-5 space-y-2 text-slate-600">
                              <li>Bên A đảm bảo cung cấp đầy đủ tiện ích cơ bản, hỗ trợ sửa chữa các hư hỏng cơ sở vật chất phát sinh không do lỗi của Bên B.</li>
                              <li>Bên B có trách nhiệm thanh toán tiền thuê phòng đúng hạn, giữ gìn vệ sinh chung, tuân thủ nội quy khu trọ và bảo quản tài sản được giao.</li>
                            </ul>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12 pt-8 text-center border-t border-slate-200 min-w-[500px]">
                          <div>
                            <h4 className="font-black text-slate-900">ĐẠI DIỆN BÊN A</h4>
                            <p className="text-sm text-slate-500 italic mb-24">(Ký và ghi rõ họ tên)</p>
                            <p className="font-bold text-lg">{hoSoChuTro?.full_name}</p>
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900">ĐẠI DIỆN BÊN B</h4>
                            <p className="text-sm text-slate-500 italic mb-24">(Ký và ghi rõ họ tên)</p>
                            <p className="font-bold text-lg">{hopDongDangXem.hoSo?.full_name}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-center mt-auto bg-white">
                    <div>
                      <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest ${hopDongDangXem.mauTrangThai}`}>
                        Trạng thái: {hopDongDangXem.nhanTrangThai}
                      </span>
                    </div>
                    <button 
                      onClick={() => setHopDongDangXem(null)}
                      className="w-full sm:w-auto px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all shadow-lg shadow-slate-200"
                    >
                      Đóng
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
    </>
  );
};
