import { OverviewTab } from '../components/manage/OverviewTab';
import { RoomsTab } from '../components/manage/RoomsTab';
import { TenantsTab } from '../components/manage/TenantsTab';
import { InvoicesTab } from '../components/manage/InvoicesTab';
import { ListingsTab } from '../components/manage/ListingsTab';
import { ContractsTab } from '../components/manage/ContractsTab';
import { SupportTab } from '../components/manage/SupportTab';
import { MessagesTab } from '../components/manage/MessagesTab';
import { AccountTab } from '../components/manage/AccountTab';
import { AddRoomModal } from '../components/manage/modals/AddRoomModal';
import { EditRoomModal } from '../components/manage/modals/EditRoomModal';
import { AddListingModal } from '../components/manage/modals/AddListingModal';
import { RoomDetailModal } from '../components/manage/modals/RoomDetailModal';
import { DeleteConfirmModal } from '../components/manage/modals/DeleteConfirmModal';
import { CreateInvoiceModal } from '../components/manage/modals/CreateInvoiceModal';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import Messaging from '../components/shared/Messaging';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard, 
  Home as HomeIcon, 
  FileText, 
  MessageSquare, 
  User, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Bed,
  Wallet,
  ChevronRight,
  LogOut,
  Home,
  Filter,
  ArrowUpDown,
  Maximize2,
  Users,
  MoreVertical,
  Construction,
  Info,
  Layers,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  ChevronLeft,
  Search,
  FileClock,
  Settings,
  Edit3,
  Phone,
  Video,
  PlusCircle,
  Image as ImageIcon,
  Smile,
  Send,
  MoreHorizontal,
  ShieldAlert,
  Ban,
  Mail,
  PhoneCall,
  MessageCircle,
  Shield,
  Lock as LockIcon,
  Camera,
  MapPin,
  Eye,
  EyeOff,
  BadgeCheck,
  X,
  Sparkles,
  ArrowLeft,
  Trash2,
  Zap,
  Droplets,
  ShieldCheck,
  Wrench,
  Calendar
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface ManagePageProps {
  onNavigate: (page: string, params?: any) => void;
  user: SupabaseUser | null;
  onLogout: () => void;
  initialParams?: any;
}



