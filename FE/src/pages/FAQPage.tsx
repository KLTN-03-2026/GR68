import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, MessageCircle, HelpCircle, Plus, Minus } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface ThuocTinhTrangFAQ {
  dieuHuong: (page: string, params?: any) => void;
  nguoiDung: SupabaseUser | null;
  dangXuat: () => void;
}

export const TrangFAQ = ({ dieuHuong, nguoiDung, dangXuat }: ThuocTinhTrangFAQ) => {
  const [idDangChon, datIdDangChon] = useState<number | null>(null);
  const [tuKhoaTimKiem, datTuKhoaTimKiem] = useState('');

  const danhSachCauHoi = [
    {
      id: 1,
      danhMuc: 'Tài khoản',
      cauHoi: 'Làm thế nào để thay đổi mật khẩu?',
      traLoi: 'Bạn vào trang cá nhân, chọn Cài đặt bảo mật và nhấn Thay đổi mật khẩu. Bạn sẽ cần nhập mật khẩu cũ để xác thực.'
    },
    {
      id: 2,
      danhMuc: 'Đăng tin',
      cauHoi: 'Tin đăng của tôi bị từ chối, tại sao?',
      traLoi: 'Lý do phổ biến nhất là hình ảnh không rõ nét hoặc thông tin không chính xác. Bạn có thể kiểm tra email thông báo để biết lý do cụ thể và chỉnh sửa lại.'
    },
    {
      id: 3,
      danhMuc: 'Thanh toán',
      cauHoi: 'Trọ Pro hỗ trợ những phương thức thanh toán nào?',
      traLoi: 'Chúng tôi hỗ trợ chuyển khoản ngân hàng, ví điện tử VNPay, MoMo và thanh toán qua thẻ quốc tế (Visa/Mastercard).'
    },
    {
      id: 4,
      danhMuc: 'Dành cho người thuê',
      cauHoi: 'Làm sao để biết tin đăng có uy tín hay không?',
      traLoi: 'Bạn nên chọn các tin đăng có nhãn "Đã xác minh" hoặc chủ trọ có tỷ lệ phản hồi cao. Luôn xem phòng trực tiếp trước khi cọc.'
    },
    {
      id: 5,
      danhMuc: 'Kỹ thuật',
      cauHoi: 'Tôi không nhận được mã xác thực OTP?',
      traLoi: 'Hãy kiểm tra lại số điện thoại và đảm bảo sóng ổn định. Nếu vẫn không được, hãy thử lại sau 5 phút hoặc liên hệ Hotline.'
    }
  ];

  const cauHoiDaLoc = danhSachCauHoi.filter(ch =>
    ch.cauHoi.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()) ||
    ch.traLoi.toLowerCase().includes(tuKhoaTimKiem.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="w-full max-w-4xl mx-auto px-6 py-12 space-y-16 flex-1">
        <section className="text-center space-y-6 pt-12">
          <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-primary/30">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 font-display">Câu hỏi thường gặp</h1>
          <p className="max-w-2xl mx-auto text-slate-500 text-lg font-medium">
            Tìm câu trả lời nhanh cho các thắc mắc phổ biến nhất của người dùng Trọ Pro.
          </p>

          <div className="relative max-w-xl mx-auto pt-4">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi..."
              value={tuKhoaTimKiem}
              onChange={(e) => datTuKhoaTimKiem(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm font-medium"
            />
          </div>
        </section>

        <div className="space-y-4">
          {cauHoiDaLoc.map((ch) => (
            <motion.div
              key={ch.id}
              layout
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => datIdDangChon(idDangChon === ch.id ? null : ch.id)}
                className="w-full px-8 py-6 flex items-center justify-between text-left group"
              >
                <div className="space-y-1">
                  <span className="text-xs font-black text-primary uppercase tracking-widest">{ch.danhMuc}</span>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{ch.cauHoi}</h3>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${idDangChon === ch.id ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400'}`}>
                  {idDangChon === ch.id ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>

              <AnimatePresence>
                {idDangChon === ch.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 text-slate-500 font-medium leading-relaxed">
                      <div className="h-px bg-slate-100 mb-6 w-full"></div>
                      {ch.traLoi}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {cauHoiDaLoc.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <div className="text-slate-300">
                <Search className="w-12 h-12 mx-auto mb-2" />
              </div>
              <p className="text-slate-500 font-medium text-lg">Rất tiếc, chúng tôi không tìm thấy câu hỏi nào phù hợp.</p>
              <button
                onClick={() => datTuKhoaTimKiem('')}
                className="text-primary font-bold hover:underline"
              >
                Xóa tìm kiếm
              </button>
            </div>
          )}
        </div>

        <section className="bg-gradient-to-br from-primary to-orange-600 rounded-[3rem] p-12 text-center space-y-8 relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[100px]"></div>
          <h2 className="text-3xl font-black text-white font-display relative z-10">Vẫn còn thắc mắc?</h2>
          <p className="text-white/80 max-w-xl mx-auto font-medium relative z-10">Đừng ngần ngại liên hệ với chúng tôi qua Chatbox hoặc Hotline để được hỗ trợ tức thì.</p>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <button
              onClick={() => dieuHuong('contact')}
              className="px-8 py-4 bg-white text-primary font-black rounded-2xl hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Chat với tư vấn viên
            </button>
            <button className="px-8 py-4 bg-black/10 text-white font-black rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
              Gửi Email yêu cầu
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
