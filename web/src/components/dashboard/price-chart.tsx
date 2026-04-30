"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import type { PerformDateGroup } from "@/lib/stats"

interface ChartData {
  date: string
  minPrice: number | null
  count: number
  netProfit: number | null
}

interface PriceChartProps {
  timeSeriesData: ChartData[]
  performGroups: PerformDateGroup[]
}

function fmt(n: number | null | undefined) {
  if (n == null) return "-"
  return n.toLocaleString("ko-KR") + "원"
}

function fmtTooltip(v: unknown) {
  if (typeof v !== "number") return "-"
  return fmt(v)
}

export function PriceChart({ timeSeriesData, performGroups }: PriceChartProps) {
  const byDateData = performGroups.map((g) => ({
    label: g.label,
    minPrice: g.minPrice,
    count: g.count,
    netProfit: g.netProfit,
  }))

  const areas = [...new Set(performGroups.flatMap((g) =>
    g.listings.map((l) => l.area || "기타")
  ))].slice(0, 6)

  const areaByDate = performGroups.map((g) => {
    const entry: Record<string, number | string> = { label: g.label }
    for (const area of areas) {
      const prices = g.listings
        .filter((l) => (l.area || "기타") === area)
        .map((l) => l.price)
      if (prices.length) entry[area] = Math.min(...prices)
    }
    return entry
  })

  const COLORS = [
    "#5e78a1", "#7e93b4", "#9faec6", "#394860", "#263040", "#bfc9d9",
  ]

  return (
    <Tabs defaultValue="overall">
      <TabsList className="flex-wrap h-auto gap-1 bg-[#eff1f6] rounded-[10px] p-1">
        <TabsTrigger value="overall" className="rounded-lg text-[13px] data-[state=active]:bg-[#263040] data-[state=active]:text-white data-[state=active]:font-semibold data-[state=inactive]:text-[#5e78a1] data-[state=inactive]:font-normal">전체 최저가</TabsTrigger>
        <TabsTrigger value="byDate" className="rounded-lg text-[13px] data-[state=active]:bg-[#263040] data-[state=active]:text-white data-[state=active]:font-semibold data-[state=inactive]:text-[#5e78a1] data-[state=inactive]:font-normal">회차별 최저가</TabsTrigger>
        <TabsTrigger value="byArea" className="rounded-lg text-[13px] data-[state=active]:bg-[#263040] data-[state=active]:text-white data-[state=active]:font-semibold data-[state=inactive]:text-[#5e78a1] data-[state=inactive]:font-normal">구역별 최저가</TabsTrigger>
        <TabsTrigger value="profit" className="rounded-lg text-[13px] data-[state=active]:bg-[#263040] data-[state=active]:text-white data-[state=active]:font-semibold data-[state=inactive]:text-[#5e78a1] data-[state=inactive]:font-normal">순수익</TabsTrigger>
        <TabsTrigger value="velocity" className="rounded-lg text-[13px] data-[state=active]:bg-[#263040] data-[state=active]:text-white data-[state=active]:font-semibold data-[state=inactive]:text-[#5e78a1] data-[state=inactive]:font-normal">소진율</TabsTrigger>
      </TabsList>

      <TabsContent value="overall" className="mt-4">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dfe4ec" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={fmtTooltip} />
            <Line
              type="monotone"
              dataKey="minPrice"
              stroke="#5e78a1"
              strokeWidth={2}
              dot={false}
              name="최저가"
            />
          </LineChart>
        </ResponsiveContainer>
      </TabsContent>

      <TabsContent value="byDate" className="mt-4">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={byDateData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dfe4ec" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={fmtTooltip} />
            <Bar dataKey="minPrice" fill="#5e78a1" name="최저가" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>

      <TabsContent value="byArea" className="mt-4">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={areaByDate}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dfe4ec" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={fmtTooltip} />
            <Legend />
            {areas.map((area, i) => (
              <Bar
                key={area}
                dataKey={area}
                fill={COLORS[i % COLORS.length]}
                name={`${area}구역`}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>

      <TabsContent value="profit" className="mt-4">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={byDateData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dfe4ec" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={fmtTooltip} />
            <Bar
              dataKey="netProfit"
              fill="#394860"
              name="순수익"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>

      <TabsContent value="velocity" className="mt-4">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dfe4ec" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#7e93b4"
              strokeWidth={2}
              dot={false}
              name="매물 수"
            />
          </LineChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  )
}
