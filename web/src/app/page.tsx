import { getConcerts, getLatestData, getDates, getDailyData } from "@/lib/data"
import {
  getMinPrice,
  getListingCount,
  calcNetProfit,
  groupByPerformDate,
  getDdayLabel,
} from "@/lib/stats"
import { DashboardClient } from "@/components/dashboard/dashboard-client"

export default async function DashboardPage() {
  const concerts = getConcerts()

  const allConcertData = concerts.map((concert) => {
    const latest = getLatestData(concert.artist, concert.category_id)
    const listings = latest?.listings ?? []

    const minPrice = getMinPrice(listings)
    const listingCount = getListingCount(listings)
    const netProfit = minPrice !== null ? calcNetProfit(minPrice) : null
    const performGroups = groupByPerformDate(listings)
    const firstDate = performGroups[0]?.date ?? null
    const ddayLabel = firstDate ? getDdayLabel(firstDate) : null
    const uniquePerformDates = performGroups.map((g) => g.date)

    const dates = getDates(concert.artist, concert.category_id)
    const timeSeriesData = dates.map((date) => {
      try {
        const data = getDailyData(concert.artist, concert.category_id, date)
        const mp = getMinPrice(data.listings)
        return {
          date: date.slice(5),
          minPrice: mp,
          count: getListingCount(data.listings),
          netProfit: mp !== null ? calcNetProfit(mp) : null,
        }
      } catch {
        return { date: date.slice(5), minPrice: null, count: 0, netProfit: null }
      }
    })

    return {
      concert,
      minPrice,
      listingCount,
      netProfit,
      ddayLabel,
      performGroups,
      uniquePerformDates,
      timeSeriesData,
      lastCollected: latest?.collected_at ?? null,
    }
  })

  return <DashboardClient allConcertData={allConcertData} />
}
