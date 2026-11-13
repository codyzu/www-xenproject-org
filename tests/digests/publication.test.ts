import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {test} from 'node:test';
import {promisify} from 'node:util';
import {load} from 'cheerio';

const run = promisify(execFile);

test('builds only reviewed, published issues and connects the archive, feed, and latest placements', {timeout: 180_000}, async () => {
  const output = await mkdtemp(path.join(os.tmpdir(), 'xen-digest-test-'));
  const content = path.resolve('src/content/xen-devel-digests');
  const fixtures = [
    {id: 'fixture-digest-older', end: '2020-01-07', draft: false, published: '2020-01-08'},
    {id: 'fixture-digest-newer', end: '2020-01-14', draft: false, published: '2020-01-15'},
    {id: 'fixture-digest-draft', end: '2020-01-21', draft: true, published: '2020-01-22'},
    {id: 'fixture-digest-future', end: '2020-01-28', draft: false, published: '2999-01-29'},
  ];
  const created: string[] = [];
  const archive = '/community/xen-devel-digest/';
  const read = (url: string) => readFile(path.join(output, url, 'index.html'), 'utf8');
  try {
    for (const fixture of fixtures) {
      await writeFile(path.join(content, `${fixture.id}.md`), `---
title: '${fixture.id}'
description: 'Synthetic publication fixture'
coverageStart: '2020-01-01'
coverageEnd: '${fixture.end}'
author: Test author
reviewedBy: Test reviewer
publishedAt: '${fixture.published}'
draft: ${fixture.draft}
---

## Publication fixture

Synthetic body for ${fixture.id}.
`, {flag: 'wx'});
      created.push(path.join(content, `${fixture.id}.md`));
    }
    await run(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build', '--outDir', output], {
      env: {...process.env, DOWNLOADS_SOURCE: 'fixture', SITE_URL: 'https://digest.example'},
      maxBuffer: 10 * 1024 * 1024,
    });
    const archiveHtml = await read(archive);
    assert.ok(archiveHtml.indexOf('fixture-digest-newer') < archiveHtml.indexOf('fixture-digest-older'));
    for (const id of ['fixture-digest-draft', 'fixture-digest-future']) {
      assert.ok(!archiveHtml.includes(id));
      await assert.rejects(read(`${archive}${id}/`), {code: 'ENOENT'});
    }
    const newer = load(await read(`${archive}fixture-digest-newer/`));
    assert.equal(newer('h1').text().trim(), 'fixture-digest-newer');
    assert.equal(newer('link[rel="canonical"]').attr('href'), `https://digest.example${archive}fixture-digest-newer/`);
    assert.equal(newer('nav[aria-label="Weekly issues"] a').attr('href'), `${archive}fixture-digest-older/`);
    assert.ok(newer('[data-pagefind-body]').text().includes('Synthetic body'));
    const older = load(await read(`${archive}fixture-digest-older/`));
    assert.equal(older('nav[aria-label="Weekly issues"] a').attr('href'), `${archive}fixture-digest-newer/`);
    for (const url of ['/', '/community/']) {
      const $ = load(await read(url));
      assert.equal($('#development-updates h2').text().trim(), 'fixture-digest-newer');
      assert.equal($('#development-updates a').first().attr('href'), `${archive}fixture-digest-newer/`);
    }
    const feed = load(await readFile(path.join(output, archive, 'rss.xml'), 'utf8'), {xmlMode: true});
    assert.deepEqual(feed('item > title').toArray().map(node => feed(node).text()), ['fixture-digest-newer', 'fixture-digest-older']);
    assert.equal(feed('item > link').first().text(), `https://digest.example${archive}fixture-digest-newer/`);
    const sitemap = await readFile(path.join(output, 'sitemap-0.xml'), 'utf8');
    assert.ok(sitemap.includes(`${archive}fixture-digest-newer/`));
    assert.ok(!sitemap.includes('fixture-digest-draft'));
    assert.ok(!sitemap.includes('fixture-digest-future'));
  } finally {
    for (const file of created) await rm(file, {force: true});
    await rm(output, {recursive: true, force: true});
  }
});
