import { getConcerts, getDates } from "@/lib/data"
import { ListingsClient } from "@/components/listings/listings-client"

export default function ListingsPage() {
  const concerts = getConcerts()
  const concertMeta = concerts.map((c) => ({
    concert: c,
    dates: getDates(c.artist, c.category_id),
  }))

  return <ListingsClient concertMeta={concertMeta} />
}
