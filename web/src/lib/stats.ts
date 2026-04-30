import type { Listing } from "@/types/data"

// 순수익 = 판매가 - (판매가 × 10% + 원가)
// 원가 기본값 172,700원 (멜론티켓 기준: 티켓 + 수수료 + 배송비 포함)
export function calcNetProfit(price: number, cost = 172700): number {
  return Math.round(price - (price * 0.1 + cost))
}

export function getMinPrice(listings: Listing[]): number | null {
  if (!listings.length) return null
  return Math.min(...listings.map((l) => l.price))
}

export function getListingCount(listings: Listing[]): number {
  return listings.filter((l) => l.product_status === "SALE").length
}

export interface PerformDateGroup {
  date: string
  label: string
  listings: Listing[]
  minPrice: number | null
  count: number
  netProfit: number | null
}

export function groupByPerformDate(listings: Listing[]): PerformDateGroup[] {
  const map = new Map<string, Listing[]>()
  for (const l of listings) {
    const key = l.start_perform_date?.slice(0, 10) ?? "unknown"
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(l)
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, items], i, arr) => {
      const label =
        i === 0 ? "첫콘" : i === arr.length - 1 ? "막콘" : `${i + 1}회차`
      const minPrice = getMinPrice(items)
      return {
        date,
        label,
        listings: items,
        minPrice,
        count: getListingCount(items),
        netProfit: minPrice !== null ? calcNetProfit(minPrice) : null,
      }
    })
}

export function getDdayLabel(dateStr: string): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  const diff = Math.round(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )
  if (diff === 0) return "D-DAY"
  if (diff > 0) return `D-${diff}`
  return `D+${Math.abs(diff)}`
}
