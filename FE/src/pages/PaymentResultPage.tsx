import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, ShoppingBag, ArrowRight, Clock, Crown, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PaymentResultPageProps {
  onNavigate: (page: string) => void;
  params?: any;
}

export const PaymentResultPage = ({ onNavigate, params }: PaymentResultPageProps) => {
  const [status, setStatus] = useState<'success' | 'failed' | 'loading'>('loading');
  const [amount, setAmount] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const [isCod, setIsCod] = useState(false);
  const [isSubscription, setIsSubscription] = useState(false);
  const [subTier, setSubTier] = useState<'pro' | 'enterprise' | ''>('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const vnp_ResponseCode = urlParams.get('vnp_ResponseCode') || params?.vnp_ResponseCode;
    const vnp_Amount = urlParams.get('vnp_Amount');
    const vnp_TxnRef = urlParams.get('vnp_TxnRef') || params?.vnp_TxnRef;
    const method = params?.method || (urlParams.get('vnp_ResponseCode') ? 'vnpay' : 'unknown');
    const paramAmount = params?.amount;

    const finalizeOrder = async () => {
      if (vnp_ResponseCode === '00') {
        setStatus('success');
        setIsCod(method === 'cod');

        if (vnp_TxnRef) {
          if (vnp_TxnRef.startsWith('SUB_')) {
            setIsSubscription(true);
            try {
              const parts = vnp_TxnRef.split('_');
              const tier = parts[1]; // 'pro' or 'enterprise'
              const userId = parts[2]; // UUID of the user
              
              if (tier) {
                setSubTier(tier as any);
              }

              if (tier && userId) {
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

                const { error: updateError } = await supabase
                   .from('profiles')
                   .update({
                     subscription_tier: tier,
                     subscription_expires_at: expiresAt.toISOString(),
                     subscription_created_at: new Date().toISOString()
                   })
                   .eq('id', userId);

                if (updateError) throw updateError;
              }
            } catch (err) {
              console.error('Lỗi cập nhật gói dịch vụ chủ trọ:', err);
            }
          } else {
            try {
              if (method === 'vnpay') {
                // ✅ Chỉ VNPAY: Trừ kho + chuyển 'completed'
                const { data: orderData, error: orderFetchError } = await supabase
                  .from('orders')
                  .select('id, items, status')
                  .eq('id', vnp_TxnRef)
                  .single();

                if (!orderFetchError && orderData) {
                  if (orderData.status !== 'completed' && orderData.items) {
                    const itemsArr = Array.isArray(orderData.items)
                      ? orderData.items
                      : JSON.parse(orderData.items as string);

                    for (const item of itemsArr) {
                      await supabase.rpc('reduce_product_stock_and_hide', {
                        product_id: item.id,
                        quantity_bought: (item.quantity || 1)
                      });
                    }
                  }

                  await supabase
                    .from('orders')
                    .update({ status: 'completed' })
                    .eq('id', orderData.id);
                }
              }
              // 📦 COD: Giữ nguyên trạng thái 'pending' — nút Hủy sẽ xuất hiện trong "Đơn Mua"
            } catch (err) {
              console.error('Lỗi cập nhật hóa đơn:', err);
            }
          }
        }
      } else {
        setStatus('failed');
        if (vnp_TxnRef) {
          if (vnp_TxnRef.startsWith('SUB_')) {
            setIsSubscription(true);
            const parts = vnp_TxnRef.split('_');
            const tier = parts[1];
            if (tier) setSubTier(tier as any);
          } else {
            try {
              await supabase
                .from('orders')
                .update({ status: 'failed' })
                .eq('id', vnp_TxnRef);
            } catch (err) {}
          }
        }
      }

      if (vnp_Amount) {
        setAmount((parseInt(vnp_Amount) / 100).toLocaleString('vi-VN') + ' đ');
      } else if (paramAmount) {
        setAmount(Number(paramAmount).toLocaleString('vi-VN') + ' đ');
      }

      if (vnp_TxnRef) {
        setOrderId(vnp_TxnRef);
      }
    };

    finalizeOrder();
  }, [params]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white p-10 rounded-[40px] max-w-md w-full shadow-2xl shadow-slate-200/50 text-center relative overflow-hidden"
      >
        {isSubscription && status === 'success' && (
          <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-orange-500 to-amber-500 animate-pulse" />
        )}
        
        {status === 'loading' ? (
          <div className="animate-pulse py-4">
            <div className="w-28 h-28 bg-slate-200 rounded-full mx-auto mb-8" />
            <div className="h-6 bg-slate-200 rounded w-3/4 mx-auto mb-4" />
            <div className="h-4 bg-slate-200 rounded w-5/6 mx-auto mb-8" />
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4 mb-8">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <div className="w-16 h-4 bg-slate-200 rounded" />
                <div className="w-24 h-6 bg-slate-200 rounded" />
              </div>
              <div className="flex justify-between items-center">
                <div className="w-24 h-4 bg-slate-200 rounded" />
                <div className="w-20 h-4 bg-slate-200 rounded" />
              </div>
            </div>
            <div className="w-full h-12 bg-slate-200 rounded-2xl" />
          </div>
        ) : status === 'success' ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl ${
                isSubscription 
                  ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-orange-500/20' 
                  : isCod 
                    ? 'bg-orange-100 text-orange-500 shadow-orange-500/10' 
                    : 'bg-green-100 text-green-500 shadow-green-500/10'
              }`}
            >
              {isSubscription ? (
                <Crown strokeWidth={2.5} className="w-14 h-14 animate-bounce" />
              ) : isCod ? (
                <Clock strokeWidth={3} className="w-14 h-14" />
              ) : (
                <CheckCircle2 strokeWidth={3} className="w-14 h-14" />
              )}
            </motion.div>

            <h1 className="text-3xl font-black text-slate-900 mb-2 font-display tracking-tight">
              {isSubscription 
                ? 'Nâng cấp VIP thành công!' 
                : isCod 
                  ? 'Đặt hàng thành công!' 
                  : 'Thanh toán thành công!'}
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed mb-8 text-sm">
              {isSubscription ? (
                `Chúc mừng! Tài khoản của bạn đã được nâng cấp lên hạng ${
                  subTier === 'enterprise' ? '👑 DOANH NGHIỆP' : '⭐ CHUYÊN NGHIỆP'
                }. Hãy bắt đầu hành trình tiếp cận hàng ngàn khách hàng tiềm năng.`
              ) : isCod ? (
                'Đơn hàng COD của bạn đang chờ xử lý. Bạn có thể hủy đơn trong mục "Đơn Mua" nếu cần.'
              ) : (
                'Cảm ơn bạn đã mua sắm. Đơn của bạn đã được ghi nhận và hoàn tất.'
              )}
            </p>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col gap-4 mb-8 text-left shadow-inner">
              <div className="flex justify-between items-center text-sm font-bold border-b border-slate-200 pb-3">
                <span className="text-slate-400">Số tiền:</span>
                <span className={`text-2xl font-black ${
                  isSubscription 
                    ? 'text-orange-500 bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent' 
                    : isCod 
                      ? 'text-orange-500' 
                      : 'text-green-600'
                }`}>{amount}</span>
              </div>
              
              {isSubscription ? (
                <>
                  <div className="flex justify-between items-center text-sm font-bold border-b border-slate-200 pb-3">
                    <span className="text-slate-400">Gói cước:</span>
                    <span className="text-slate-900 font-black uppercase text-xs tracking-wider">
                      {subTier === 'enterprise' ? '👑 Doanh Nghiệp' : '⭐ Chuyên Nghiệp'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-400">Thời hạn sử dụng:</span>
                    <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> 30 Ngày hoạt động
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-400">Mã đơn hàng:</span>
                    <span className="text-slate-900 bg-slate-200 px-3 py-1 rounded-lg text-xs tracking-wider font-mono">
                      {orderId.substring(0, 8).toUpperCase()}
                    </span>
                  </div>
                  {isCod && (
                    <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-2 rounded-xl text-xs font-bold border border-orange-100 mt-2">
                      <Clock className="w-4 h-4 shrink-0" />
                      Thanh toán khi nhận hàng (COD)
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-28 h-28 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/10"
            >
              <XCircle strokeWidth={3} className="w-14 h-14" />
            </motion.div>
            <h1 className="text-3xl font-black text-slate-900 mb-2 font-display">Thanh toán thất bại!</h1>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">
              Giao dịch của bạn đã bị hủy hoặc xảy ra lỗi từ phía hệ thống ngân hàng. Vui lòng thử lại sau.
            </p>
          </>
        )}

        {status !== 'loading' && (
          <div className="flex flex-col gap-3">
            {status === 'success' && !isSubscription && (
              <button
                onClick={() => {
                  window.history.replaceState({}, document.title, '/');
                  onNavigate('my-store');
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                Xem đơn hàng của tôi
              </button>
            )}
            
            <button
              onClick={() => {
                window.history.replaceState({}, document.title, '/');
                onNavigate(isSubscription ? 'manage' : 'store');
              }}
              className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-500/30 hover:bg-primary-hover hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
            >
              {isSubscription ? (
                <>
                  Đi tới trang đăng tin
                  <ArrowRight className="w-4 h-4 ml-1 opacity-50 group-hover:translate-x-1 transition-transform" />
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Quay lại Cửa hàng
                  <ArrowRight className="w-4 h-4 ml-1 opacity-50 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
