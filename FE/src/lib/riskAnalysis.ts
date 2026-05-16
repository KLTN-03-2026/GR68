import { supabase } from "./supabase";

export interface LichSuDienNuoc {
  thang: string; // e.g., '2023-05'
  soDien: number;
  soNuoc: number;
}

export interface CanhBaoRuiRo {
  roomId: string;
  loaiRuiRo: 'dien' | 'nuoc';
  mucDoRuiRo: 'thap' | 'trung_binh' | 'cao';
  chiTiet: string;
}

// 1. Hàm tính tiêu thụ trung bình
function tinhMucTieuThuTrungBinh(lichSu: LichSuDienNuoc[]) {
  if (lichSu.length === 0) return { dien: 0, nuoc: 0 };
  const sum = lichSu.reduce((acc, curr) => ({
    dien: acc.dien + curr.soDien,
    nuoc: acc.nuoc + curr.soNuoc
  }), { dien: 0, nuoc: 0 });
  return {
    dien: sum.dien / lichSu.length,
    nuoc: sum.nuoc / lichSu.length
  };
}

// 2. Hàm tính độ lệch chuẩn
function tinhDoLechChuan(lichSu: LichSuDienNuoc[], trungBinh: { dien: number, nuoc: number }) {
  if (lichSu.length <= 1) return { dien: 1, nuoc: 1 }; // Tránh chia 0 hoặc dữ liệu quá ít
  
  const sumSquares = lichSu.reduce((acc, curr) => ({
    dien: acc.dien + Math.pow(curr.soDien - trungBinh.dien, 2),
    nuoc: acc.nuoc + Math.pow(curr.soNuoc - trungBinh.nuoc, 2),
  }), { dien: 0, nuoc: 0 });

  return {
    dien: Math.sqrt(sumSquares.dien / (lichSu.length - 1)) || 1, // Để || 1 tránh bằng 0
    nuoc: Math.sqrt(sumSquares.nuoc / (lichSu.length - 1)) || 1
  };
}

