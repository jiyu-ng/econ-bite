// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // 배포 도메인 확정되면 교체 (Cloudflare Pages 기본 도메인 가정)
  site: 'https://econ-bite.pages.dev',
});
