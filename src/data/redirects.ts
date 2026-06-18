import {readFileSync} from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import {z} from 'zod';

const rootedRoute = z.string().regex(/^\/(?:.*\/)?$/, 'must be a rooted route ending in /');
const redirectTarget = z.string().refine((value) => {
  if (value.startsWith('/')) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}, 'must be a rooted local path or an absolute HTTP(S) URL');

export type Redirect = {
  source: string;
  target: string;
  /**
   * `alias` preserves a historical URL declared by a content page's Hugo
   * frontmatter. `redirect` represents a standalone redirect content route.
   * Astro renders both with the same static redirect page, but retaining the
   * distinction documents their origin and supports migration auditing.
   */
  type: 'alias' | 'redirect';
};

const redirectSchema: z.ZodType<Redirect> = z.object({
  source: rootedRoute,
  target: redirectTarget,
  type: z.enum(['alias', 'redirect']),
});

const redirectsSchema = z.array(redirectSchema).superRefine((redirects, context) => {
  const sources = new Set<string>();

  for (const [index, redirect] of redirects.entries()) {
    if (sources.has(redirect.source)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `duplicate redirect source: ${redirect.source}`,
        path: [index, 'source'],
      });
    }

    sources.add(redirect.source);
  }
});

const redirectsYaml = readFileSync(path.resolve('data/redirects.yaml'), 'utf8');

export const redirects = redirectsSchema.parse(yaml.load(redirectsYaml));

export const normalizeRoute = (route: string) => {
  const {pathname} = new URL(route, 'https://beta.xenproject.org');

  if (pathname === '/' || pathname.endsWith('/') || /\/[^/]+\.[^/]+$/.test(pathname)) {
    return pathname;
  }

  return `${pathname}/`;
};

export const getOwnedRedirects = (contentRoutes: readonly string[]) => {
  const normalizedContentRoutes = new Set(contentRoutes.map((route) => normalizeRoute(route)));

  return redirects.filter(
    (redirect) => !redirect.target.startsWith('/') || normalizedContentRoutes.has(normalizeRoute(redirect.target)),
  );
};
