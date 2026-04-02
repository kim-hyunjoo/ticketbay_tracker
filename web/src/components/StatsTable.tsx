import type { DailySnapshot } from "../types/data";

interface Props {
  snapshots: DailySnapshot[];
}

export default function StatsTable({ snapshots }: Props) {
  if (snapshots.length === 0) return null;

  const latest = snapshots[snapshots.length - 1];
  const performDates = [
    ...new Set(latest.listings.map((l) => l.perform_date.split("T")[0])),
  ].sort();

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h3>최신 시세 요약 ({latest.collected_at.split("T")[0]})</h3>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.9rem",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid #333" }}>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>공연일</th>
            <th style={{ textAlign: "right", padding: "0.5rem" }}>매물 수</th>
            <th style={{ textAlign: "right", padding: "0.5rem" }}>최저가</th>
            <th style={{ textAlign: "right", padding: "0.5rem" }}>평균가</th>
            <th style={{ textAlign: "right", padding: "0.5rem" }}>최고가</th>
          </tr>
        </thead>
        <tbody>
          {performDates.map((pd) => {
            const listings = latest.listings.filter(
              (l) => l.perform_date.split("T")[0] === pd
            );
            const prices = listings.map((l) => l.price);
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            const avg = Math.round(
              prices.reduce((a, b) => a + b, 0) / prices.length
            );
            return (
              <tr key={pd} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "0.5rem" }}>{pd}</td>
                <td style={{ textAlign: "right", padding: "0.5rem" }}>
                  {listings.length}개
                </td>
                <td style={{ textAlign: "right", padding: "0.5rem" }}>
                  {min.toLocaleString()}원
                </td>
                <td style={{ textAlign: "right", padding: "0.5rem" }}>
                  {avg.toLocaleString()}원
                </td>
                <td style={{ textAlign: "right", padding: "0.5rem" }}>
                  {max.toLocaleString()}원
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
