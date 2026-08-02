import path from 'node:path';
import process from 'node:process';
import * as pagefind from 'pagefind';
import {readGhostCache, type NormalizedGhostPost} from './ghost.ts';

export function ghostPagefindRecord(post: NormalizedGhostPost) {
  return {
    url: post.url,
    content: post.content,
    language: post.language,
    meta: {
      title: post.title,
      excerpt: post.excerpt,
      section: 'Blog',
      contentType: 'Blog',
      published: post.publishedAt,
      updated: post.updatedAt,
      ghostId: post.id,
      canonical: post.url,
      ...(post.aliases.length > 0 && {aliases: post.aliases.join(', ')}),
      ...(post.primaryAuthor && {author: post.primaryAuthor}),
      ...(post.primaryTag && {primaryTag: post.primaryTag}),
    },
    filters: {contentType: ['Blog'], section: ['Blog'], tags: post.tags, authors: post.authors},
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
  try {
    console.log('Indexing generated Astro pages from dist/…');
    const astro = await index.addDirectory({path: path.resolve('dist'), glob: '**/*.html'});
    if (astro.errors.length > 0) throw new Error(`Pagefind failed to index Astro output: ${astro.errors.join('; ')}`);
    console.log(`Indexed ${astro.page_count} Astro pages.`);
    const cache = await readGhostCache();
    if (cache) {
      console.log(`Adding ${cache.posts.length} cached Ghost posts to Pagefind…`);
      let completedGhostPosts = 0;
      const results = await Promise.all(
        cache.posts.map(async (post) => {
          const result = await index.addCustomRecord(ghostPagefindRecord(post));
          completedGhostPosts += 1;
          if (completedGhostPosts % 100 === 0 || completedGhostPosts === cache.posts.length)
            console.log(`Indexed ${completedGhostPosts}/${cache.posts.length} Ghost posts.`);
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
    console.log(
      `Wrote unified search index: ${astro.page_count} Astro pages, ${cache?.posts.length ?? 0} Ghost posts.`,
    );
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
