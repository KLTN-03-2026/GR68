import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, CheckCircle2, AlertCircle, Search, Home, ClipboardCheck, MessageSquare, Key } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface GuidePageProps {
  onNavigate: (page: string, params?: any) => void;
  user: SupabaseUser | null;
  onLogout: () => void;
}

export const GuidePage = ({ onNavigate, user, onLogout }: GuidePageProps) => {
  const steps = [
    {
      title: 'Đăng ký tài khoản',
      desc: 'Tạo tài khoản Trọ Pro chỉ trong 30 giây bằng số điện thoại hoặc email.',
      icon: CheckCircle2,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Tìm kiếm & Lọc',
      desc: 'Sử dụng bộ lọc thông minh để tìm phòng theo khu vực, giá cả và tiện ích.',
      icon: Search,
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      title: 'Liên hệ chủ trọ',
      desc: 'Nhắn tin trực tiếp hoặc gọi điện qua hệ thống để trao đổi chi tiết.',
      icon: MessageSquare,
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      title: 'Xem phòng & Ký hợp đồng',
      desc: 'Hẹn lịch xem phòng thực tế và ký hợp đồng điện tử an toàn.',
      icon: Key,
      color: 'bg-amber-50 text-amber-600'
    }
  ];

  const Rocket = ({ className }: { className?: string }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71.79-1.35.71-2.02l3.02-3.02c1.47.11 2.52-.13 3.06-.67l.53-.53c.6-.6.6-1.58 0-2.18l-1.12-1.12c-.6-.6-1.58-.6-2.18 0l-.53.53c-.54.54-.78 1.59-.67 3.06l-3.02 3.02c-.67-.08-1.31 0-2.02.71Z" />
      <path d="M12 15s1.25 1.5 1.5 4.5l1.5-1.5s-1.5-1.25-1.5-3" />
      <path d="m15 12 5-5" />
      <path d="m13 10 5-5" />
      <path d="m17 14 5-5" />
    </svg>
  );

  const landlordSteps = [
    {
      title: 'Tạo tin đăng',
      desc: 'Nhập thông tin chi tiết, địa chỉ và tải lên hình ảnh phòng trọ rõ nét.',
      icon: Home
    },
    {
      title: 'Xác thực thông tin',
      desc: 'Đội ngũ Trọ Pro sẽ kiểm duyệt nội dung để đảm bảo tính xác thực.',
      icon: ClipboardCheck
    },
    {
      title: 'Tiếp cận khách hàng',
      desc: 'Tin đăng của bạn sẽ được hiển thị tới hàng ngàn người đang tìm kiếm.',
      icon: Rocket
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="w-full max-w-7xl mx-auto px-6 py-12 space-y-24 flex-1">
        {/* Header */}
        <section className="text-center space-y-4 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-primary font-bold"
          >
            <BookOpen className="w-6 h-6" />
            <span>Trung tâm hướng dẫn</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 font-display"
          >
            Hướng dẫn sử dụng Trọ Pro
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-slate-500 text-lg font-medium"
          >
            Mọi điều bạn cần biết để bắt đầu tìm kiếm hoặc cho thuê phòng trọ một cách chuyên nghiệp.
          </motion.p>
        </section>

        {/* Tenant Guide */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="h-10 w-2 bg-primary rounded-full"></div>
            <h2 className="text-3xl font-black text-slate-900 font-display">Dành cho Người tìm trọ</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mb-6`}>
                  <step.icon className="w-7 h-7" />
                </div>
                <div className="text-sm font-black text-slate-400 mb-2 uppercase tracking-widest">Bước {idx + 1}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 font-display">{step.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Landlord Guide */}
        <section className="bg-gradient-to-br from-primary to-orange-600 rounded-[40px] p-8 md:p-16 text-white overflow-hidden relative shadow-2xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[120px] rounded-full -mr-48 -mt-48"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-black font-display">Bạn là Chủ trọ? <br /> <span className="text-white">Bắt đầu cho thuê ngay</span></h2>
              <p className="text-white/80 text-lg font-medium leading-relaxed">
                Chúng tôi cung cấp bộ công cụ quản lý tin đăng mạnh mẽ giúp bạn tiếp cận đúng đối tượng khách hàng mục tiêu một cách nhanh nhất.
              </p>
              <div className="space-y-6">
                {landlordSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-5">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0 text-white">
                      <step.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl">{step.title}</h4>
                      <p className="text-white/70 font-medium">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => onNavigate('manage')}
                className="px-8 py-4 bg-white text-primary font-black rounded-2xl hover:shadow-xl transition-all shadow-xl shadow-primary/20 active:scale-95 uppercase tracking-widest"
              >
                Đăng tin ngay
              </button>
            </div>
            <div className="hidden lg:block relative">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000" 
                alt="Modern House" 
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl text-slate-900 border border-slate-100 max-w-[240px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <span className="font-bold">Đã xác minh</span>
                </div>
                <p className="text-sm font-medium text-slate-500 italic">"Hệ thống giúp tôi quản lý 20 phòng trọ cực kỳ đơn giản."</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-10 bg-rose-50 rounded-3xl border border-rose-100 space-y-6">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-8 h-8" />
              <h3 className="text-2xl font-black font-display text-slate-900">Cảnh báo lừa đảo</h3>
            </div>
            <ul className="space-y-4 font-medium text-slate-600">
              <li className="flex gap-3">
                <span className="text-rose-500 font-bold">•</span>
                <span>Không chuyển khoản đặt cọc trước khi xem phòng thực tế.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-rose-500 font-bold">•</span>
                <span>Cảnh giác với các tin rao giá rẻ bất thường so với khu vực.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-rose-500 font-bold">•</span>
                <span>Luôn yêu cầu xem giấy tờ chứng minh quyền sở hữu của chủ nhà.</span>
              </li>
            </ul>
          </div>

          <div className="p-10 bg-primary/5 rounded-3xl border border-primary/10 space-y-6">
            <div className="flex items-center gap-3 text-primary">
              <CheckCircle2 className="w-8 h-8" />
              <h3 className="text-2xl font-black font-display text-slate-900">Mẹo cho thuê nhanh</h3>
            </div>
            <ul className="space-y-4 font-medium text-slate-600">
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Hình ảnh rõ nét, đầy đủ các góc của căn phòng (tối thiểu 5 ảnh).</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Mô tả chi tiết về chi phí điện, nước, internet và dịch vụ khác.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Sử dụng dịch vụ "Đẩy tin" của Trọ Pro để luôn nằm ở top tìm kiếm.</span>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};
