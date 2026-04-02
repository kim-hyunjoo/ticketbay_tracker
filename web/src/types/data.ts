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
  name: string;
  depth3_name: string;
  created_at: string;
}

export interface DailySnapshot {
  collected_at: string;
  artist: string;
  category_id: number;
  venue: string;
  total_listings: number;
  listings: Listing[];
}

export interface Concert {
  artist: string;
  category_id: number;
  venue?: string;
}

export interface ConcertsConfig {
  concerts: Concert[];
}

/** 차트에 사용할 가공된 데이터 */
export interface DailyStats {
  date: string; // 수집일 (YYYY-MM-DD)
  minPrice: number;
  avgPrice: number;
  maxPrice: number;
  listingCount: number;
}
