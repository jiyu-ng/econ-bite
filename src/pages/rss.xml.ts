import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE_NAME, SITE_DESCRIPTION } from '../consts';
import { withBase } from '../lib/url';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts');
  const sorted = posts.sort(
    (a, b) =>
      b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf(),
  );

  // 채널 <link>는 site 값이 그대로 쓰이는데, context.site는 base(/right-economy)가
  // 빠진 오리진(https://jiyu-ng.github.io)이라 피드 리더가 홈을 잘못 가리킴.
  // base를 포함한 실제 홈 URL로 교정. (item.link는 루트 절대경로라 이 site에
  // 대해 resolve해도 중복 없이 올바른 절대 URL이 됨)
  const feedSite = new URL(withBase('/'), context.site).href;
  // 피드 자기참조 URL(atom:link rel="self") + 최신 글 기준 갱신시각.
  // 둘 다 W3C 피드 유효성 검사가 권장하는 요소로, 리더 호환성·신선도 표시에 쓰임.
  const feedUrl = new URL(withBase('/rss.xml'), context.site).href;
  const lastBuildDate = sorted[0]?.data.publishedDate.toUTCString() ?? '';

  return rss({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: feedSite,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    items: sorted.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedDate,
      link: withBase(`/posts/${post.id}/`),
      categories: [post.data.category, ...(post.data.tags ?? [])],
    })),
    customData:
      `<language>ko-KR</language>` +
      (lastBuildDate ? `<lastBuildDate>${lastBuildDate}</lastBuildDate>` : '') +
      `<atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>`,
  });
}
