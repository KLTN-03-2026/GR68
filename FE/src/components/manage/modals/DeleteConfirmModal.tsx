import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle } from 'lucide-react';

interface DeleteConfirmModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  loading?: boolean;
}

export const DeleteConfirmModal = ({ 
  show, 
  onClose, 
  onConfirm, 
  title, 
  itemName, 
  loading 
}: DeleteConfirmModalProps) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8 text-center">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-red-400/20 rounded-full animate-ping"></div>
                <AlertCircle className="w-12 h-12 relative z-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 font-display">{title}</h3>
              <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
                Bạn sắp xóa vĩnh viễn <strong className="text-slate-900 text-base">"{itemName}"</strong>.<br />
                Hành động này sẽ <strong className="text-red-500">xóa toàn bộ hợp đồng, hóa đơn và bài đăng</strong> liên quan. 
                Không thể hoàn tác thao tác này!
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-widest text-white bg-red-500 hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Xóa ngay'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
