export type DownloadFile = {name: string; url: string};
export type DownloadRelease = {name: string; link: string; files: DownloadFile[]};
export type DownloadSeries = {name: string; subversions: DownloadRelease[]};
export type DownloadGroup = {
  name: string;
  key: string;
  versions: Array<DownloadRelease | DownloadSeries>;
};

const isDownloadRelease = (version: DownloadGroup['versions'][number]): version is DownloadRelease =>
  'link' in version && version.link !== '';

const compareVersionsDescending = (a: string, b: string) =>
  b.localeCompare(a, undefined, {numeric: true, sensitivity: 'base'});

const latestVersionsForGroup = (group: DownloadGroup): DownloadGroup['versions'] => {
  const versionGroups = new Map<string, DownloadRelease[]>();

  for (const version of group.versions) {
    if (!isDownloadRelease(version) || version.name.includes('beta') || version.name.includes('rc')) {
      continue;
    }

    if (group.key === 'xcpng') return [version];

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

const groupOrder = new Map(['xen', 'xcpng', 'mirageos'].map((key, index) => [key, index]));

export const sortDownloadGroups = (groups: DownloadGroup[]) =>
  groups.toSorted(
    (a, b) => (groupOrder.get(a.key) ?? Number.MAX_SAFE_INTEGER) - (groupOrder.get(b.key) ?? Number.MAX_SAFE_INTEGER),
  );

export const latestDownloadsFor = (allDownloads: DownloadGroup[]) =>
  allDownloads.map((group) => ({...group, versions: latestVersionsForGroup(group)}));
