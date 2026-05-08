import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, AlertTriangle, CheckCircle, Info, FileText } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface PropsTrangQuyDinh {
  onNavigate: (page: string, params?: any) => void;
  user: SupabaseUser | null;
  onLogout: () => void;
}

export const TrangQuyDinh = ({ onNavigate: chuyenTrang, user: nguoiDung, onLogout: dangXuat }: PropsTrangQuyDinh) => {
  const danhSachQuyDinh = [
    {
      tieuDe: 'Nội dung tin đăng',
      cacMuc: [
        'Thông tin phải chính xác, trung thực, không gây nhầm lẫn.',
        'Hình ảnh phải là ảnh thật của căn phòng, không dùng ảnh mạng.',
        'Không đăng tin trùng lặp nhiều lần cho cùng một địa chỉ.',
        'Giá cả và chi phí dịch vụ phải được niêm yết rõ ràng.'
      ],
      bieuTuong: FileText,
      mauSac: 'text-blue-600 bg-blue-50'
    },
    {
      tieuDe: 'Hành vi bị cấm',
      cacMuc: [
        'Nghiêm cấm các hành vi lừa đảo, chiếm đoạt tiền cọc.',
        'Không đăng tải nội dung vi phạm pháp luật, thuần phong mỹ tục.',
        'Không sử dụng ngôn từ xúc phạm, thiếu văn hóa.',
        'Không chèo kéo khách hàng sang các nền tảng cạnh tranh khác.'
      ],
      bieuTuong: AlertTriangle,
      mauSac: 'text-rose-600 bg-rose-50'
    },
    {
      tieuDe: 'Xác thực tài khoản',
      cacMuc: [
        'Chủ trọ nên xác thực danh tính để tăng độ uy tín.',
        'Thông tin liên hệ (SĐT, Email) phải luôn hoạt động.',
        'Mỗi người dùng chỉ nên sở hữu một tài khoản duy nhất.'
      ],
      bieuTuong: ShieldCheck,
      mauSac: 'text-emerald-600 bg-emerald-50'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="w-full max-w-5xl mx-auto px-6 py-12 space-y-16 flex-1">
        <section className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">
            <Info className="w-4 h-4" />
            <span>Chính sách nền tảng</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 font-display">Quy định đăng tin</h1>
          <p className="max-w-2xl mx-auto text-slate-500 text-lg font-medium">
            Để xây dựng một cộng đồng tin cậy, chúng tôi áp dụng các quy định nghiêm ngặt đối với mọi tin đăng trên hệ thống.
          </p>
        </section>

        <div className="space-y-12">
          {danhSachQuyDinh.map((quyDinh, chiSo) => (
            <motion.div
              key={chiSo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: chiSo * 0.1 }}
              className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-14 h-14 rounded-2xl ${quyDinh.mauSac} flex items-center justify-center`}>
                  <quyDinh.bieuTuong className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 font-display">{quyDinh.tieuDe}</h2>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quyDinh.cacMuc.map((muc, chiSoMuc) => (
                  <li key={chiSoMuc} className="flex gap-4 items-start group">
                    <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-slate-600 font-medium leading-relaxed">{muc}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <section className="bg-primary/5 rounded-3xl p-8 border border-primary/10 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Bạn có thắc mắc về quy định?</h3>
            <p className="text-slate-500 font-medium">Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp.</p>
          </div>
          <button 
            onClick={() => chuyenTrang('contact')}
            className="px-8 py-3 bg-primary text-white font-black rounded-xl hover:bg-primary-hover transition-all active:scale-95"
          >
            Liên hệ hỗ trợ
          </button>
        </section>
      </main>
    </div>
  );
};
