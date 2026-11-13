/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
import rss from '@astrojs/rss';
import {digestUrl, getPublishedDigests} from '../../../data/xen-devel-digests.ts';

export async function GET(context: {site?: URL}) {
  const issues = await getPublishedDigests();
  return rss({
    title: 'This week on xen-devel',
    description: 'Weekly summaries of Xen development discussions.',
    site: context.site!,
    items: issues.map((issue) => ({
      title: issue.data.title,
      description: issue.data.description,
      link: digestUrl(issue),
      pubDate: issue.data.publishedAt!,
    })),
    customData: '<language>en-gb</language>',
  });
}
