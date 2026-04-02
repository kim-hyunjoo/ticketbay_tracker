import type { DailySnapshot, DailyStats, Listing } from "../types/data";

/** 매물 목록에서 통계를 계산한다 */
function calcStats(date: string, listings: Listing[]): DailyStats {
  if (listings.length === 0) {
    return { date, minPrice: 0, avgPrice: 0, maxPrice: 0, listingCount: 0 };
  }
  const prices = listings.map((l) => l.price);
  return {
    date,
    minPrice: Math.min(...prices),
    avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    maxPrice: Math.max(...prices),
    listingCount: listings.length,
  };
}

/** 전체 회차 통합 날짜별 최저가 통계 */
export function statsByCollectedDate(snapshots: DailySnapshot[]): DailyStats[] {
  return snapshots.map((s) => {
    const date = s.collected_at.split("T")[0];
    return calcStats(date, s.listings);
  });
}

/** 회차별(공연날짜별) 날짜별 최저가 통계 */
export function statsByPerformDate(
  snapshots: DailySnapshot[]
): Map<string, DailyStats[]> {
  // 공연 날짜 목록 추출
  const performDates = new Set<string>();
  snapshots.forEach((s) =>
    s.listings.forEach((l) => performDates.add(l.perform_date.split("T")[0]))
  );

  const result = new Map<string, DailyStats[]>();

  for (const performDate of performDates) {
    const stats = snapshots.map((s) => {
      const date = s.collected_at.split("T")[0];
      const filtered = s.listings.filter(
        (l) => l.perform_date.split("T")[0] === performDate
      );
      return calcStats(date, filtered);
    });
    result.set(performDate, stats);
  }

  return result;
}

/** 구역별(floor별) 날짜별 최저가 통계 */
export function statsByFloor(
  snapshots: DailySnapshot[]
): Map<string, DailyStats[]> {
  const floors = new Set<string>();
  snapshots.forEach((s) => s.listings.forEach((l) => floors.add(l.floor)));

  const result = new Map<string, DailyStats[]>();

  for (const floor of floors) {
    const stats = snapshots.map((s) => {
      const date = s.collected_at.split("T")[0];
      const filtered = s.listings.filter((l) => l.floor === floor);
      return calcStats(date, filtered);
    });
    result.set(floor, stats);
  }

  return result;
}
