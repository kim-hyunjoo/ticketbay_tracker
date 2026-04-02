import type { Listing, TicketBayResponse } from "./types.js";

const API_URL =
  "https://www.ticketbay.co.kr/ticketbayApi/product/v1/public/products";

/** 한 페이지의 매물 데이터를 가져온다 */
async function fetchPage(
  categoryId: number,
  page: number
): Promise<TicketBayResponse> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category_id: categoryId, page }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/** 특정 공연의 전체 매물 데이터를 수집한다 */
export async function fetchAllListings(
  categoryId: number
): Promise<{ totalListings: number; listings: Listing[] }> {
  const first = await fetchPage(categoryId, 0);
  const { data } = first;
  const allListings: Listing[] = [...data.content];

  console.log(
    `  총 ${data.totalElements}개 매물, ${data.totalPages}페이지 수집 시작...`
  );

  // 나머지 페이지 순차 수집
  for (let page = 1; page < data.totalPages; page++) {
    const res = await fetchPage(categoryId, page);
    allListings.push(...res.data.content);

    if (page % 10 === 0) {
      console.log(`  ${page}/${data.totalPages} 페이지 완료`);
    }

    // API 부하 방지: 요청 간 200ms 대기
    await new Promise((r) => setTimeout(r, 200));
  }

  return {
    totalListings: data.totalElements,
    listings: allListings,
  };
}
