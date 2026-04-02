/** 트래킹 중인 공연 정보 */
export interface Concert {
  artist: string;
  category_id: number;
  venue?: string;
  dates?: string[];
}

/** concerts.json 전체 구조 */
export interface ConcertsConfig {
  concerts: Concert[];
}

/** 티켓베이 API 매물 항목 */
export interface Listing {
  id: number;
  price: number;
  total_price: number;
  list_price: number;
  area: string;
  floor: string;
  grade: string;
  perform_date: string;
  sale_quantity: number;
  seat_number: string;
  seat_number_type: string;
  name: string;
  depth3_name: string;
  is_use_safe: string;
  is_have_ticket: string;
  created_at: string;
  [key: string]: unknown;
}

/** 티켓베이 API 페이지 데이터 */
export interface TicketBayPageData {
  content: Listing[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/** 티켓베이 API 응답 (data로 감싸져 있음) */
export interface TicketBayResponse {
  code: string;
  message: string;
  data: TicketBayPageData;
}

/** 날짜별 저장 데이터 */
export interface DailySnapshot {
  collected_at: string;
  artist: string;
  category_id: number;
  venue: string;
  total_listings: number;
  listings: Listing[];
}
