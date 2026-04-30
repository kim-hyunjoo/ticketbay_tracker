"use client"

import { useState } from "react"
import { StatsCards } from "./stats-cards"
import { SummaryTable } from "./summary-table"
import { PriceChart } from "./price-chart"
import { ConcertSelector } from "./concert-selector"
import { Separator } from "@/components/ui/separator"
import type { Concert } from "@/types/data"
import type { PerformDateGroup } from "@/lib/stats"

interface ConcertData {
  concert: Concert
  minPrice: number | null
  listingCount: number
  netProfit: number | null
  ddayLabel: string | null
  performGroups: PerformDateGroup[]
  uniquePerformDates: string[]
  timeSeriesData: {
    date: string
    minPrice: number | null
    count: number
    netProfit: number | null
  }[]
  lastCollected: string | null
}

interface DashboardClientProps {
  allConcertData: ConcertData[]
}

export function DashboardClient({ allConcertData }: DashboardClientProps) {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const current = allConcertData[selectedIdx]

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-5">
      <ConcertSelector
        concerts={allConcertData.map((d) => d.concert)}
        selected={current.concert}
        performDates={current.uniquePerformDates}
        lastCollected={current.lastCollected}
        onSelect={(categoryId) => {
          const idx = allConcertData.findIndex(
            (d) => d.concert.category_id === categoryId
          )
          if (idx !== -1) setSelectedIdx(idx)
        }}
      />

      <StatsCards
        minPrice={current.minPrice}
        listingCount={current.listingCount}
        netProfit={current.netProfit}
        ddayLabel={current.ddayLabel}
      />

      <Separator />

      <PriceChart
        timeSeriesData={current.timeSeriesData}
        performGroups={current.performGroups}
      />

      <Separator />

      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">
          회차별 시세 요약
        </h2>
        <SummaryTable groups={current.performGroups} />
      </div>
    </div>
  )
}
