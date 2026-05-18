import React from 'react';
import { Home, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="relative bg-[#0B0F19] mt-20 pt-16 pb-8 w-full bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] bg-center">
      {/* Curved wave top separator */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-[0] z-10 -translate-y-[99%] pointer-events-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[60px] fill-[#0B0F19]">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
        </svg>
      </div>

      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-primary/5 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6 text-left">
              <div className="text-primary">
                <Home className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white font-display">Trọ Pro</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed text-left">
              Kênh thông tin tìm kiếm phòng trọ, căn hộ, nhà nguyên căn hàng đầu Việt Nam. Giúp bạn tìm được không gian sống lý tưởng một cách nhanh chóng và an toàn.
            </p>
          </div>
          <div className="text-left">
            <h3 className="font-bold text-white mb-6 font-display">Liên kết nhanh</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link className="hover:text-primary transition-colors" to="/about">Về chúng tôi</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/guide">Hướng dẫn đăng tin</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/pricing">Bảng giá dịch vụ</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/contact">Liên hệ hỗ trợ</Link></li>
            </ul>
          </div>
          <div className="text-left">
            <h3 className="font-bold text-white mb-6 font-display">Hỗ trợ khách hàng</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link className="hover:text-primary transition-colors" to="/rules">Quy định đăng tin</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/privacy">Chính sách bảo mật</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/complaints">Giải quyết khiếu nại</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/faq">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>
          <div className="text-left">
            <h3 className="font-bold text-white mb-6 font-display">Thông tin liên hệ</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="text-primary w-5 h-5 flex-shrink-0" />
                <span className="text-slate-300">100 Âu Cơ, Thành Phố Đà Nẵng</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-primary w-5 h-5 flex-shrink-0" />
                <span className="text-slate-300">0362796857</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-primary w-5 h-5 flex-shrink-0" />
                <span className="text-slate-300">TroPro@gmail.com</span>
              </li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-transparent transition-all shadow-md active:scale-95 duration-200" href="https://www.facebook.com/nguyen.trung.ky.682419">
                <Facebook className="w-4 h-4" />
              </a>
              <a className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-transparent transition-all shadow-md active:scale-95 duration-200" href="https://www.facebook.com/nguyen.trung.ky.682419">
                <Instagram className="w-4 h-4" />
              </a>
              <a className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-transparent transition-all shadow-md active:scale-95 duration-200" href="https://www.facebook.com/nguyen.trung.ky.682419">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800/80 pt-8 text-center text-slate-500 text-xs">
          <p>© 2026 TroPro.vn</p>
        </div>
      </div>
    </footer>
  );
};
