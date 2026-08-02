import {readFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import {normalizeGhostPost, writeGhostCacheAtomic} from './ghost.ts';

export async function writeSyntheticFixtureCache() {
  const fixturePath = fileURLToPath(new URL('../../tests/fixtures/ghost-posts.json', import.meta.url));
  const fixture = JSON.parse(await readFile(fixturePath, 'utf8')) as {posts: unknown[]};
  const posts = fixture.posts.map((post) => normalizeGhostPost(post));
  await writeGhostCacheAtomic(posts);
  return posts.length;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const count = await writeSyntheticFixtureCache();
  console.log(`Prepared ${count} synthetic Ghost search records.`);
}
