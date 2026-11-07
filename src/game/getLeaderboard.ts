import type { GameResult } from './types';

export function getLeaderboard(results: readonly GameResult[]): readonly GameResult[] {
  return results
    .filter((result) => result.outcome === 'won')
    .sort(
      (first, second) =>
        first.attempts.length - second.attempts.length || first.duration - second.duration,
    );
}
