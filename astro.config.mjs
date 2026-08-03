// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkCjkFriendly from 'remark-cjk-friendly';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages 조직 사이트: https://right-economy.github.io/ (루트 서빙, base 없음)
  // repo = right-economy/right-economy.github.io. 커스텀 도메인 생기면 site만 교체.
  site: 'https://right-economy.github.io',
  markdown: {
    // 한국어 등 CJK 문자 옆의 볼드/이탤릭이 깨지는 CommonMark 이슈 해결.
    // 예: **자산배분(Asset Allocation)**이라고 처럼 닫는 ** 뒤에 한글이 바로
    // 붙어도 정상 볼드 처리 (CommonMark 기본은 리터럴 ** 로 새어나옴).
    remarkPlugins: [remarkCjkFriendly],
  },
  integrations: [
    // 빌드 시 sitemap-index.xml + sitemap-0.xml 자동 생성 (검색엔진 색인용)
    sitemap(),
  ],
});
