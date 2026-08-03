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
  deduplicateGhostPosts,
  fetchAllGhostPosts,
  normalizeGhostPost,
  readGhostCache,
  resolveGhostCachePath,
  writeGhostCacheAtomic,
} from '../../scripts/search/ghost.ts';
import {ensureGhostCache} from '../../scripts/search/ensure-cache.ts';
import {ghostPagefindRecord} from '../../scripts/search/index.ts';
import {
  promotedTermsForUrl,
  promotedUrlsForQuery,
  searchAliasesForPage,
  searchAliasesForText,
  sectionForPath,
} from '../../src/data/search.ts';

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
  assert.deepEqual(technical.aliases, ['dom0', 'control domain', 'XenStore', 'Xen Store', 'PVH', 'paravirtualized hardware', 'live migration', 'VM migration']);
  const record = ghostPagefindRecord(rich);
  assert.equal(record.meta.ghostId, 'fixture-rich-003');
  assert.deepEqual(record.filters.section, ['Blog']);
  assert.deepEqual(record.filters.contentType, ['Blog']);
  assert.equal(record.url, '/blog/open-virtualization-boundaries/');
});

test('removes boilerplate while preserving technical content', () => {
  const cleaned = cleanGhostHtml(`${(fixture.posts[1] as {html: string}).html}<nav>Repeated navigation</nav>`);
  assert.match(cleaned, /XenStore/);
  assert.match(cleaned, /xl migrate/);
  assert.doesNotMatch(cleaned, /display:none|Repeated navigation/);
  const rich = cleanGhostHtml((fixture.posts[2] as {html: string}).html);
  assert.match(rich, /responsibilities stay visible/);
  assert.doesNotMatch(rich, /Similar articles|recommendation must not enter|Become a member to keep reading/);
  assert.doesNotMatch(normalizeGhostPost(fixture.posts[0]).content, /secret|Subscribe/);
});

test('deduplicates Ghost identities and defines conservative aliases and route sections', () => {
  const technical = normalizeGhostPost(fixture.posts[1]);
  const newer = {...technical, updatedAt: '2025-03-13T12:00:00.000Z'};
  assert.deepEqual(deduplicateGhostPosts([technical, newer]), [newer]);
  assert.deepEqual(searchAliasesForText('How a Xen Security Advisory affects dom0'), [
    'dom0',
    'control domain',
    'XSA',
    'Xen Security Advisory',
  ]);
  assert.deepEqual(searchAliasesForText('Dom0less boot for embedded systems'), [
    'Dom0less',
    'dom0-less',
    'without a control domain',
  ]);
  assert.deepEqual(searchAliasesForText('Boot Xen without a control domain'), [
    'dom0',
    'control domain',
    'Dom0less',
    'dom0-less',
    'without a control domain',
  ]);
  assert.equal(sectionForPath('/resources/downloads/'), 'Releases');
  assert.equal(sectionForPath('/projects/hypervisor/openpgp-keys/'), 'Security');
  assert.equal(sectionForPath('/more/xen-branding/'), 'About');
});

test('defines narrow promoted results and indexing terms for the chat query', () => {
  assert.deepEqual(promotedUrlsForQuery(' chat '), [
    '/resources/matrix/',
    '/blog/we-have-moved-to-matrix/',
  ]);
  assert.deepEqual(promotedUrlsForQuery('chat history'), []);
  assert.deepEqual(promotedTermsForUrl('/blog/we-have-moved-to-matrix/'), ['chat']);
  const matrixRecord = ghostPagefindRecord(normalizeGhostPost(fixture.posts[3]));
  assert.match(matrixRecord.meta.aliases ?? '', /chat/);
  const ircRecord = ghostPagefindRecord(normalizeGhostPost(fixture.posts[4]));
  assert.doesNotMatch(ircRecord.meta.aliases ?? '', /chat/);
});

test('promotes downloads for exact download and release intent', () => {
  for (const query of ['download', 'downloads', 'xen download', 'download xen', 'release', 'xen releases']) {
    assert.deepEqual(promotedUrlsForQuery(query), ['/resources/downloads/']);
  }
  assert.deepEqual(promotedUrlsForQuery('download drivers'), []);
  assert.deepEqual(promotedTermsForUrl('/resources/downloads/'), [
    'download',
    'downloads',
    'xen download',
    'xen downloads',
    'download xen',
    'release',
    'releases',
    'xen release',
    'xen releases',
  ]);
  assert.deepEqual(searchAliasesForPage('/resources/downloads/', 'Downloads for dom0'), [
    'dom0',
    'control domain',
    'download',
    'downloads',
    'xen download',
    'xen downloads',
    'download xen',
    'release',
    'releases',
    'xen release',
    'xen releases',
  ]);
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
  assert.equal(cache?.posts.length, fixture.posts.length);
  assert.equal((await readFile(cachePath, 'utf8')).includes('fixture-secret'), false);
  assert.deepEqual(await readdir(directory), ['posts.json']);

  const validCache = await readFile(cachePath, 'utf8');
  await assert.rejects(writeGhostCacheAtomic([{invalid: true} as never], cachePath));
  assert.equal(await readFile(cachePath, 'utf8'), validCache);
});

test('resolves the default Ghost cache from the project working directory', () => {
  const projectRoot = path.join(tmpdir(), 'xen-project-root');
  assert.equal(
    resolveGhostCachePath(undefined, projectRoot),
    path.join(projectRoot, '.cache/ghost-search/posts.json'),
  );
  assert.equal(
    resolveGhostCachePath('custom/posts.json', projectRoot),
    path.join(projectRoot, 'custom/posts.json'),
  );
});

test('seeds a missing development cache without replacing an existing cache', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'xen-search-dev-cache-'));
  temporaryDirectories.push(directory);
  const cachePath = path.join(directory, 'posts.json');

  assert.deepEqual(await ensureGhostCache(cachePath), {source: 'fixture', count: fixture.posts.length});
  assert.equal((await readGhostCache(cachePath))?.posts.length, fixture.posts.length);

  const existingPost = normalizeGhostPost(fixture.posts[0]);
  await writeGhostCacheAtomic([existingPost], cachePath);
  assert.deepEqual(await ensureGhostCache(cachePath), {source: 'existing', count: 1});
  assert.deepEqual((await readGhostCache(cachePath))?.posts, [existingPost]);
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
