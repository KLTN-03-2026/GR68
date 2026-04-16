// ============================================================
// PROBOT KNOWLEDGE SEARCH ENGINE
// Tìm kiếm và định dạng dữ liệu knowledge base cho Gemini RAG
// ============================================================

import { KHO_TRI_THUC, TriThucKhuVuc } from './knowledgeBase';

/**
 * Chuẩn hóa chuỗi: lowercase, bỏ dấu tiếng Việt, trim
 */
export function chuanHoaVanBan(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // bỏ dấu
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .trim();
}

/**
 * Tính điểm tương đồng giữa câu hỏi (query) và một đối tượng tri thức khu vực.
 * Hệ thống điểm số giúp xác định quận/huyện nào được người dùng nhắc đến sát nhất.
 * 
 * @param query Câu hỏi đã được chuyển về chữ thường
 * @param knowledge Đối tượng tri thức về một quận
 * @returns Điểm số phù hợp (càng cao càng đúng)
 */
function tinhDiemPhuHop(query: string, knowledge: TriThucKhuVuc): number {
  const normalizedQuery = chuanHoaVanBan(query);
  let score = 0;

  // Kiểm tra tên quận/huyện
  if (normalizedQuery.includes(chuanHoaVanBan(knowledge.district))) {
    score += 10;
  }

  // Kiểm tra tên thành phố
  if (normalizedQuery.includes(chuanHoaVanBan(knowledge.city))) {
    score += 3;
  }

  // Kiểm tra các tên gọi khác (aliases)
  for (const alias of knowledge.aliases) {
    if (normalizedQuery.includes(chuanHoaVanBan(alias))) {
      score += 8;
      break;
    }
  }

  // Kiểm tra tên trường đại học (nếu có)
  if (knowledge.universities) {
    for (const uni of knowledge.universities) {
      if (normalizedQuery.includes(chuanHoaVanBan(uni))) {
        score += 15; // Phù hợp trường ĐH điểm cao nhất vì rất cụ thể
        break;
      }
    }
  }

  // Kiểm tra tên từng con đường cụ thể trong câu hỏi
  for (const street of knowledge.streets) {
    if (normalizedQuery.includes(chuanHoaVanBan(street.name))) {
      score += 6;
      break;
    }
  }

  return score;
}

/**
 * Hàm tìm kiếm tri thức khu vực phù hợp nhất từ câu hỏi của người dùng.
 * Thường dùng cho các câu hỏi tư vấn khu vực (VD: "Hải Châu có gì?")
 * 
 * @param query Câu nhập liệu của người dùng
 * @returns Đối tượng TriThucKhuVuc tốt nhất hoặc null nếu không khớp
 */
export function timKiemTriThuc(query: string): TriThucKhuVuc | null {
  if (!query || query.trim().length === 0) return null;

  let bestMatch: TriThucKhuVuc | null = null;
  let bestScore = 0;

  // Lặp qua toàn bộ kho dữ liệu để tìm quận có điểm cao nhất
  for (const knowledge of KHO_TRI_THUC) {
    const score = tinhDiemPhuHop(query, knowledge);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = knowledge;
    }
  }

  // Chỉ trả về nếu điểm số đạt ngưỡng tối thiểu (đã lọc các trường hợp nhầm lẫn)
  return bestScore >= 6 ? bestMatch : null;
}

/**
 * Tìm kiếm nhiều khu vực cùng lúc, dùng cho các câu hỏi so sánh hoặc chung chung.
 */
export function timKiemTriThucNhieu(query: string, limit = 3): TriThucKhuVuc[] {
  if (!query || query.trim().length === 0) return [];

  const scored = KHO_TRI_THUC
    .map((k) => ({ knowledge: k, score: tinhDiemPhuHop(query, k) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((item) => item.knowledge);
}

/**
 * CHUYỂN ĐỔI TRI THỨC SANG VĂN BẢN (Dùng cho AI)
 * Chuyển đổi dữ liệu TriThucKhuVuc từ dạng object phức tạp sang định dạng Markdown dễ đọc.
 * Văn bản này sẽ được gửi làm "context" (ngữ cảnh) cho Gemini để AI có thông tin thực tế tư vấn cho người dùng.
 */
export function dinhDangTriThucChoAI(knowledge: TriThucKhuVuc): string {
  const lines: string[] = [];

  lines.push(`## Khu vực: ${knowledge.district} — ${knowledge.city}`);
  lines.push(`**Tổng quan:** ${knowledge.overview}`);
  lines.push(
    `**Giá thuê trung bình:** ${knowledge.avg_price.min} – ${knowledge.avg_price.max} triệu VNĐ/tháng`
  );
  lines.push(`**Phù hợp với:** ${knowledge.target_audience.join(', ')}`);
  
  if (knowledge.universities && knowledge.universities.length > 0) {
    // Chỉ hiển thị tên chính (loại bỏ các alias rút gọn)
    const displayUnis = knowledge.universities.filter(u => u.includes('Đại học') || u.includes('Cao đẳng') || u.includes('FPT'));
    if (displayUnis.length > 0) {
      lines.push(`**Trường Đại học lân cận:** ${displayUnis.join(', ')}`);
    }
  }
  
  lines.push('');

  lines.push('**Ưu điểm khu vực:**');
  knowledge.pros.forEach((p) => lines.push(`  - ${p}`));

  lines.push('**Nhược điểm khu vực:**');
  knowledge.cons.forEach((c) => lines.push(`  - ${c}`));
  lines.push('');

  lines.push('### Các đường phố nên ở:');
  for (const street of knowledge.streets) {
    lines.push('');
    lines.push(`#### Đường ${street.name}`);
    lines.push(`- **Lý do nên ở:** ${street.reason}`);
    lines.push(
      `- **Giá thuê:** ${street.price_range.min} – ${street.price_range.max} triệu/tháng`
    );
    lines.push(`- **Loại phòng:** ${street.types.join(', ')}`);
    lines.push(`- **Phù hợp với:** ${street.target.join(', ')}`);
    lines.push(`- **Tiện ích gần đó:** ${street.amenities.join(' | ')}`);
    lines.push(`- **Ưu điểm:** ${street.pros.join('; ')}`);
    lines.push(`- **Nhược điểm:** ${street.cons.join('; ')}`);
  }

  return lines.join('\n');
}

/**
 * Định dạng nhiều kết quả (dùng cho câu hỏi so sánh nhiều quận)
 */
export function dinhDangNhieuTriThucChoAI(districts: TriThucKhuVuc[]): string {
  if (districts.length === 0) return '';
  return districts.map(dinhDangTriThucChoAI).join('\n\n---\n\n');
}