export const ManagePage = ({ onNavigate, user, onLogout, initialParams }: ManagePageProps) => {
  // Get tab from URL or LocalStorage or fallback to initialParams or 'overview'
  const getInitialTab = () => {
    const params = new URLSearchParams(window.location.search);
    const urlTab = params.get('tab');
    if (urlTab) return urlTab;

    const savedTab = localStorage.getItem('last_manage_tab');
    return savedTab || initialParams?.tab || 'overview';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  
  // Update URL and LocalStorage when tab changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    window.history.replaceState({}, '', url.toString());
    
    localStorage.setItem('last_manage_tab', activeTab);
  }, [activeTab]);

  const [roomFilter, setRoomFilter] = useState('all');
  const [contractFilter, setContractFilter] = useState(initialParams?.filter || 'all');
  const [activeChat, setActiveChat] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // Real data states
  const [roomsData, setRoomsData] = useState<any[]>([]);
  const [contractsData, setContractsData] = useState<any[]>([]);
  const [invoicesData, setInvoicesData] = useState<any[]>([]);
  const [listingsData, setListingsData] = useState<any[]>([]);
  const [supportRequestsData, setSupportRequestsData] = useState<any[]>([]);

  // Add Room Modal states
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [addRoomStep, setAddRoomStep] = useState<1 | 2>(1);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [addingRoom, setAddingRoom] = useState(false);
  const [newRoomForm, setNewRoomForm] = useState({
    title: '',
    price: '',
    type: 'Phòng trọ',
    area: '',
    status: 'empty',
    note: '',
    image_url: '',
    tenant_id: '',
    electricity_price: 3500,
    water_price: 20000,
    service_fee: 150000,
    initial_electricity_number: 0,
    initial_water_number: 0,
    tenant_deposit: '',
    tenant_start_date: new Date().toISOString().split('T')[0],
    tenant_end_date: (() => { const d = new Date(); d.setFullYear(d.getFullYear() + 1); return d.toISOString().split('T')[0]; })()
  });

  // Add Listing Modal states
  const [showAddListingModal, setShowAddListingModal] = useState(false);
  const [addingListing, setAddingListing] = useState(false);
  const [listingForm, setListingForm] = useState({
    title: '', description: '', price: '', area: '', type: 'Phòng trọ',
    location: '', street: '', image_url: '',
    electricity_price: 3500, water_price: 20000, service_fee: 150000, deposit: ''
  });

  // Edit Room Modal states
  const [showEditRoomModal, setShowEditRoomModal] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [savingRoomEdit, setSavingRoomEdit] = useState(false);
  const [editRoomForm, setEditRoomForm] = useState({
    title: '',
    price: '',
    type: 'Phòng trọ',
    area: '',
    status: 'empty',
    note: '',
    image_url: '',
    electricity_price: 3500,
    water_price: 20000,
    service_fee: 150000,
    initial_electricity_number: 0,
    initial_water_number: 0
  });

  // Delete Room Confirm Modal states
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<{id: string, title: string} | null>(null);
  const [isDeletingRoom, setIsDeletingRoom] = useState(false);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState('');

  // Room Detail Modal states
  const [showRoomDetailModal, setShowRoomDetailModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  // Tenant phone search states
  const [searchPhone, setSearchPhone] = useState('');
  const [searchingTenant, setSearchingTenant] = useState(false);
  const [foundTenant, setFoundTenant] = useState<any>(null);
  const [searchError, setSearchError] = useState('');

  // Tenant management states
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [showTenantProfile, setShowTenantProfile] = useState(false);

  // Invoices
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [addingInvoice, setAddingInvoice] = useState(false);
  const [preSelectedRoomForInvoice, setPreSelectedRoomForInvoice] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingContracts, setLoadingContracts] = useState(false);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [loadingListings, setLoadingListings] = useState(false);
  const [loadingSupport, setLoadingSupport] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true); // Initial load still shows a quick pulse if needed, but we'll try to keep it light
      
      // Fetch everything independently
      Promise.all([
        fetchRooms(),
        fetchContracts(),
        fetchInvoices(),
        fetchListings(),
        fetchSupportRequests()
      ]).finally(() => setLoading(false));
    }
  }, [user]);

  const fetchRooms = async () => {
    setLoadingRooms(true);
    try {
      const { data } = await supabase.from('rooms').select('*, contracts(tenant_id, status)').eq('owner_id', user?.id);
      setRoomsData(data || []);
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoadingRooms(false);
    }
  };

  const fetchContracts = async () => {
    setLoadingContracts(true);
    try {
      const { data } = await supabase.from('contracts').select('*, profiles!contracts_tenant_id_fkey(full_name, avatar_url, phone, gender, birth_date, permanent_address, id_card_number, id_card_date, id_card_place, zalo_phone, bank_name, bank_account_number, bank_account_name, emergency_contact_name, emergency_contact_phone), rooms(title)').eq('owner_id', user?.id);
      setContractsData(data || []);
    } catch (err) {
      console.error('Error fetching contracts:', err);
    } finally {
      setLoadingContracts(false);
    }
  };

  const fetchInvoices = async () => {
    setLoadingInvoices(true);
    try {
      const { data } = await supabase.from('invoices').select('*, profiles!invoices_tenant_id_fkey(full_name, avatar_url, phone), rooms(title)').eq('owner_id', user?.id);
      setInvoicesData(data || []);
    } catch (err) {
      console.error('Error fetching invoices:', err);
    } finally {
      setLoadingInvoices(false);
    }
  };

  const fetchListings = async () => {
    setLoadingListings(true);
    try {
      const { data } = await supabase.from('listings').select('*').eq('owner_id', user?.id);
      setListingsData(data || []);
    } catch (err) {
      console.error('Error fetching listings:', err);
    } finally {
      setLoadingListings(false);
    }
  };

  const fetchSupportRequests = async () => {
    setLoadingSupport(true);
    try {
      const { data: supportRequests, error: supportError } = await supabase
        .from('support_requests')
        .select('*, rooms(title)')
        .eq('landlord_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (supportRequests && supportRequests.length > 0) {
        const tenantIds = [...new Set(supportRequests.map(req => req.tenant_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, phone')
          .in('id', tenantIds);
          
        const mappedRequests = supportRequests.map(req => ({
          ...req,
          profiles: profilesData?.find(p => p.id === req.tenant_id) || null
        }));
        setSupportRequestsData(mappedRequests);
      } else {
        setSupportRequestsData([]);
      }
    } catch (err) {
      console.error('Error fetching support:', err);
    } finally {
      setLoadingSupport(false);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    await Promise.all([
      fetchRooms(),
      fetchContracts(),
      fetchInvoices(),
      fetchListings(),
      fetchSupportRequests()
    ]);
    setLoading(false);
  };

  const handleAddInvoice = async (invoiceData: any) => {
    setAddingInvoice(true);
    try {
      const { error } = await supabase.from('invoices').insert({
        owner_id: user?.id,
        ...invoiceData
      });
      if (error) throw error;
      
      if (invoiceData.tenant_id) {
        await supabase.from('notifications').insert({
          receiver_id: invoiceData.tenant_id,
          sender_id: user?.id,
          type: 'invoice',
          title: 'Hóa đơn mới',
          message: invoiceData.title,
          action_url: '/tenant?tab=invoices'
        });
      }
      
      setShowCreateInvoiceModal(false);
      await fetchInvoices(); // Only need to refresh invoices
    } catch (err) {
      console.error('Error creating invoice:', err);
      alert('Không thể tạo hóa đơn');
    } finally {
      setAddingInvoice(false);
    }
  };

  const handleUpdateInvoiceStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('invoices').update({ status }).eq('id', id);
      if (error) throw error;
      await fetchInvoices(); // Only need to refresh invoices
    } catch (err) {
      console.error('Error updating invoice:', err);
      alert('Không thể cập nhật hóa đơn');
    }
  };

  const openAddRoomModal = () => {
    setShowAddRoomModal(true);
    setAddRoomStep(1);
    setSelectedListingId(null);
    setNewRoomForm({ title: '', price: '', type: 'Phòng trọ', area: '', status: 'empty', note: '', image_url: '', tenant_id: '', electricity_price: 3500, water_price: 20000, service_fee: 150000, initial_electricity_number: 0, initial_water_number: 0, tenant_deposit: '', tenant_start_date: new Date().toISOString().split('T')[0], tenant_end_date: (() => { const d = new Date(); d.setFullYear(d.getFullYear() + 1); return d.toISOString().split('T')[0]; })() });
    setSearchPhone('');
    setFoundTenant(null);
    setSearchError('');
  };

  const selectListingForRoom = (listing: any) => {
    setSelectedListingId(listing.id);
    setNewRoomForm({
      title: listing.title || '',
      price: listing.price?.toString() || '',
      type: listing.type || 'Phòng trọ',
      area: listing.area?.toString() || '',
      status: 'empty',
      note: '',
      image_url: listing.image_url || (listing.images && listing.images[0]) || '',
      tenant_id: '',
      electricity_price: listing.electricity_price || 3500,
      water_price: listing.water_price || 20000,
      service_fee: listing.service_fee || 150000,
      initial_electricity_number: 0,
      initial_water_number: 0,
      tenant_deposit: listing.deposit?.toString() || listing.price?.toString() || '',
      tenant_start_date: new Date().toISOString().split('T')[0],
      tenant_end_date: (() => { const d = new Date(); d.setFullYear(d.getFullYear() + 1); return d.toISOString().split('T')[0]; })()
    });
    setAddRoomStep(2);
  };

  const skipToManualEntry = () => {
    setSelectedListingId(null);
    setNewRoomForm({ title: '', price: '', type: 'Phòng trọ', area: '', status: 'empty', note: '', image_url: '', tenant_id: '', electricity_price: 3500, water_price: 20000, service_fee: 150000, initial_electricity_number: 0, initial_water_number: 0, tenant_deposit: '', tenant_start_date: new Date().toISOString().split('T')[0], tenant_end_date: (() => { const d = new Date(); d.setFullYear(d.getFullYear() + 1); return d.toISOString().split('T')[0]; })() });
    setAddRoomStep(2);
  };

  const handleAddRoom = async () => {
    if (!newRoomForm.title || !newRoomForm.price) return;
    setAddingRoom(true);
    try {
      const roomStatus = newRoomForm.tenant_id ? 'pending' : (newRoomForm.status || 'empty');
      
      // 1. Create the room
      const { data: newRoom, error: roomError } = await supabase.from('rooms').insert({
        owner_id: user?.id,
        title: newRoomForm.title,
        price: Number(newRoomForm.price),
        type: newRoomForm.type,
        area: newRoomForm.area ? Number(newRoomForm.area) : null,
        status: roomStatus,
        note: newRoomForm.note || null,
        image_url: newRoomForm.image_url || null,
        electricity_price: Number(newRoomForm.electricity_price) || 3500,
        water_price: Number(newRoomForm.water_price) || 20000,
        service_fee: Number(newRoomForm.service_fee) || 150000,
        initial_electricity_number: Number(newRoomForm.initial_electricity_number) || 0,
        initial_water_number: Number(newRoomForm.initial_water_number) || 0
      }).select().single();
      if (roomError) throw roomError;

      // 2. Create a contract linking tenant to this room IF tenant was selected
      if (newRoom && newRoomForm.tenant_id) {
        const { data: newContract, error: contractError } = await supabase.from('contracts').insert({
          owner_id: user?.id,
          tenant_id: newRoomForm.tenant_id,
          room_id: newRoom.id,
          start_date: newRoomForm.tenant_start_date,
          end_date: newRoomForm.tenant_end_date,
          deposit: newRoomForm.tenant_deposit ? Number(newRoomForm.tenant_deposit) : 0,
          status: 'pending'
        }).select().single();

        if (contractError) {
          console.error('Error creating contract:', contractError);
        } else if (newContract) {
          // 3. Send notification to tenant
          await supabase.from('notifications').insert({
            sender_id: user?.id,
            receiver_id: newRoomForm.tenant_id,
            type: 'contract_invite',
            title: 'Yêu cầu ký hợp đồng mới',
            message: `Chủ trọ đã thêm bạn vào phòng "${newRoom.title}". Vui lòng xác nhận hợp đồng để bắt đầu thuê.`,
            related_entity_id: newContract.id,
            action_url: 'tenant?tab=overview'
          });
        }
      }

      setShowAddRoomModal(false);
      await fetchDashboardData();
    } catch (err) {
      console.error('Error adding room:', err);
      alert('Đã có lỗi xảy ra. Kiểm tra console hoặc quyền (RLS) của database.');
    } finally {
      setAddingRoom(false);
    }
  };

  // Tạo bài đăng mới - CHỈ insert vào listings, KHÔNG tạo room
  const handleAddListing = async () => {
    if (!listingForm.title || !listingForm.price) return;
    setAddingListing(true);
    try {
      const { error } = await supabase.from('listings').insert({
        owner_id: user?.id,
        title: listingForm.title,
        description: listingForm.description || null,
        price: Number(listingForm.price),
        area: listingForm.area ? Number(listingForm.area) : null,
        type: listingForm.type,
        location: listingForm.location || null,
        street: listingForm.street || null,
        image_url: listingForm.image_url || null,
        images: listingForm.image_url ? [listingForm.image_url] : [],
        electricity_price: Number(listingForm.electricity_price) || 3500,
        water_price: Number(listingForm.water_price) || 20000,
        service_fee: Number(listingForm.service_fee) || 150000,
        deposit: listingForm.deposit ? Number(listingForm.deposit) : Number(listingForm.price),
        is_active: true,
        approval_status: 'approved'
      });
      if (error) throw error;
      setShowAddListingModal(false);
      setListingForm({ title: '', description: '', price: '', area: '', type: 'Phòng trọ', location: '', street: '', image_url: '', electricity_price: 3500, water_price: 20000, service_fee: 150000, deposit: '' });
      await fetchDashboardData();
    } catch (err) {
      console.error('Error adding listing:', err);
      alert('Đã có lỗi khi tạo bài đăng.');
    } finally {
      setAddingListing(false);
    }
  };

  const handleUpdateSupportRequest = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase.from('support_requests').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setSupportRequestsData(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
    } catch (err) {
      console.error('Error updating support request:', err);
      alert('Không thể cập nhật yêu cầu. Vui lòng thử lại.');
    }
  };

  const openEditRoomModal = (roomId: string) => {
    const r = roomsData.find(x => x.id === roomId);
    if (!r) return;
    setEditingRoomId(r.id);
    setEditRoomForm({
      title: r.title || '',
      price: r.price?.toString() || '',
      type: r.type || 'Phòng trọ',
      area: r.area?.toString() || '',
      status: r.status || 'empty',
      note: r.note || '',
      image_url: r.image_url || '',
      electricity_price: r.electricity_price || 3500,
      water_price: r.water_price || 20000,
      service_fee: r.service_fee || 150000,
      initial_electricity_number: r.initial_electricity_number || 0,
      initial_water_number: r.initial_water_number || 0
    });
    setShowEditRoomModal(true);
  };

  const handleSaveRoomEdit = async () => {
    if (!editingRoomId || !editRoomForm.title || !editRoomForm.price) return;
    setSavingRoomEdit(true);
    try {
      const { error } = await supabase.from('rooms').update({
        title: editRoomForm.title,
        price: Number(editRoomForm.price),
        type: editRoomForm.type,
        area: editRoomForm.area ? Number(editRoomForm.area) : null,
        status: editRoomForm.status,
        note: editRoomForm.note || null,
        image_url: editRoomForm.image_url || null,
        electricity_price: Number(editRoomForm.electricity_price) || 3500,
        water_price: Number(editRoomForm.water_price) || 20000,
        service_fee: Number(editRoomForm.service_fee) || 150000,
        initial_electricity_number: Number(editRoomForm.initial_electricity_number) || 0,
        initial_water_number: Number(editRoomForm.initial_water_number) || 0
      }).eq('id', editingRoomId);
      
      if (error) throw error;
      
      setShowEditRoomModal(false);
      await fetchDashboardData();
    } catch (err) {
      console.error('Error updating room:', err);
      alert('Đã có lỗi khi cập nhật phòng.');
    } finally {
      setSavingRoomEdit(false);
    }
  };

  const searchTenantByPhone = async () => {
    if (!searchPhone.trim()) return;
    setSearchingTenant(true);
    setSearchError('');
    setFoundTenant(null);
    setNewRoomForm(f => ({ ...f, tenant_id: '' }));
    try {
      // Search in profiles table by phone
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone, avatar_url, role')
        .eq('phone', searchPhone.trim())
        .single();

      if (error || !profile) {
        setSearchError('Không tìm thấy người dùng với số điện thoại này. Vui lòng kiểm tra lại.');
        return;
      }

      // Check if this tenant already has an active contract (room assigned)
      const { data: activeContract } = await supabase
        .from('contracts')
        .select('id, rooms(title)')
        .eq('tenant_id', profile.id)
        .eq('status', 'active')
        .eq('owner_id', user?.id)
        .single();

      if (activeContract) {
        const roomName = (activeContract as any).rooms?.title || 'một phòng';
        setSearchError(`Người thuê này đã được gán vào "${roomName}". Mỗi số điện thoại chỉ được thuê 1 phòng.`);
        return;
      }

      setFoundTenant(profile);
      setNewRoomForm(f => ({ ...f, tenant_id: profile.id }));
    } catch (err) {
      console.error('Error searching tenant:', err);
      setSearchError('Đã có lỗi xảy ra khi tìm kiếm.');
    } finally {
      setSearchingTenant(false);
    }
  };

  const handleDeleteRoom = (roomId: string, roomTitle: string) => {
    setRoomToDelete({ id: roomId, title: roomTitle });
    setShowDeleteConfirmModal(true);
  };

  const executeDeleteRoom = async () => {
    if (!roomToDelete) return;
    setIsDeletingRoom(true);
    try {
      const roomId = roomToDelete.id;

      // Sử dụng RPC function đã tạo để xóa dọn dẹp toàn bộ dữ liệu liên quan trong một transaction
      const { error } = await supabase.rpc('delete_room_cascade', {
        target_room_id: roomId,
        target_owner_id: user?.id
      });

      if (error) throw error;
      
      await fetchDashboardData();
      setShowDeleteConfirmModal(false);
      
      // Hiện Toast Message đẹp
      setDeleteSuccessMessage(`Đã xóa thành công phòng "${roomToDelete.title}".`);
      setTimeout(() => setDeleteSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting room:', err);
      // Nếu vẫn lỗi, khả năng cao là do chính sách RLS hoặc dữ liệu đặc biệt chưa được dọn dẹp hết
      alert('Không thể xóa phòng. Phòng có thể đang gắn với dữ liệu không thể dọn dẹp tự động. Vui lòng liên hệ hỗ trợ hoặc kiểm tra lại các hợp đồng đang hoạt động.');
    } finally {
      setIsDeletingRoom(false);
      setRoomToDelete(null);
    }
  };
  const handleViewProfile = (tenant: any) => {
    setSelectedTenant(tenant);
    setShowTenantProfile(true);
  };

  const [sendingProfileReminder, setSendingProfileReminder] = useState(false);
  const [profileReminderSent, setProfileReminderSent] = useState(false);

  const handleRequestProfileUpdate = async (tenant: any) => {
    if (!user || !tenant?.id) return;
    setSendingProfileReminder(true);
    try {
      // Detect which fields are missing
      const missingFields: string[] = [];
      if (!tenant.id_card_number) missingFields.push('Số CCCD/CMND');
      if (!tenant.permanent_address) missingFields.push('Địa chỉ thường trú');
      if (!tenant.birth_date) missingFields.push('Ngày sinh');
      if (!tenant.emergency_contact_name) missingFields.push('Tên người thân khẩn cấp');
      if (!tenant.emergency_contact_phone) missingFields.push('SĐT người thân khẩn cấp');

      const missingText = missingFields.length > 0
        ? `Thông tin còn thiếu: ${missingFields.join(', ')}.`
        : 'Vui lòng cập nhật đầy đủ thông tin hồ sơ.';

      const { error } = await supabase.from('notifications').insert({
        sender_id: user.id,
        receiver_id: tenant.id,
        type: 'profile_update_request',
        title: 'Yêu cầu cập nhật thông tin cá nhân',
        message: `Chủ trọ yêu cầu bạn bổ sung hồ sơ để hoàn tất thủ tục thuê phòng. ${missingText} Vui lòng vào mục Tài khoản để cập nhật.`,
        action_url: 'tenant?tab=account'
      });

      if (!error) {
        setProfileReminderSent(true);
        setTimeout(() => setProfileReminderSent(false), 4000);
      }
    } catch (err) {
      console.error('Error sending profile reminder:', err);
    } finally {
      setSendingProfileReminder(false);
    }
  };

  const calculateMonthlyRevenue = () => {
    // Generate all 12 months for the selected year
    const yearNum = Number(selectedYear);
    const months = [];
    
    for (let i = 0; i < 12; i++) {
      months.push({
        month: i + 1,
        year: yearNum,
        label: `T${i + 1}`,
        revenue: 0
      });
    }

    // Filter paid invoices for the selected year
    const paidInvoices = invoicesData.filter(inv => 
      inv.status === 'paid' && 
      new Date(inv.due_date).getFullYear().toString() === selectedYear
    );

    // Aggregate revenue to matching months
    paidInvoices.forEach(inv => {
      // Use string split for date to avoid timezone shifts (format: YYYY-MM-DD or ISO)
      const dateStr = inv.due_date || inv.created_at;
      if (!dateStr) return;
      
      const dateParts = dateStr.split(/[-T ]/);
      const invYear = parseInt(dateParts[0]);
      const invMonth = parseInt(dateParts[1]); // 1-indexed
      
      const targetMonth = months.find(m => m.month === invMonth && m.year === invYear);
      if (targetMonth) {
        targetMonth.revenue += Number(inv.amount);
      }
    });

    // Calculate chart height relative to max revenue
    const maxRevenue = Math.max(...months.map(m => m.revenue), 1000000);
    
    return months.map(m => ({
      ...m,
      height: m.revenue > 0 ? Math.max((m.revenue / maxRevenue) * 100, 10) : 5,
      displayValue: (m.revenue / 1000000).toFixed(1) + 'M'
    }));
  };

  const chartData = calculateMonthlyRevenue();

  interface NavItem {
    id: string;
    label: string;
    icon: any;
    badge?: number | string;
  }

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'rooms', label: 'Danh sách phòng', icon: HomeIcon },
    { id: 'tenants', label: 'Người thuê', icon: Users },
    { id: 'contracts', label: 'Hợp đồng', icon: FileText },
    { id: 'invoices', label: 'Hóa đơn', icon: Wallet },
    { id: 'support', label: 'Yêu cầu hỗ trợ', icon: Wrench },
    { id: 'listings', label: 'Bài đăng', icon: ImageIcon },
    { id: 'messages', label: 'Tin nhắn', icon: MessageSquare },
    { id: 'account', label: 'Tài khoản', icon: User },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <div className="p-6 flex-1">
            <div className="flex items-center gap-3 text-primary mb-8">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 font-display">Chủ Trọ</h2>
            </div>
            
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                    activeTab === item.id 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              ))}
            </nav>
          </div>

        </aside>

        {/* Main Content */}
        <main className={`flex-1 flex flex-col ${activeTab === 'messages' ? '' : 'p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full'}`}>
          {activeTab === 'overview' && (
            loading ? (
              <div className="h-64 flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
            ) : (
              <OverviewTab 
                user={user} 
                roomsData={roomsData} 
                invoicesData={invoicesData} 
                listingsData={listingsData} 
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                chartData={chartData} 
              />
            )
          )}

          {activeTab === 'rooms' && (
            <RoomsTab
              roomsData={roomsData}
              contractsData={contractsData}
              listingsData={listingsData}
              roomFilter={roomFilter}
              setRoomFilter={setRoomFilter}
              openAddRoomModal={openAddRoomModal}
              openEditRoomModal={openEditRoomModal}
              handleDeleteRoom={handleDeleteRoom}
              setSelectedRoom={setSelectedRoom}
              setShowRoomDetailModal={setShowRoomDetailModal}
              loading={loading}
            />
          )}

          {activeTab === 'tenants' && (
            <TenantsTab
              contractsData={contractsData}
              setActiveTab={setActiveTab}
              loading={loading}
            />
          )}

          {activeTab === 'invoices' && (
            <InvoicesTab 
              invoicesData={invoicesData} 
              roomsData={roomsData}
              contractsData={contractsData}
              onOpenCreateInvoice={(roomId: string | null = null) => {
                setPreSelectedRoomForInvoice(roomId);
                setShowCreateInvoiceModal(true);
              }}
              onCreateInvoice={handleAddInvoice}
              onUpdateStatus={handleUpdateInvoiceStatus}
            />
          )}

          {activeTab === 'listings' && (
            <ListingsTab
              listingsData={listingsData}
              setShowAddListingModal={setShowAddListingModal}
            />
          )}

          {activeTab === 'contracts' && (
            <ContractsTab contractsData={contractsData} />
          )}

          {activeTab === 'support' && (
            <SupportTab
              supportRequestsData={supportRequestsData}
              handleUpdateSupportRequest={handleUpdateSupportRequest}
            />
          )}

          {activeTab === 'messages' && (
            <MessagesTab user={user} />
          )}




          {activeTab === 'account' && (
            <AccountTab
              user={user}
              roomsData={roomsData}
              contractsData={contractsData}
              supabase={supabase}
            />
          )}

          {activeTab !== 'overview' && activeTab !== 'rooms' && activeTab !== 'contracts' && activeTab !== 'messages' && activeTab !== 'account' && activeTab !== 'tenants' && activeTab !== 'invoices' && activeTab !== 'listings' && activeTab !== 'support' && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
                <Construction className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Tính năng đang phát triển</h3>
              <p className="text-slate-500 max-w-xs">Chúng tôi đang nỗ lực hoàn thiện tính năng này. Vui lòng quay lại sau!</p>
            </div>
          )}
        </main>
      </div>

      <CreateInvoiceModal
        show={showCreateInvoiceModal}
        onClose={() => {
          setShowCreateInvoiceModal(false);
          setPreSelectedRoomForInvoice(null);
        }}
        roomsData={roomsData}
        preSelectedRoomId={preSelectedRoomForInvoice}
        onCreate={handleAddInvoice}
        loading={addingInvoice}
      />

      <AddRoomModal 
        show={showAddRoomModal}
        onClose={() => setShowAddRoomModal(false)}
        step={addRoomStep}
        setStep={setAddRoomStep}
        listings={listingsData}
        onSelectListing={selectListingForRoom}
        onSkipToManual={skipToManualEntry}
        form={newRoomForm}
        setForm={setNewRoomForm}
        onSubmit={handleAddRoom}
        loading={addingRoom}
        searchPhone={searchPhone}
        setSearchPhone={setSearchPhone}
        onSearchTenant={searchTenantByPhone}
        searchingTenant={searchingTenant}
        foundTenant={foundTenant}
        searchError={searchError}
      />

      <EditRoomModal
        show={showEditRoomModal}
        onClose={() => setShowEditRoomModal(false)}
        form={editRoomForm}
        setForm={setEditRoomForm}
        onSubmit={handleSaveRoomEdit}
        loading={savingRoomEdit}
      />
      <AddListingModal
        show={showAddListingModal}
        onClose={() => setShowAddListingModal(false)}
        form={listingForm}
        setForm={setListingForm}
        onSubmit={handleAddListing}
        loading={addingListing}
      />
      <DeleteConfirmModal
        show={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={executeDeleteRoom}
        title="Xóa phòng?"
        itemName={roomToDelete?.title || ""}
        loading={isDeletingRoom}
      />

      <RoomDetailModal
        show={showRoomDetailModal}
        room={selectedRoom}
        onClose={() => setShowRoomDetailModal(false)}
        onEdit={openEditRoomModal}
        onDelete={handleDeleteRoom}
        onNavigateToTab={setActiveTab}
        onCreateListing={(room) => {
          setListingForm(f => ({
            ...f,
            title: `Phòng ${room.title} - ${room.type}`,
            price: (room.price_raw || 0).toString(),
            area: (room.area_raw || 0).toString(),
            type: room.type,
            electricity_price: room.electricity_price || 3500,
            water_price: room.water_price || 20000,
            service_fee: room.service_fee || 150000
          }));
          setShowRoomDetailModal(false);
          setShowAddListingModal(true);
        }}
      />
    </div>
  );
};
