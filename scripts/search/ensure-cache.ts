import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import {defaultCachePath, readGhostCache} from './ghost.ts';
import {writeSyntheticFixtureCache} from './fixture-cache.ts';

export async function ensureGhostCache(cachePath = defaultCachePath) {
  const existing = await readGhostCache(cachePath);
  if (existing) return {source: 'existing' as const, count: existing.posts.length};

  const count = await writeSyntheticFixtureCache(cachePath);
  return {source: 'fixture' as const, count};
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const result = await ensureGhostCache();
  const message = result.source === 'existing' ? 'Using existing' : 'Prepared synthetic';
  console.log(`${message} Ghost cache with ${result.count} records.`);
}
