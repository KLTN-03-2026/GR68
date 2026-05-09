import React from 'react';
import { motion } from 'motion/react';
import { Lock, Eye, Shield, Server, Globe, Mail } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface ThuocTinhTrangChinhSach {
  onNavigate: (page: string, params?: any) => void;
  user: SupabaseUser | null;
  onLogout: () => void;
}

export const PrivacyPage = ({ onNavigate: dieuHuong, user: nguoiDung, onLogout: dangXuat }: ThuocTinhTrangChinhSach) => {
  const danhSachMuc = [
    {
      title: 'Thông tin chúng tôi thu thập',
      content: 'Chúng tôi thu thập các thông tin cá nhân như tên, số điện thoại, địa chỉ email khi bạn đăng ký tài khoản. Ngoài ra, chúng tôi cũng thu thập dữ liệu về vị trí và lịch sử tìm kiếm để cải thiện trải nghiệm người dùng.',
      icon: Eye
    },
    {
      title: 'Cách chúng tôi sử dụng thông tin',
      content: 'Thông tin của bạn được sử dụng để xác thực tài khoản, xử lý tin đăng, cung cấp các gợi ý phòng trọ phù hợp và liên hệ hỗ trợ khi cần thiết.',
      icon: Lock
    },
    {
      title: 'Bảo mật dữ liệu',
      content: 'Chúng tôi sử dụng các công nghệ mã hóa tiên tiến và các biện pháp bảo mật đa tầng để bảo vệ dữ liệu cá nhân của bạn khỏi sự truy cập trái phép.',
      icon: Shield
    },
    {
      title: 'Chia sẻ với bên thứ ba',
      content: 'Trọ Pro cam kết không bán hoặc cho thuê thông tin cá nhân của bạn cho bên thứ ba. Chúng tôi chỉ chia sẻ thông tin liên hệ giữa chủ trọ và người thuê khi có sự đồng ý của cả hai bên.',
      icon: Server
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="w-full max-w-4xl mx-auto px-6 py-12 space-y-16 flex-1">
        <section className="text-center space-y-4 pt-8">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 font-display">Chính sách bảo mật</h1>
          <p className="max-w-2xl mx-auto text-slate-500 text-lg font-medium leading-relaxed">
            Quyền riêng tư của bạn là ưu tiên hàng đầu của chúng tôi. Hãy dành ít phút để hiểu rõ cách chúng tôi bảo vệ thông tin của bạn.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-8">
          {danhSachMuc.map((muc, chiSo) => (
            <motion.div
              key={chiSo}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: chiSo * 0.1 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm"
            >
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-primary flex items-center justify-center shrink-0">
                  <muc.icon className="w-6 h-6" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-slate-900 font-display">{muc.title}</h2>
                  <p className="text-slate-500 leading-relaxed font-medium">{muc.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <section className="space-y-8 bg-gradient-to-br from-primary to-orange-600 rounded-[2.5rem] p-10 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[100px]"></div>
          <div className="flex flex-col md:flex-row gap-8 justify-between items-center relative z-10">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold font-display">Bạn có câu hỏi về quyền riêng tư?</h3>
              <p className="text-white/80 font-medium max-w-md">Chúng tôi luôn sẵn sàng minh bạch và hỗ trợ bạn trong mọi thắc mắc về dữ liệu.</p>
              <div className="flex gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-white/60" />
                  <span className="text-sm font-bold">TroPro@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-white/60" />
                  <span className="text-sm font-bold">tropro.vn/legal</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => dieuHuong('contact')}
              className="w-full md:w-auto px-8 py-4 bg-white text-primary font-black rounded-2xl hover:shadow-xl transition-all"
            >
              Liên hệ bộ phận pháp lý
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
