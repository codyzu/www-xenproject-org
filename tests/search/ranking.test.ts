import assert from 'node:assert/strict';
import test from 'node:test';
import {fuseSearchRanks, type SearchRankResult} from '../../src/data/search-ranking.ts';

const result = (id: string, score: number): SearchRankResult => ({id, score});

test('boosts recent credible matches without admitting weak incidental matches', () => {
  const historical = Array.from({length: 145}, (_, index) => result(`historical-${index}`, 12 - index / 20));
  const relevance = [
    result('website-exact', 45),
    result('old-exact', 40),
    result('technical-match', 24),
    result('website-secondary', 20),
    ...historical,
    result('recent-release', 5),
    result('recent-incidental', 2),
  ];
  const newest = [
    result('recent-incidental', 2),
    result('recent-release', 5),
    result('technical-match', 24),
    ...[...historical].reverse(),
    result('old-exact', 40),
  ];
  const ranked = fuseSearchRanks(relevance, newest);

  assert.equal(ranked[0]?.id, 'website-exact');
  assert.equal(ranked[3]?.id, 'website-secondary');
  assert.ok(ranked.indexOf(resultById(ranked, 'recent-release')) < 4);
  assert.ok(ranked.indexOf(resultById(ranked, 'recent-incidental')) > 100);
});

test('reorders Blog results only within the slots Pagefind assigned to Blog', () => {
  const relevance = [
    result('website-first', 30),
    result('older-blog', 25),
    result('website-second', 20),
    result('newer-blog', 15),
  ];
  const ranked = fuseSearchRanks(relevance, [result('newer-blog', 15), result('older-blog', 25)]);

  assert.deepEqual(ranked.map(({id}) => id), [
    'website-first',
    'newer-blog',
    'website-second',
    'older-blog',
  ]);
});

test('uses original relevance rank as a deterministic tie breaker', () => {
  const relevance = [result('first', 10), result('second', 10)];
  assert.deepEqual(fuseSearchRanks(relevance, []), relevance);
});

test('does not boost results beyond the relevance eligibility window', () => {
  const relevance = Array.from({length: 202}, (_, index) => result(`result-${index}`, 10));
  const ranked = fuseSearchRanks(relevance, [result('result-201', 10)]);
  assert.equal(ranked.at(-1)?.id, 'result-201');
});

function resultById(results: SearchRankResult[], id: string) {
  const match = results.find((item) => item.id === id);
  assert.ok(match);
  return match;
}
