// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkCjkFriendly from 'remark-cjk-friendly';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// 글별 publishedDate를 읽어 sitemap <lastmod>에 채운다. 하루 2회 발행되는
// 사이트라 정확한 갱신일이 검색엔진 크롤 우선순위·신선도 판단에 도움을 준다.
// (의존성 없이 frontmatter만 가볍게 파싱 — 빌드 시 1회 실행)
const POSTS_DIR = fileURLToPath(new URL('./src/content/posts', import.meta.url));
const postLastmod = new Map();
for (const file of readdirSync(POSTS_DIR)) {
  if (!file.endsWith('.md')) continue;
  const slug = file.replace(/\.md$/, '');
  const raw = readFileSync(`${POSTS_DIR}/${file}`, 'utf8');
  const m = raw.match(/^publishedDate:\s*"?(\d{4}-\d{2}-\d{2})"?/m);
  if (m) postLastmod.set(`/posts/${slug}/`, m[1]);
}

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
    // 글 상세 URL엔 발행일을 <lastmod>로 넣어 신선도 신호를 준다.
    sitemap({
      serialize(item) {
        const path = new URL(item.url).pathname;
        const lastmod = postLastmod.get(path);
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
  ],
});
