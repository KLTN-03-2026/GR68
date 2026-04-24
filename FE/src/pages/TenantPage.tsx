import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from '../context/ToastContext';
import { TenantOverviewTab } from '../components/tenant/TenantOverviewTab';
import { TenantRoomsTab } from '../components/tenant/TenantRoomsTab';
import { TenantContractsTab } from '../components/tenant/TenantContractsTab';
import { TenantInvoicesTab } from '../components/tenant/TenantInvoicesTab';
import { InvoiceDetailModal } from '../components/tenant/modals/InvoiceDetailModal';
import { TenantSupportModal } from '../components/tenant/modals/TenantSupportModal';
import { TenantSupportTab } from '../components/tenant/TenantSupportTab';
import { TabTaiKhoanNguoiThue } from '../components/tenant/TenantAccountTab';
import Messaging from '../components/shared/Messaging';
import { 
  Building,
  LayoutDashboard,
  Bed,
  FileText,
  Wallet,
  Wrench,
  MessageSquare,
  User,
  LogOut
} from 'lucide-react';

/**
 * Interface cho props của trang Người Thuê
 */
interface TenantPageProps {
  onNavigate: (page: string, params?: any) => void;
  user: SupabaseUser | null;
  onLogout: () => void;
  initialParams?: any;
}

