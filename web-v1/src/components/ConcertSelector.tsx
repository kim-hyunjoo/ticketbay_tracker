import type { Concert } from "../types/data";

interface Props {
  concerts: Concert[];
  selected: Concert | null;
  onSelect: (concert: Concert) => void;
}

export default function ConcertSelector({
  concerts,
  selected,
  onSelect,
}: Props) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>
        공연 선택:
      </label>
      <select
        value={selected ? `${selected.category_id}` : ""}
        onChange={(e) => {
          const concert = concerts.find(
            (c) => c.category_id === Number(e.target.value)
          );
          if (concert) onSelect(concert);
        }}
        style={{ padding: "0.4rem 0.8rem", fontSize: "1rem" }}
      >
        <option value="" disabled>
          공연을 선택하세요
        </option>
        {concerts.map((c) => (
          <option key={c.category_id} value={c.category_id}>
            {c.artist} {c.venue ? `- ${c.venue}` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
