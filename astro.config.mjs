// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // 배포 도메인 확정되면 교체 (Cloudflare Pages 기본 도메인 가정)
  site: 'https://econ-bite.pages.dev',
  integrations: [
    // 빌드 시 sitemap-index.xml + sitemap-0.xml 자동 생성 (검색엔진 색인용)
    sitemap(),
  ],
});
