import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, Clock, Building, Calendar, ShieldCheck
} from 'lucide-react';

interface TabHopDongNguoiThueProps {
  danhSachPhong: any[];
  dangTaiDuLieu: boolean;
}

/**
 * Component hiển thị danh sách hợp đồng của người thuê
 * Cung cấp cái nhìn tổng quan về trạng thái thuê, tiền cọc, và thời hạn.
 */
export const TenantContractsTab = ({ danhSachPhong, dangTaiDuLieu }: TabHopDongNguoiThueProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 font-display">Hợp đồng của tôi</h2>
          <p className="text-slate-500 font-medium">Quản lý và xem lại các hợp đồng thuê phòng.</p>
        </div>
      </div>

      {dangTaiDuLieu ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : danhSachPhong.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-200 px-6">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
            <FileText className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có hợp đồng nào</h3>
          <p className="text-slate-500 max-w-sm">Dữ liệu hợp đồng sẽ xuất hiện sau khi bạn ký hợp đồng với chủ trọ.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {/* Lặp qua danh sách phòng để hiển thị từng hợp đồng */}
          {danhSachPhong.map((phong) => (
            <div key={phong.contract_id || phong.id} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-1 font-display">Hợp đồng thuê: {phong.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-bold text-slate-500">
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Bắt đầu: {new Date(phong.contract_start).toLocaleDateString('vi-VN')}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Kết thúc: {new Date(phong.contract_end).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2">
                  <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-200 shadow-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Đã ký điện tử
                  </span>
                  <button className="text-sm font-bold text-primary hover:underline">Tải bản PDF</button>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Tiền cọc</p>
                  <p className="text-lg font-black text-slate-900">{Number(phong.deposit).toLocaleString()}đ</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Giá thuê hàng tháng</p>
                  <p className="text-lg font-black text-slate-900">{Number(phong.price).toLocaleString()}đ</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Chủ cho thuê</p>
                  <p className="text-lg font-black text-slate-900">{phong.landlord_name}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Ngày ký</p>
                  <p className="text-lg font-black text-slate-900">{new Date(phong.contract_start).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
