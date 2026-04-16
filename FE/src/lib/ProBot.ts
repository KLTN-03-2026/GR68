// ============================================================
// ProBot.ts — Logic Cốt Lõi: Chỉ dẫn hệ thống, Nhận diện ý định,
//              Trích xuất tham số tìm kiếm, Kết nối Gemini API
// ============================================================

import { GoogleGenAI } from "@google/genai";

// ─────────────────────────────────────────────────────────────
// CHỈ DẪN HỆ THỐNG (System Instructions)
// ─────────────────────────────────────────────────────────────

export const HUONG_DAN_HE_THONG = `
Bạn là ProBot - trợ lý tư vấn phòng trọ của nền tảng Trọ Pro.
Phong cách: Ngắn gọn, thân thiện, thực tế. Luôn trả lời bằng tiếng Việt.

Vai trò của bạn:
1. Tư vấn người thuê về khu vực, đường phố phù hợp với nhu cầu của họ
2. Phân tích ưu/nhược điểm khu vực, tiện ích xung quanh, mức giá phù hợp
3. Đặt câu hỏi để hiểu rõ nhu cầu nếu thông tin chưa đủ

Quy tắc bắt buộc:
- Nếu có "DỮ LIỆU KHU VỰC" bên dưới, ưu tiên dùng dữ liệu đó để trả lời chính xác
- KHÔNG bịa thông tin. Nếu không có dữ liệu, nói thẳng "Mình chưa có dữ liệu khu vực này"
- KHÔNG dẫn link hoặc nguồn tham khảo bên ngoài
- Câu trả lời ngắn gọn, có cấu trúc rõ ràng (dùng bullet points khi cần)
`;

// ─────────────────────────────────────────────────────────────
// ĐỊNH NGHĨA KIỂU DỮ LIỆU (Types)
// ─────────────────────────────────────────────────────────────

export interface ThamSoTimKiem {
  location?: string;
  street?: string;
  minPrice?: number; // VNĐ
  maxPrice?: number; // VNĐ
  minArea?: number;  // m²
  roomType?: string;
}

export type YDinh = 'FIND_ROOM' | 'ADVICE' | 'CHAT';

// ─────────────────────────────────────────────────────────────
// NHẬN DIỆN Ý ĐỊNH (Client-side, không gọi API)
// ─────────────────────────────────────────────────────────────

const TU_KHOA_TIM_PHONG = [
  'tìm', 'thuê', 'kiếm', 'cho thuê', 'có phòng', 'phòng trống',
  'muốn thuê', 'cần thuê', 'tìm phòng', 'tìm trọ', 'phòng nào',
];

const TU_KHOA_TU_VAN = [
  'nên ở', 'nên thuê', 'đường nào', 'khu nào', 'ở đâu', 'khu vực nào',
  'tiện ích', 'gần trường', 'gần chợ', 'ưu điểm', 'nhược điểm',
  'so sánh', 'tốt không', 'an ninh', 'an toàn', 'yên tĩnh',
];

/**
 * NHẬN DIỆN Ý ĐỊNH (Intent Detection)
 * Hàm này dùng Regex để phân loại nhanh câu hỏi của người dùng ngay tại trình duyệt (Client-side), 
 * giúp giảm tải cho API và tăng tốc độ phản hồi.
 * 
 * @param text Câu hỏi của người dùng
 * @returns Loại ý định: 'FIND_ROOM' (Tìm phòng), 'ADVICE' (Tư vấn), hoặc 'CHAT' (Tán gẫu)
 */
export function nhanDienYDinh(text: string): YDinh {
  const lower = text.toLowerCase();

  // Kiểm tra từ khóa tìm phòng
  const coTuKhoaTimPhong = TU_KHOA_TIM_PHONG.some(k => lower.includes(k));
  // Kiểm tra nếu có nhắc đến giá tiền (VD: "2 triệu", "3tr")
  const coGiaTien = /\d+\s*(?:triệu|tr)/.test(lower);

  if (coTuKhoaTimPhong || coGiaTien) return 'FIND_ROOM';

  // Kiểm tra từ khóa tư vấn khu vực
  const coTuKhoaTuVan = TU_KHOA_TU_VAN.some(k => lower.includes(k));
  if (coTuKhoaTuVan) return 'ADVICE';

  return 'CHAT';
}

// ─────────────────────────────────────────────────────────────
// TRÍCH XUẤT THAM SỐ TÌM KIẾM (Dùng Regex, không gọi API)
// ─────────────────────────────────────────────────────────────

/**
 * TRÍCH XUẤT THAM SỐ TÌM KIẾM
 * Sử dụng Regex để "bóc tách" các thông tin cụ thể (giá, diện tích, loại phòng, đường) 
 * từ câu nói tự nhiên của người dùng để đưa vào câu lệnh SQL tìm phòng.
 */
