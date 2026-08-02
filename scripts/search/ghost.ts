import {mkdir, readFile, rename, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import {load} from 'cheerio';
import {z} from 'zod';
import {searchAliasesForText} from '../../src/data/search.ts';

export const cacheVersion = 1;
export const defaultCachePath = process.env.GHOST_SEARCH_CACHE_PATH
  ? path.resolve(process.env.GHOST_SEARCH_CACHE_PATH)
  : fileURLToPath(new URL('../../.cache/ghost-search/posts.json', import.meta.url));

const namedEntitySchema = z.object({name: z.string().min(1)}).passthrough();
/* eslint-disable @typescript-eslint/naming-convention -- Ghost Content API field names are fixed. */
export const ghostPostSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  url: z.string().url(),
  title: z.string().min(1),
  html: z.string().nullable().optional(),
  excerpt: z.string().nullable().optional(),
  custom_excerpt: z.string().nullable().optional(),
  feature_image: z.string().url().nullable().optional(),
  published_at: z.string().datetime({offset: true}),
  updated_at: z.string().datetime({offset: true}),
  visibility: z.string().optional(),
  authors: z.array(namedEntitySchema).default([]),
  tags: z.array(namedEntitySchema).default([]),
  primary_author: namedEntitySchema.nullable().optional(),
  primary_tag: namedEntitySchema.nullable().optional(),
});
/* eslint-enable @typescript-eslint/naming-convention */

export const normalizedGhostPostSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  url: z.string().regex(/^\/blog\//),
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string(),
  publishedAt: z.string().datetime({offset: true}),
  updatedAt: z.string().datetime({offset: true}),
  primaryAuthor: z.string().optional(),
  authors: z.array(z.string()),
  primaryTag: z.string().optional(),
  tags: z.array(z.string()),
  aliases: z.array(z.string()).default([]),
  language: z.literal('en'),
});

export type NormalizedGhostPost = z.infer<typeof normalizedGhostPostSchema>;

export const ghostCacheSchema = z.object({
  version: z.literal(cacheVersion),
  generatedAt: z.string().datetime(),
  posts: z.array(normalizedGhostPostSchema),
});

const removablePatterns = [
  /newsletter/i,
  /subscribe/i,
  /social[-_ ]?share/i,
  /share[-_ ]?(buttons?|links?)/i,
  /kg-embed-card/i,
  /navigation/i,
  /related[-_ ]?(articles?|posts?)/i,
  /similar[-_ ]?articles?/i,
  /recommended[-_ ]?(articles?|posts?|reading)/i,
  /read[-_ ]?next/i,
  /post[-_ ]?(footer|recommendations?)/i,
  /gh-post-upgrade-cta/i,
  /kg-signup-card/i,
];

const trailingBoilerplatePattern =
  /^(?:related posts?|similar articles?|recommended (?:articles?|posts?|reading)|you (?:may|might) also like|read next)\b\s*:?/i;

