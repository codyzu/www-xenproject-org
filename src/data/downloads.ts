import {z} from 'zod';
import allDownloadsJson from '../../assets/data/downloads.json';
import latestDownloadsJson from '../../assets/data/downloads-latest.json';

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
export const allDownloads = downloadsSchema.parse(allDownloadsJson);
export const latestDownloads = downloadsSchema.parse(latestDownloadsJson);
