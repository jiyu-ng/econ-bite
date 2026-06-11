import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 경제 글 카드 컬렉션. src/content/posts/*.md 를 자동으로 읽어온다.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    publishedDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { posts };
