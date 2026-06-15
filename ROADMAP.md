# 경제한입 로드맵 🗺️

자동 기능개선 잡(`scripts/auto-feature.sh`)이 이 목록에서 다음 할 일을 고른다.
처리하면 `[x]`로 체크하고, 새 아이디어는 자유롭게 추가.

## 우선순위: SEO · 수익화
- [ ] 배포 도메인 확정 후 `astro.config.mjs` site + `robots.txt` Sitemap URL 교체 (← 지유)
- [ ] AdSense 승인 후 `src/consts.ts` `ADSENSE_CLIENT` 채우기 (← 지유)
- [ ] Search Console 등록 + `GSC_VERIFICATION` 채우고 sitemap 제출 (← 지유)
- [x] 글 간 내부 링크 / "관련 글" 섹션 (체류시간·색인↑)
- [x] 카테고리 페이지 (`/category/[name]`)
- [ ] 태그 페이지 (`/tags/[tag]`)
- [x] RSS 피드 (`@astrojs/rss`)
- [ ] BreadcrumbList JSON-LD (검색결과 경로 표시)
- [ ] 글별 OG 이미지 자동 생성

## 사용자 경험 · 성능
- [ ] 글 목록 검색/필터
- [x] 404 페이지
- [ ] 다크모드
- [ ] 폰트 로딩 최적화 (jsDelivr CDN → self-host 검토) — preconnect는 적용됨
- [ ] 접근성 점검 — 1차 완료(본문 바로가기·:focus-visible·prefers-reduced-motion). 남음: 색 대비·aria·시맨틱 태그

## 완료
- [x] SEO 기반: sitemap · robots.txt · Article/WebSite JSON-LD · AdSense/GSC 배선 (PR #19)
- [x] RSS 피드: `@astrojs/rss` + autodiscovery `<link>` 태그 (PR #?)
