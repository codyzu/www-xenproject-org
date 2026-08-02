import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {mkdtemp, readFile, readdir, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {after, test} from 'node:test';
import {fileURLToPath} from 'node:url';
import {rm} from 'node:fs/promises';
import {promisify} from 'node:util';
import {
  cleanGhostHtml,
  fetchAllGhostPosts,
  normalizeGhostPost,
  readGhostCache,
  writeGhostCacheAtomic,
} from '../../scripts/search/ghost.ts';
import {ghostPagefindRecord} from '../../scripts/search/index.ts';

const fixture = JSON.parse(
  await readFile(fileURLToPath(new URL('../fixtures/ghost-posts.json', import.meta.url)), 'utf8'),
) as {posts: unknown[]};
const temporaryDirectories: string[] = [];
const execFileAsync = promisify(execFile);
after(async () => Promise.all(temporaryDirectories.map((directory) => rm(directory, {recursive: true, force: true}))));

test('normalizes metadata, fallbacks, URLs, and custom records', () => {
  const standard = normalizeGhostPost(fixture.posts[0]);
  const technical = normalizeGhostPost(fixture.posts[1]);
  const rich = normalizeGhostPost(fixture.posts[2]);
  assert.equal(rich.url, '/blog/open-virtualization-boundaries/');
  assert.equal(rich.excerpt, 'A closer look at ownership across layered open virtualization systems.');
  assert.match(rich.content, /closer look at ownership/);
  assert.match(technical.excerpt, /dom0 toolstack/);
  assert.deepEqual(rich.authors, ['Taylor Author', 'Sam Reviewer']);
  assert.deepEqual(rich.tags, ['Architecture', 'Xen', 'Community']);
  const record = ghostPagefindRecord(rich);
  assert.equal(record.meta.ghostId, 'fixture-rich-003');
  assert.deepEqual(record.filters.section, ['Blog']);
  assert.equal(record.url, '/blog/open-virtualization-boundaries/');
});

test('removes boilerplate while preserving technical content', () => {
  const cleaned = cleanGhostHtml(`${(fixture.posts[1] as {html: string}).html}<nav>Repeated navigation</nav>`);
  assert.match(cleaned, /XenStore/);
  assert.match(cleaned, /xl migrate/);
  assert.doesNotMatch(cleaned, /display:none|Repeated navigation/);
  assert.doesNotMatch(normalizeGhostPost(fixture.posts[0]).content, /secret|Subscribe/);
});

test('fetches every Ghost API page without exposing the key', async () => {
  const requestedPages: string[] = [];
  const progress: string[] = [];
  const secret = 'fixture-secret-that-must-not-leak';
  const posts = await fetchAllGhostPosts({
    apiUrl: 'https://example.invalid/blog',
    apiKey: secret,
    onProgress: ({page, pages, totalPostCount}) => progress.push(`${page}/${pages}:${totalPostCount}`),
    fetchImpl: async (input) => {
      const requestUrl = new URL(String(input));
      requestedPages.push(requestUrl.searchParams.get('page') ?? '');
      const page = Number(requestUrl.searchParams.get('page'));
      return new Response(
        JSON.stringify({
          posts: [fixture.posts[page - 1]],
          meta: {pagination: {page, pages: 3}},
        }),
        {headers: {'content-type': 'application/json'}},
      );
    },
  });
  assert.deepEqual(requestedPages, ['1', '2', '3']);
  assert.deepEqual(progress, ['1/3:1', '2/3:2', '3/3:3']);
  assert.equal(posts.length, 3);

  await assert.rejects(
    fetchAllGhostPosts({
      apiUrl: 'https://example.invalid/blog',
      apiKey: secret,
      fetchImpl: async () => {
        throw new Error(secret);
      },
    }),
    (error) => error instanceof Error && !error.message.includes(secret) && /page 1/.test(error.message),
  );
});

test('handles missing and malformed cache, and replaces a cache atomically', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'xen-search-test-'));
  temporaryDirectories.push(directory);
  const cachePath = path.join(directory, 'posts.json');
  assert.equal(await readGhostCache(cachePath), undefined);
  await writeFile(cachePath, '{broken');
  await assert.rejects(readGhostCache(cachePath), /Malformed Ghost search cache/);
  const normalized = fixture.posts.map(normalizeGhostPost);
  await writeGhostCacheAtomic(normalized, cachePath);
  const cache = await readGhostCache(cachePath);
  assert.equal(cache?.posts.length, 3);
  assert.equal((await readFile(cachePath, 'utf8')).includes('fixture-secret'), false);
  assert.deepEqual(await readdir(directory), ['posts.json']);

  const validCache = await readFile(cachePath, 'utf8');
  await assert.rejects(writeGhostCacheAtomic([{invalid: true} as never], cachePath));
  assert.equal(await readFile(cachePath, 'utf8'), validCache);
});

test('requires live Ghost credentials for an explicit refresh without leaking values', async () => {
  await assert.rejects(
    execFileAsync(process.execPath, ['scripts/search/refresh.ts'], {
      cwd: fileURLToPath(new URL('../..', import.meta.url)),
      env: {
        PATH: process.env.PATH,
      },
    }),
    error => {
      const output = `${(error as {stdout?: string}).stdout ?? ''}${(error as {stderr?: string}).stderr ?? ''}`;
      return /requires GHOST_CONTENT_API_URL and GHOST_CONTENT_API_KEY/.test(output) && !/Admin API/.test(output);
    },
  );
});