function uniqueNames(values: string[]) {
  const seen = new Set<string>();
  return values.filter((value) => {
    const normalized = value.trim().toLocaleLowerCase('en');
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

export function cleanGhostHtml(html: string) {
  const $ = load(html);
  $('script, style, nav, form, iframe, noscript').remove();
  $('[class], [id]').each((_, element) => {
    const marker = `${$(element).attr('class') ?? ''} ${$(element).attr('id') ?? ''}`;
    if (removablePatterns.some((pattern) => pattern.test(marker))) $(element).remove();
  });
  $('h1, h2, h3, h4, h5, h6, p, aside, section').each((_, element) => {
    const text = $(element).text().replaceAll(/\s+/g, ' ').trim();
    if (!trailingBoilerplatePattern.test(text)) return;
    $(element).nextAll().remove();
    $(element).remove();
  });
  $('figcaption').each((_, element) => {
    const text = $(element).text().replaceAll(/\s+/g, ' ').trim();
    if (!text || /^(image|photo|video|source|credit):?$/i.test(text)) $(element).remove();
  });
  return $('body')
    .text()
    .replaceAll('\u00A0', ' ')
    .replaceAll(/[ \t]+/g, ' ')
    .replaceAll(/\n\s*\n+/g, '\n')
    .trim();
}

function canonicalBlogPath(value: string) {
  const url = new URL(value, 'https://xenproject.org');
  if (!url.pathname.startsWith('/blog/')) throw new Error('Ghost post URL is outside the public /blog path.');
  return url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
}

export function normalizeGhostPost(input: unknown): NormalizedGhostPost {
  const post = ghostPostSchema.parse(input);
  if (post.visibility && post.visibility !== 'public') throw new Error('Ghost post is not publicly visible.');
  const content = cleanGhostHtml(post.html ?? '');
  const fallbackExcerpt = cleanGhostHtml(post.excerpt ?? '') || content.slice(0, 240).trim();
  const excerpt = cleanGhostHtml(post.custom_excerpt ?? '') || fallbackExcerpt;
  const primaryAuthor = post.primary_author?.name ?? post.authors[0]?.name;
  const primaryTag = post.primary_tag?.name ?? post.tags[0]?.name;
  const authors = uniqueNames(post.authors.map((author) => author.name));
  const tags = uniqueNames(post.tags.map((tag) => tag.name));
  const aliases = searchAliasesForText(`${post.title}\n${excerpt}\n${content}\n${tags.join(' ')}`);
  return normalizedGhostPostSchema.parse({
    id: post.id,
    slug: post.slug,
    url: canonicalBlogPath(post.url),
    title: post.title.trim(),
    content: `${post.title.trim()}\n${excerpt}\n${content || fallbackExcerpt}`,
    excerpt,
    publishedAt: post.published_at,
    updatedAt: post.updated_at,
    primaryAuthor,
    authors,
    primaryTag,
    tags,
    aliases,
    language: 'en',
  });
}

export function deduplicateGhostPosts(posts: NormalizedGhostPost[]) {
  const byIdentity = new Map<string, NormalizedGhostPost>();
  for (const post of posts) {
    const existing = byIdentity.get(post.id) ?? byIdentity.get(post.url);
    if (!existing || Date.parse(post.updatedAt) > Date.parse(existing.updatedAt)) {
      if (existing) {
        byIdentity.delete(existing.id);
        byIdentity.delete(existing.url);
      }

      byIdentity.set(post.id, post);
      byIdentity.set(post.url, post);
    }
  }

  return [...new Map([...byIdentity.values()].map((post) => [post.id, post])).values()];
}

type FetchLike = typeof fetch;

export type GhostFetchProgress = {
  page: number;
  pages: number;
  pagePostCount: number;
  totalPostCount: number;
};

export async function fetchAllGhostPosts(options: {
  apiUrl: string;
  apiKey: string;
  fetchImpl?: FetchLike;
  onProgress?: (progress: GhostFetchProgress) => void;
}) {
  const fetchImpl = options.fetchImpl ?? fetch;
  let page = 1;
  let pages = 1;
  const records: NormalizedGhostPost[] = [];
  do {
    const endpoint = new URL('ghost/api/content/posts/', `${options.apiUrl.replace(/\/$/, '')}/`);
    endpoint.searchParams.set('key', options.apiKey);
    endpoint.searchParams.set('limit', '100');
    endpoint.searchParams.set('page', String(page));
    endpoint.searchParams.set('include', 'authors,tags');
    endpoint.searchParams.set('filter', 'visibility:public');
    endpoint.searchParams.set(
      'fields',
      'id,slug,url,title,html,excerpt,custom_excerpt,feature_image,published_at,updated_at,visibility',
    );

    let response: Response;

    try {
      // Pagination is intentionally sequential so a later page cannot be fetched before its metadata is validated.
      // eslint-disable-next-line no-await-in-loop
      response = await fetchImpl(endpoint);
    } catch {
      throw new Error(`Ghost Content API request failed on page ${page}.`);
    }

    if (!response.ok) throw new Error(`Ghost Content API returned HTTP ${response.status} on page ${page}.`);

    let payload: unknown;

    try {
      // eslint-disable-next-line no-await-in-loop
      payload = await response.json();
    } catch {
      throw new Error(`Ghost Content API returned invalid JSON on page ${page}.`);
    }

    const parsed = z
      .object({
        posts: z.array(z.unknown()),
        meta: z.object({
          pagination: z.object({page: z.number().int().positive(), pages: z.number().int().nonnegative()}),
        }),
      })
      .safeParse(payload);
    if (!parsed.success) throw new Error(`Ghost Content API response was invalid on page ${page}.`);
    pages = parsed.data.meta.pagination.pages;
    if (parsed.data.meta.pagination.page !== page)
      throw new Error(`Ghost Content API pagination was inconsistent on page ${page}.`);
    for (const post of parsed.data.posts) records.push(normalizeGhostPost(post));
    options.onProgress?.({
      page,
      pages,
      pagePostCount: parsed.data.posts.length,
      totalPostCount: records.length,
    });
    page += 1;
  } while (page <= pages);

  return deduplicateGhostPosts(records);
}

export async function writeGhostCacheAtomic(posts: NormalizedGhostPost[], cachePath = defaultCachePath) {
  await mkdir(path.dirname(cachePath), {recursive: true});
  const temporaryPath = `${cachePath}.${process.pid}.${Date.now()}.tmp`;
  const cache = ghostCacheSchema.parse({version: cacheVersion, generatedAt: new Date().toISOString(), posts});
  try {
    await writeFile(temporaryPath, `${JSON.stringify(cache, null, 2)}\n`, {
      encoding: 'utf8',
      flag: 'wx',
      mode: 0o600,
    });
    await rename(temporaryPath, cachePath);
  } finally {
    await rm(temporaryPath, {force: true});
  }
}

export async function readGhostCache(cachePath = defaultCachePath) {
  let raw: string;
  try {
    raw = await readFile(cachePath, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw error;
  }

  try {
    return ghostCacheSchema.parse(JSON.parse(raw));
  } catch {
    throw new Error(
      `Malformed Ghost search cache at ${path.relative(process.cwd(), cachePath)}. Run npm run search:refresh.`,
    );
  }
}
