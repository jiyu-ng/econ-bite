// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages 프로젝트 사이트: https://jiyu-ng.github.io/right-economy/
  // (커스텀 도메인 생기면 site=그 도메인, base 제거)
  site: 'https://jiyu-ng.github.io',
  base: '/right-economy',
  integrations: [
    // 빌드 시 sitemap-index.xml + sitemap-0.xml 자동 생성 (검색엔진 색인용)
    sitemap(),
  ],
});
