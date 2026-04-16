import { createClient } from '@supabase/supabase-js';

// Cấu hình các biến môi trường cho Supabase
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Kiểm tra nếu thiếu thông tin cấu hình
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Please check your .env file.');
}

// Khởi tạo Supabase Client để tương tác với Database
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Interface Listing: Định nghĩa cấu trúc dữ liệu của một tin đăng phòng trọ
export interface Listing {
  id: string;
  owner_id?: string;
  title: string;
  description?: string;
  price: number;
  area?: number;
  type?: string;
  location?: string;
  street?: string;
  image_url?: string;
  images?: string[];
  electricity_price?: number;
  water_price?: number;
  service_fee?: number;
  deposit?: number;
  is_active?: boolean;
  approval_status?: string;
  created_at?: string;
}