export const TenantPage = ({ onNavigate, user, onLogout, initialParams }: TenantPageProps) => {
  const { showToast } = useToast();
  
  // Các state quản lý giao diện và dữ liệu
  const [tabHienTai, setTabHienTai] = useState('overview');
  const [danhSachPhong, setDanhSachPhong] = useState<any[]>([]);
  const [dangTaiDuLieuPhong, setDangTaiDuLieuPhong] = useState(false);
  const [hopDongChoXacNhan, setHopDongChoXacNhan] = useState<any[]>([]);
  const [idHopDongDangKy, setIdHopDongDangKy] = useState<string | null>(null);
  const [idChatHienTai, setIdChatHienTai] = useState<string | null>(null);
  const [dangKhoiTaoChat, setDangKhoiTaoChat] = useState(false);
  const [tenantInvoices, setTenantInvoices] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // State quản lý Yêu cầu hỗ trợ
  const [danhSachHoTro, setDanhSachHoTro] = useState<any[]>([]);
  const [dangTaiHoTro, setDangTaiHoTro] = useState(false);
  const [hienThiModalHoTro, setHienThiModalHoTro] = useState(false);
  const [formYeuCauMoi, setFormYeuCauMoi] = useState({ roomId: '', title: '', description: '' });
  const [dangGuiYeuCau, setDangGuiYeuCau] = useState(false);

  // State form hồ sơ
  const [formHoSo, setFormHoSo] = useState({
    full_name: '', phone: '', gender: '', birth_date: '',
    permanent_address: '',
    id_card_number: '', id_card_date: '', id_card_place: '',
    bank_name: '', bank_account_number: '', bank_account_name: '',
    zalo_phone: '', emergency_contact_name: '', emergency_contact_phone: ''
  });
  const [dangTaiHoSo, setDangTaiHoSo] = useState(false);
  const [dangLuuHoSo, setDangLuuHoSo] = useState(false);
  const [thongBaoLuuHoSo, setThongBaoLuuHoSo] = useState('');

  // State đổi mật khẩu
  const [formMatKhau, setFormMatKhau] = useState({ cu: '', moi: '', xac_nhan: '' });
  const [dangDoiMatKhau, setDangDoiMatKhau] = useState(false);
  const [thongBaoMatKhau, setThongBaoMatKhau] = useState('');
  const [hienThiMatKhau, setHienThiMatKhau] = useState(false);

  // Khởi tạo dữ liệu khi người dùng đăng nhập
  useEffect(() => {
    if (user) {
      layDanhSachPhongNguoiThue();
      layDanhSachHopDongChoKy();
      fetchTenantInvoices();
      layDanhSachHoTro();
      taiThongTinHoSo();
    }
  }, [user]);

  /**
   * Tải thông tin hồ sơ cá nhân hiện tại
   */
  const taiThongTinHoSo = async () => {
    if (!user) return;
    setDangTaiHoSo(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setFormHoSo({
          full_name: data.full_name || '',
          phone: data.phone || '',
          gender: data.gender || '',
          birth_date: data.birth_date || '',
          permanent_address: data.permanent_address || '',
          id_card_number: data.id_card_number || '',
          id_card_date: data.id_card_date || '',
          id_card_place: data.id_card_place || '',
          bank_name: data.bank_name || '',
          bank_account_number: data.bank_account_number || '',
          bank_account_name: data.bank_account_name || '',
          zalo_phone: data.zalo_phone || '',
          emergency_contact_name: data.emergency_contact_name || '',
          emergency_contact_phone: data.emergency_contact_phone || ''
        });
      }
    } catch (err) {
      console.error('Lỗi khi tải thông tin cá nhân:', err);
    } finally {
      setDangTaiHoSo(false);
    }
  };

  /**
   * Xử lý lưu các thay đổi hồ sơ cá nhân
   */
  const xuLyLuuHoSo = async () => {
    if (!user) return;
    setDangLuuHoSo(true);
    setThongBaoLuuHoSo('');
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formHoSo)
        .eq('id', user.id);

      if (error) throw error;
      setThongBaoLuuHoSo('Cập nhật hồ sơ thành công!');
      showToast('Cập nhật hồ sơ thành công!', 'success');
      taiThongTinHoSo();
    } catch (err: any) {
      console.error('Lỗi lưu thay đổi hồ sơ:', err);
      setThongBaoLuuHoSo('Có lỗi xảy ra: ' + err.message);
      showToast('Lỗi cập nhật hồ sơ: ' + err.message, 'error');
    } finally {
      setDangLuuHoSo(false);
    }
  };

  /**
   * Xử lý thay đổi mật khẩu
   */
  const xuLyDoiMatKhau = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formMatKhau.moi !== formMatKhau.xac_nhan) {
      setThongBaoMatKhau('Mật khẩu xác nhận không khớp');
      return;
    }
    setDangDoiMatKhau(true);
    setThongBaoMatKhau('');
    try {
      const { error } = await supabase.auth.updateUser({
        password: formMatKhau.moi
      });
      if (error) throw error;
      setThongBaoMatKhau('Cập nhật mật khẩu thành công!');
      showToast('Đổi mật khẩu thành công!', 'success');
      setFormMatKhau({ cu: '', moi: '', xac_nhan: '' });
    } catch (err: any) {
      console.error('Lỗi cập nhật mật khẩu:', err);
      setThongBaoMatKhau('Lỗi: ' + err.message);
      showToast('Lỗi đổi mật khẩu: ' + err.message, 'error');
    } finally {
      setDangDoiMatKhau(false);
    }
  };

  /**
   * Truy xuất danh sách phòng mà người thuê đang ở
   */
  const layDanhSachPhongNguoiThue = async () => {
    if (!user) return;
    setDangTaiDuLieuPhong(true);
    try {
      // Lấy số điện thoại từ profile để tìm phòng
      const { data: profileCuaToi } = await supabase
        .from('profiles')
        .select('phone')
        .eq('id', user.id)
        .single();

      const soDienThoai = profileCuaToi?.phone || null;
      if (!soDienThoai) {
        setDanhSachPhong([]);
        return;
      }

      // Gọi RPC để lấy thông tin phòng và hợp đồng liên quan
      const { data: rooms, error: rpcError } = await supabase
        .rpc('get_tenant_rooms', { tenant_phone: soDienThoai });

      if (rpcError) throw rpcError;

      if (rooms && rooms.length > 0) {
        const mapped = rooms.map((r: any) => ({
          id: r.id || r.room_id,
          title: r.title || r.room_title,
          price: r.price || r.room_price,
          type: r.type || r.room_type,
          area: r.area || r.room_area,
          status: r.status || r.room_status,
          image_url: r.image_url || r.room_image_url,
          note: r.note || r.room_note,
          contract_id: r.contract_id,
          contract_start: r.contract_start,
          contract_end: r.contract_end,
          contract_deposit: r.contract_deposit || r.deposit,
          landlord_name: r.landlord_name || 'Chủ trọ',
          landlord_phone: r.landlord_phone || '',
          electricity_price: r.electricity_price,
          water_price: r.water_price,
          service_fee: r.service_fee,
          owner_id: r.owner_id
        }));
        setDanhSachPhong(mapped);
      } else {
        setDanhSachPhong([]);
      }
    } catch (error) {
      console.error('[TenantRooms] Lỗi:', error);
    } finally {
      setDangTaiDuLieuPhong(false);
    }
  };

  /**
   * Truy xuất các hợp đồng đang chờ người thuê ký xác nhận
   */
  const layDanhSachHopDongChoKy = async () => {
    if (!user) return;
    try {
      const { data: duLieuHopDong, error } = await supabase
        .rpc('get_pending_contracts', { p_tenant_id: user.id });

      if (error) throw error;
      setHopDongChoXacNhan(duLieuHopDong || []);
    } catch (err) {
      console.error('Lỗi khi lấy hợp đồng chờ ký:', err);
      setHopDongChoXacNhan([]);
    }
  };

  /**
   * Xử lý hành động ký xác nhận hợp đồng điện tử
   */
  const xuLyKyHopDong = async (contract: any) => {
    setIdHopDongDangKy(contract.id);
    try {
      const { error: rpcError } = await supabase.rpc('accept_contract', { 
        p_contract_id: contract.id 
      });
      
      if (rpcError) throw rpcError;
      // Tải lại dữ liệu sau khi ký thành công
      await Promise.all([layDanhSachPhongNguoiThue(), layDanhSachHopDongChoKy()]);
      showToast('Ký hợp đồng thành công!', 'success');
    } catch (err) {
      console.error('Lỗi ký hợp đồng:', err);
      showToast('Lỗi ký hợp đồng.', 'error');
    } finally {
      setIdHopDongDangKy(null);
    }
  };

  /**
   * Xử lý hành động từ chối lời mời ký hợp đồng
   */
  const xuLyTuChoiHopDong = async (contract: any) => {
    if (!window.confirm(`Bạn có chắc muốn TỪ CHỐI hợp đồng phòng ${contract.rooms?.title}?`)) return;
    
    setIdHopDongDangKy(contract.id);
    try {
      const { error: rpcError } = await supabase.rpc('reject_contract', { 
        p_contract_id: contract.id 
      });
      if (rpcError) throw rpcError;
      await layDanhSachHopDongChoKy();
      showToast('Đã từ chối lời mời hợp đồng.', 'success');
    } catch (err) {
      console.error('Lỗi từ chối hợp đồng:', err);
      showToast('Lỗi từ chối hợp đồng.', 'error');
    } finally {
      setIdHopDongDangKy(null);
    }
  };

  /**
   * Khởi tạo hoặc chuyển hướng đến cuộc hội thoại với chủ trọ
   */
  const xuLyBatDauChat = async (owner_id: string) => {
    if (!owner_id || !user) {
      setTabHienTai('messages');
      return;
    }
    setDangKhoiTaoChat(true);
    try {
      // Tìm kiếm hội thoại hiện có
      const { data: hoiThoaiDaCo } = await supabase
        .from('conversations')
        .select('id')
        .eq('tenant_id', user.id)
        .eq('landlord_id', owner_id);

      let idCuocHoiThoai: string | null = null;
      if (hoiThoaiDaCo && hoiThoaiDaCo.length > 0) {
        idCuocHoiThoai = hoiThoaiDaCo[0].id;
      } else {
        // Tạo hội thoại mới nếu chưa có
        const { data: hoiThoaiMoi } = await supabase
          .from('conversations')
          .insert({ tenant_id: user.id, landlord_id: owner_id })
          .select('id')
          .single();
        if (hoiThoaiMoi) idCuocHoiThoai = hoiThoaiMoi.id;
      }
      if (idCuocHoiThoai) setIdChatHienTai(idCuocHoiThoai);
    } catch (err) {
      console.error('Lỗi khởi tạo chat:', err);
    } finally {
      setDangKhoiTaoChat(false);
      setTabHienTai('messages');
    }
  };

  const fetchTenantInvoices = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          rooms (id, title)
        `)
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setTenantInvoices(data || []);
    } catch (err) {
      console.error('Lỗi khi lấy hóa đơn:', err);
    }
  };

  const layDanhSachHoTro = async () => {
    if (!user) return;
    setDangTaiHoTro(true);
    try {
      const { data, error } = await supabase
        .from('support_requests')
        .select(`*, rooms(title)`)
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setDanhSachHoTro(data || []);
    } catch (err) {
      console.error('Lỗi khi tải danh sách hỗ trợ:', err);
    } finally {
      setDangTaiHoTro(false);
    }
  };

  const xuLyGuiYeuCau = async () => {
    if (!formYeuCauMoi.roomId || !formYeuCauMoi.title || !formYeuCauMoi.description) return;
    
    setDangGuiYeuCau(true);
    try {
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('owner_id')
        .eq('id', formYeuCauMoi.roomId)
        .single();
        
      if (roomError || !roomData?.owner_id) {
        showToast('Không tìm thấy thông tin phòng.', 'error');
        return;
      }
      
      const { error } = await supabase.from('support_requests').insert({
        tenant_id: user?.id,
        room_id: formYeuCauMoi.roomId,
        landlord_id: roomData.owner_id,
        title: formYeuCauMoi.title,
        description: formYeuCauMoi.description,
        status: 'pending'
      });
      if (error) throw error;
      setHienThiModalHoTro(false);
      setFormYeuCauMoi({ roomId: '', title: '', description: '' });
      await layDanhSachHoTro();
      showToast('Gửi yêu cầu hỗ trợ thành công!', 'success');
    } catch (err) {
      console.error('Lỗi khi gửi yêu cầu:', err);
      showToast('Đã có lỗi xảy ra.', 'error');
    } finally {
      setDangGuiYeuCau(false);
    }
  };

  const xuLyThanhToanHoaDon = async (invoiceId: string) => {
    if (!window.confirm('Xác nhận bạn đã chuyển khoản số tiền này cho Chủ Trọ?')) return;
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ 
          status: 'pending_verification',
          updated_at: new Date().toISOString()
        })
        .eq('id', invoiceId);

      if (error) throw error;
      showToast('Đã gửi yêu cầu xác nhận thanh toán!', 'success');
      await fetchTenantInvoices();
      setShowInvoiceModal(false);
    } catch (err) {
      console.error('Lỗi thanh toán hóa đơn:', err);
      showToast('Lỗi khi cập nhật trạng thái thanh toán.', 'error');
    }
  };

  // Danh mục menu điều hướng
  const danhMucMenu = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'rooms', label: 'Phòng của tôi', icon: Bed },
    { id: 'contracts', label: 'Hợp đồng', icon: FileText },
    { id: 'invoices', label: 'Hóa đơn', icon: Wallet },
    { id: 'support', label: 'Hỗ trợ', icon: Wrench },
    { id: 'messages', label: 'Tin nhắn', icon: MessageSquare },
    { id: 'account', label: 'Tài khoản', icon: User },
  ];

  // Dữ liệu giả lập biểu đồ điện năng
  const duLieuDienNangTheoThang = [
    { month: 'T11', height: '60%' },
    { month: 'T12', height: '85%' },
    { month: 'T1', height: '40%' },
    { month: 'T2', height: '30%' },
    { month: 'T3', height: '55%' },
    { month: 'T4', height: '70%', isCurrent: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex flex-1">
        {/* Thanh Sidebar bên trái */}
        <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <div className="p-6 flex-1">
            <div className="flex items-center gap-3 text-primary mb-8 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 font-display">Người Thuê</h2>
            </div>
            
            <nav className="space-y-1">
            {danhMucMenu.map((item) => (
              <button
                key={item.id}
                onClick={() => setTabHienTai(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                  tabHienTai === item.id 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
            </nav>
          </div>
        </aside>

        {/* Nội dung chính dựa trên tab được chọn */}
        <main className={`flex-1 flex flex-col p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-y-auto`}>
          {tabHienTai === 'overview' && (
            <TenantOverviewTab 
              nguoiDung={user} 
              danhSachPhong={danhSachPhong} 
              hopDongChoKy={hopDongChoXacNhan} 
              dangTaiPhong={dangTaiDuLieuPhong} 
              dienNangTheoThang={duLieuDienNangTheoThang}
              idHopDongDangKy={idHopDongDangKy} 
              xuLyKyHopDong={xuLyKyHopDong} 
              xuLyTuChoiHopDong={xuLyTuChoiHopDong} 
              onNavigate={onNavigate} 
              // Thêm props support
              danhSachHoTro={danhSachHoTro}
              layDanhSachHoTro={layDanhSachHoTro}
              dangTaiHoTro={dangTaiHoTro}
              setHienThiModalHoTro={setHienThiModalHoTro}
              setFormYeuCauMoi={setFormYeuCauMoi}
            />
          )}

          {tabHienTai === 'rooms' && (
            <TenantRoomsTab 
              danhSachPhong={danhSachPhong} 
              dangTaiPhong={dangTaiDuLieuPhong} 
              onNavigate={onNavigate} 
              xuLyBatDauChat={xuLyBatDauChat}
              dangKhoiTaoChat={dangKhoiTaoChat}
              user={user}
            />
          )}

          {tabHienTai === 'contracts' && (
            <TenantContractsTab 
              danhSachPhong={danhSachPhong}
              dangTaiDuLieu={dangTaiDuLieuPhong}
            />
          )}

          {tabHienTai === 'invoices' && (
            <TenantInvoicesTab 
              danhSachHoaDon={tenantInvoices}
              xuLyXemChiTiet={(hoaDon) => {
                setSelectedInvoice(hoaDon);
                setShowInvoiceModal(true);
              }}
              xuLyThanhToan={xuLyThanhToanHoaDon}
            />
          )}

          {tabHienTai === 'support' && (
            <TenantSupportTab
              danhSachHoTro={danhSachHoTro}
              dangTaiDuLieu={dangTaiHoTro}
              danhSachPhong={danhSachPhong}
              setHienThiModalThem={setHienThiModalHoTro}
              setFormYeuCauMoi={setFormYeuCauMoi}
            />
          )}

          {tabHienTai === 'messages' && (
            <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)] rounded-2xl border border-slate-200 shadow-sm">
              <Messaging 
                nguoiDung={user} 
                vaiTro="tenant" 
                idHoiThoaiBanDau={idChatHienTai ?? undefined} 
              />
            </div>
          )}

          {tabHienTai === 'account' && (
            <TabTaiKhoanNguoiThue 
              nguoiDung={user} 
              danhSachPhong={danhSachPhong}
              formHoSo={formHoSo} 
              setFormHoSo={setFormHoSo} 
              dangTaiHoSo={dangTaiHoSo} 
              dangLuuHoSo={dangLuuHoSo} 
              thongBaoLuuHoSo={thongBaoLuuHoSo} 
              xuLyLuuHoSo={xuLyLuuHoSo} 
              formMatKhau={formMatKhau} 
              setFormMatKhau={setFormMatKhau} 
              dangDoiMatKhau={dangDoiMatKhau} 
              thongBaoMatKhau={thongBaoMatKhau} 
              hienThiMatKhau={hienThiMatKhau} 
              setHienThiMatKhau={setHienThiMatKhau} 
              xuLyDoiMatKhau={xuLyDoiMatKhau} 
              xuLyDangXuat={onLogout} 
            />
          )}

          {/* Placeholder cho các tính năng chưa phát triển */}
          {tabHienTai !== 'overview' && tabHienTai !== 'rooms' && tabHienTai !== 'contracts' && tabHienTai !== 'invoices' && tabHienTai !== 'support' && tabHienTai !== 'messages' && tabHienTai !== 'account' && (
            <div className="flex flex-col items-center justify-center h-96 text-slate-400">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Tính năng đang phát triển</h3>
              <p className="text-sm">Trang {danhMucMenu.find(i => i.id === tabHienTai)?.label} sẽ sớm ra mắt.</p>
            </div>
          )}
        </main>
      </div>

      <InvoiceDetailModal
        hienThi={showInvoiceModal}
        dongModal={() => setShowInvoiceModal(false)}
        hoaDon={selectedInvoice}
        xuLyThanhToan={selectedInvoice?.status === 'unpaid' ? () => xuLyThanhToanHoaDon(selectedInvoice.id) : undefined}
      />

      <TenantSupportModal 
        hienThiModalHoTro={hienThiModalHoTro} 
        setHienThiModalHoTro={setHienThiModalHoTro} 
        formYeuCauMoi={formYeuCauMoi} 
        setFormYeuCauMoi={setFormYeuCauMoi} 
        danhSachPhong={danhSachPhong} 
        dangGuiYeuCau={dangGuiYeuCau} 
        xuLyGuiYeuCau={xuLyGuiYeuCau} 
      />
    </div>
  );
};
