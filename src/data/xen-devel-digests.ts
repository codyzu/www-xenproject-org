/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
import {getCollection, type CollectionEntry} from 'astro:content';

export const digestArchiveUrl = '/community/xen-devel-digest/';
export const digestFeedUrl = `${digestArchiveUrl}rss.xml`;

export function digestUrl(issue: Pick<CollectionEntry<'xenDevelDigests'>, 'id'>) {
  return `${digestArchiveUrl}${issue.id}/`;
}

export async function getPublishedDigests() {
  const now = new Date();
  const issues = await getCollection(
    'xenDevelDigests',
    ({data}) => !data.draft && Boolean(data.reviewedBy) && Boolean(data.publishedAt && data.publishedAt <= now),
  );
  return issues.toSorted((a, b) => b.data.coverageEnd.getTime() - a.data.coverageEnd.getTime());
}

export function formatDigestDate(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
