import { useEffect, useState } from "react";
import type { Concert, DailySnapshot } from "./types/data";
import { loadConcerts, loadAllSnapshots } from "./utils/dataLoader";
import {
  statsByCollectedDate,
  statsByPerformDate,
  statsByFloor,
} from "./utils/stats";
import PriceChart, { getColor } from "./components/PriceChart";
import ConcertSelector from "./components/ConcertSelector";
import StatsTable from "./components/StatsTable";
import "./App.css";

type ViewMode = "all" | "byDate" | "byFloor";

export default function App() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [selected, setSelected] = useState<Concert | null>(null);
  const [snapshots, setSnapshots] = useState<DailySnapshot[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConcerts().then((config) => {
      setConcerts(config.concerts);
      if (config.concerts.length > 0) {
        setSelected(config.concerts[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    loadAllSnapshots(selected.artist, selected.category_id).then((data) => {
      setSnapshots(data);
      setLoading(false);
    });
  }, [selected]);

  const renderCharts = () => {
    if (snapshots.length === 0) {
      return <p>수집된 데이터가 없습니다.</p>;
    }

    switch (viewMode) {
      case "all": {
        const stats = statsByCollectedDate(snapshots);
        return (
          <PriceChart
            title="날짜별 최저가 (전회차 통합)"
            datasets={[{ label: "최저가", stats, color: getColor(0) }]}
          />
        );
      }
      case "byDate": {
        const byDate = statsByPerformDate(snapshots);
        const datasets = [...byDate.entries()].map(
          ([performDate, stats], i) => ({
            label: performDate,
            stats,
            color: getColor(i),
          })
        );
        return (
          <PriceChart title="날짜별 최저가 (회차 구분)" datasets={datasets} />
        );
      }
      case "byFloor": {
        const byFloor = statsByFloor(snapshots);
        const datasets = [...byFloor.entries()].map(([floor, stats], i) => ({
          label: floor,
          stats,
          color: getColor(i),
        }));
        return <PriceChart title="구역별 최저가" datasets={datasets} />;
      }
    }
  };

  return (
    <div className="app-container">
      <h1>TicketBay Tracker</h1>

      <ConcertSelector
        concerts={concerts}
        selected={selected}
        onSelect={setSelected}
      />

      <div className="view-tabs">
        <button
          className={viewMode === "all" ? "active" : ""}
          onClick={() => setViewMode("all")}
        >
          전회차 통합
        </button>
        <button
          className={viewMode === "byDate" ? "active" : ""}
          onClick={() => setViewMode("byDate")}
        >
          회차별
        </button>
        <button
          className={viewMode === "byFloor" ? "active" : ""}
          onClick={() => setViewMode("byFloor")}
        >
          구역별
        </button>
      </div>

      {loading ? <p>데이터 로딩 중...</p> : renderCharts()}

      <StatsTable snapshots={snapshots} />
    </div>
  );
}
