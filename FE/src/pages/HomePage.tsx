import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';

import { 
  Home, 
  Search, 
  MapPin, 
  ArrowRight, 
  Square, 
  ChevronDown,
  Phone,
  Crown,
  Sparkles
} from 'lucide-react';
import { listings, areas } from '../constants';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { ListingCardSkeleton } from '../components/shared/SharedSkeletons';

export const HomePage = ({ 
  onNavigate, 
  user, 
  role,
  onLogout 
}: { 
  onNavigate: (page: string, params?: any) => void,
  user: SupabaseUser | null,
  role: string | null,
  onLogout: () => void
}) => {
  const [realListings, setRealListings] = useState<any[]>([]);
  const [featuredListings, setFeaturedListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchLocation, setSearchLocation] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [roomType, setRoomType] = useState('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const districts = ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu', 'Cẩm Lệ', 'Hòa Vang'];

  useEffect(() => {
    if (role === 'admin') {
      onNavigate('admin');
      return;
    }
    fetchListings();
  }, [role]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('id, title, price, area, location, image_url, created_at, profiles(subscription_tier, full_name, avatar_url)')
        .eq('is_active', true)
        .eq('approval_status', 'approved');

      if (error) throw error;

      // Premium prioritizing order: enterprise -> pro -> free, then sort by newest
      const sortedData = (data || []).sort((a: any, b: any) => {
        const tierA = a.profiles?.subscription_tier || 'free';
        const tierB = b.profiles?.subscription_tier || 'free';
        
        const priority: Record<string, number> = {
          'enterprise': 3,
          'pro': 2,
          'free': 1
        };
        
        const prioA = priority[tierA] || 1;
        const prioB = priority[tierB] || 1;
        
        if (prioB !== prioA) {
          return prioB - prioA;
        }
        
        // If equal priority, sort by newest created_at
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      // Featured = pro + enterprise only
      const onlyFeatured = (data || [])
        .filter((item: any) => ['pro', 'enterprise'].includes(item.profiles?.subscription_tier))
        .sort((a: any, b: any) => {
          const ta = a.profiles?.subscription_tier || 'free';
          const tb = b.profiles?.subscription_tier || 'free';
          const p: Record<string, number> = { enterprise: 2, pro: 1, free: 0 };
          if ((p[tb] || 0) !== (p[ta] || 0)) return (p[tb] || 0) - (p[ta] || 0);
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
      setFeaturedListings(onlyFeatured.slice(0, 8));

      // Regular = free only
      const onlyFree = (data || [])
        .filter((item: any) => !['pro', 'enterprise'].includes(item.profiles?.subscription_tier))
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setRealListings(onlyFree.slice(0, 8));
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    onNavigate('search', {
      location: searchLocation,
      price: priceRange,
      type: roomType
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  } as const;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full min-h-[680px] lg:h-[680px] py-16 lg:py-0 flex items-center bg-[#0B0F19] overflow-hidden bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] bg-center">
          {/* Ambient Glows */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.08),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.05),transparent_40%)] pointer-events-none" />
          
          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Title, Description, Stats & Search Bar */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Title Heading */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.15] font-display text-left tracking-tight"
              >
                Tìm phòng trọ<br/>
                <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">Nhanh</span> • Đúng • <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">Tin cậy</span>
              </motion.h1>

              {/* Subheading description */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 max-w-xl text-left font-semibold"
              >
                Hàng nghìn phòng trọ, chung cư mini, nhà nguyên căn được đăng mới mỗi ngày. Xem bản đồ thực tế, liên hệ trực tiếp chủ nhà — không qua trung gian.
              </motion.p>

              {/* Cohesive Dark Search Bar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                className="bg-slate-900/60 backdrop-blur-md p-2.5 rounded-2xl border border-slate-800/85 flex flex-col md:flex-row gap-2.5 w-full shadow-2xl"
              >
                {/* Location Selector */}
                <div
                  className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-slate-800/80 relative cursor-pointer group py-2 hover:bg-slate-800/30 rounded-xl transition-colors duration-200"
                  onClick={() => {
                    setShowSuggestions(!showSuggestions);
                    setShowPriceDropdown(false);
                    setShowTypeDropdown(false);
                  }}
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary mr-3 group-hover:scale-105 transition-transform shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Địa điểm</p>
                    <p className="text-xs md:text-sm font-bold text-slate-200 truncate">
                      {searchLocation || 'Tất cả khu vực'}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 shrink-0 ${showSuggestions ? '' : 'rotate-180'}`} />

                  {/* Suggestions Dropdown */}
                  {showSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-0 mt-3 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 py-3 z-50 overflow-hidden text-left"
                    >
                      <p className="px-5 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-950/40">Khu vực Đà Nẵng</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearchLocation('');
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-5 py-3 text-xs md:text-sm font-bold text-slate-400 hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-3"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                        Tất cả khu vực
                      </button>
                      {districts.map((district) => (
                        <button
                          key={district}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSearchLocation(district);
                            setShowSuggestions(false);
                          }}
                          className="w-full text-left px-5 py-3 text-xs md:text-sm font-bold text-slate-200 hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-3"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${searchLocation === district ? 'bg-primary' : 'bg-slate-700'}`}></div>
                          {district}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Price Selector */}
                <div
                  className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-slate-800/80 py-2 group relative cursor-pointer hover:bg-slate-800/30 rounded-xl transition-colors duration-200"
                  onClick={() => {
                    setShowPriceDropdown(!showPriceDropdown);
                    setShowSuggestions(false);
                    setShowTypeDropdown(false);
                  }}
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary mr-3 group-hover:scale-105 transition-transform shrink-0">
                    <Search className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Khoảng giá</p>
                    <p className="text-xs md:text-sm font-bold text-slate-200 truncate">
                      {priceRange === 'all' ? 'Tất cả mức giá' :
                       priceRange === 'under2' ? 'Dưới 2 triệu' :
                       priceRange === '2to5' ? '2 - 5 triệu' : 'Trên 5 triệu'}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 shrink-0 ${showPriceDropdown ? '' : 'rotate-180'}`} />

                  {/* Price Dropdown */}
                  {showPriceDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-0 mt-3 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 py-3 z-50 overflow-hidden text-left"
                    >
                      {[
                        { id: 'all', label: 'Tất cả mức giá' },
                        { id: 'under2', label: 'Dưới 2 triệu' },
                        { id: '2to5', label: '2 - 5 triệu' },
                        { id: 'over5', label: 'Trên 5 triệu' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPriceRange(item.id);
                            setShowPriceDropdown(false);
                          }}
                          className="w-full text-left px-5 py-3 text-xs md:text-sm font-bold text-slate-200 hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-3"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${priceRange === item.id ? 'bg-primary' : 'bg-slate-700'}`}></div>
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Type Selector */}
                <div
                  className="flex-1 flex items-center px-4 py-2 group relative cursor-pointer hover:bg-slate-800/30 rounded-xl transition-colors duration-200"
                  onClick={() => {
                    setShowTypeDropdown(!showTypeDropdown);
                    setShowSuggestions(false);
                    setShowPriceDropdown(false);
                  }}
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary mr-3 group-hover:scale-105 transition-transform shrink-0">
                    <Home className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Loại phòng</p>
                    <p className="text-xs md:text-sm font-bold text-slate-200 truncate">
                      {roomType === 'all' ? 'Tất cả loại' : roomType}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 shrink-0 ${showTypeDropdown ? '' : 'rotate-180'}`} />

                  {/* Type Dropdown */}
                  {showTypeDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-0 mt-3 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 py-3 z-50 overflow-hidden text-left"
                    >
                      {[
                        { id: 'all', label: 'Tất cả loại' },
                        { id: 'Phòng trọ', label: 'Phòng trọ' },
                        { id: 'Căn hộ', label: 'Căn hộ mini' },
                        { id: 'Nhà nguyên căn', label: 'Nhà nguyên căn' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setRoomType(item.id);
                            setShowTypeDropdown(false);
                          }}
                          className="w-full text-left px-5 py-3 text-xs md:text-sm font-bold text-slate-200 hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-3"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${roomType === item.id ? 'bg-primary' : 'bg-slate-700'}`}></div>
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Search Action Button */}
                <button
                  onClick={handleSearch}
                  className="bg-primary text-white font-black uppercase tracking-widest text-xs px-8 py-4 rounded-xl hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-500/10 active:scale-95 duration-200 shrink-0 md:w-auto w-full"
                >
                  <Search className="w-4 h-4" />
                  Tìm kiếm
                </button>
              </motion.div>

              {/* Stats Block - Centered */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex items-center justify-center lg:justify-start mt-10 border-t border-slate-800/60 pt-8 w-full"
              >
                <div>
                  <p className="text-3xl font-black bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent font-display text-center lg:text-left">Đăng tin miễn phí</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 text-center lg:text-left">Dành cho chủ trọ đăng bài tìm kiếm người thuê</p>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Floating Mockup Cards */}
            <div className="lg:col-span-5 hidden lg:flex items-center justify-center relative select-none">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative max-w-sm w-full group cursor-default"
              >
                {/* Glow behind card */}
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-3xl opacity-30 group-hover:opacity-40 transition-opacity duration-500" />
                
                {/* Main Room Card */}
                <div className="relative bg-white rounded-3xl p-4 shadow-2xl border border-slate-100/10 overflow-hidden transform group-hover:-translate-y-1 transition-all duration-300">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                    <img
                      alt="Mockup room"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-left px-1">
                    <div className="flex items-center text-primary font-black mb-1.5">
                      <span className="text-lg">3.600.000đ</span>
                      <span className="text-xs font-bold text-slate-400 ml-1">/tháng</span>
                    </div>
                    <h3 className="font-black text-slate-900 text-sm line-clamp-2 leading-snug font-display mb-3">
                      🏠 CHO THUÊ TRỌ GẦN ĐẠI HỌC DUY TÂN
                    </h3>
                    <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        Quận Hải Châu
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Square className="w-3.5 h-3.5 text-orange-500" />
                        27.00 m²
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Badge 1: Top Right - Mới đăng */}
                <div className="absolute -top-6 -right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-100 flex items-center gap-2 group-hover:scale-105 transition-transform duration-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div className="text-left leading-none">
                    <p className="text-[9px] font-black text-slate-900">Mới đăng</p>
                    <p className="text-[7.5px] font-bold text-slate-400 mt-0.5">1 tuần trước</p>
                  </div>
                </div>

                {/* Floating Badge 2: Mid Right - Đã xác minh */}
                <div className="absolute top-[60%] -right-12 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-100 flex items-center gap-2.5 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-xs shrink-0 select-none">
                    ✓
                  </div>
                  <div className="text-left leading-none">
                    <p className="text-[9px] font-black text-slate-900">Đã xác minh</p>
                    <p className="text-[7.5px] font-bold text-slate-400 mt-0.5">Chủ nhà uy tín</p>
                  </div>
                </div>

                {/* Floating Badge 3: Bottom Left - Gần trường */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-100 flex items-center gap-2.5 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 select-none">
                    <Home className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left leading-none">
                    <p className="text-[9px] font-black text-slate-900">Gần trường</p>
                    <p className="text-[7.5px] font-bold text-slate-400 mt-0.5">Dưới 1km đi bộ</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Curved wave bottom separator */}
          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0] z-10 translate-y-[1px]">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[60px] fill-white">
              <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-slate-50/10"></path>
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,53.05,22,79.66,34.79,157.65,72.23,243.39,60.54,321.39,56.44Z" className="fill-white"></path>
            </svg>
          </div>
        </section>

        {/* ── 3 Steps Guide Section ── */}
        <section className="py-20 bg-slate-50/30 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 text-center">
            {/* Header animation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Badge */}
              <div className="inline-block px-3.5 py-1 bg-orange-100/60 rounded-full mb-4 border border-orange-200/20">
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-primary font-display">ĐƠN GIẢN</span>
              </div>
              
              {/* Heading */}
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 font-display">
                Tìm phòng chỉ <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">3 bước</span>
              </h2>
              
              {/* Subheading */}
              <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
                Không phức tạp, không qua trung gian, liên hệ trực tiếp chủ nhà
              </p>
            </motion.div>

            {/* Steps Cards Grid with stagger animation */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-14 max-w-6xl mx-auto text-left"
            >
              {/* Step 1 */}
              <motion.div 
                variants={itemVariants}
                className="relative bg-white rounded-3xl p-8 md:p-10 border border-slate-100/80 shadow-lg shadow-slate-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
              >
                <span className="absolute top-4 right-6 text-5xl font-black text-orange-500/10 font-display select-none group-hover:scale-110 transition-transform duration-300">01</span>
                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2 font-display">Tìm kiếm</h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                  Nhập địa chỉ, chọn loại phòng và khoảng giá phù hợp với bạn
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                variants={itemVariants}
                className="relative bg-white rounded-3xl p-8 md:p-10 border border-slate-100/80 shadow-lg shadow-slate-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
              >
                <span className="absolute top-4 right-6 text-5xl font-black text-purple-500/10 font-display select-none group-hover:scale-110 transition-transform duration-300">02</span>
                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2 font-display">Xem bản đồ</h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                  Xem vị trí thực tế trên bản đồ, kiểm tra tiện ích xung quanh
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div 
                variants={itemVariants}
                className="relative bg-white rounded-3xl p-8 md:p-10 border border-slate-100/80 shadow-lg shadow-slate-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
              >
                <span className="absolute top-4 right-6 text-5xl font-black text-emerald-500/10 font-display select-none group-hover:scale-110 transition-transform duration-300">03</span>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2 font-display">Liên hệ ngay</h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                  Gọi điện hoặc nhắn tin trực tiếp cho chủ nhà, không qua trung gian
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── Featured (Pro + Enterprise) Section ── */}
        {featuredListings.length > 0 && (
          <section id="featured-listings" className="max-w-7xl mx-auto px-4 py-16 overflow-hidden relative mb-4">
            {/* Ambient glow blobs */}
            <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-orange-500/5 blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-amber-400/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Glowing border wrapper */}
            <div className="relative rounded-[40px] border border-orange-400/20 bg-gradient-to-b from-orange-500/[0.03] via-transparent to-amber-500/[0.02] px-4 py-10 shadow-[0_0_60px_0_rgba(249,115,22,0.05)]">

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex items-center justify-between mb-10"
              >
                <div className="text-left space-y-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/25">
                    <Sparkles className="w-3.5 h-3.5 fill-current animate-spin" style={{ animationDuration: '3s' }} />
                    TIN NỔI BẬT
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-display">
                    Phòng Trọ{' '}
                    <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">Nổi Bật</span>
                  </h2>
                  <p className="text-slate-400 text-sm font-medium">Phòng chất lượng, chủ trọ uy tín — được ưu tiên hiển thị hàng đầu</p>
                </div>
                <a
                  className="text-orange-500 font-black text-sm flex items-center gap-1.5 hover:underline cursor-pointer group active:scale-95 transition-transform"
                  onClick={(e) => { e.preventDefault(); onNavigate('search'); }}
                >
                  Xem tất cả
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
              >
                {featuredListings.map((item) => {
                  const tier = item.profiles?.subscription_tier;
                  const isEnterprise = tier === 'enterprise';
                  return (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      whileHover={{ y: -7, scale: 1.015 }}
                      onClick={() => onNavigate('listing-detail', { id: item.id })}
                      className={`group bg-white rounded-[22px] overflow-hidden transition-all duration-300 cursor-pointer relative text-left ${
                        isEnterprise
                          ? 'border-2 border-amber-400 shadow-lg shadow-amber-500/10 hover:shadow-xl hover:shadow-amber-500/20 hover:border-amber-500'
                          : 'border-2 border-orange-400 shadow-md shadow-orange-500/8 hover:shadow-xl hover:shadow-orange-500/15 hover:border-orange-500'
                      }`}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          src={item.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'}
                          referrerPolicy="no-referrer"
                        />
                        {isEnterprise ? (
                          <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 z-10">
                            <Crown className="w-2.5 h-2.5 text-white fill-current" /> ĐỐI TÁC
                          </div>
                        ) : (
                          <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 z-10">
                            <Sparkles className="w-2.5 h-2.5 text-white fill-current" /> NỔI BẬT
                          </div>
                        )}
                      </div>
                      <div className="p-4 text-left">
                        <h3 className={`font-black line-clamp-1 font-display text-sm group-hover:transition-colors ${
                          isEnterprise ? 'text-slate-900 group-hover:text-amber-600' : 'text-slate-900 group-hover:text-orange-500'
                        }`}>{item.title}</h3>
                        <div className={`flex items-center font-black my-2 ${
                          isEnterprise ? 'text-amber-600' : 'text-orange-500'
                        }`}>
                          <span className="text-lg">{Number(item.price).toLocaleString()}đ</span>
                          <span className="text-xs font-bold text-slate-400 ml-1">/tháng</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-2.5">
                          <span className="flex items-center gap-1">
                            <Square className={`w-3 h-3 ${isEnterprise ? 'text-amber-400/80' : 'text-orange-400/80'}`} />
                            {item.area || '0'}m²
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className={`w-3 h-3 ${isEnterprise ? 'text-amber-400/80' : 'text-orange-400/80'}`} />
                            {item.location || 'Đà Nẵng'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>
        )}

        {/* Featured Section */}
        <section id="new-listings" className="max-w-7xl mx-auto px-4 py-16 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center justify-between mb-8"
          >
            <div className="text-left">
              <h2 className="text-2xl font-bold text-slate-900 font-display">Phòng trọ mới đăng</h2>
              <p className="text-slate-500 mt-1">Tin đăng thông thường — cập nhật mới nhất hàng ngày</p>
            </div>
            <a className="text-primary font-semibold flex items-center gap-1 hover:underline cursor-pointer" onClick={(e) => { e.preventDefault(); onNavigate('search'); }}>
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <ListingCardSkeleton key={i} />
              ))}
            </div>
          ) : realListings.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
            >
              {realListings.map((item) => {
                const tier = item.profiles?.subscription_tier || 'free';
                const isEnterprise = tier === 'enterprise';
                const isPro = tier === 'pro';
                
                let cardClass = "group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 cursor-pointer relative text-left";
                if (isEnterprise) {
                  cardClass = "group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border-2 border-amber-400 hover:border-amber-500 bg-gradient-to-b from-amber-500/[0.01] to-transparent cursor-pointer relative text-left";
                } else if (isPro) {
                  cardClass = "group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border-2 border-orange-400 hover:border-orange-500 bg-gradient-to-b from-orange-500/[0.01] to-transparent cursor-pointer relative text-left";
                }

                return (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    onClick={() => onNavigate('listing-detail', { id: item.id })}
                    className={cardClass}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        src={item.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'}
                        referrerPolicy="no-referrer"
                      />
                      {isEnterprise ? (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[9px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1 z-10">
                          <Crown className="w-2.5 h-2.5 text-white fill-current" /> Đối tác
                        </div>
                      ) : isPro ? (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1 z-10">
                          <Sparkles className="w-2.5 h-2.5 text-white fill-current" /> VIP PRO
                        </div>
                      ) : new Date(item.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 ? (
                        <div className="absolute top-2 left-2 text-white text-[10px] font-black px-2 py-1 rounded bg-primary uppercase tracking-widest z-10">MỚI</div>
                      ) : null}
                    </div>
                    <div className="p-4">
                      <h3 className="font-black text-slate-900 line-clamp-1 font-display">{item.title}</h3>
                      <div className="flex items-center text-primary font-black my-2">
                        <span className="text-lg">{Number(item.price).toLocaleString()}đ</span>
                        <span className="text-xs font-bold text-slate-400 ml-1">/tháng</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1">
                          <Square className="w-3 h-3" />
                          {item.area || '0'}m²
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {item.location || 'Đà Nẵng'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-slate-400 font-bold">Chưa có bài đăng nào.</p>
            </div>
          )}
        </section>

        {/* ── Knowledge & Room Types Section ── */}
        <section className="py-20 bg-white border-t border-slate-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Text & CTA with slide-in animation */}
              <motion.div 
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="lg:col-span-5 text-left"
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-500 rounded-full mb-5 border border-red-100/50">
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest font-display flex items-center gap-1.5">
                    📖 KIẾN THỨC
                  </span>
                </div>
                
                {/* Heading */}
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight font-display">
                  Phòng trọ là gì?<br/>
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Giải thích chi tiết</span>
                </h2>
                
                {/* Paragraphs */}
                <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-5">
                  <strong>Phòng trọ</strong> là loại hình nhà ở cho thuê phổ biến nhất tại Việt Nam, thường có diện tích <strong>10–30m²</strong> nằm trong dãy nhà hoặc tòa nhà nhiều phòng. Người thuê chia sẻ không gian chung (bếp, WC) và trả tiền thuê hàng tháng cho chủ nhà.
                </p>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-8">
                  Khác với chung cư mini (có bếp & WC riêng, 4–10 triệu/tháng) hoặc nhà nguyên căn (8–25 triệu/tháng), phòng trọ là lựa chọn <em>tiết kiệm nhất</em> – phù hợp sinh viên, người mới đi làm, hoặc người cần ở ngắn hạn với chi phí 1–4 triệu đồng/tháng.
                </p>

                {/* CTA Button */}
                <button
                  onClick={() => onNavigate?.('guide')}
                  className="px-6 py-3.5 rounded-2xl border border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all duration-200 flex items-center gap-2 group active:scale-95 shadow-sm shadow-orange-100"
                >
                  <span>Xem hướng dẫn thuê phòng đầy đủ</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </button>
              </motion.div>

              {/* Right Column: 2x2 Interactive Grid with stagger entrance */}
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="lg:col-span-7"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 text-left">
                  {/* Card 1: Phòng trọ */}
                  <motion.div 
                    variants={itemVariants}
                    className="bg-slate-50/40 rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden group border-l-4 border-l-orange-500 hover:-translate-y-1 duration-300"
                  >
                    <span className="absolute top-4 right-4 px-2.5 py-0.5 bg-orange-50 text-orange-600 rounded-full text-[9px] font-black uppercase tracking-widest font-display">Phổ biến nhất</span>
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 mb-4 group-hover:scale-105 transition-transform duration-300">
                      <Home className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-black text-slate-900 mb-1 font-display">Phòng trọ</h3>
                    <p className="text-slate-400 text-xs mb-2">10-30m²</p>
                    <p className="text-sm font-black text-orange-500">1-4 triệu/tháng</p>
                  </motion.div>

                  {/* Card 2: Chung cư mini */}
                  <motion.div 
                    variants={itemVariants}
                    className="bg-slate-50/40 rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden group border-l-4 border-l-indigo-500 hover:-translate-y-1 duration-300"
                  >
                    <span className="absolute top-4 right-4 px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest font-display">Riêng tư cao</span>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-4 group-hover:scale-105 transition-transform duration-300">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 16.5h1.5m3 0H15" />
                      </svg>
                    </div>
                    <h3 className="text-base font-black text-slate-900 mb-1 font-display">Chung cư mini</h3>
                    <p className="text-slate-400 text-xs mb-2">25-50m²</p>
                    <p className="text-sm font-black text-indigo-500">4-10 triệu/tháng</p>
                  </motion.div>

                  {/* Card 3: Nhà nguyên căn */}
                  <motion.div 
                    variants={itemVariants}
                    className="bg-slate-50/40 rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden group border-l-4 border-l-emerald-500 hover:-translate-y-1 duration-300"
                  >
                    <span className="absolute top-4 right-4 px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest font-display">Cho gia đình</span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-105 transition-transform duration-300">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                      </svg>
                    </div>
                    <h3 className="text-base font-black text-slate-900 mb-1 font-display">Nhà nguyên căn</h3>
                    <p className="text-slate-400 text-xs mb-2">50-150m²</p>
                    <p className="text-sm font-black text-emerald-500">8-25 triệu/tháng</p>
                  </motion.div>

                  {/* Card 4: Ở ghép */}
                  <motion.div 
                    variants={itemVariants}
                    className="bg-slate-50/40 rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden group border-l-4 border-l-amber-500 hover:-translate-y-1 duration-300"
                  >
                    <span className="absolute top-4 right-4 px-2.5 py-0.5 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest font-display">Linh hoạt</span>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 mb-4 group-hover:scale-105 transition-transform duration-300">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0 1 10.089 20c-2.213 0-4.302-.63-6.089-1.73v-.109A11.386 11.386 0 0 1 8.92 16.5c2.24 0 4.354.654 6.08 1.802v.003c.5.91.786 1.957.786 3.07ZM15 7.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 2.25a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-black text-slate-900 mb-1 font-display">Ở ghép</h3>
                    <p className="text-slate-400 text-xs mb-2">Chia sẻ phòng</p>
                    <p className="text-sm font-black text-amber-500 font-display">Tiết kiệm 40-60%</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Popular Areas */}
        <section className="bg-slate-100 py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-4 font-display">Khu vực nổi bật</h2>
              <p className="text-slate-500">Khám phá phòng trọ tại các quận huyện nhộn nhịp nhất</p>
            </motion.div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
            >
              {areas.map((area) => (
                <motion.a 
                  key={area.name} 
                  variants={itemVariants}
                  className="relative h-64 rounded-xl overflow-hidden group cursor-pointer" 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('search', { location: area.name });
                  }}
                >
                  <img 
                    alt={area.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    src={area.image}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white text-left">
                    <p className="text-lg font-bold font-display">{area.name}</p>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};
