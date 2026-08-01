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

  return rss({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: feedSite,
    items: sorted.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedDate,
      link: withBase(`/posts/${post.id}/`),
      categories: [post.data.category, ...(post.data.tags ?? [])],
    })),
    customData: `<language>ko-KR</language>`,
  });
}
