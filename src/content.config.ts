import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One .md per project in src/content/projects/ (frontmatter only), cover image next to it.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.enum(['branding', 'web']),
      year: z.number().int(),
      cover: image(),
      alt: z.object({ pt: z.string().min(1), en: z.string().min(1) }),
      summary: z.object({ pt: z.string(), en: z.string() }),
      order: z.number().default(0),
      url: z.url().optional(),
    }),
});

export const collections = { projects };
