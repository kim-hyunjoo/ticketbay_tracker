"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Shield, Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Concert, DailyData, Listing } from "@/types/data"
import { calcNetProfit } from "@/lib/stats"

interface ConcertMeta {
  concert: Concert
  dates: string[]
}

interface ListingsClientProps {
  concertMeta: ConcertMeta[]
}

function fmt(n: number) {
  return n.toLocaleString("ko-KR") + "원"
}

function performDateLabel(d: string) {
  const date = new Date(d)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours() === 18 ? "18:00" : date.getHours() + ":00"}`
}

export function ListingsClient({ concertMeta }: ListingsClientProps) {
  const [concertIdx, setConcertIdx] = useState(0)
  const [dateIdx, setDateIdx] = useState(0)
  const [data, setData] = useState<DailyData | null>(null)
  const [loading, setLoading] = useState(false)
  const [filterDate, setFilterDate] = useState<string>("all")
  const [filterArea, setFilterArea] = useState<string>("all")

  const current = concertMeta[concertIdx]
  const dates = current.dates
  const selectedDate = dates[dateIdx] ?? null

  useEffect(() => {
    if (!selectedDate) return
    setLoading(true)
    setFilterDate("all")
    setFilterArea("all")
    const { artist, category_id } = current.concert
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ""
    fetch(`${base}/data/${artist}_${category_id}/${selectedDate}.json`)
      .then((r) => r.json())
      .then((d: DailyData) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [concertIdx, dateIdx, selectedDate, current.concert])

  // 공연일 목록 추출
  const performDates = data
    ? [...new Set(data.listings.map((l) => l.start_perform_date?.slice(0, 10)))]
        .filter(Boolean)
        .sort()
    : []

  // 구역 목록 추출 (데이터에서)
  const areas = data
    ? [...new Set(data.listings.map((l) => l.area).filter(Boolean))].sort()
    : []

  const filtered = (data?.listings ?? []).filter((l) => {
    if (filterDate !== "all" && l.start_perform_date?.slice(0, 10) !== filterDate) return false
    if (filterArea !== "all" && l.area !== filterArea) return false
    return true
  })

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-4">
      {/* 상단 컨트롤 */}
      <div className="flex flex-wrap items-center gap-3">
        {/* 공연 선택 */}
        <div className="relative">
          <select
            value={concertIdx}
            onChange={(e) => { setConcertIdx(Number(e.target.value)); setDateIdx(0) }}
            className="appearance-none bg-white border border-[#dfe4ec] rounded-lg pl-4 pr-8 py-[10px] text-sm font-semibold text-[#131820] focus:outline-none focus:ring-1 focus:ring-[#5e78a1]"
          >
            {concertMeta.map((m, i) => (
              <option key={m.concert.category_id} value={i}>
                {m.concert.artist} 2026 - 서울
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5e78a1]" />
        </div>

        {/* 수집일 선택 */}
        <div className="relative">
          <select
            value={dateIdx}
            onChange={(e) => setDateIdx(Number(e.target.value))}
            className="appearance-none bg-white border border-[#dfe4ec] rounded-lg pl-4 pr-8 py-[10px] text-sm text-[#131820] focus:outline-none focus:ring-1 focus:ring-[#5e78a1]"
          >
            {[...dates].reverse().map((d, i) => (
              <option key={d} value={dates.length - 1 - i}>
                {d} 수집
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5e78a1]" />
        </div>

        {/* 공연일 필터 */}
        {performDates.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterDate("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filterDate === "all"
                  ? "bg-[#263040] text-white"
                  : "bg-[#dfe4ec] text-[#394860]"
              }`}
            >
              전체
            </button>
            {performDates.map((d) => (
              <button
                key={d}
                onClick={() => setFilterDate(d!)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filterDate === d
                    ? "bg-[#263040] text-white"
                    : "bg-[#dfe4ec] text-[#394860]"
                }`}
              >
                {d?.slice(5).replace("-", "/")}
              </button>
            ))}
          </div>
        )}

        {/* 구역 필터 */}
        {areas.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-muted-foreground mr-1">구역</span>
            <button
              onClick={() => setFilterArea("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filterArea === "all"
                  ? "bg-[#5e78a1] text-white"
                  : "bg-[#dfe4ec] text-[#394860]"
              }`}
            >
              전체
            </button>
            {areas.map((a) => (
              <button
                key={a}
                onClick={() => setFilterArea(a)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filterArea === a
                    ? "bg-[#5e78a1] text-white"
                    : "bg-[#dfe4ec] text-[#394860]"
                }`}
              >
                {a}구역
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 헤더 정보 */}
      {data && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            총 <span className="font-semibold text-foreground">{filtered.length}</span>개 매물
          </span>
          <span className="text-xs text-[#9faec6]">
            수집: {new Date(data.collected_at).toLocaleString("ko-KR", {
              month: "numeric", day: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}
          </span>
        </div>
      )}

      {/* 매물 리스트 */}
      {loading && (
        <div className="py-16 text-center text-sm text-muted-foreground">
          로딩 중...
        </div>
      )}

      {!loading && data && filtered.length === 0 && (
        <div className="py-16 text-center text-sm text-muted-foreground">
          매물이 없습니다.
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <>
          {/* 데스크톱 테이블 */}
          <div className="hidden md:block bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#eff1f6] text-xs text-muted-foreground">
                  <th className="text-left px-5 py-3 font-medium">구역/좌석</th>
                  <th className="text-left px-4 py-3 font-medium">공연일</th>
                  <th className="text-right px-4 py-3 font-medium">판매가</th>
                  <th className="text-right px-4 py-3 font-medium">순수익</th>
                  <th className="text-left px-4 py-3 font-medium">옵션</th>
                  <th className="text-left px-4 py-3 font-medium">등록일</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <ListingRow key={l.id} listing={l} />
                ))}
              </tbody>
            </table>
          </div>

          {/* 모바일 카드 리스트 */}
          <div className="md:hidden space-y-2">
            {filtered.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ListingRow({ listing: l }: { listing: Listing }) {
  const profit = calcNetProfit(l.price)
  return (
    <tr className="border-b border-[#eff1f6] last:border-0 hover:bg-[#eff1f6]/50 transition-colors">
      <td className="px-5 py-3">
        <div className="font-medium text-[#131820]">{l.area}구역</div>
        <div className="text-xs text-muted-foreground">{l.floor}{l.seat_number ? ` · ${l.seat_number}` : ""}</div>
      </td>
      <td className="px-4 py-3 text-[#394860]">
        {performDateLabel(l.start_perform_date)}
      </td>
      <td className="px-4 py-3 text-right font-mono font-semibold text-[#131820]">
        {fmt(l.price)}
      </td>
      <td className={`px-4 py-3 text-right font-mono font-semibold ${profit >= 0 ? "text-green-600" : "text-red-500"}`}>
        {(profit >= 0 ? "+" : "") + fmt(profit)}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {l.is_use_safe === "YES" && (
            <span title="안전거래"><Shield className="w-3.5 h-3.5 text-[#5e78a1]" /></span>
          )}
          {l.is_use_delivery === "YES" && (
            <span title="배송"><Truck className="w-3.5 h-3.5 text-[#9faec6]" /></span>
          )}
          {l.is_have_ticket === "YES" && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">실물</Badge>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {l.created_at?.slice(5, 16).replace("T", " ")}
      </td>
    </tr>
  )
}

function ListingCard({ listing: l }: { listing: Listing }) {
  const profit = calcNetProfit(l.price)
  return (
    <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] px-4 py-3 space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-sm font-semibold text-[#131820]">{l.area}구역</span>
          <span className="ml-2 text-xs text-muted-foreground">{performDateLabel(l.start_perform_date)}</span>
        </div>
        <div className="text-right">
          <div className="font-mono font-bold text-[#131820]">{fmt(l.price)}</div>
          <div className={`text-xs font-mono font-semibold ${profit >= 0 ? "text-green-600" : "text-red-500"}`}>
            {(profit >= 0 ? "+" : "") + fmt(profit)}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{l.name.trim()}</p>
        <div className="flex items-center gap-1.5">
          {l.is_use_safe === "YES" && <Shield className="w-3.5 h-3.5 text-[#5e78a1]" />}
          {l.is_use_delivery === "YES" && <Truck className="w-3.5 h-3.5 text-[#9faec6]" />}
          {l.is_have_ticket === "YES" && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">실물</Badge>}
        </div>
      </div>
    </div>
  )
}
