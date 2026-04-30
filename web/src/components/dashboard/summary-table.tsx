import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { PerformDateGroup } from "@/lib/stats"
import { getDdayLabel } from "@/lib/stats"

interface SummaryTableProps {
  groups: PerformDateGroup[]
}

function fmt(n: number) {
  return n.toLocaleString("ko-KR") + "원"
}

export function SummaryTable({ groups }: SummaryTableProps) {
  if (!groups.length) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        매물 데이터가 없습니다.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>회차</TableHead>
          <TableHead>공연일</TableHead>
          <TableHead>D-day</TableHead>
          <TableHead className="text-right">최저가</TableHead>
          <TableHead className="text-right">매물 수</TableHead>
          <TableHead className="text-right">순수익</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groups.map((g) => {
          const dday = getDdayLabel(g.date)
          return (
            <TableRow key={g.date}>
              <TableCell>
                <Badge variant="secondary">{g.label}</Badge>
              </TableCell>
              <TableCell className="text-sm">{g.date}</TableCell>
              <TableCell className="text-sm font-medium">{dday}</TableCell>
              <TableCell className="text-right text-sm">
                {g.minPrice !== null ? fmt(g.minPrice) : "-"}
              </TableCell>
              <TableCell className="text-right text-sm">{g.count}개</TableCell>
              <TableCell
                className={`text-right text-sm font-medium ${
                  g.netProfit !== null && g.netProfit >= 0
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {g.netProfit !== null
                  ? (g.netProfit >= 0 ? "+" : "") + fmt(g.netProfit)
                  : "-"}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
