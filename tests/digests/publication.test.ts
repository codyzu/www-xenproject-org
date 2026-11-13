import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import path from 'node:path';
import {test} from 'node:test';
import {load} from 'cheerio';
import yaml from 'js-yaml';

const archive = '/community/xen-devel-digest/';
const read = (url: string) => readFile(path.join('dist', url, 'index.html'), 'utf8');

test('renders every collection issue without requiring publication or reviewer metadata', async () => {
  const directory = 'src/content/xen-devel-digests';
  const issues = await Promise.all((await readdir(directory)).filter(file => file.endsWith('.md')).map(async file => {
    const source = await readFile(path.join(directory, file), 'utf8');
    const data = yaml.load(source.split('---')[1]) as {title: string; coverageEnd: Date; publishedAt?: Date};
    return {id: file.slice(0, -3), data};
  }));
  issues.sort((a, b) => new Date(b.data.coverageEnd).getTime() - new Date(a.data.coverageEnd).getTime());
  const index = load(await read(archive));
  const origin = new URL(index('link[rel="canonical"]').attr('href')!).origin;
  assert.deepEqual(index('article h3 a').toArray().map(node => index(node).attr('href')), issues.map(issue => `${archive}${issue.id}/`));
  const sitemap = await readFile('dist/sitemap-0.xml', 'utf8');
  for (const [i, issue] of issues.entries()) {
    const url = `${archive}${issue.id}/`;
    const $ = load(await read(url));
    assert.equal($('h1').text().trim(), issue.data.title);
    assert.equal($('link[rel="canonical"]').attr('href'), `${origin}${url}`);
    assert.ok($('[data-pagefind-body]').text().includes('Most discussed'));
    assert.ok(!$('article').text().includes('Reviewed by undefined'));
    assert.ok(sitemap.includes(url));
    const expected = [issues[i + 1], issues[i - 1]].filter(Boolean).map(adjacent => `${archive}${adjacent.id}/`);
    assert.deepEqual($('nav[aria-label="Weekly issues"] a').toArray().map(node => $(node).attr('href')), expected);
  }
  const feed = load(await readFile(`dist${archive}rss.xml`, 'utf8'), {xmlMode: true});
  assert.deepEqual(feed('item > title').toArray().map(node => feed(node).text()), issues.map(issue => issue.data.title));
  for (const [i, item] of feed('item').toArray().entries()) {
    assert.equal(new Date(feed(item).find('pubDate').text()).getTime(), new Date(issues[i].data.publishedAt ?? issues[i].data.coverageEnd).getTime());
  }
  for (const url of ['/', '/community/']) {
    const $ = load(await read(url));
    assert.equal($('#development-updates h2').text().trim(), issues[0].data.title);
    assert.equal($('#development-updates a').first().attr('href'), `${archive}${issues[0].id}/`);
  }
});
