import type { ConcertsConfig, DailySnapshot } from "../types/data";

const BASE_URL = import.meta.env.BASE_URL;

/** concerts.json에서 트래킹 중인 공연 목록을 불러온다 */
export async function loadConcerts(): Promise<ConcertsConfig> {
  const res = await fetch(`${BASE_URL}data/concerts.json`);
  return res.json();
}

/** 특정 공연의 수집된 날짜 목록을 불러온다 */
export async function loadIndex(
  artist: string,
  categoryId: number
): Promise<string[]> {
  const folder = `${artist}_${categoryId}`;
  const res = await fetch(`${BASE_URL}data/${folder}/index.json`);
  if (!res.ok) return [];
  return res.json();
}

/** 특정 날짜의 스냅샷 데이터를 불러온다 */
export async function loadSnapshot(
  artist: string,
  categoryId: number,
  date: string
): Promise<DailySnapshot | null> {
  const folder = `${artist}_${categoryId}`;
  const res = await fetch(`${BASE_URL}data/${folder}/${date}.json`);
  if (!res.ok) return null;
  return res.json();
}

/** 공연의 모든 스냅샷을 불러온다 */
export async function loadAllSnapshots(
  artist: string,
  categoryId: number
): Promise<DailySnapshot[]> {
  const dates = await loadIndex(artist, categoryId);
  const snapshots = await Promise.all(
    dates.map((date) => loadSnapshot(artist, categoryId, date))
  );
  return snapshots.filter((s): s is DailySnapshot => s !== null);
}
