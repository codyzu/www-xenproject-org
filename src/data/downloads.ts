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
    link: z.literal(''),
    name: z.literal('default'),
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
type DownloadRelease = z.infer<typeof downloadReleaseSchema>;

const allDownloadsJson = JSON.parse(readFileSync(path.resolve('assets/data/downloads.json'), 'utf8')) as unknown;

export const allDownloads = downloadsSchema.parse(allDownloadsJson);

const isDownloadRelease = (version: DownloadGroup['versions'][number]): version is DownloadRelease =>
  'link' in version && version.link !== '';

const compareVersionsDescending = (a: string, b: string) =>
  b.localeCompare(a, undefined, {numeric: true, sensitivity: 'base'});

const latestVersionsForGroup = (group: DownloadGroup): DownloadGroup['versions'] => {
  const defaultVersion = group.versions.find((version) => version.name === 'default');

  if (defaultVersion) {
    return [defaultVersion];
  }

  const versionGroups = new Map<string, DownloadRelease[]>();

  for (const version of group.versions) {
    if (!isDownloadRelease(version) || version.name.includes('beta') || version.name.includes('rc')) {
      continue;
    }

    const [major, minor] = version.name.split('.');
    const groupName = `${major}.${minor}`;
    versionGroups.set(groupName, [...(versionGroups.get(groupName) ?? []), version]);
  }

  return [...versionGroups]
    .sort(([a], [b]) => compareVersionsDescending(a, b))
    .slice(0, 2)
    .map(([name, subversions]) => ({
      name,
      subversions: subversions.toSorted((a, b) => compareVersionsDescending(a.name, b.name)),
    }));
};

export const latestDownloads = downloadsSchema.parse(
  allDownloads.map((group) => ({
    ...group,
    versions: latestVersionsForGroup(group),
  })),
);
