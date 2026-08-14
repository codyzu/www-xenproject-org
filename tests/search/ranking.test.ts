import assert from 'node:assert/strict';
import test from 'node:test';
import {fuseSearchRanks, type SearchRankResult} from '../../src/data/search-ranking.ts';

const result = (id: string, score: number): SearchRankResult => ({id, score});

test('boosts recent credible matches without admitting weak incidental matches', () => {
  const relevance = [
    result('old-exact', 40),
    result('technical-match', 24),
    ...Array.from({length: 145}, (_, index) => result(`historical-${index}`, 12 - index / 20)),
    result('recent-release', 5),
    result('recent-incidental', 2),
  ];
  const newest = [result('recent-incidental', 2), result('recent-release', 5), result('technical-match', 24)];
  const ranked = fuseSearchRanks(relevance, newest);

  assert.ok(ranked.indexOf(resultById(ranked, 'recent-release')) < 4);
  assert.ok(ranked.indexOf(resultById(ranked, 'recent-incidental')) > 100);
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
