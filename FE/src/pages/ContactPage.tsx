import React from 'react';
import { motion } from 'motion/react';


import { 
  Home, 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  ExternalLink,
  User,
  LogOut,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';

interface ContactPageProps {
  onNavigate: (page: string, params?: any) => void;
  user: SupabaseUser | null;
  onLogout: () => void;
}

export const ContactPage = ({ onNavigate, user, onLogout }: ContactPageProps) => {
  const { showToast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Hỗ trợ tìm trọ',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Gửi vào bảng reports với type là 'contact' hoặc đơn giản là giả lập nếu chưa có bảng
      const { error } = await supabase.from('reports').insert({
        reporter_id: user?.id || null,
        target_type: 'contact_form',
        reason: formData.subject,
        details: `Tên: ${formData.name}\nEmail: ${formData.email}\nSĐT: ${formData.phone}\nNội dung: ${formData.message}`,
        status: 'pending'
      });

      if (error) throw error;

      showToast('Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất.', 'success');
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Hỗ trợ tìm trọ',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Có lỗi xảy ra, vui lòng thử lại sau.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-6 py-12 space-y-16 flex-1">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 font-display"
          >
            Liên hệ với chúng tôi
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-slate-500 text-lg leading-relaxed font-medium"
          >
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn tìm kiếm căn trọ ưng ý nhất. Hãy để lại lời nhắn cho Trọ Pro nhé!
          </motion.p>
        </section>

        {/* Contact Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center space-y-4 hover:shadow-md transition-all group cursor-pointer hover:border-primary/30"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:-translate-y-1 transition-transform">
              <MapPin className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 font-display">Địa chỉ</h3>
              <p className="text-slate-500 font-medium">100 Âu Cơ, Thành Phố Đà Nẵng</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-8 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center space-y-4 hover:shadow-md transition-all group cursor-pointer hover:border-primary/30"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:-translate-y-1 transition-transform">
              <Phone className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 font-display">Điện thoại</h3>
              <p className="text-slate-500 font-medium whitespace-pre-line">
                0362796857 (Hotline)
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-8 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center space-y-4 hover:shadow-md transition-all group cursor-pointer hover:border-primary/30"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:-translate-y-1 transition-transform">
              <Mail className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 font-display">Email</h3>
              <p className="text-slate-500 font-medium">TroPro@gmail.com</p>
            </div>
          </motion.div>
        </section>

        {/* Contact Form & Map Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Send Message Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-8 rounded-3xl shadow-xl shadow-primary/5 border border-slate-100 min-h-[500px] flex flex-col"
          >
            {submitted ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 font-display">Gửi thành công!</h2>
                  <p className="text-slate-500 font-medium max-w-xs mx-auto">
                    Cảm ơn bạn đã liên hệ. Trọ Pro đã nhận được tin nhắn và sẽ phản hồi bạn qua email trong vòng 24h tới.
                  </p>
                </div>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95"
                >
                  Gửi thêm tin nhắn
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-8 text-slate-900 font-display">Gửi tin nhắn cho chúng tôi</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* ... form content ... */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Họ tên <span className="text-red-500">*</span></label>
                      <input 
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-slate-700" 
                        placeholder="Nguyễn Văn A" 
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Email <span className="text-red-500">*</span></label>
                      <input 
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-slate-700" 
                        placeholder="example@gmail.com" 
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Số điện thoại</label>
                      <input 
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-slate-700" 
                        placeholder="0901234567" 
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Chủ đề</label>
                      <div className="relative">
                        <select 
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-slate-700 appearance-none cursor-pointer"
                        >
                          <option>Hỗ trợ tìm trọ</option>
                          <option>Báo cáo sự cố</option>
                          <option>Thắc mắc thanh toán</option>
                          <option>Góp ý dịch vụ</option>
                          <option>Hợp tác kinh doanh</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Nội dung tin nhắn <span className="text-red-500">*</span></label>
                    <textarea 
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-slate-700 resize-none" 
                      placeholder="Nhập tin nhắn của bạn tại đây..." 
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>

                  <button 
                    className="w-full bg-primary hover:bg-primary-hover text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/30 active:scale-95 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    {loading ? 'Đang gửi...' : 'Gửi tin nhắn'}
                  </button>
                </form>
              </>
            )}
          </motion.div>

          {/* Map Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="h-full min-h-[500px] lg:min-h-full rounded-3xl overflow-hidden shadow-md border border-slate-200 relative group"
          >
            <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center -z-10">
              <MapPin className="w-10 h-10 text-slate-300" />
            </div>
            
            {/* Google Maps Iframe - Styled like Listing Detail Map */}
            <div className="absolute inset-0 group">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight={0} 
                marginWidth={0} 
                src="https://maps.google.com/maps?q=16.0416246,108.1565579&z=16&output=embed"
                className="border-0 transition-all duration-700"
              ></iframe>
              {/* Overlay for premium look */}
              <div className="absolute inset-0 pointer-events-none border-4 border-transparent group-hover:border-primary/10 transition-all duration-500 rounded-3xl"></div>
              <div className="absolute inset-0 pointer-events-none shadow-[inner_0_2px_10px_rgba(0,0,0,0.05)] rounded-3xl"></div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      
    </div>
  );
};
