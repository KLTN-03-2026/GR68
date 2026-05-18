import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Zap, Star, Crown, HelpCircle, X, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from '../context/ToastContext';

interface PricingPageProps {
  onNavigate: (page: string, params?: any) => void;
  user: SupabaseUser | null;
  onLogout: () => void;
}

export const PricingPage = ({ onNavigate, user, onLogout }: PricingPageProps) => {
  const { showToast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const plans = [
    {
      name: 'Gói Miễn Phí',
      price: '0',
      numericalPrice: 0,
      description: 'Dành cho cá nhân muốn đăng tin lẻ',
      features: [
        'Đăng tối đa 2 tin/tháng',
        'Hiển thị trong 7 ngày',
        'Ảnh tối đa 5 tấm/tin',
        'Hỗ trợ qua email'
      ],
      buttonText: 'Bắt đầu ngay',
      premium: false
    },
    {
      name: 'Gói Chuyên Nghiệp',
      price: '199.000',
      numericalPrice: 199000,
      description: 'Lựa chọn tốt nhất cho chủ trọ vừa và nhỏ',
      features: [
        'Đăng tối đa 10 tin/tháng',
        'Hiển thị trong 30 ngày',
        'Ảnh tối đa 15 tấm/tin',
        '5 lượt đẩy tin/tháng',
        'Hỗ trợ ưu tiên 24/7'
      ],
      buttonText: 'Nâng cấp ngay',
      premium: true,
      popular: true
    },
    {
      name: 'Gói Doanh Nghiệp',
      price: '499.000',
      numericalPrice: 499000,
      description: 'Giải pháp toàn diện cho hệ thống căn hộ',
      features: [
        'Không giới hạn số lượng tin',
        'Hiển thị không thời hạn',
        'Ảnh & Video không giới hạn',
        '30 lượt đẩy tin/tháng',
        'Gắn nhãn "Đối tác xác minh"',
        'Quản lý đa cửa hàng'
      ],
      buttonText: 'Nâng cấp ngay',
      premium: true
    }
  ];

  const handlePlanSelection = (plan: any) => {
    if (plan.numericalPrice === 0) {
      onNavigate('manage');
      return;
    }

    if (!user) {
      showToast('Vui lòng đăng nhập để nâng cấp tài khoản chủ trọ!', 'warning');
      onNavigate('login');
      return;
    }

    setSelectedPlan(plan);
  };

  const handlePayment = async () => {
    if (!user || !selectedPlan) return;
    setIsSubmitting(true);
    showToast('Đang kết nối cổng VNPay...', 'info');

    try {
      const tier = selectedPlan.name === 'Gói Chuyên Nghiệp' ? 'pro' : 'enterprise';
      // Tạo mã SUB_[tier]_[userId]_[timestamp]
      const orderId = `SUB_${tier}_${user.id}_${Date.now().toString().slice(-6)}`;
      
      const response = await fetch('http://localhost:3001/create-payment-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedPlan.numericalPrice,
          orderId: orderId,
          orderInfo: `Nang cap tai khoan TroPro goi ${selectedPlan.name.toUpperCase()}`
        }),
      });

      if (!response.ok) throw new Error('Cổng thanh toán từ chối kết nối');

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Chưa lấy được liên kết VNPay');
      }
    } catch (err: any) {
      console.error('Lỗi khi nâng cấp:', err);
      showToast(err.message || 'Lỗi kết nối cổng thanh toán VNPay', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <style>{`
        @keyframes golden-glow {
          0% { box-shadow: 0 0 15px rgba(245, 158, 11, 0.2), 0 0 5px rgba(245, 158, 11, 0.1); }
          50% { box-shadow: 0 0 35px rgba(245, 158, 11, 0.5), 0 0 15px rgba(245, 158, 11, 0.25); }
          100% { box-shadow: 0 0 15px rgba(245, 158, 11, 0.2), 0 0 5px rgba(245, 158, 11, 0.1); }
        }
        @keyframes shimmer-border {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .pricing-enterprise-card {
          position: relative;
          background: linear-gradient(180deg, #ffffff 0%, #fffdf0 100%);
          border: 2.5px solid transparent !important;
          background-clip: padding-box, border-box !important;
          background-origin: padding-box, border-box !important;
          background-image: linear-gradient(#ffffff, #fffdf0), linear-gradient(135deg, #fbbf24, #f59e0b, #ea580c, #f59e0b, #fbbf24) !important;
          background-size: 100% 100%, 300% 300% !important;
          animation: golden-glow 3s infinite alternate, shimmer-border 5s linear infinite !important;
        }
      `}</style>
      <main className="w-full max-w-7xl mx-auto px-6 py-12 space-y-24 flex-1">
        {/* Header */}
        <section className="text-center space-y-6 pt-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-slate-900 font-display tracking-tight"
          >
            Bảng giá dịch vụ <span className="text-primary bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">Trọ Pro</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-slate-500 text-xl font-medium"
          >
            Chọn gói dịch vụ phù hợp để tối ưu hóa hiệu quả cho thuê của bạn. Minh bạch, công bằng và hiệu quả.
          </motion.p>
        </section>

        {/* Pricing Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className={
                plan.name === 'Gói Doanh Nghiệp'
                  ? `relative rounded-[40px] p-10 transition-all hover:shadow-2xl hover:-translate-y-2 flex flex-col justify-between pricing-enterprise-card`
                  : `relative bg-white rounded-[40px] p-10 border-2 transition-all hover:shadow-2xl hover:-translate-y-2 flex flex-col justify-between ${
                      plan.popular ? 'border-primary shadow-xl shadow-primary/5' : 'border-slate-100'
                    }`
              }
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-6 py-1.5 rounded-full text-sm font-black uppercase tracking-widest shadow-md">
                  Phổ biến nhất
                </div>
              )}
              {plan.name === 'Gói Doanh Nghiệp' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/25 flex items-center gap-1 animate-bounce">
                  <Crown className="w-3.5 h-3.5 fill-current" /> ĐỐI TÁC KHUYÊN DÙNG
                </div>
              )}
              
              <div className="space-y-6 flex-1 text-left">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 font-display mb-2">{plan.name}</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 font-display">{plan.price}</span>
                  <span className="text-slate-400 font-bold">VNĐ/tháng</span>
                </div>

                <div className="h-px bg-slate-100 w-full"></div>

                <ul className="space-y-4">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex gap-3 text-slate-600 font-medium text-sm">
                      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        plan.name === 'Gói Doanh Nghiệp' ? 'bg-amber-100 text-amber-600' :
                        plan.premium ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => handlePlanSelection(plan)}
                  className={`w-full py-4 rounded-2xl font-black transition-all active:scale-95 uppercase tracking-widest text-xs cursor-pointer ${
                    plan.name === 'Gói Doanh Nghiệp'
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white shadow-xl shadow-orange-500/30 hover:brightness-110 hover:shadow-orange-500/50'
                    : plan.popular 
                      ? 'bg-primary text-white shadow-xl shadow-primary/30 hover:bg-primary-hover' 
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Individual Services */}
        <section className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900 font-display">Dịch vụ bổ sung</h2>
            <p className="text-slate-500 font-medium mt-2">Dành cho các tin đăng lẻ cần sự nổi bật</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Đẩy tin (Top)',
                price: '15.000đ/lượt',
                desc: 'Tin của bạn sẽ được đẩy lên vị trí đầu tiên trong danh sách tìm kiếm.',
                icon: Zap,
                color: 'text-amber-500 bg-amber-50'
              },
              {
                title: 'Tin VIP 1',
                price: '150.000đ/tuần',
                desc: 'Hiển thị với khung viền nổi bật và được ưu tiên trên trang chủ.',
                icon: Star,
                color: 'text-primary bg-primary/5'
              },
              {
                title: 'Tin Đặc Biệt',
                price: '500.000đ/tuần',
                desc: 'Hiển thị ở vị trí banner lớn nhất trang chủ và thông báo tới người dùng.',
                icon: Crown,
                color: 'text-blue-600 bg-blue-50'
              }
            ].map((service, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 flex items-start gap-6 hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center shrink-0`}>
                  <service.icon className="w-7 h-7" />
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="font-bold text-slate-900 text-lg">{service.title}</h4>
                  <div className="text-primary font-black">{service.price}</div>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto space-y-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-primary font-bold mb-2">
              <HelpCircle className="w-5 h-5" />
              <span>Giải đáp thắc mắc</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 font-display">Câu hỏi thường gặp</h2>
          </div>
          <div className="space-y-6 text-left">
            {[
              {
                q: 'Làm sao để thanh toán dịch vụ?',
                a: 'Bạn có thể thanh toán qua chuyển khoản ngân hàng, ví điện tử VNPay hoặc số dư tài khoản Trọ Pro.'
              },
              {
                q: 'Tôi có thể thay đổi gói dịch vụ không?',
                a: 'Có, bạn có thể nâng cấp gói dịch vụ bất kỳ lúc nào. Phần chi phí còn lại của gói cũ sẽ được quy đổi sang gói mới.'
              },
              {
                q: 'Tin đăng VIP có hiệu quả hơn không?',
                a: 'Theo thống kê, tin đăng VIP có lượt xem cao hơn gấp 5-10 lần so với tin đăng thường, giúp bạn chốt khách nhanh hơn.'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-900">{item.q}</h4>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Upgrade Confirmation Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlan(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] p-8 md:p-10 shadow-2xl border border-slate-100 overflow-hidden"
            >
              {/* Premium Top Glow */}
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500" />
              
              <button 
                onClick={() => setSelectedPlan(null)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors flex items-center justify-center active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/20">
                  <Crown className="w-10 h-10 animate-bounce" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 font-display">Xác Nhận Nâng Cấp</h3>
                  <p className="text-sm font-medium text-slate-400">
                    Bắt đầu gia tăng hiệu quả tiếp cận khách hàng tiềm năng cùng Trọ Pro
                  </p>
                </div>

                {/* Bill Card */}
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-left space-y-4 shadow-inner">
                  <div className="flex justify-between items-center text-sm font-bold border-b border-slate-200 pb-3">
                    <span className="text-slate-400">Gói chọn mua:</span>
                    <span className="text-slate-900 font-black text-base">{selectedPlan.name}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm font-bold border-b border-slate-200 pb-3">
                    <span className="text-slate-400">Thời hạn sử dụng:</span>
                    <span className="text-emerald-600 font-bold text-xs flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> 30 Ngày hoạt động
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-400">Số tiền thanh toán:</span>
                    <span className="text-xl font-black text-primary">{selectedPlan.price} VNĐ</span>
                  </div>
                </div>

                {/* Notice info */}
                <div className="flex items-start gap-2.5 bg-orange-50 text-orange-600 p-4 rounded-2xl border border-orange-100 text-left text-xs font-bold leading-relaxed text-left">
                  <AlertCircle className="w-5 h-5 shrink-0 text-orange-500 mt-0.5" />
                  <div>
                    Bạn sẽ được chuyển hướng sang cổng thanh toán **VNPay** để tiến hành thanh toán an toàn. Tài khoản của bạn sẽ tự động nâng cấp ngay sau khi giao dịch hoàn tất.
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={() => setSelectedPlan(null)}
                    disabled={isSubmitting}
                    className="w-full sm:w-[35%] bg-slate-100 hover:bg-slate-200 text-slate-600 font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-colors"
                  >
                    Quay lại
                  </button>

                  <button
                    onClick={handlePayment}
                    disabled={isSubmitting}
                    className="w-full sm:w-[65%] bg-primary text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-primary-hover shadow-xl shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      'Đang xử lý...'
                    ) : (
                      <>
                        Xác nhận & Thanh toán
                        <ArrowRight className="w-4 h-4 ml-1 opacity-50 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const TrangBangGia = PricingPage;
