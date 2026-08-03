import type {NormalizedGhostPost} from '../../scripts/search/ghost.ts';

export const homepageNewsLimit = 3;

const badgeDefinitions = [
  {slugs: ['safety'], label: 'Safety', icon: 'i-carbon-security'},
  {slugs: ['release', 'releases'], label: 'Release', icon: 'i-carbon-package'},
  {slugs: ['security'], label: 'Security', icon: 'i-carbon-locked'},
  {slugs: ['summit'], label: 'Event', icon: 'i-carbon-event'},
  {slugs: ['event', 'events'], label: 'Event', icon: 'i-carbon-calendar'},
  {slugs: ['automotive'], label: 'Automotive', icon: 'i-carbon-car'},
  {slugs: ['embedded'], label: 'Embedded', icon: 'i-carbon-chip'},
  {slugs: ['cloud'], label: 'Cloud', icon: 'i-carbon-cloud'},
  {slugs: ['technical'], label: 'Technical', icon: 'i-carbon-code'},
  {slugs: ['community'], label: 'Community', icon: 'i-carbon-group'},
] as const;

export type HomepageNewsBadge = (typeof badgeDefinitions)[number];

function normalizedTagValues(post: NormalizedGhostPost) {
  return new Set(
    [...post.tagSlugs, ...post.tags]
      .map((tag) => tag.trim().toLocaleLowerCase('en').replaceAll(/\s+/g, '-'))
      .filter(Boolean),
  );
}

export function homepageNewsBadge(post: NormalizedGhostPost): HomepageNewsBadge | undefined {
  const tags = normalizedTagValues(post);
  return badgeDefinitions.find((definition) => definition.slugs.some((slug) => tags.has(slug)));
}

export function selectHomepageNews(posts: NormalizedGhostPost[], options: {limit?: number; now?: Date} = {}) {
  const limit = options.limit ?? homepageNewsLimit;
  const now = options.now ?? new Date();
  const published = posts
    .filter((post) => Date.parse(post.publishedAt) <= now.valueOf())
    .sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt));
  const featured = published.filter((post) => post.featured);
  const fallback = published.filter((post) => !post.featured);
  const selected = [...featured, ...fallback];
  const seen = new Set<string>();

  return selected
    .filter((post) => {
      if (seen.has(post.id) || seen.has(post.url)) return false;
      seen.add(post.id);
      seen.add(post.url);
      return true;
    })
    .slice(0, limit);
}

export function compactGhostExcerpt(excerpt: string, maximumLength = 170) {
  const compact = excerpt.replaceAll(/\s+/g, ' ').trim();
  if (compact.length <= maximumLength) return compact;
  const shortened = compact.slice(0, maximumLength + 1);
  const boundary = shortened.lastIndexOf(' ');
  return `${shortened.slice(0, boundary > maximumLength * 0.7 ? boundary : maximumLength).trimEnd()}…`;
}

export function formatGhostPublicationDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}
