/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
import {defineCollection} from 'astro:content';
import {glob} from 'astro/loaders';
import {z} from 'astro/zod';

const pastEvents = defineCollection({
  loader: glob({pattern: '**/*.{md,mdx}', base: './src/content/past-events'}),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
    eventDates: z.string(),
    eventEnd: z.coerce.date(),
    eventLocation: z.string(),
    lastUpdated: z.string(),
    showEventDetails: z.boolean().default(true),
  }),
});

export const collections = {pastEvents};
