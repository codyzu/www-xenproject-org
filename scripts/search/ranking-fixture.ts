import type {NormalizedGhostPost} from './ghost.ts';

const historicalReleasePosts: NormalizedGhostPost[] = Array.from({length: 72}, (_, index) => {
  const sequence = String(index + 1).padStart(2, '0');
  const year = 2008 + Math.floor(index / 8);
  return {
    id: `ranking-historical-${sequence}`,
    slug: `historical-release-${sequence}`,
    url: `/blog/historical-release-${sequence}/`,
    title: `Historical maintenance release ${sequence}`,
    content: `Historical maintenance release ${sequence}\nRelease release released maintenance release archive.`,
    excerpt: `An archived maintenance release announcement from ${year}.`,
    publishedAt: `${year}-01-01T00:00:00.000Z`,
    updatedAt: `${year}-01-01T00:00:00.000Z`,
    primaryAuthor: 'Fixture Archivist',
    authors: ['Fixture Archivist'],
    primaryTag: 'Releases',
    tags: ['Releases', 'Archive'],
    tagSlugs: ['releases', 'archive'],
    featured: false,
    aliases: [],
    language: 'en',
  };
});

export const searchRankingFixturePosts: NormalizedGhostPost[] = [
  {
    id: 'ranking-xcp-ng-update',
    slug: 'current-xcp-ng-update',
    url: '/blog/current-xcp-ng-update/',
    title: 'XCP-ng project update',
    content:
      'XCP-ng project update\nA current look at XCP-ng development, community participation, and platform improvements.',
    excerpt: 'A current update from the XCP-ng project and its community.',
    publishedAt: '2026-08-08T12:00:00.000Z',
    updatedAt: '2026-08-08T12:00:00.000Z',
    primaryAuthor: 'Fixture Project Author',
    authors: ['Fixture Project Author'],
    primaryTag: 'XCP-ng',
    tags: ['XCP-ng', 'Projects'],
    tagSlugs: ['xcp-ng', 'projects'],
    featured: false,
    aliases: [],
    language: 'en',
  },
  {
    id: 'ranking-current-release',
    slug: 'current-xen-release',
    url: '/blog/current-xen-release/',
    title: 'Xen 4.22: Strengthening open source virtualization',
    content:
      'Xen 4.22: Strengthening open source virtualization\nXen 4.22 is the latest release of the Xen hypervisor. This release adds current platform and hardware improvements. The release announcement describes support, architecture, and the release lifecycle for users evaluating the current release.',
    excerpt: 'The latest Xen release adds current platform, hardware, and architecture improvements.',
    publishedAt: '2026-08-05T15:18:36.000Z',
    updatedAt: '2026-08-05T15:18:36.000Z',
    primaryAuthor: 'Fixture Release Author',
    authors: ['Fixture Release Author'],
    primaryTag: 'Releases',
    tags: ['Releases', 'Xen 4.22'],
    tagSlugs: ['releases', 'xen-4-22'],
    featured: false,
    aliases: [],
    language: 'en',
  },
  {
    id: 'ranking-current-incidental',
    slug: 'current-community-roundup',
    url: '/blog/current-community-roundup/',
    title: 'Current community roundup',
    content: `Current community roundup\n${'The community discussed events, documentation, contribution, and project updates. '.repeat(60)}The final note mentioned one release checklist.`,
    excerpt: 'A current roundup of several community activities.',
    publishedAt: '2026-08-10T10:00:00.000Z',
    updatedAt: '2026-08-10T10:00:00.000Z',
    primaryAuthor: 'Fixture Community Author',
    authors: ['Fixture Community Author'],
    primaryTag: 'Community',
    tags: ['Community'],
    tagSlugs: ['community'],
    featured: false,
    aliases: [],
    language: 'en',
  },
  ...historicalReleasePosts,
];
