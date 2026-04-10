import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Zap, Droplets, Receipt, CheckCircle, ChevronDown, Plus } from 'lucide-react';

interface CreateInvoiceModalProps {
  show: boolean;
  onClose: () => void;
  roomsData: any[]; // The landlord's rooms that are 'occupied'
  preSelectedRoomId?: string | null;
  onCreate: (invoiceData: any) => void;
  loading: boolean;
}

export const CreateInvoiceModal = ({ show, onClose, roomsData, preSelectedRoomId, onCreate, loading }: CreateInvoiceModalProps) => {
  const activeRooms = roomsData.filter(r => r.status === 'occupied' || r.tenant_id);

  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [electricityType, setElectricityType] = useState<'kwh' | 'fixed'>('kwh');
  const [waterType, setWaterType] = useState<'block' | 'fixed' | 'person'>('block');

  const [rentFee, setRentFee] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);

  // Meter states
  const [oldElec, setOldElec] = useState(0);
  const [newElec, setNewElec] = useState(0);
  const [elecPrice, setElecPrice] = useState(3500);

  const [oldWater, setOldWater] = useState(0);
  const [newWater, setNewWater] = useState(0);
  const [waterPrice, setWaterPrice] = useState(20000);

  useEffect(() => {
    if (show && activeRooms.length > 0) {
      if (preSelectedRoomId) {
        setSelectedRoomId(preSelectedRoomId);
      } else if (!selectedRoomId) {
        setSelectedRoomId(activeRooms[0].id);
      }
    }
    if (show && !title) {
      const today = new Date();
      setTitle(`Hóa đơn phòng - Tháng ${today.getMonth() + 1}/${today.getFullYear()}`);
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      setDueDate(nextWeek.toISOString().split('T')[0]);
    }
  }, [show, activeRooms]);

  useEffect(() => {
    if (selectedRoomId) {
      const room = roomsData.find(r => r.id === selectedRoomId);
      if (room) {
        setRentFee(room.price || 0);
        setServiceFee(room.service_fee || 0);
        setOldElec(room.initial_electricity_number || 0); // TODO: fetch from last invoice
        setNewElec(room.initial_electricity_number || 0);
        setElecPrice(room.electricity_price || 3500);
        
        setOldWater(room.initial_water_number || 0); // TODO: fetch from last invoice
        setNewWater(room.initial_water_number || 0);
        setWaterPrice(room.water_price || 20000);
      }
    }
  }, [selectedRoomId, roomsData]);

  const elecUsage = Math.max(0, newElec - oldElec);
  const elecTotal = elecUsage * elecPrice;

  const waterUsage = Math.max(0, newWater - oldWater);
  const waterTotal = waterUsage * waterPrice;

  const finalAmount = rentFee + serviceFee + elecTotal + waterTotal;

  const handleSubmit = () => {
    const room = roomsData.find(r => r.id === selectedRoomId);
    if (!room) return;

    onCreate({
      room_id: room.id,
      tenant_id: room.tenant_id || room.contracts?.find((c: any) => c.status === 'active')?.tenant_id || room.contracts?.[0]?.tenant_id,
      title,
      due_date: dueDate,
      rent_fee: rentFee,
      electricity_fee: elecTotal,
      water_fee: waterTotal,
      service_fee: serviceFee,
      electricity_usage: elecUsage,
      water_usage: waterUsage,
      amount: finalAmount,
      status: 'unpaid'
    });
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
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
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 font-display">
                    Lập hóa đơn mới
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mt-1">
                    Tạo hóa đơn tiền phòng và dịch vụ cho người thuê
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={onClose} 
                className="p-2 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors text-slate-500 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-8 py-6 overflow-y-auto flex-1 space-y-8">
              
              {/* Chọn Phòng & Tiêu đề */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chọn phòng *</label>
                  <div className="relative">
                    <select
                      value={selectedRoomId}
                      onChange={(e) => setSelectedRoomId(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 appearance-none outline-none cursor-pointer"
                    >
                      <option value="" disabled>-- Chọn phòng đang cho thuê --</option>
                      {activeRooms.map(r => (
                        <option key={r.id} value={r.id}>{r.title}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hạn thanh toán *</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 pl-11 outline-none"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tiêu đề hóa đơn *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="VD: Hóa đơn phòng 201 tháng 10"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Chi phí cố định */}
              <div className="pt-6 border-t border-slate-100">
                <h4 className="text-sm font-black text-slate-900 font-display mb-4">Chi phí cố định</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tiền phòng (VNĐ)</label>
                    <input
                      type="number"
                      value={rentFee}
                      onChange={(e) => setRentFee(Number(e.target.value))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary p-4 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phí dịch vụ chung (VNĐ)</label>
                    <input
                      type="number"
                      value={serviceFee}
                      onChange={(e) => setServiceFee(Number(e.target.value))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary p-4 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Điện */}
              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <h4 className="text-sm font-black text-slate-900 font-display">Chỉ số Điện</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số cũ</label>
                    <input type="number" value={oldElec} onChange={e => setOldElec(Number(e.target.value))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 p-3 outline-none" />
                  </div>
                   <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số mới</label>
                    <input type="number" value={newElec} onChange={e => setNewElec(Number(e.target.value))} className="w-full rounded-2xl border border-primary bg-primary/5 font-black text-primary p-3 outline-none" />
                  </div>
                   <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Đơn giá (đ)</label>
                    <input type="number" value={elecPrice} onChange={e => setElecPrice(Number(e.target.value))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 p-3 outline-none" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Thành tiền</label>
                    <div className="w-full rounded-2xl border border-slate-100 bg-slate-100 font-black text-slate-900 p-3 text-right">
                      {elecTotal.toLocaleString()} đ
                    </div>
                  </div>
                </div>
              </div>

              {/* Nước */}
              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <h4 className="text-sm font-black text-slate-900 font-display">Chỉ số Nước</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số cũ</label>
                    <input type="number" value={oldWater} onChange={e => setOldWater(Number(e.target.value))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 p-3 outline-none" />
                  </div>
                   <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số mới</label>
                    <input type="number" value={newWater} onChange={e => setNewWater(Number(e.target.value))} className="w-full rounded-2xl border border-primary bg-primary/5 font-black text-primary p-3 outline-none" />
                  </div>
                   <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Đơn giá (đ)</label>
                    <input type="number" value={waterPrice} onChange={e => setWaterPrice(Number(e.target.value))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 p-3 outline-none" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Thành tiền</label>
                    <div className="w-full rounded-2xl border border-slate-100 bg-slate-100 font-black text-slate-900 p-3 text-right">
                      {waterTotal.toLocaleString()} đ
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Summary */}
            <div className="p-6 border-t border-slate-100 bg-slate-900 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng cộng (Cần thu)</p>
                <p className="text-3xl font-black text-white font-display">
                  {finalAmount.toLocaleString()} <span className="text-xl text-slate-400">VNĐ</span>
                </p>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !selectedRoomId || !title}
                className="bg-primary hover:bg-primary-hover text-white font-black uppercase tracking-widest text-sm py-4 px-8 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Tạo hóa đơn'}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
