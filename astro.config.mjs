// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages 조직 사이트: https://right-economy.github.io/ (루트 서빙, base 없음)
  // repo = right-economy/right-economy.github.io. 커스텀 도메인 생기면 site만 교체.
  site: 'https://right-economy.github.io',
  integrations: [
    // 빌드 시 sitemap-index.xml + sitemap-0.xml 자동 생성 (검색엔진 색인용)
    sitemap(),
  ],
});
