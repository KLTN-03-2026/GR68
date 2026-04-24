import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Search, Edit, Trash2, Loader2, Phone, Mail, Shield, CheckCircle, Eye, Plus, Home, UserCheck, XCircle
} from 'lucide-react';

interface AdminUsersTabProps {
  boLocNguoiDung: 'all' | 'landlord' | 'tenant' | 'admin';
  datBoLocNguoiDung: (filter: 'all' | 'landlord' | 'tenant' | 'admin') => void;
  nguoiDungHienTai: any[];
  thongKeNguoiDung: any;
  dangTai: boolean;
  dangTaiThaoTac: string | null;
  xuLyChinhSuaNguoiDung: (user: any) => void;
  xuLyXoaNguoiDung: (id: string) => void;
  datNguoiDungDangXem: (user: any) => void;
  layChuCaiDau: (name?: string) => string;
  dinhDangNgay: (date: string) => string;
  nguoiDungDangSua: any;
  datNguoiDungDangSua: (user: any) => void;
  bieuMauSuaNguoiDung: any;
  datBieuMauSuaNguoiDung: (form: any) => void;
  xuLyLuuChinhSuaNguoiDung: () => void;
  nguoiDungDangXem: any;
}

export const AdminUsersTab = ({ 
  boLocNguoiDung, datBoLocNguoiDung, nguoiDungHienTai, thongKeNguoiDung, dangTai, dangTaiThaoTac,
  xuLyChinhSuaNguoiDung, xuLyXoaNguoiDung, datNguoiDungDangXem,
  layChuCaiDau, dinhDangNgay,
  nguoiDungDangSua, datNguoiDungDangSua, bieuMauSuaNguoiDung, datBieuMauSuaNguoiDung, xuLyLuuChinhSuaNguoiDung,
  nguoiDungDangXem
}: AdminUsersTabProps) => {
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col w-full h-full">
                <div className="mb-8 shrink-0 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Quản lý Thành viên</h2>
                    <p className="text-slate-500">Xem và quản lý tất cả người dùng trong hệ thống.</p>
                  </div>
                </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 shrink-0">
          <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${boLocNguoiDung === 'all' ? 'border-primary ring-1 ring-primary' : 'border-slate-200'}`}
               onClick={() => datBoLocNguoiDung('all')}>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Tổng cộng</p>
              <p className="text-2xl font-black text-slate-900">{dangTai ? '-' : thongKeNguoiDung.total}</p>
            </div>
          </div>
          
          <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${boLocNguoiDung === 'landlord' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200'}`}
               onClick={() => datBoLocNguoiDung('landlord')}>
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Chủ trọ</p>
              <p className="text-2xl font-black text-slate-900">{dangTai ? '-' : thongKeNguoiDung.landlord}</p>
            </div>
          </div>

          <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${boLocNguoiDung === 'tenant' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200'}`}
               onClick={() => datBoLocNguoiDung('tenant')}>
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Người thuê</p>
              <p className="text-2xl font-black text-slate-900">{dangTai ? '-' : thongKeNguoiDung.tenant}</p>
            </div>
          </div>

          <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${boLocNguoiDung === 'admin' ? 'border-purple-500 ring-1 ring-purple-500' : 'border-slate-200'}`}
               onClick={() => datBoLocNguoiDung('admin')}>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Quản trị</p>
              <p className="text-2xl font-black text-slate-900">{dangTai ? '-' : thongKeNguoiDung.admin}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col flex-1 min-h-0">
          <div className="flex border-b border-slate-200 px-6 shrink-0 bg-slate-50/50">
            {['all', 'landlord', 'tenant', 'admin'].map((filter) => (
              <button 
                key={filter}
                onClick={() => datBoLocNguoiDung(filter as any)}
                className={`py-4 px-6 border-b-2 font-black text-sm whitespace-nowrap uppercase transition-all ${
                  boLocNguoiDung === filter 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 font-bold'
                }`}
              >
                {filter === 'all' ? 'Tất cả' : filter === 'landlord' ? 'Chủ trọ' : filter === 'tenant' ? 'Người thuê' : 'Quản trị'}
              </button>
            ))}
          </div>
          <div className="overflow-auto flex-1">
            {dangTai ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="font-bold">Đang tải danh sách...</p>
              </div>
            ) : nguoiDungHienTai.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400 text-center p-8">
                <Users className="w-12 h-12 mb-4 text-slate-200 mx-auto" />
                <p className="font-bold">Không tìm thấy thành viên nào phù hợp.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 sticky top-0 z-10 text-slate-500 text-xs font-black uppercase tracking-wider">
                    <th className="px-6 py-4">Người dùng</th>
                    <th className="px-6 py-4">Vai trò</th>
                    <th className="px-6 py-4">Liên hệ</th>
                    <th className="px-6 py-4">Ngày tham gia</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                        <tbody className="divide-y divide-slate-200">
                          {nguoiDungHienTai.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                                    {user.avatar_url ? (
                                      <img src={user.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                                    ) : (
                                      layChuCaiDau(user.full_name)
                                    )}
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-slate-900 line-clamp-1">{user.full_name || 'Chưa cập nhật'}</div>
                                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{user.id.substring(0,8)}...</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold capitalize ${
                                  user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 
                                  user.role === 'landlord' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                                }`}>
                                  {user.role === 'admin' && <Shield className="w-3 h-3" />}
                                  {user.role === 'landlord' && <Home className="w-3 h-3" />}
                                  {user.role === 'tenant' && <UserCheck className="w-3 h-3" />}
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-600 border-b border-slate-100 pb-1 mb-1">
                                  <Phone className="w-4 h-4 text-primary" /> {user.phone || 'Chưa cung cấp'}
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium">SĐT liên hệ chính</p>
                              </td>
                              <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                                {dinhDangNgay(user.created_at)}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button onClick={() => datNguoiDungDangXem(user)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded transition-all" title="Xem thông tin chi tiết">
                                    <Eye className="w-5 h-5" />
                                  </button>
                                  <button onClick={() => xuLyChinhSuaNguoiDung(user)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded transition-all" title="Sửa thông tin">
                                    <Edit className="w-5 h-5" />
                                  </button>
                                  <button onClick={() => xuLyXoaNguoiDung(user.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded transition-all" title="Xóa người dùng">
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* MODAL SỬA NGƯỜI DÙNG */}
                {nguoiDungDangSua && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                      <div className="p-6 border-b border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900">Sửa thông tin người dùng</h3>
                        <p className="text-xs text-slate-400 mt-1">ID: {nguoiDungDangSua.id}</p>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Họ và tên</label>
                          <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" 
                            value={bieuMauSuaNguoiDung.full_name} onChange={e => datBieuMauSuaNguoiDung({...bieuMauSuaNguoiDung, full_name: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Số điện thoại</label>
                          <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" 
                            value={bieuMauSuaNguoiDung.phone} onChange={e => datBieuMauSuaNguoiDung({...bieuMauSuaNguoiDung, phone: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Vai trò hệ thống</label>
                          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none appearance-none"
                            value={bieuMauSuaNguoiDung.role} onChange={e => datBieuMauSuaNguoiDung({...bieuMauSuaNguoiDung, role: e.target.value as any})}>
                            <option value="tenant">Tenant (Người thuê)</option>
                            <option value="landlord">Landlord (Chủ trọ)</option>
                            <option value="admin">Admin (Quản trị viên)</option>
                          </select>
                        </div>
                      </div>
                      <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                        <button onClick={() => datNguoiDungDangSua(null)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg">Hủy</button>
                        <button onClick={xuLyLuuChinhSuaNguoiDung} disabled={dangTaiThaoTac === 'saving-user'} className="px-4 py-2 text-sm font-bold bg-primary text-white hover:bg-primary-hover rounded-lg flex items-center gap-2">
                          {dangTaiThaoTac === 'saving-user' && <Loader2 className="w-4 h-4 animate-spin"/>}
                          Lưu chỉnh sửa
                        </button>
                      </div>
                    </div>
                  </div>
                )}


                {/* MODAL XEM CHI TIẾT NGƯỜI DÙNG */}
                {nguoiDungDangXem && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
                      <div className="relative h-24 bg-gradient-to-r from-primary to-blue-600">
                        <button onClick={() => datNguoiDungDangXem(null)} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors">
                          <XCircle className="w-6 h-6" />
                        </button>
                      </div>
                      <div className="px-8 pb-8 relative">
                        <div className="absolute -top-12 left-8 w-24 h-24 rounded-3xl bg-white p-1 shadow-xl">
                          <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center text-2xl font-black text-primary overflow-hidden">
                            {nguoiDungDangXem.avatar_url ? (
                              <img src={nguoiDungDangXem.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                            ) : (
                              layChuCaiDau(nguoiDungDangXem.full_name)
                            )}
                          </div>
                        </div>
                        <div className="mt-16">
                          <div className="flex items-center gap-3">
                            <h3 className="text-2xl font-bold text-slate-900">{nguoiDungDangXem.full_name}</h3>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">{nguoiDungDangXem.role}</span>
                          </div>
                          <p className="text-slate-500 text-sm mt-1">ID: {nguoiDungDangXem.id}</p>
                          
                          <div className="grid grid-cols-2 gap-6 mt-8">
                            <div className="p-4 bg-slate-50 rounded-2xl col-span-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Số điện thoại</p>
                              <p className="text-base font-black text-slate-700">{nguoiDungDangXem.phone || 'Chưa cập nhật'}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl">
                              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Vai trò</p>
                              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mt-1">
                                {nguoiDungDangXem.role === 'admin' ? <Shield className="w-4 h-4 text-purple-600" /> : 
                                 nguoiDungDangXem.role === 'landlord' ? <Home className="w-4 h-4 text-blue-600" /> : 
                                 <UserCheck className="w-4 h-4 text-emerald-600" />}
                                {nguoiDungDangXem.role}
                              </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl">
                              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Ngày gia nhập</p>
                              <p className="text-sm font-bold text-slate-700">{dinhDangNgay(nguoiDungDangXem.created_at)}</p>
                            </div>
                          </div>
                          
                          <div className="mt-8 flex gap-3">
                            <button onClick={() => { xuLyChinhSuaNguoiDung(nguoiDungDangXem); datNguoiDungDangXem(null); }} className="flex-1 bg-primary text-white font-bold py-3 rounded-2xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
                              Chỉnh sửa hồ sơ
                            </button>
                            <button onClick={() => datNguoiDungDangXem(null)} className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-2xl hover:bg-slate-200 transition-colors">
                              Đóng
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
    </>
  );
};
