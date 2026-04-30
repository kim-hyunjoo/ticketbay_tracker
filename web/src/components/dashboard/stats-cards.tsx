interface StatsCardsProps {
  minPrice: number | null
  listingCount: number
  netProfit: number | null
  ddayLabel: string | null
}

function fmt(n: number) {
  return n.toLocaleString("ko-KR") + "원"
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="flex flex-col justify-center gap-1 bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] h-[72px] md:h-[100px] px-[10px] md:px-5 py-3 md:py-4">
      <span className="text-[10px] md:text-xs text-muted-foreground">{label}</span>
      <span className="font-mono text-base md:text-2xl font-bold text-foreground leading-tight tabular-nums">
        {value}
      </span>
      {sub && (
        <span className="text-[9px] md:text-[11px] text-[#2d5e3a]">{sub}</span>
      )}
    </div>
  )
}

export function StatsCards({
  minPrice,
  listingCount,
  netProfit,
  ddayLabel,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
      <StatCard
        label="최저가"
        value={minPrice !== null ? fmt(minPrice) : "-"}
      />
      <StatCard label="매물 수" value={`${listingCount}개`} />
      <StatCard
        label="순수익"
        value={
          netProfit !== null
            ? (netProfit >= 0 ? "+" : "") + fmt(netProfit)
            : "-"
        }
      />
      <StatCard label="첫 회차" value={ddayLabel ?? "-"} />
    </div>
  )
}
