import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { DailyStats } from "../types/data";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PriceChartProps {
  title: string;
  datasets: { label: string; stats: DailyStats[]; color: string }[];
}

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
];

export function getColor(index: number): string {
  return COLORS[index % COLORS.length];
}

export default function PriceChart({ title, datasets }: PriceChartProps) {
  // 모든 데이터셋에서 날짜 라벨 추출 (겹치지 않게)
  const allDates = [
    ...new Set(datasets.flatMap((d) => d.stats.map((s) => s.date))),
  ].sort();

  const chartData = {
    labels: allDates,
    datasets: datasets.map((d) => ({
      label: d.label,
      data: allDates.map((date) => {
        const stat = d.stats.find((s) => s.date === date);
        return stat ? stat.minPrice : null;
      }),
      borderColor: d.color,
      backgroundColor: d.color + "33",
      tension: 0.3,
      spanGaps: true,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      title: { display: true, text: title, font: { size: 16 } },
      tooltip: {
        callbacks: {
          label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) => {
            const val = ctx.parsed.y;
            if (val === null) return "";
            return `${ctx.dataset.label}: ${val.toLocaleString()}원`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: string | number) =>
            Number(value).toLocaleString() + "원",
        },
      },
    },
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
