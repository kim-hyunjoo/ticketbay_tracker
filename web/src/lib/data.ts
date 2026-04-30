import fs from "fs"
import path from "path"
import type { Concert, ConcertsConfig, DailyData } from "@/types/data"

const DATA_ROOT = path.join(process.cwd(), "..", "data")

export function getConcerts(): Concert[] {
  const raw = fs.readFileSync(path.join(DATA_ROOT, "concerts.json"), "utf-8")
  const config: ConcertsConfig = JSON.parse(raw)
  return config.concerts
}

export function getDates(artist: string, categoryId: number): string[] {
  const dir = `${artist}_${categoryId}`
  const raw = fs.readFileSync(path.join(DATA_ROOT, dir, "index.json"), "utf-8")
  return JSON.parse(raw) as string[]
}

export function getDailyData(
  artist: string,
  categoryId: number,
  date: string
): DailyData {
  const dir = `${artist}_${categoryId}`
  const raw = fs.readFileSync(
    path.join(DATA_ROOT, dir, `${date}.json`),
    "utf-8"
  )
  return JSON.parse(raw) as DailyData
}

export function getLatestData(
  artist: string,
  categoryId: number
): DailyData | null {
  const dates = getDates(artist, categoryId)
  for (const date of [...dates].reverse()) {
    const data = getDailyData(artist, categoryId, date)
    if (data.total_listings > 0) return data
  }
  return null
}
