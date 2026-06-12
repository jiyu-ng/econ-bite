# 경제한입 🍱

하루 한입, 쉬워지는 경제. 금리·물가·환율부터 투자 기초까지 어려운 경제 개념을 **한입 크기 카드**로 잘라 정리하는 콘텐츠 사이트.

글린트프로젝트의 광고 수익형 콘텐츠 사이트. 검색 유입(SEO)을 노려 글을 꾸준히 쌓고, 애드센스로 수익화하는 것이 목표.

## 기술 스택

- **[Astro](https://astro.build)** — 정적 사이트 생성기 (빠른 로딩 + 강력한 SEO)
- 콘텐츠 컬렉션 (`src/content/posts/*.md`)으로 글 관리
- 배포: Cloudflare Pages (예정)

## 구조

```
src/
  content/posts/      # 경제 글 카드 (마크다운)
  content.config.ts   # 글 스키마 정의
  layouts/            # 공통 레이아웃 + SEO 메타
  pages/
    index.astro       # 글 카드 목록 (홈)
    posts/[...slug]   # 글 상세 페이지
  styles/global.css   # 전역 스타일
```

## 개발

```bash
npm install
npm run dev      # 개발 서버 (localhost:4321)
npm run build    # 정적 빌드 → dist/
npm run preview  # 빌드 결과 미리보기
```

## 글 추가하기

`src/content/posts/` 에 마크다운 파일을 추가하면 자동으로 목록에 노출된다.

```md
---
title: "제목"
description: "한 줄 요약 (목록 카드 + SEO 설명에 사용)"
category: "기초 개념"
publishedDate: 2026-06-11
tags: ["금리", "기초경제"]
---

본문...
```

## 로드맵

- [x] 사이트 뼈대 + 첫 글 (금리란?)
- [ ] 글 꾸준히 추가 (2시간마다 PR)
- [ ] Cloudflare Pages 배포
- [ ] 카테고리/태그 페이지
- [ ] 애드센스 승인 → 광고 슬롯 활성화
- [ ] (확장) 환율·금리 등 실시간 지표 대시보드
