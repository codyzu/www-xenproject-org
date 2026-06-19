/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
import rss from '@astrojs/rss';
import {getCollection} from 'astro:content';
import researchPapers from '../../data/research.json';

export async function GET(context: {site?: URL}) {
  const events = await getCollection('pastEvents');
  const items = [
    ...researchPapers.map((paper) => ({
      title: paper.title,
      description: paper.abstract ?? `Academic research published in ${paper.year}.`,
      link: `/research/${paper.id}/`,
      pubDate: new Date(`${paper.year}-01-01T00:00:00Z`),
    })),
    ...events.map((event) => ({
      title: event.data.title,
      description: event.data.description,
      link: `/resources/past-events/${event.id}/`,
      pubDate: event.data.eventEnd,
    })),
  ].toSorted((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: 'Xen Project',
    description: 'Recent content on Xen Project',
    site: context.site ?? new URL('https://beta.xenproject.org'),
    items,
    customData: '<language>en-us</language>',
  });
}
