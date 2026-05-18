import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { CartDrawer } from '../components/store/CartDrawer';
import {
  Search, Plus, LayoutGrid, Armchair, Utensils,
  Sparkles, Trash2, Bed, PlusCircle, X, CheckCircle2, Loader2, ShoppingCart, Store, ShoppingBag, SearchSlash, Smartphone
} from 'lucide-react';
import { StoreSearchBar } from '../components/store/StoreSearchBar';
import { ProductSkeleton } from '../components/store/ProductSkeleton';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Eye, ChevronDown, MapPin, Home, Square } from 'lucide-react';
import { ProductModal } from '../components/store/ProductModal';
import { Select } from '../components/store/Select';

interface StorePageProps {
  onNavigate: (page: string, params?: any) => void;
  user: SupabaseUser | null;
  onLogout: () => void;
}

export const StorePage = ({ onNavigate, user, onLogout }: StorePageProps) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const sortOptions = [
    { value: 'newest', label: 'Mới đăng nhất' },
    { value: 'price_asc', label: 'Giá: Thấp đến Cao' },
    { value: 'price_desc', label: 'Giá: Cao đến Thấp' }
  ];
  
  // Pagination State
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 12;

  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { showToast } = useToast();
  const { cartCount, addToCart } = useCart();

  const categories = [
    { id: 'all', label: 'Tất cả', icon: LayoutGrid },
    { id: 'electronics', label: 'Đồ điện tử', icon: Smartphone },
    { id: 'furniture', label: 'Nội thất', icon: Armchair },
    { id: 'kitchen', label: 'Bếp & Đồ dùng', icon: Utensils },
    { id: 'decor', label: 'Trang trí', icon: Sparkles },
    { id: 'cleaning', label: 'Vệ sinh', icon: Trash2 },
    { id: 'bedroom', label: 'Phòng ngủ', icon: Bed },
  ];

  const fetchProducts = async (isAppending = false) => {
    if (!isAppending) setLoading(true);
    else setLoadingMore(true);

    try {
      const from = page * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('approval_status', 'approved')
        .range(from, to);
      
      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'price_asc') {
        query = query.order('price', { ascending: true });
      } else if (sortBy === 'price_desc') {
        query = query.order('price', { ascending: false });
      }
      
      if (debouncedSearch) {
        query = query.or(`title.ilike.%${debouncedSearch}%,description.ilike.%${debouncedSearch}%`);
      }

      if (activeCategory !== 'all') {
        const categoryLabel = categories.find(c => c.id === activeCategory)?.label;
        if (categoryLabel) {
          query = query.eq('category', categoryLabel);
        }
      }

      const { data, error, count } = await query;
      
      if (error) throw error;

      if (isAppending) {
        setProducts(prev => [...prev, ...(data || [])]);
      } else {
        setProducts(data || []);
      }

      setHasMore(count ? (from + (data?.length || 0)) < count : false);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast('Không thể tải danh sách sản phẩm', 'error');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  // Debounce search effect
  useEffect(() => {
    if (searchQuery) setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setIsSearching(false);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
    setHasMore(true);
  }, [activeCategory, debouncedSearch, sortBy]);

  // Initial and Load More fetch
  useEffect(() => {
    fetchProducts(page > 0);
  }, [activeCategory, debouncedSearch, sortBy, page]);

  const handleImageChange = (index: number, value: string) => {
    // ... removed old image handler
  };

  const handleCreateProduct = async () => {
    // ... removed old create logic
  };

  const filteredProducts = products;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <CartDrawer 
        isOpen={showCart} 
        onClose={() => setShowCart(false)} 
        onNavigate={onNavigate} 
        user={user}
      />

      {/* Floating Cart Button */}
      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-6 right-6 z-[100] bg-primary text-white w-14 h-14 rounded-2xl shadow-2xl shadow-orange-500/40 flex items-center justify-center hover:-translate-y-1 transition-all"
      >
        <ShoppingCart className="w-6 h-6" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg">{cartCount}</span>
        )}
      </button>

      <main className="flex-grow bg-slate-50">
        {/* Full-width Hero Banner exactly like HomePage */}
        <section className="relative w-full min-h-[580px] lg:h-[580px] py-16 lg:py-0 flex items-center bg-[#0B0F19] overflow-hidden bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] bg-center">
          {/* Ambient Glows */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.06),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.04),transparent_40%)] pointer-events-none" />
          
          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Title, Description, Buttons */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-black text-white mb-6 leading-[1.15] font-display text-left tracking-tight"
              >
                Chợ đồ cũ sinh viên<br/>
                <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">Siêu tiết kiệm</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-sm md:text-base text-slate-400 max-w-lg mb-8 leading-relaxed text-left font-medium"
              >
                Tìm đồ gia dụng, nội thất giá siêu rẻ từ những người thuê trọ khác. Trải nghiệm trực tuyến, thanh toán an toàn, tiết kiệm tối đa chi phí sinh hoạt.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex flex-wrap gap-4"
              >
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-primary hover:bg-primary-hover text-white px-6 md:px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-orange-500/10 active:scale-95 duration-200 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Đăng bán đồ
                </button>
                {user && (
                  <button 
                    onClick={() => onNavigate('my-store')}
                    className="bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80 px-6 md:px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 duration-200 flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Quản lý mua bán
                  </button>
                )}
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
                      alt="Mockup product"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=600"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-left px-1">
                    <div className="flex items-center text-primary font-black mb-1.5">
                      <span className="text-lg">850.000đ</span>
                      <span className="text-xs font-bold text-slate-400 ml-1">(Thanh lý)</span>
                    </div>
                    <h3 className="font-black text-slate-900 text-sm line-clamp-2 leading-snug font-display mb-3">
                      🛋️ GHẾ BÀNH VINTAGE MỚI 98% - BÁN LẠI GIÁ RẺ
                    </h3>
                    <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        Quận Hải Châu
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Square className="w-3.5 h-3.5 text-orange-500" />
                        Nội thất gỗ sồi
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Badge 1: Top Right - Mới đăng */}
                <div className="absolute -top-6 -right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-100 flex items-center gap-2 group-hover:scale-105 transition-transform duration-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div className="text-left leading-none">
                    <p className="text-[9px] font-black text-slate-900">Vừa đăng</p>
                    <p className="text-[7.5px] font-bold text-slate-400 mt-0.5">3 giờ trước</p>
                  </div>
                </div>

                {/* Floating Badge 2: Mid Right - Đã kiểm duyệt */}
                <div className="absolute top-[60%] -right-12 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-100 flex items-center gap-2.5 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-xs shrink-0 select-none">
                    ✓
                  </div>
                  <div className="text-left leading-none">
                    <p className="text-[9px] font-black text-slate-900">Đã duyệt</p>
                    <p className="text-[7.5px] font-bold text-slate-400 mt-0.5">Thông tin chính xác</p>
                  </div>
                </div>

                {/* Floating Badge 3: Bottom Left - Giá sinh viên */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-100 flex items-center gap-2.5 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 select-none">
                    <Home className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left leading-none">
                    <p className="text-[9px] font-black text-slate-900">Giá sinh viên</p>
                    <p className="text-[7.5px] font-bold text-slate-400 mt-0.5">Hỗ trợ vận chuyển</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Curved wave bottom separator */}
          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0] z-10 translate-y-[1px]">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[60px] fill-slate-50">
              <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-slate-100/5"></path>
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,53.05,22,79.66,34.79,157.65,72.23,243.39,60.54,321.39,56.44Z" className="fill-slate-50"></path>
            </svg>
          </div>
        </section>

        {/* Contained page content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex flex-col gap-8">

          {/* New Search & Sort ToolBar */}
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <StoreSearchBar 
              value={searchQuery} 
              onChange={setSearchQuery} 
              onClear={() => setSearchQuery('')} 
              isSearching={isSearching}
              className="flex-1"
            />
            <div className="flex items-center gap-3 shrink-0 w-full lg:w-max">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Sắp xếp:</span>
              <Select 
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
                className="flex-1 lg:min-w-[200px]"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all shadow-sm border w-full h-full ${
                  activeCategory === cat.id 
                    ? 'bg-primary text-white border-primary shadow-orange-100' 
                    : 'bg-white text-slate-500 border-slate-100 hover:border-primary/50 hover:text-primary'
                }`}
              >
                <cat.icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
            {loading && page === 0 ? (
              Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))
            ) : products.length === 0 ? (
              <div className="col-span-full py-20 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                <SearchSlash className="w-16 h-16 text-slate-200 mb-4" />
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  {searchQuery ? `Không tìm thấy kết quả cho "${searchQuery}"` : "Chưa có sản phẩm nào"}
                </h3>
                {searchQuery ? (
                   <button 
                    onClick={() => setSearchQuery('')}
                    className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs mt-4 uppercase shadow-xl hover:-translate-y-1 transition-transform"
                  >
                    Xóa tìm kiếm
                  </button>
                ) : (
                  <button onClick={() => setShowCreateModal(true)} className="bg-primary text-white px-8 py-3 rounded-xl font-black text-xs mt-4 uppercase shadow-xl hover:-translate-y-1 transition-transform">
                    Trở thành người bán đầu tiên
                  </button>
                )}
              </div>
            ) : (
              filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  whileHover={{ y: -5 }}
                  onClick={() => onNavigate('store-detail', { id: product.id })}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 cursor-pointer"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={product.image_url}
                      referrerPolicy="no-referrer"
                    />
                    {product.condition && (
                      <div className="absolute top-2 left-2 text-white text-[10px] font-black px-2 py-1 rounded bg-primary uppercase tracking-widest">
                        {product.condition}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-black text-slate-900 line-clamp-1 font-display">{product.title}</h3>
                    <div className="flex items-center text-primary font-black my-2">
                      <span className="text-lg">{Number(product.price).toLocaleString()}đ</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <LayoutGrid className="w-3 h-3" />
                        {product.category}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
           </div>

           {/* Load More Button */}
           {!loading && hasMore && (
             <div className="mt-12 flex justify-center">
                <button 
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-white hover:bg-slate-50 text-slate-600 px-10 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {loadingMore ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Tải thêm sản phẩm <ChevronDown className="w-5 h-5" />
                    </>
                  )}
                </button>
             </div>
           )}
        </div>
      </main>


      <ProductModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        user={user} 
        onSuccess={() => fetchProducts()} 
      />

    </div>
  );
};
