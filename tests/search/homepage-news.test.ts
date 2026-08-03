import assert from 'node:assert/strict';
import test from 'node:test';
import type {NormalizedGhostPost} from '../../scripts/search/ghost.ts';
import {compactGhostExcerpt, homepageNewsBadge, selectHomepageNews} from '../../src/data/homepage-news.ts';

const date = (day: number) => `2026-07-${String(day).padStart(2, '0')}T12:00:00.000+00:00`;

function post(
  id: string,
  day: number,
  options: {featured?: boolean; tags?: string[]; tagSlugs?: string[]} = {},
): NormalizedGhostPost {
  return {
    id,
    slug: id,
    url: `/blog/${id}/`,
    title: `Post ${id}`,
    content: `Post ${id} content`,
    excerpt: `Post ${id} excerpt`,
    publishedAt: date(day),
    updatedAt: date(day),
    authors: [],
    tags: options.tags ?? [],
    tagSlugs: options.tagSlugs ?? [],
    featured: options.featured ?? false,
    aliases: [],
    language: 'en',
  };
}

test('selects featured posts first, sorts each group newest first, and fills to three', () => {
  const selected = selectHomepageNews(
    [
      post('newest-fallback', 20),
      post('older-featured', 10, {featured: true}),
      post('newest-featured', 18, {featured: true}),
      post('older-fallback', 5),
    ],
    {now: new Date('2026-08-01T00:00:00Z')},
  );

  assert.deepEqual(
    selected.map((item) => item.id),
    ['newest-featured', 'older-featured', 'newest-fallback'],
  );
});

test('deduplicates posts, caps results, and omits future unpublished posts', () => {
  const duplicate = post('duplicate', 19, {featured: true});
  const selected = selectHomepageNews(
    [
      duplicate,
      {...duplicate},
      post('second', 18),
      post('third', 17),
      post('fourth', 16),
      {...post('future', 31), publishedAt: '2026-09-01T12:00:00.000+00:00'},
    ],
    {now: new Date('2026-08-01T00:00:00Z')},
  );

  assert.deepEqual(
    selected.map((item) => item.id),
    ['duplicate', 'second', 'third'],
  );
  assert.deepEqual(selectHomepageNews([], {now: new Date('2026-08-01T00:00:00Z')}), []);
});

test('uses deterministic tag priority and returns one icon-backed badge', () => {
  const badge = homepageNewsBadge(
    post('tagged', 20, {
      tags: ['Community', 'Releases', 'Safety'],
      tagSlugs: ['community', 'releases', 'safety'],
    }),
  );

  assert.deepEqual(badge, {slugs: ['safety'], label: 'Safety', icon: 'i-carbon-security'});
  assert.equal(homepageNewsBadge(post('unknown', 20, {tags: ['Announcements']})), undefined);
});

test('compacts long excerpts without rewriting short copy', () => {
  assert.equal(compactGhostExcerpt('  Short   excerpt.  '), 'Short excerpt.');
  const result = compactGhostExcerpt('A realistic Ghost excerpt '.repeat(20), 120);
  assert.ok(result.length <= 121);
  assert.ok(result.endsWith('…'));
});
