/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
import {getCollection} from 'astro:content';
import {sortDownloadGroups, type DownloadGroup} from '../../data/downloads.ts';

export async function GET() {
  const entries = await getCollection('downloads');
  const groups: DownloadGroup[] = entries.map(({data}) => data);
  const downloads = sortDownloadGroups(groups);

  return new Response(`${JSON.stringify(downloads, null, 2)}\n`, {
    headers: {'Content-Type': 'application/json; charset=utf-8'},
  });
}
