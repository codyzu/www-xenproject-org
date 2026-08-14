export type SearchRankResult = {
  id: string;
  score: number;
};

type FuseSearchRanksOptions = {
  eligibilityLimit?: number;
  minimumRelativeScore?: number;
  rankConstant?: number;
  freshnessWeight?: number;
};

const defaultOptions = {
  eligibilityLimit: 200,
  minimumRelativeScore: 0.1,
  rankConstant: 60,
  freshnessWeight: 4,
} as const;

/**
 * Blends Pagefind's relevance and publication-date ranks without depending on
 * query-specific raw score ranges. Freshness only applies to results that are
 * already credible relevance candidates.
 */
export function fuseSearchRanks<Result extends SearchRankResult>(
  relevanceResults: Result[],
  newestBlogResults: Result[],
  options: FuseSearchRanksOptions = {},
) {
  const settings = {...defaultOptions, ...options};
  const highestScore = relevanceResults[0]?.score ?? 0;
  const newestRanks = new Map(newestBlogResults.map(({id}, index) => [id, index + 1]));

  const rankedBlogResults = relevanceResults
    .map((result, index) => {
      const relevanceRank = index + 1;
      const newestRank = newestRanks.get(result.id);
      if (newestRank === undefined) return undefined;
      const receivesFreshnessBoost =
        relevanceRank <= settings.eligibilityLimit &&
        (highestScore <= 0 || result.score >= highestScore * settings.minimumRelativeScore);
      const fusedScore =
        1 / (settings.rankConstant + relevanceRank) +
        (receivesFreshnessBoost ? settings.freshnessWeight / (settings.rankConstant + newestRank) : 0);

      return {result, relevanceRank, fusedScore};
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== undefined)
    .sort((left, right) => right.fusedScore - left.fusedScore || left.relevanceRank - right.relevanceRank)
    .map(({result}) => result);

  let nextBlogResult = 0;
  return relevanceResults.map((result) => (newestRanks.has(result.id) ? rankedBlogResults[nextBlogResult++] : result));
}
