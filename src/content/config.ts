import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    excerpt: z.string(),
    category: z.enum(['tools', 'jobs', 'cases', 'trends']),
  }),
});

export const collections = { posts };
