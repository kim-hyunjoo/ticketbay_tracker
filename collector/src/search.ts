/**
 * 티켓베이에서 가수명으로 공연을 검색하는 스크립트
 * 사용법: npm run search -- "엑소"
 */

const SEARCH_URL = "https://www.ticketbay.co.kr/search";

interface SearchResult {
  name: string;
  category_id: number;
  venue?: string;
}

/** 티켓베이 검색 페이지를 파싱하여 공연 목록을 추출한다 */
async function searchConcerts(keyword: string): Promise<SearchResult[]> {
  const url = `${SEARCH_URL}?keyword=${encodeURIComponent(keyword)}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`검색 실패: ${res.status}`);
  }

  const html = await res.text();

  // Next.js SSR 페이지의 __NEXT_DATA__에서 검색 결과 추출
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/
  );
  if (!match) {
    console.log("검색 결과를 파싱할 수 없습니다.");
    return [];
  }

  const nextData = JSON.parse(match[1]);
  const products = nextData?.props?.pageProps?.products ?? [];

  return products.map((p: Record<string, unknown>) => ({
    name: p.name as string,
    category_id: p.depth3Id as number,
    venue: p.placeName as string | undefined,
  }));
}

// CLI에서 직접 실행할 때
const keyword = process.argv[2];
if (!keyword) {
  console.log("사용법: npm run search -- <가수명>");
  console.log('예시: npm run search -- "엑소"');
  process.exit(1);
}

console.log(`"${keyword}" 검색 중...\n`);

const results = await searchConcerts(keyword);

if (results.length === 0) {
  console.log("검색 결과가 없습니다.");
} else {
  console.log("검색 결과:");
  console.log("─".repeat(60));
  results.forEach((r, i) => {
    console.log(`${i + 1}. ${r.name}`);
    console.log(`   category_id: ${r.category_id}`);
    if (r.venue) console.log(`   공연장: ${r.venue}`);
    console.log();
  });
  console.log("─".repeat(60));
  console.log(
    "위 category_id를 data/concerts.json에 추가하세요."
  );
}
