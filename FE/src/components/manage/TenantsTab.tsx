import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home, BadgeCheck, Phone, AlertCircle,
  Users, ChevronRight, Building2
} from 'lucide-react';

interface ThuocTinhTabNguoiThue {
  duLieuHopDong: any[];
  setTabHoatDong: (tab: string) => void;
  dangTai?: boolean;
}

interface ChiTietNguoiThue {
  idHopDong: string;
  idNguoiThue: string;
  tenNguoiThue: string;
  soDienThoai: string | null;
  soZalo: string | null;
  anhDaiDien: string;
  gioiTinh: string | null;
  ngaySinh: string | null;
  diaChiThuongTru: string | null;
  soCccd: string | null;
  ngayCapCccd: string | null;
  noiCapCccd: string | null;
  tenNganHang: string | null;
  soTaiKhoan: string | null;
  chuTaiKhoan: string | null;
  tenLienHeKhanCap: string | null;
  sdtLienHeKhanCap: string | null;
  ngayBatDauHopDong: string;
  ngayKetThucHopDong: string;
  tienCoc: number;
  daHoanThienHoSo: boolean;
}

interface NhomPhong {
  idPhong: string;
  tenPhong: string;
  danhSachNguoiThue: ChiTietNguoiThue[];
}

export const TenantsTab = ({ duLieuHopDong, setTabHoatDong, dangTai = false }: ThuocTinhTabNguoiThue) => {
  const [idPhongDuocChon, setIdPhongDuocChon] = useState<string | null>(null);

  // Group active contracts by room_id → allows multiple tenants per room
  const danhSachNhomPhong: NhomPhong[] = useMemo(() => {
    const banDoPhong = new Map<string, NhomPhong>();

    duLieuHopDong.forEach(hopDong => {
      if (hopDong.status !== 'active' || !hopDong.profiles || !hopDong.rooms) return;
      const hoSo = Array.isArray(hopDong.profiles) ? hopDong.profiles[0] : hopDong.profiles;
      if (!hoSo) return;

      const idPhong = hopDong.room_id;
      const tenPhong = hopDong.rooms?.title || 'Phòng không rõ';

      const nguoiThue: ChiTietNguoiThue = {
        idHopDong: hopDong.id,
        idNguoiThue: hopDong.tenant_id,
        tenNguoiThue: hoSo.full_name || 'Người thuê',
        soDienThoai: hoSo.phone || null,
        soZalo: hoSo.zalo_phone || null,
        anhDaiDien: hoSo.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(hoSo.full_name || 'U')}&background=FF8A00&color=fff`,
        gioiTinh: hoSo.gender || null,
        ngaySinh: hoSo.birth_date || null,
        diaChiThuongTru: hoSo.permanent_address || null,
        soCccd: hoSo.id_card_number || null,
        ngayCapCccd: hoSo.id_card_date || null,
        noiCapCccd: hoSo.id_card_place || null,
        tenNganHang: hoSo.bank_name || null,
        soTaiKhoan: hoSo.bank_account_number || null,
        chuTaiKhoan: hoSo.bank_account_name || null,
        tenLienHeKhanCap: hoSo.emergency_contact_name || null,
        sdtLienHeKhanCap: hoSo.emergency_contact_phone || null,
        ngayBatDauHopDong: hopDong.start_date,
        ngayKetThucHopDong: hopDong.end_date,
        tienCoc: hopDong.deposit || 0,
        daHoanThienHoSo: !!(hoSo.id_card_number && hoSo.permanent_address && hoSo.birth_date && hoSo.emergency_contact_name),
      };

      if (!banDoPhong.has(idPhong)) {
        banDoPhong.set(idPhong, { idPhong, tenPhong, danhSachNguoiThue: [] });
      }
      banDoPhong.get(idPhong)!.danhSachNguoiThue.push(nguoiThue);
    });

    return Array.from(banDoPhong.values()).sort((a, b) => a.tenPhong.localeCompare(b.tenPhong));
  }, [duLieuHopDong]);

  // Auto-select first room on load
  useEffect(() => {
    if (danhSachNhomPhong.length > 0 && !idPhongDuocChon) {
      setIdPhongDuocChon(danhSachNhomPhong[0].idPhong);
    }
  }, [danhSachNhomPhong, idPhongDuocChon]);

  const nhomPhongDuocChon = danhSachNhomPhong.find(nhom => nhom.idPhong === idPhongDuocChon) || null;

  const dinhDangChu = (giaTri: string | null) =>
    giaTri ? giaTri : <span className="text-slate-300 italic text-xs">—</span>;

  const dinhDangNgay = (giaTri: string | null) =>
    giaTri ? new Date(giaTri).toLocaleDateString('vi-VN') : <span className="text-slate-300 italic text-xs">—</span>;

  const dinhDangTien = (giaTri: number) =>
    giaTri > 0 ? `${Number(giaTri).toLocaleString()}đ` : <span className="text-slate-300 italic text-xs">—</span>;

  // ───── Loading skeleton ─────
  if (dangTai) {
    return (
      <div className="flex gap-6 animate-pulse">
        <div className="w-72 flex-shrink-0 space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-slate-100 rounded-2xl" />
          ))}
        </div>
        <div className="flex-1 bg-slate-100 rounded-3xl h-96" />
      </div>
    );
  }

  // ───── Empty state ─────
  if (danhSachNhomPhong.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-slate-200">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
          <Users className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có người thuê</h3>
        <p className="text-slate-500 max-w-sm">
          Người thuê sẽ xuất hiện khi bạn tạo Hợp đồng thuê phòng đang có hiệu lực.
        </p>
      </div>
    );
  }

  // ───── Main layout ─────
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-1 font-display">
          Quản lý Người Thuê
        </h2>
        <p className="text-slate-500 font-medium">
          {danhSachNhomPhong.length} phòng đang có người thuê •{' '}
          {danhSachNhomPhong.reduce((s, nhom) => s + nhom.danhSachNguoiThue.length, 0)} người thuê tổng cộng
        </p>
      </div>

      <div className="flex gap-5 items-start">
        {/* ── Left panel: Room list ── */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" /> Danh sách phòng
          </p>
          {danhSachNhomPhong.map(nhom => {
            const dangDuocChon = nhom.idPhong === idPhongDuocChon;
            const coHoSoChuaHoanThien = nhom.danhSachNguoiThue.some(nguoiThue => !nguoiThue.daHoanThienHoSo);
            return (
              <motion.button
                key={nhom.idPhong}
                onClick={() => setIdPhongDuocChon(nhom.idPhong)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3 ${
                  dangDuocChon
                    ? 'bg-primary/10 border-primary/30 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className={`font-black text-sm truncate ${dangDuocChon ? 'text-primary' : 'text-slate-900'}`}>
                    {nhom.tenPhong}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    {nhom.danhSachNguoiThue.length} người thuê
                    {coHoSoChuaHoanThien && (
                      <span className="ml-1.5 text-amber-500">⚠</span>
                    )}
                  </p>
                </div>

                <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-colors ${dangDuocChon ? 'text-primary' : 'text-slate-300'}`} />
              </motion.button>
            );
          })}
        </div>

        {/* ── Right panel: Tenant table ── */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {nhomPhongDuocChon ? (
              <motion.div
                key={nhomPhongDuocChon.idPhong}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden"
              >
                {/* Table header */}
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                  <h3 className="font-black text-slate-900 text-lg">{nhomPhongDuocChon.tenPhong}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {nhomPhongDuocChon.danhSachNguoiThue.length} người đang thuê
                  </p>
                </div>

                {/* Scrollable table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        {[
                          'Người thuê', 'Liên hệ', 'Ngày sinh', 'CCCD',
                          'Địa chỉ thường trú', 'Hợp đồng', 'Tiền cọc',
                          'Ngân hàng', 'Liên hệ khẩn cấp', 'Hồ sơ', ''
                        ].map(tieuDeCot => (
                          <th key={tieuDeCot} className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">
                            {tieuDeCot}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {nhomPhongDuocChon.danhSachNguoiThue.map((nguoiThue, thuTu) => (
                        <motion.tr
                          key={nguoiThue.idHopDong}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: thuTu * 0.05 }}
                          className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors group"
                        >
                          {/* Người thuê */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{nguoiThue.tenNguoiThue}</p>
                              {nguoiThue.gioiTinh && (
                                <p className="text-[10px] text-slate-400 font-medium">{nguoiThue.gioiTinh}</p>
                              )}
                            </div>
                          </td>

                          {/* Liên hệ */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="space-y-0.5">
                              <p className="font-semibold text-slate-700 flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {nguoiThue.soDienThoai
                                  ? <a href={`tel:${nguoiThue.soDienThoai}`} className="hover:text-primary transition-colors">{nguoiThue.soDienThoai}</a>
                                  : <span className="text-slate-300 italic text-xs">—</span>
                                }
                              </p>
                              {nguoiThue.soZalo && (
                                <p className="text-xs text-slate-400 font-medium">Zalo: {nguoiThue.soZalo}</p>
                              )}
                            </div>
                          </td>

                          {/* Ngày sinh */}
                          <td className="px-4 py-3 whitespace-nowrap text-slate-600 font-medium">
                            {dinhDangNgay(nguoiThue.ngaySinh)}
                          </td>

                          {/* CCCD */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            {nguoiThue.soCccd ? (
                              <div>
                                <p className="font-bold text-slate-800 font-mono text-xs">{nguoiThue.soCccd}</p>
                                <p className="text-[10px] text-slate-400">
                                  {nguoiThue.ngayCapCccd ? new Date(nguoiThue.ngayCapCccd).toLocaleDateString('vi-VN') : ''}
                                  {nguoiThue.noiCapCccd ? ` • ${nguoiThue.noiCapCccd}` : ''}
                                </p>
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-md">Chưa có</span>
                            )}
                          </td>

                          {/* Địa chỉ */}
                          <td className="px-4 py-3 max-w-[160px]">
                            <p className="text-slate-600 font-medium text-xs line-clamp-2">
                              {dinhDangChu(nguoiThue.diaChiThuongTru)}
                            </p>
                          </td>

                          {/* Hợp đồng */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            {nguoiThue.ngayBatDauHopDong && nguoiThue.ngayKetThucHopDong ? (
                              <div>
                                <p className="text-xs font-semibold text-slate-700">
                                  {new Date(nguoiThue.ngayBatDauHopDong).toLocaleDateString('vi-VN')}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  → {new Date(nguoiThue.ngayKetThucHopDong).toLocaleDateString('vi-VN')}
                                </p>
                              </div>
                            ) : dinhDangChu(null)}
                          </td>

                          {/* Tiền cọc */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="font-black text-primary text-sm">
                              {dinhDangTien(nguoiThue.tienCoc)}
                            </span>
                          </td>

                          {/* Ngân hàng */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            {nguoiThue.tenNganHang ? (
                              <div>
                                <p className="text-xs font-bold text-slate-700">{nguoiThue.tenNganHang}</p>
                                <p className="text-[10px] font-mono text-slate-400">{nguoiThue.soTaiKhoan}</p>
                                <p className="text-[10px] text-slate-400">{nguoiThue.chuTaiKhoan}</p>
                              </div>
                            ) : dinhDangChu(null)}
                          </td>

                          {/* Liên hệ khẩn cấp */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            {nguoiThue.tenLienHeKhanCap ? (
                              <div>
                                <p className="text-xs font-bold text-slate-700">{nguoiThue.tenLienHeKhanCap}</p>
                                {nguoiThue.sdtLienHeKhanCap && (
                                  <a
                                    href={`tel:${nguoiThue.sdtLienHeKhanCap}`}
                                    className="text-[10px] text-primary hover:underline font-medium"
                                  >
                                    {nguoiThue.sdtLienHeKhanCap}
                                  </a>
                                )}
                              </div>
                            ) : dinhDangChu(null)}
                          </td>

                          {/* Hồ sơ */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            {nguoiThue.daHoanThienHoSo ? (
                              <span className="flex items-center gap-1 text-[10px] font-black text-green-700 bg-green-50 px-2 py-1 rounded-full">
                                <BadgeCheck className="w-3 h-3" /> Đầy đủ
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                                <AlertCircle className="w-3 h-3" /> Thiếu
                              </span>
                            )}
                          </td>

                          {/* Action */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            {nguoiThue.soDienThoai && (
                              <a
                                href={`tel:${nguoiThue.soDienThoai}`}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-primary hover:text-white text-slate-500 transition-all inline-flex items-center"
                                title="Gọi điện"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>


              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-slate-200 border-dashed text-slate-400">
                <Home className="w-10 h-10 mb-3 text-slate-300" />
                <p className="font-bold text-sm">Chọn một phòng để xem danh sách người thuê</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
