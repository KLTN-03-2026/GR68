import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Loader2,
  AlertCircle,
  Trash2,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  Home
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Page } from '../components/layout/Header';

import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';
import { AdminDashboardTab } from '../components/admin/AdminDashboardTab';
import { AdminListingsTab } from '../components/admin/AdminListingsTab';
import { AdminUsersTab } from '../components/admin/AdminUsersTab';

interface AdminPageProps {
  user: SupabaseUser | null;
  onLogout: () => void;
  onNavigate: (page: Page, params?: any) => void;
}

interface Profile {
  id: string;
  full_name: string;
  phone: string;
  role: string;
  avatar_url: string;
  created_at: string;
}

interface Listing {
  id: string;
  owner_id: string;
  title: string;
  price: number;
  image_url: string;
  type: string;
  location: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  ownerInfo?: Profile;
}

interface Product {
  id: string;
  owner_id: string;
  title: string;
  price: number;
  image_url: string;
  category: string;
  condition: string;
  status: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  ownerInfo?: Profile;
}

interface ThongKeTongQuan {
  totalListings: number;
  totalUsers: number;
  totalRevenue: number;
  activeContracts: number;
  totalProducts: number;
}

type CheDoXemAdmin = 'dashboard' | 'listings' | 'users';

export const AdminPage = ({ user, onLogout, onNavigate }: AdminPageProps) => {
  const layCheDoXemBanDau = (): CheDoXemAdmin => {
    const params = new URLSearchParams(window.location.search);
    const urlView = params.get('view') as CheDoXemAdmin;
    const validViews: CheDoXemAdmin[] = ['dashboard', 'listings', 'users'];
    
    if (urlView && validViews.includes(urlView)) return urlView;
    
    const savedView = localStorage.getItem('last_admin_view') as CheDoXemAdmin;
    if (savedView && validViews.includes(savedView)) return savedView;
    
    return 'dashboard';
  };

  const [cheDoXemHienTai, setCheDoXemHienTai] = useState<CheDoXemAdmin>(layCheDoXemBanDau());
  
  // Trạng thái Tin đăng
  const [tabHienTai, setTabHienTai] = useState<'pending' | 'approved' | 'rejected'>('approved');
  const [danhSachTinDang, setDanhSachTinDang] = useState<Listing[]>([]);
  
  // Trạng thái Sản phẩm
  const [danhSachSanPham, setDanhSachSanPham] = useState<Product[]>([]);
  const [cheDoTinDang, setCheDoTinDang] = useState<'room' | 'product'>('room');
  
  // Trạng thái Người dùng
  const [danhSachNguoiDung, setDanhSachNguoiDung] = useState<Profile[]>([]);
  const [boLocNguoiDung, setBoLocNguoiDung] = useState<'all' | 'landlord' | 'tenant' | 'admin'>('all');

  // Trạng thái Chung
  const [dangTai, setDangTai] = useState(true);
  const [dangTaiThaoTac, setDangTaiThaoTac] = useState<string | null>(null);

  // Chỉnh sửa Tin đăng
  const [tinDangDangSua, setTinDangDangSua] = useState<Listing | null>(null);
  const [bieuMauSua, setBieuMauSua] = useState<{ title: string, price: number, type: string, location: string }>({ title: '', price: 0, type: '', location: '' });

  // Chỉnh sửa Người dùng
  const [nguoiDungDangSua, setNguoiDungDangSua] = useState<Profile | null>(null);
  const [bieuMauSuaNguoiDung, setBieuMauSuaNguoiDung] = useState<{ full_name: string, phone: string, role: string }>({ full_name: '', phone: '', role: 'tenant' });
  
  // Chỉnh sửa Sản phẩm
  const [sanPhamDangSua, setSanPhamDangSua] = useState<Product | null>(null);
  const [bieuMauSuaSanPham, setBieuMauSuaSanPham] = useState<{ title: string, price: number, category: string, condition: string }>({ 
    title: '', 
    price: 0, 
    category: '', 
    condition: '' 
  });

  // Xem Người dùng
  const [nguoiDungDangXem, setNguoiDungDangXem] = useState<Profile | null>(null);

  // Thống kê Tổng quan
  const [tongQuanThongKe, setTongQuanThongKe] = useState<ThongKeTongQuan>({
    totalListings: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activeContracts: 0,
    totalProducts: 0
  });

  // Modal Xác nhận
  const [modalXacNhan, setModalXacNhan] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'warning'
  });

  const { showToast } = useToast();

  // ID Tin đăng nổi bật (dùng để highlight khi cần)
  const [idTinDangNoiBat, setIdTinDangNoiBat] = useState<string | null>(null);

  // Tải dữ liệu ban đầu
  useEffect(() => {
    const taiTatCaDuLieu = async () => {
      try {
        setDangTai(true);
        await Promise.all([
          taiTongQuanThongKe(),
          taiDanhSachTinDang(),
          taiDanhSachSanPham(),
          taiDanhSachNguoiDung()
        ]);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu admin:', error);
      } finally {
        setDangTai(false);
      }
    };

    if (user) {
      taiTatCaDuLieu();
    }
  }, [user]);

  // Đồng bộ tab với URL và LocalStorage
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('view', cheDoXemHienTai);
    window.history.replaceState({}, '', url.toString());
    
    localStorage.setItem('last_admin_view', cheDoXemHienTai);
  }, [cheDoXemHienTai]);

  // ===================== LOGIC THỐNG KÊ =====================
  const taiTongQuanThongKe = async () => {
    try {
      const [
        { count: listingsCount },
        { count: usersCount },
        { data: revenueData },
        { count: contractsCount },
        { count: productsCount }
      ] = await Promise.all([
        supabase.from('listings').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('invoices').select('amount').eq('status', 'paid'),
        supabase.from('contracts').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('products').select('*', { count: 'exact', head: true })
      ]) as any[];

      const totalRevenue = revenueData?.reduce((sum: number, inv: any) => sum + (Number(inv.amount) || 0), 0) || 0;

      setTongQuanThongKe({
        totalListings: listingsCount || 0,
        totalUsers: usersCount || 0,
        totalRevenue,
        activeContracts: contractsCount || 0,
        totalProducts: productsCount || 0
      });
    } catch (error) {
      console.error('Lỗi tải thống kê:', error);
    }
  };

  // ===================== LOGIC TIN ĐĂNG =====================
  const taiDanhSachTinDang = async () => {
    try {
      const { data: listingsData, error: listingsError } = await supabase
        .from('listings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (listingsError) throw listingsError;
      
      if (!listingsData || listingsData.length === 0) {
        setDanhSachTinDang([]);
        return;
      }

      const ownerIds = [...new Set(listingsData.map(l => l.owner_id).filter(id => id))];
      let profilesMap = new Map();
      
      if (ownerIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, phone, role, avatar_url')
          .in('id', ownerIds);
          
        if (profilesError) {
          console.error("Lỗi tải profile:", profilesError);
        } else if (profilesData) {
          profilesData.forEach(p => profilesMap.set(p.id, p));
        }
      }
      
      const mergedListings = listingsData.map(listing => ({
        ...listing,
        ownerInfo: profilesMap.get(listing.owner_id)
      }));

      setDanhSachTinDang(mergedListings as Listing[]);
    } catch (error) {
      console.error('Lỗi tải danh sách tin đăng:', error);
      showToast('Không thể tải dữ liệu tin đăng.', 'error');
    }
  };

  const taiDanhSachSanPham = async () => {
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;
      
      if (!productsData || productsData.length === 0) {
        setDanhSachSanPham([]);
        return;
      }

      const ownerIds = [...new Set(productsData.map(p => p.owner_id).filter(id => id))];
      let profilesMap = new Map();
      
      if (ownerIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, phone, role, avatar_url')
          .in('id', ownerIds);
          
        profilesData?.forEach(p => profilesMap.set(p.id, p));
      }
      
      const mergedProducts = productsData.map(product => ({
        ...product,
        ownerInfo: profilesMap.get(product.owner_id)
      }));

      setDanhSachSanPham(mergedProducts as Product[]);
    } catch (error) {
      console.error('Lỗi tải danh sách sản phẩm:', error);
      showToast('Không thể tải dữ liệu sản phẩm.', 'error');
    }
  };

  const xuLyCapNhatTrangThai = async (id: string, status: 'approved' | 'rejected') => {
    setModalXacNhan({
      isOpen: true,
      title: 'Xác nhận thay đổi',
      message: `Bạn có chắc muốn ${status === 'approved' ? 'duyệt' : 'từ chối'} tin đăng này?`,
      type: 'warning',
      onConfirm: async () => {
        try {
          setDangTaiThaoTac(id);
          const listing = danhSachTinDang.find(l => l.id === id);
          if (!listing) throw new Error("Không tìm thấy tin đăng.");

          const { error } = await supabase
            .from('listings')
            .update({ approval_status: status })
            .eq('id', id);

          if (error) throw error;
          
          await supabase.from('notifications').insert({
            sender_id: user?.id,
            receiver_id: listing.owner_id,
            type: status === 'approved' ? 'success' : 'error',
            title: status === 'approved' ? 'Tin đăng đã được duyệt!' : 'Tin đăng bị từ chối',
            message: status === 'approved' 
              ? `Tin đăng "${listing.title}" của bạn đã được phê duyệt và hiển thị công khai.`
              : `Rất tiếc, tin đăng "${listing.title}" của bạn không được phê duyệt. Vui lòng kiểm tra lại thông tin.`,
            related_entity_id: id
          });

          setDanhSachTinDang(prev => prev.map(l => l.id === id ? { ...l, approval_status: status } : l));
          showToast(`Đã ${status === 'approved' ? 'duyệt' : 'từ chối'} tin đăng!`, 'success');
        } catch (error: any) {
          showToast(error.message || 'Lỗi cập nhật trạng thái.', 'error');
        } finally {
          setDangTaiThaoTac(null);
        }
      }
    });
  };

  const xuLyDuyetSanPham = async (id: string, status: 'approved' | 'rejected') => {
    setModalXacNhan({
      isOpen: true,
      title: 'Xác nhận phê duyệt sản phẩm',
      message: `Bạn có chắc muốn ${status === 'approved' ? 'duyệt' : 'từ chối'} sản phẩm này?`,
      type: 'warning',
      onConfirm: async () => {
        try {
          setDangTaiThaoTac(id);
          const product = danhSachSanPham.find(p => p.id === id);
          if (!product) throw new Error("Không tìm thấy sản phẩm.");

          const { error } = await supabase
            .from('products')
            .update({ approval_status: status })
            .eq('id', id);

          if (error) throw error;
          
          await supabase.from('notifications').insert({
            sender_id: user?.id,
            receiver_id: product.owner_id,
            type: status === 'approved' ? 'success' : 'error',
            title: status === 'approved' ? 'Sản phẩm đã được duyệt!' : 'Sản phẩm bị từ chối',
            message: status === 'approved' 
              ? `Sản phẩm "${product.title}" của bạn đã được phê duyệt và hiển thị trên cửa hàng.`
              : `Rất tiếc, sản phẩm "${product.title}" của bạn không được phê duyệt. Vui lòng kiểm tra lại hình ảnh và thông tin.`,
            related_entity_id: id
          });

          setDanhSachSanPham(prev => prev.map(p => p.id === id ? { ...p, approval_status: status } : p));
          showToast(`Đã ${status === 'approved' ? 'duyệt' : 'từ chối'} sản phẩm!`, 'success');
        } catch (error: any) {
          showToast(error.message || 'Lỗi cập nhật trạng thái sản phẩm.', 'error');
        } finally {
          setDangTaiThaoTac(null);
        }
      }
    });
  };

  const xuLyXoaTinDang = async (id: string) => {
    setModalXacNhan({
      isOpen: true,
      title: 'Xóa tin đăng',
      message: 'Bạn có chắc chắn muốn xóa tin đăng này khỏi hệ thống không?',
      type: 'danger',
      onConfirm: async () => {
        try {
          setDangTaiThaoTac(id);
          const { error } = await supabase
            .from('listings')
            .update({ is_active: false })
            .eq('id', id);

          if (error) throw error;
          
          setDanhSachTinDang(prev => prev.filter(l => l.id !== id));
          showToast('Đã xóa bài đăng khỏi hệ thống!', 'success');
        } catch (error: any) {
          showToast(error.message || 'Lỗi khi xóa tin đăng.', 'error');
        } finally {
          setDangTaiThaoTac(null);
        }
      }
    });
  };

  const xuLyCapNhatTrangThaiSanPham = async (id: string, status: string) => {
    try {
      setDangTaiThaoTac(id);
      const { error } = await supabase
        .from('products')
        .update({ status: status })
        .eq('id', id);

      if (error) throw error;
      
      setDanhSachSanPham(prev => prev.map(p => p.id === id ? { ...p, status: status } : p));
      showToast('Cập nhật trạng thái sản phẩm thành công!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Lỗi cập nhật sản phẩm.', 'error');
    } finally {
      setDangTaiThaoTac(null);
    }
  };

  const xuLyMoChinhSua = (listing: Listing) => {
    setTinDangDangSua(listing);
    setBieuMauSua({
      title: listing.title || '',
      price: listing.price || 0,
      type: listing.type || '',
      location: listing.location || ''
    });
  };

  const xuLyLuuChinhSua = async () => {
    if (!tinDangDangSua) return;
    try {
      setDangTaiThaoTac('saving');
      const { error } = await supabase
        .from('listings')
        .update({ 
          title: bieuMauSua.title,
          price: bieuMauSua.price,
          type: bieuMauSua.type,
          location: bieuMauSua.location
        })
        .eq('id', tinDangDangSua.id);

      if (error) throw error;
      
      setDanhSachTinDang(prev => prev.map(l => l.id === tinDangDangSua.id ? { ...l, ...bieuMauSua } : l));
      setTinDangDangSua(null);
      showToast('Cập nhật tin đăng thành công!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Lỗi khi lưu chỉnh sửa.', 'error');
    } finally {
      setDangTaiThaoTac(null);
    }
  };

  const xuLyMoChinhSuaSanPham = (product: Product) => {
    setSanPhamDangSua(product);
    setBieuMauSuaSanPham({
      title: product.title || '',
      price: product.price || 0,
      category: product.category || '',
      condition: product.condition || ''
    });
  };

  const xuLyLuuChinhSuaSanPham = async () => {
    if (!sanPhamDangSua) return;
    try {
      setDangTaiThaoTac('saving-product');
      const { error } = await supabase
        .from('products')
        .update({ 
          title: bieuMauSuaSanPham.title,
          price: bieuMauSuaSanPham.price,
          category: bieuMauSuaSanPham.category,
          condition: bieuMauSuaSanPham.condition
        })
        .eq('id', sanPhamDangSua.id);

      if (error) throw error;
      
      setDanhSachSanPham(prev => prev.map(p => p.id === sanPhamDangSua.id ? { ...p, ...bieuMauSuaSanPham } : p));
      setSanPhamDangSua(null);
      showToast('Cập nhật sản phẩm thành công!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Lỗi khi lưu sản phẩm.', 'error');
    } finally {
      setDangTaiThaoTac(null);
    }
  };

  const xuLyXoaSanPham = async (id: string) => {
    setModalXacNhan({
      isOpen: true,
      title: 'Xóa sản phẩm',
      message: 'Bạn có chắc muốn xóa vĩnh viễn sản phẩm này?',
      type: 'danger',
      onConfirm: async () => {
        try {
          setDangTaiThaoTac(id);
          const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

          if (error) throw error;
          
          setDanhSachSanPham(prev => prev.filter(p => p.id !== id));
          showToast('Đã xóa sản phẩm thành công!', 'success');
        } catch (error: any) {
          showToast(error.message || 'Lỗi khi xóa sản phẩm.', 'error');
        } finally {
          setDangTaiThaoTac(null);
        }
      }
    });
  };

  // ===================== LOGIC NGƯỜI DÙNG =====================
  const taiDanhSachNguoiDung = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('role', { ascending: true });
      if (error) throw error;
      setDanhSachNguoiDung(data || []);
    } catch (error) {
      console.error('Lỗi tải danh sách người dùng:', error);
    }
  };

  const xuLyMoChinhSuaNguoiDung = (user: Profile) => {
    setNguoiDungDangSua(user);
    setBieuMauSuaNguoiDung({
      full_name: user.full_name || '',
      phone: user.phone || '',
      role: user.role || 'tenant'
    });
  };

  const xuLyLuuChinhSuaNguoiDung = async () => {
    if (!nguoiDungDangSua) return;
    try {
      setDangTaiThaoTac('saving-user');
      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: bieuMauSuaNguoiDung.full_name,
          phone: bieuMauSuaNguoiDung.phone,
          role: bieuMauSuaNguoiDung.role 
        })
        .eq('id', nguoiDungDangSua.id);

      if (error) throw error;
      
      setDanhSachNguoiDung(prev => prev.map(u => u.id === nguoiDungDangSua.id ? { ...u, ...bieuMauSuaNguoiDung } : u));
      setNguoiDungDangSua(null);
      showToast('Cập nhật người dùng thành công!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Lỗi khi lưu người dùng.', 'error');
    } finally {
      setDangTaiThaoTac(null);
    }
  };

  const xuLyXoaNguoiDung = async (id: string) => {
    setModalXacNhan({
      isOpen: true,
      title: 'XÓA VĨNH VIỄN TÀI KHOẢN',
      message: 'Chú ý: Hành động này sẽ xóa sạch dữ liệu của người dùng này và không thể hoàn tác. Bạn có chắc chắn muốn thực hiện?',
      type: 'danger',
      onConfirm: async () => {
        try {
          setDangTaiThaoTac(id);
          const { error } = await supabase.rpc('admin_delete_account_cascade', {
            target_user_id: id
          });

          if (error) throw error;
          
          setDanhSachNguoiDung(prev => prev.filter(u => u.id !== id));
          showToast('Đã xóa vĩnh viễn tài khoản người dùng thành công!', 'success');
        } catch (error: any) {
          showToast(error.message || 'Lỗi khi xóa tài khoản.', 'error');
        } finally {
          setDangTaiThaoTac(null);
        }
      }
    });
  };

  // ===================== TRÌNH TRỢ GIÚP =====================
  const layChuCaiDau = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const dinhDangNgay = (dateString: string) => {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}`;
  };

  const thongKeTinDang = {
    pending: danhSachTinDang.filter(l => l.approval_status === 'pending').length,
    approved: danhSachTinDang.filter(l => l.approval_status === 'approved').length,
    rejected: danhSachTinDang.filter(l => l.approval_status === 'rejected').length,
    productPending: danhSachSanPham.filter(p => p.approval_status === 'pending').length,
    productApproved: danhSachSanPham.filter(p => p.approval_status === 'approved').length,
    productRejected: danhSachSanPham.filter(p => p.approval_status === 'rejected').length,
  };

  const thongKeNguoiDung = {
    total: danhSachNguoiDung.length,
    landlord: danhSachNguoiDung.filter(u => u.role === 'landlord').length,
    tenant: danhSachNguoiDung.filter(u => u.role === 'tenant').length,
    admin: danhSachNguoiDung.filter(u => u.role === 'admin').length,
  };

  const tinDangHienTai = danhSachTinDang.filter(l => l.approval_status === tabHienTai);
  const sanPhamHienTai = danhSachSanPham.filter(p => p.approval_status === tabHienTai);
  const nguoiDungHienTai = danhSachNguoiDung.filter(u => boLocNguoiDung === 'all' || u.role === boLocNguoiDung);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col sticky top-16 h-[calc(100vh-64px)] overflow-y-auto shrink-0">
          <div className="p-6 flex-1">
            <div className="flex items-center gap-3 text-primary mb-8 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 font-display">Quản Trị Viên</h2>
            </div>
            
            <nav className="space-y-2">
              <button 
                onClick={() => setCheDoXemHienTai('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${cheDoXemHienTai === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Bảng điều khiển</span>
              </button>
              <button 
                onClick={() => setCheDoXemHienTai('listings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${cheDoXemHienTai === 'listings' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <FileText className="w-5 h-5" />
                <span>Quản lý tin đăng</span>
              </button>
              <button 
                onClick={() => setCheDoXemHienTai('users')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${cheDoXemHienTai === 'users' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <Users className="w-5 h-5" />
                <span>Quản lý người dùng</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-hidden">
            
            {cheDoXemHienTai === 'listings' && (
            <AdminListingsTab 
              cheDoTinDang={cheDoTinDang} datCheDoTinDang={setCheDoTinDang}
              tabHienTai={tabHienTai} datTabHienTai={setTabHienTai}
              tinDangHienTai={tinDangHienTai} sanPham={sanPhamHienTai}
              dangTai={dangTai} dangTaiThaoTac={dangTaiThaoTac}
              xuLyCapNhatTrangThai={xuLyCapNhatTrangThai} xuLyChinhSua={xuLyMoChinhSua}
              xuLyXoaTinDang={xuLyXoaTinDang}
              xuLyCapNhatTrangThaiSanPham={xuLyCapNhatTrangThaiSanPham}
              xuLyDuyetSanPham={xuLyDuyetSanPham}
              xuLyChinhSuaSanPham={xuLyMoChinhSuaSanPham}
              xuLyXoaSanPham={xuLyXoaSanPham}
              idTinDangNoiBat={idTinDangNoiBat} layChuCaiDau={layChuCaiDau} dinhDangNgay={dinhDangNgay}
              thongKeTinDang={thongKeTinDang}
              tinDangDangSua={tinDangDangSua} datTinDangDangSua={setTinDangDangSua}
              bieuMauSua={bieuMauSua} datBieuMauSua={setBieuMauSua} xuLyLuuChinhSua={xuLyLuuChinhSua}
              sanPhamDangSua={sanPhamDangSua} datSanPhamDangSua={setSanPhamDangSua}
              bieuMauSuaSanPham={bieuMauSuaSanPham} datBieuMauSuaSanPham={setBieuMauSuaSanPham} xuLyLuuChinhSuaSanPham={xuLyLuuChinhSuaSanPham}
              datIdTinDangNoiBat={setIdTinDangNoiBat} chuyenTrang={onNavigate}
            />
          )}

            {cheDoXemHienTai === 'users' && (
            <AdminUsersTab 
              nguoiDungDangSua={nguoiDungDangSua} datNguoiDungDangSua={setNguoiDungDangSua}
              bieuMauSuaNguoiDung={bieuMauSuaNguoiDung} datBieuMauSuaNguoiDung={setBieuMauSuaNguoiDung} xuLyLuuChinhSuaNguoiDung={xuLyLuuChinhSuaNguoiDung}
              nguoiDungDangXem={nguoiDungDangXem}
              boLocNguoiDung={boLocNguoiDung} datBoLocNguoiDung={setBoLocNguoiDung}
              nguoiDungHienTai={nguoiDungHienTai} thongKeNguoiDung={thongKeNguoiDung}
              dangTai={dangTai} dangTaiThaoTac={dangTaiThaoTac}
              xuLyChinhSuaNguoiDung={xuLyMoChinhSuaNguoiDung} xuLyXoaNguoiDung={xuLyXoaNguoiDung}
              datNguoiDungDangXem={setNguoiDungDangXem}
              layChuCaiDau={layChuCaiDau} dinhDangNgay={dinhDangNgay}
            />
          )}

            {cheDoXemHienTai === 'dashboard' && (
            <AdminDashboardTab datCheDoXem={setCheDoXemHienTai} datCheDoTinDang={setCheDoTinDang} 
              tongQuanThongKe={tongQuanThongKe} 
              dangTai={dangTai} 
            />
          )}
        </main>
      </div>

      {/* MODAL XÁC NHẬN TOÀN CỤC */}
      {modalXacNhan.isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden"
          >
            <div className={`p-6 ${modalXacNhan.type === 'danger' ? 'bg-red-50' : 'bg-orange-50'}`}>
              <div className="flex items-center gap-3 mb-2">
                {modalXacNhan.type === 'danger' ? (
                  <Trash2 className="w-6 h-6 text-red-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                )}
                <h3 className="text-lg font-bold text-slate-900">{modalXacNhan.title}</h3>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">{modalXacNhan.message}</p>
            </div>
            <div className="p-4 bg-white flex justify-end gap-3">
              <button 
                onClick={() => setModalXacNhan(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={() => {
                  modalXacNhan.onConfirm();
                  setModalXacNhan(prev => ({ ...prev, isOpen: false }));
                }}
                className={`px-6 py-2 text-sm font-bold text-white rounded-xl shadow-lg transition-transform active:scale-95 ${
                  modalXacNhan.type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary-hover'
                }`}
              >
                Xác nhận
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
