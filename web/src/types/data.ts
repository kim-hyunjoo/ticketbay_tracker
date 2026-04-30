export interface Concert {
  artist: string
  category_id: number
  venue: string
}

export interface Listing {
  id: number
  category_id: number
  name: string
  perform_date: string
  start_perform_date: string
  area: string
  floor: string
  grade: string
  seat_number: string
  seat_number_type: string
  price: number
  total_price: number
  list_price: number
  product_status: "SALE" | "SOLDOUT" | string
  sale_quantity: number
  is_use_delivery: "YES" | "NO"
  is_use_safe: "YES" | "NO"
  is_have_ticket: "YES" | "NO"
  created_at: string
}

export interface DailyData {
  collected_at: string
  artist: string
  category_id: number
  venue: string
  total_listings: number
  listings: Listing[]
}

export interface ConcertsConfig {
  concerts: Concert[]
}
