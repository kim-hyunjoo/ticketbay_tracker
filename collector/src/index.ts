/**
 * 메인 수집 스크립트
 * concerts.json에 등록된 모든 공연의 매물 데이터를 수집하여 저장한다.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { fetchAllListings } from "./fetcher.js";
import type { ConcertsConfig, DailySnapshot } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");
const DATA_DIR = resolve(ROOT, "data");
const CONCERTS_PATH = resolve(DATA_DIR, "concerts.json");

function today(): string {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
}

async function main() {
  // concerts.json 읽기
  if (!existsSync(CONCERTS_PATH)) {
    console.error("data/concerts.json 파일이 없습니다.");
    console.error("먼저 공연을 등록해주세요.");
    process.exit(1);
  }

  const config: ConcertsConfig = JSON.parse(
    readFileSync(CONCERTS_PATH, "utf-8")
  );

  if (config.concerts.length === 0) {
    console.log("트래킹 중인 공연이 없습니다.");
    return;
  }

  const date = today();
  console.log(`=== ${date} 데이터 수집 시작 ===\n`);

  for (const concert of config.concerts) {
    const folderName = `${concert.artist}_${concert.category_id}`;
    const dir = resolve(DATA_DIR, folderName);
    const filePath = resolve(dir, `${date}.json`);

    // 이미 오늘 수집한 데이터가 있으면 스킵
    if (existsSync(filePath)) {
      console.log(`[${concert.artist}] 오늘 이미 수집됨, 스킵`);
      continue;
    }

    console.log(`[${concert.artist}] 수집 시작 (category_id: ${concert.category_id})`);

    try {
      const { totalListings, listings } = await fetchAllListings(
        concert.category_id
      );

      const snapshot: DailySnapshot = {
        collected_at: new Date().toISOString(),
        artist: concert.artist,
        category_id: concert.category_id,
        venue: concert.venue ?? "",
        total_listings: totalListings,
        listings,
      };

      mkdirSync(dir, { recursive: true });
      writeFileSync(filePath, JSON.stringify(snapshot, null, 2), "utf-8");

      console.log(
        `[${concert.artist}] 완료: ${totalListings}개 매물 저장 → ${folderName}/${date}.json\n`
      );
    } catch (err) {
      console.error(`[${concert.artist}] 수집 실패:`, err);
    }
  }

  // 각 공연 폴더의 index.json 갱신 (웹에서 날짜 목록을 불러올 때 사용)
  for (const concert of config.concerts) {
    const folderName = `${concert.artist}_${concert.category_id}`;
    const dir = resolve(DATA_DIR, folderName);
    if (!existsSync(dir)) continue;

    const dates = readdirSync(dir)
      .filter((f) => f.endsWith(".json") && f !== "index.json")
      .map((f) => f.replace(".json", ""))
      .sort();

    writeFileSync(
      resolve(dir, "index.json"),
      JSON.stringify(dates, null, 2),
      "utf-8"
    );
  }

  console.log("=== 수집 완료 ===");
}

main();
