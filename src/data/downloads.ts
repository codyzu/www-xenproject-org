import {readFileSync} from 'node:fs';
import path from 'node:path';
import {z} from 'zod';

const absoluteUrl = z.string().refine((value) => {
  try {
    const {protocol} = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}, 'must be an absolute HTTP(S) URL');

const downloadFileSchema = z.object({
  name: z.string().min(1),
  url: absoluteUrl,
});

const downloadReleaseSchema = z.object({
  name: z.string().min(1),
  link: absoluteUrl,
  files: z.array(downloadFileSchema),
});

const downloadVersionSchema = z.union([
  downloadReleaseSchema,
  z.object({
    name: z.literal('default'),
    link: z.literal(''),
    files: z.array(downloadFileSchema),
  }),
  z.object({
    name: z.string().min(1),
    subversions: z.array(downloadReleaseSchema).min(1),
  }),
]);

const downloadGroupSchema = z.object({
  name: z.string().min(1),
  key: z.string().min(1),
  versions: z.array(downloadVersionSchema),
});

const downloadsSchema = z.array(downloadGroupSchema);

export type DownloadGroup = z.infer<typeof downloadGroupSchema>;
const allDownloadsJson = JSON.parse(readFileSync(path.resolve('assets/data/downloads.json'), 'utf8')) as unknown;
const latestDownloadsJson = JSON.parse(
  readFileSync(path.resolve('assets/data/downloads-latest.json'), 'utf8'),
) as unknown;

export const allDownloads = downloadsSchema.parse(allDownloadsJson);
export const latestDownloads = downloadsSchema.parse(latestDownloadsJson);