export function trichXuatThamSo(text: string): ThamSoTimKiem {
  const params: ThamSoTimKiem = {};
  const lower = text.toLowerCase();

  // Lọc khoảng giá: "2-4 triệu", "từ 2 đến 4 triệu"
  const rangeMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*[-–đến tới]+\s*(\d+(?:[.,]\d+)?)\s*(?:triệu|tr)/);
  if (rangeMatch) {
    params.minPrice = parseFloat(rangeMatch[1].replace(',', '.')) * 1_000_000;
    params.maxPrice = parseFloat(rangeMatch[2].replace(',', '.')) * 1_000_000;
  }

  // Lọc giá trần: "dưới 5 triệu"
  if (!params.maxPrice) {
    const maxMatch = lower.match(/(?:dưới|không quá|tối đa|max)\s*(\d+(?:[.,]\d+)?)\s*(?:triệu|tr)/);
    if (maxMatch) params.maxPrice = parseFloat(maxMatch[1].replace(',', '.')) * 1_000_000;
  }

  // Lọc giá sàn: "trên 2 triệu"
  if (!params.minPrice) {
    const minMatch = lower.match(/(?:trên|từ|ít nhất|tối thiểu)\s*(\d+(?:[.,]\d+)?)\s*(?:triệu|tr)/);
    if (minMatch) params.minPrice = parseFloat(minMatch[1].replace(',', '.')) * 1_000_000;
  }

  // Lọc diện tích: "30m2"
  const areaMatch = lower.match(/(\d+)\s*(?:m2|m²|mét vuông|mét)/);
  if (areaMatch) params.minArea = parseInt(areaMatch[1]);

  // Lọc loại phòng
  const typeMap: Record<string, string> = {
    'chung cư mini': 'chung cư mini',
    'studio': 'studio',
    'căn hộ': 'căn hộ',
    'phòng trọ': 'phòng trọ',
    'nhà trọ': 'phòng trọ',
  };
  for (const [keyword, type] of Object.entries(typeMap)) {
    if (lower.includes(keyword)) { params.roomType = type; break; }
  }

  // Lọc tên đường: "đường Ngô Quyền"
  const streetMatch = lower.match(/(?:đường|phố)\s+([a-zà-ỹ0-9\s]{2,40}?)(?:\s+(?:quận|q\.|huyện|ở|tại|giá|khoảng|có|cho|thuê|phường|p\.)|$|,|\.)/i);
  if (streetMatch && streetMatch[1].trim()) {
    let streetName = streetMatch[1].trim();
    if (streetName.length > 2) {
      params.street = streetName;
    }
  }

  return params;
}

// ─────────────────────────────────────────────────────────────
// GỌI GEMINI API VỚI CƠ CHẾ TỰ ĐỘNG THỬ LẠI (Auto-retry)
// ─────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function parseRetryDelay(error: any): number {
  try {
    const msg = typeof error?.message === 'string' ? error.message : JSON.stringify(error);
    // Trích xuất thời gian chờ (retryDelay) từ JSON của thông báo lỗi
    const jsonStart = msg.indexOf('{');
    if (jsonStart !== -1) {
      const parsed = JSON.parse(msg.slice(jsonStart));
      const retryInfo = (parsed?.error?.details || []).find((d: any) =>
        d['@type']?.includes('RetryInfo')
      );
      if (retryInfo?.retryDelay) return parseInt(String(retryInfo.retryDelay)) + 2;
    }
  } catch {}
  return 62; // Mặc định chờ 60s + 2s dự phòng an toàn
}

function isRateLimitError(error: any): boolean {
  const msg = String(error?.message || error);
  return msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota');
}

/**
 * GỌI GOOGLE GEMINI API
 * Hàm chính thức để gửi văn bản cho AI và nhận câu trả lời. 
 * Đã tích hợp sẵn cơ chế Retry (thử lại) nếu gặp lỗi Quota (giới hạn lượt gọi).
 */
export async function goiAI(
  userText: string,
  systemInstruction: string,
  apiKey: string,
  history: Array<{ role: 'user' | 'model'; text: string }> = [],
  onCountdown?: (s: number) => void,
  maxRetries = 2
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });

  // Xây dựng nội dung tin nhắn từ lịch sử + tin nhắn hiện tại
  const contents = [
    ...history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }],
    })),
    { role: 'user' as const, parts: [{ text: userText }] },
  ];

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents,
        config: { systemInstruction, temperature: 0.7 },
      });

      const parts = (response.candidates?.[0]?.content?.parts || []) as any[];
      return parts.filter(p => p.text).map(p => p.text as string).join('\n').trim();

    } catch (error: any) {
      if (isRateLimitError(error) && attempt < maxRetries) {
        const delay = parseRetryDelay(error);
        console.warn(`[ProBot] Rate limit hit. Retrying in ${delay}s... (attempt ${attempt + 1})`);

        if (onCountdown) {
          for (let i = delay; i > 0; i--) {
            onCountdown(i);
            await sleep(1000);
          }
          onCountdown(0);
        } else {
          await sleep(delay * 1000);
        }
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}
