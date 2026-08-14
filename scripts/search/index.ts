import path from 'node:path';
import process from 'node:process';
import * as pagefind from 'pagefind';
import {promotedIntentsForUrl, promotedTermsForUrl} from '../../src/data/search.ts';
import {readGhostCache, type NormalizedGhostPost} from './ghost.ts';

export function ghostPagefindRecord(post: NormalizedGhostPost) {
  const aliases = [...new Set([...post.aliases, ...promotedTermsForUrl(post.url)])];
  const promotedIntents = promotedIntentsForUrl(post.url);
  return {
    url: post.url,
    content: post.content,
    language: post.language,
    meta: {
      title: post.title,
      excerpt: post.excerpt,
      tags: post.tags.join(', '),
      section: 'Blog',
      contentType: 'Blog',
      published: post.publishedAt,
      updated: post.updatedAt,
      ghostId: post.id,
      canonical: post.url,
      ...(aliases.length > 0 && {aliases: aliases.join(', ')}),
      ...(post.primaryAuthor && {author: post.primaryAuthor}),
      ...(post.primaryTag && {primaryTag: post.primaryTag}),
    },
    filters: {
      contentType: ['Blog'],
      section: ['Blog'],
      tags: post.tags,
      authors: post.authors,
      ...(promotedIntents.length > 0 && {promotedIntent: promotedIntents}),
    },
    sort: {published: post.publishedAt, updated: post.updatedAt},
  };
}

async function main() {
  const outputPath = path.resolve('dist/pagefind');
  console.log('Creating the Pagefind search index…');
  const {index, errors: creationErrors} = await pagefind.createIndex({
    forceLanguage: 'en',
    includeCharacters: '_-+',
    excludeSelectors: ['[data-pagefind-ignore]', 'script', 'style', 'template'],
  });
  if (!index || creationErrors.length > 0)
    throw new Error(`Pagefind could not create an index: ${creationErrors.join('; ')}`);
  let indexedGhostPostCount = 0;
  try {
    console.log('Indexing generated Astro pages from dist/…');
    const astro = await index.addDirectory({path: path.resolve('dist'), glob: '**/*.html'});
    if (astro.errors.length > 0) throw new Error(`Pagefind failed to index Astro output: ${astro.errors.join('; ')}`);
    console.log(`Indexed ${astro.page_count} Astro pages.`);
    const cache = await readGhostCache();

    if (process.env.GHOST_CONTENT_REQUIRED === '1' && (!cache || cache.posts.length === 0)) {
      throw new Error('Ghost content is required for this build, but the normalized cache is empty or unavailable.');
    }

    if (cache) {
      let rankingFixturePosts: NormalizedGhostPost[] = [];
      if (process.env.SEARCH_RANKING_FIXTURE === '1') {
        const rankingFixture = await import('./ranking-fixture.ts');
        rankingFixturePosts = rankingFixture.searchRankingFixturePosts;
      }

      const posts = [...cache.posts, ...rankingFixturePosts];
      indexedGhostPostCount = posts.length;
      console.log(`Adding ${posts.length} cached Ghost posts to Pagefind…`);
      let completedGhostPosts = 0;
      const results = await Promise.all(
        posts.map(async (post) => {
          const result = await index.addCustomRecord(ghostPagefindRecord(post));
          completedGhostPosts += 1;
          if (completedGhostPosts % 100 === 0 || completedGhostPosts === posts.length)
            console.log(`Indexed ${completedGhostPosts}/${posts.length} Ghost posts.`);
          return {post, result};
        }),
      );
      for (const {post, result} of results) {
        if (result.errors.length > 0)
          throw new Error(`Pagefind failed to index Ghost record ${post.id}: ${result.errors.join('; ')}`);
      }
    } else {
      console.warn(
        'Ghost search cache is absent; indexed Astro pages only. Run npm run search:refresh to include Blog results.',
      );
    }

    console.log('Writing Pagefind browser assets to dist/pagefind/…');
    const written = await index.writeFiles({outputPath});
    if (written.errors.length > 0)
      throw new Error(`Pagefind failed to write search assets: ${written.errors.join('; ')}`);
    console.log(`Wrote unified search index: ${astro.page_count} Astro pages, ${indexedGhostPostCount} Ghost posts.`);
  } finally {
    await index.deleteIndex();
    await pagefind.close();
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  try {
    await main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Pagefind indexing failed.');
    process.exitCode = 1;
  }
}
