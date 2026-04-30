"use client"

import { ChevronDown, MapPin, Calendar } from "lucide-react"
import type { Concert } from "@/types/data"

interface ConcertSelectorProps {
  concerts: Concert[]
  selected: Concert
  performDates: string[]
  lastCollected: string | null
  onSelect: (categoryId: number) => void
}

export function ConcertSelector({
  concerts,
  selected,
  performDates,
  lastCollected,
  onSelect,
}: ConcertSelectorProps) {
  const dateLabel = performDates
    .map((d) => {
      const [, m, day] = d.split("-")
      return `${parseInt(m)}/${parseInt(day)}`
    })
    .join(", ")

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Concert Selector */}
        <div className="relative">
          <select
            value={selected.category_id}
            onChange={(e) => onSelect(Number(e.target.value))}
            className="appearance-none bg-white border border-[#dfe4ec] rounded-lg pl-4 pr-8 py-[10px] text-sm font-semibold text-[#131820] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#5e78a1]"
          >
            {concerts.map((c) => (
              <option key={c.category_id} value={c.category_id}>
                {c.artist} 2026 - 서울
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5e78a1]" />
        </div>

        {/* 공연장 태그 */}
        <span className="inline-flex items-center gap-1 bg-[#dfe4ec] rounded-full px-3 py-1.5 text-xs text-[#394860]">
          <MapPin className="w-3.5 h-3.5 text-[#5e78a1]" />
          {selected.venue}
        </span>

        {/* 날짜 태그 */}
        {dateLabel && (
          <span className="inline-flex items-center gap-1 bg-[#dfe4ec] rounded-full px-3 py-1.5 text-xs text-[#394860]">
            <Calendar className="w-3.5 h-3.5 text-[#5e78a1]" />
            {dateLabel}
          </span>
        )}
      </div>

      {lastCollected && (
        <span className="text-xs text-[#9faec6]">
          마지막 수집:{" "}
          {new Date(lastCollected).toLocaleString("ko-KR", {
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      )}
    </div>
  )
}
