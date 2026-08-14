/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
import {defineCollection} from 'astro:content';
import {glob} from 'astro/loaders';
import {z} from 'astro/zod';
import {downloadsLoader} from './loaders/downloads.js';
import {researchLoader} from './loaders/research.js';

const absoluteUrl = z
  .url()
  .refine((value) => ['http:', 'https:'].includes(new URL(value).protocol), 'must be an absolute HTTP(S) URL');
const downloadFile = z.object({name: z.string().min(1), url: absoluteUrl});
const downloadRelease = z.object({
  name: z.string().min(1),
  link: absoluteUrl,
  files: z.array(downloadFile),
});

const downloads = defineCollection({
  loader: downloadsLoader(),
  schema: z.object({
    name: z.string().min(1),
    key: z.string().min(1),
    versions: z.array(downloadRelease).min(1),
  }),
});

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

const research = defineCollection({
  loader: researchLoader(),
  schema: z.object({
    title: z.string().min(1),
    authors: z.array(z.string().min(1)).min(1),
    year: z.string().regex(/^\d{4}$/, 'Year must be a 4-digit year'),
    url: z.url().nullable(),
    tags: z.array(z.string()),
    abstract: z.string().nullable(),
    journal: z.string().nullable(),
    sourceFile: z.string().min(1),
  }),
});

export const collections = {downloads, pastEvents, research};
