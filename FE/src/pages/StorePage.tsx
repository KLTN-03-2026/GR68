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
import { Eye, ChevronDown } from 'lucide-react';
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        <div className="flex flex-col gap-6">
          {/* Hero Banner */}
          <section className="relative h-[250px] md:h-[300px] rounded-[32px] overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10"></div>
            <img 
              alt="Store Hero" 
              className="absolute inset-0 w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=1920"
              referrerPolicy="no-referrer"
            />
            <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-12 text-white">
              <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight font-display">
                Chợ đồ cũ sinh viên<br/>Siêu tiết kiệm
              </h1>
              <p className="text-white/80 max-w-md mb-8 text-sm md:text-base font-medium">
                Tìm đồ gia dụng, nội thất giá siêu rẻ từ những người thuê trọ khác. Trải nghiệm trực tuyến, thanh toán an toàn.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-primary hover:bg-primary-hover text-white px-6 md:px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Đăng bán đồ
                </button>
                {user && (
                  <button 
                    onClick={() => onNavigate('my-store')}
                    className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm px-6 md:px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 border border-white/20"
                  >
                    <ShoppingBag className="w-4 h-4" /> Quản lý mua bán
                  </button>
                )}
              </div>
            </div>
          </section>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
