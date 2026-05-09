import React from 'react';
import { motion } from 'motion/react';
import { MessageSquareWarning, Clock, UserCheck, ShieldCheck, Scale, ArrowRight } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface PropsTrangKhieuNai {
  onNavigate: (trang: string, thamSo?: any) => void;
  user: SupabaseUser | null;
  onLogout: () => void;
}

export const TrangKhieuNai = ({ onNavigate: onDieuHuong, user: nguoiDung, onLogout: onDangXuat }: PropsTrangKhieuNai) => {
  const cacBuoc = [
    {
      title: 'Gửi khiếu nại',
      desc: 'Bạn có thể gửi khiếu nại trực tiếp qua biểu mẫu liên hệ hoặc nhắn tin cho Admin.',
      icon: MessageSquareWarning,
      color: 'bg-rose-50 text-rose-600'
    },
    {
      title: 'Tiếp nhận thông tin',
      desc: 'Đội ngũ hỗ trợ sẽ tiếp nhận và phản hồi trong vòng 24h làm việc.',
      icon: Clock,
      color: 'bg-amber-50 text-amber-600'
    },
    {
      title: 'Xác minh & Giải quyết',
      desc: 'Chúng tôi sẽ làm việc với cả hai bên để đưa ra phương án giải quyết công bằng nhất.',
      icon: Scale,
      color: 'bg-primary/10 text-primary'
    },
    {
      title: 'Kết luận',
      desc: 'Thông báo kết quả cuối cùng và áp dụng các biện pháp xử lý nếu có vi phạm.',
      icon: UserCheck,
      color: 'bg-emerald-50 text-emerald-600'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="w-full max-w-6xl mx-auto px-6 py-12 space-y-24 flex-1">
        <section className="text-center space-y-6 pt-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-900 font-display"
          >
            Giải quyết khiếu nại
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-slate-500 text-lg font-medium leading-relaxed"
          >
            Trọ Pro cam kết bảo vệ quyền lợi hợp pháp của cả người thuê và chủ trọ. Mọi mâu thuẫn sẽ được giải quyết dựa trên tinh thần tôn trọng và khách quan.
          </motion.p>
        </section>

        <section className="space-y-12">
          <div className="text-center">
            <h2 className="text-2xl font-black text-slate-900 font-display">Quy trình giải quyết 4 bước</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cacBuoc.map((buoc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="relative bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
              >
                {index < cacBuoc.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-slate-300" />
                  </div>
                )}
                <div className={`w-14 h-14 rounded-2xl ${buoc.color} flex items-center justify-center mb-6`}>
                  <buoc.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 font-display">{buoc.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{buoc.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white p-10 md:p-16 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 font-display">Cam kết của Trọ Pro</h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">
                Chúng tôi không đứng ngoài các rắc rối của bạn. Đội ngũ quản trị viên sẽ tham gia điều phối và đưa ra phán quyết dựa trên bằng chứng xác thực.
              </p>
            </div>
            <ul className="space-y-4 font-bold text-slate-700">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Phản hồi nhanh chóng trong 24h
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Tuyệt đối bảo mật thông tin khiếu nại
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Hỗ trợ pháp lý cơ bản nếu cần thiết
              </li>
            </ul>
          </div>
          <div className="bg-slate-50 p-8 rounded-[2rem] space-y-6">
            <h3 className="text-xl font-black text-slate-900 font-display">Gửi báo cáo ngay</h3>
            <p className="text-slate-500 font-medium">Nếu bạn phát hiện hành vi lừa đảo hoặc vi phạm hợp đồng, đừng ngần ngại thông báo cho chúng tôi.</p>
            <div className="space-y-3">
              <button 
                onClick={() => onDieuHuong('contact')}
                className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary-hover transition-all flex items-center justify-center gap-2"
              >
                Biểu mẫu khiếu nại
              </button>
              <button className="w-full py-4 bg-white border border-slate-200 text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all">
                Hotline: 0362796857
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