// 3. Hàm chính xử lý logic mùa vụ
export async function duDoanRuiRoDienNuoc(roomId: string, lichSuDienNuoc: LichSuDienNuoc[]): Promise<CanhBaoRuiRo[]> {
  const danhSachCanhBao: CanhBaoRuiRo[] = [];

  if (lichSuDienNuoc.length < 2) {
      // Ít nhất 2 tháng mới phân tích được
      return danhSachCanhBao;
  }

  // Tách riêng dữ liệu tháng hiện tại và lịch sử
  const duLieuHienTai = lichSuDienNuoc[lichSuDienNuoc.length - 1]; // Giả định phần tử cuối là tháng hiện tại
  const lichSuCuToanBo = lichSuDienNuoc.slice(0, lichSuDienNuoc.length - 1);
  
  // Chỉ lấy đúng 3 tháng gần nhất của lịch sử cũ để thuật toán bám sát thực tế sinh hoạt nhất
  const lichSuCu = lichSuCuToanBo.slice(-3);

  // Tính toán mức tiêu thụ trung bình và độ lệch chuẩn của CÁC THÁNG TRƯỚC (Giới hạn tối đa 3 tháng)
  const mucTieuThuTrungBinh = tinhMucTieuThuTrungBinh(lichSuCu);
  const doLechChuan = tinhDoLechChuan(lichSuCu, mucTieuThuTrungBinh);

  // Phân bổ Trọng số Mùa Vụ cho Điện (Seasonality Factor)
  const thangHienTaiStr = duLieuHienTai.thang.split('-')[1]; // Mặc định YYYY-MM
  const thangHienTai = thangHienTaiStr ? parseInt(thangHienTaiStr, 10) : new Date().getMonth() + 1;
  const laMuaNong = (thangHienTai >= 4 && thangHienTai <= 8); 

  let trongSoDien = 1.0;
  if (laMuaNong) {
      trongSoDien = 1.5; // Cho phép ngưỡng mức "bình thường" cao hơn do xài Điều Hòa
  } else {
      trongSoDien = 0.8; // Mùa mưa/lạnh ít dùng làm mát -> nếu điện tăng thì độ gắt cảnh báo sẽ cao hơn
  }

  // Áp dụng trọng số mùa vụ
  const mucTrungBinhDienDuKien = mucTieuThuTrungBinh.dien * trongSoDien;
  const heSoBatThuongDien = (duLieuHienTai.soDien - mucTrungBinhDienDuKien) / doLechChuan.dien;
  const heSoBatThuongNuoc = (duLieuHienTai.soNuoc - mucTieuThuTrungBinh.nuoc) / doLechChuan.nuoc;

  // Cảnh Báo Nước
  let coCanhBaoNuoc = false;
  if (heSoBatThuongNuoc > 2.5 && mucTieuThuTrungBinh.nuoc > 0) {
      coCanhBaoNuoc = true;
      danhSachCanhBao.push({
          roomId,
          loaiRuiRo: 'nuoc',
          mucDoRuiRo: 'cao',
          chiTiet: `Lượng nước tăng quá bất thường (gấp ${Math.round(duLieuHienTai.soNuoc / mucTieuThuTrungBinh.nuoc)} lần TB), nguy cơ rất cao bị rò rỉ bồn cầu hoặc vỡ ống.`
      });
  } else if (heSoBatThuongNuoc > 1.5 && mucTieuThuTrungBinh.nuoc > 0) {
      coCanhBaoNuoc = true;
      danhSachCanhBao.push({
          roomId,
          loaiRuiRo: 'nuoc',
          mucDoRuiRo: 'trung_binh',
          chiTiet: `Lượng nước tiêu thụ có xu hướng tăng cao đáng kể.`
      });
  }

  if (!coCanhBaoNuoc) {
      danhSachCanhBao.push({
          roomId,
          loaiRuiRo: 'nuoc',
          mucDoRuiRo: 'thap',
          chiTiet: `Mức tiêu thụ nước bình thường, ổn định.`
      });
  }

  // Cảnh Báo Điện
  let coCanhBaoDien = false;
  if (heSoBatThuongDien > 2.0 && mucTieuThuTrungBinh.dien > 0) {
      coCanhBaoDien = true;
      const heSoTang = Math.round(duLieuHienTai.soDien / mucTieuThuTrungBinh.dien);
      danhSachCanhBao.push({
          roomId,
          loaiRuiRo: 'dien',
          mucDoRuiRo: laMuaNong ? 'trung_binh' : 'cao', 
          chiTiet: laMuaNong 
              ? `Điện năng tiêu thụ cao. Dù đang là mùa nóng (tháng ${thangHienTai}) sử dụng điều hòa, nhưng lượng điện báo cáo vẫn vượt ngưỡng an toàn (tăng ~${heSoTang} lần).`
              : `BẤT THƯỜNG: Đang là mùa lạnh/mưa nhưng điện năng tiêu thụ LẠI QUÁ CAO (tăng gấp ${heSoTang} lần). Cẩn thận bị rò điện, câu trộm điện hoặc bình nóng lạnh không tự ngắt!`
      });
  } else if (heSoBatThuongDien > 1.2 && !laMuaNong && mucTieuThuTrungBinh.dien > 0) {
      coCanhBaoDien = true;
      danhSachCanhBao.push({
          roomId,
          loaiRuiRo: 'dien',
          mucDoRuiRo: 'trung_binh', /* changed from 'thap' to 'trung_binh' to reserve thap for purely safe */
          chiTiet: `Tháng ${thangHienTai} là mùa lạnh ít dùng máy làm mát nhưng lượng điện lại có dấu hiệu tăng. Mong bạn chú ý lịch trình dùng thiết bị.`
      });
  }

  if (!coCanhBaoDien) {
      danhSachCanhBao.push({
          roomId,
          loaiRuiRo: 'dien',
          mucDoRuiRo: 'thap',
          chiTiet: `Mức tiêu thụ điện bình thường và nằm trong chu kỳ an toàn.`
      });
  }

  // Lưu lịch sử cảnh báo vào CSDL Supabase (Bảng risk_alerts)
  if (danhSachCanhBao.length > 0) {
     for(const alert of danhSachCanhBao) {
        // Chỉ lưu nếu thực sự muốn persist, hoặc lưu toàn bộ theo request mới nhất.
        await supabase.from('risk_alerts').insert({
          room_id: alert.roomId,
          risk_type: alert.loaiRuiRo,
          risk_level: alert.mucDoRuiRo,
          details: alert.chiTiet
        });
     }
  }

  return danhSachCanhBao;
}
