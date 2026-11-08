import { describe, expect, it } from 'vitest';
import { getLeaderboard } from '../../src/game/getLeaderboard';
import type { GameResult } from '../../src/game/types';

describe('getLeaderboard', () => {
  const results: GameResult[] = [
    {
      settings: { length: 4, base: 10 },
      attempts: [
        { guess: '1234', bulls: 2, cows: 1 },
        { guess: '1256', bulls: 4, cows: 0 },
      ],
      duration: 60_000,
      completedAt: 200,
      outcome: 'won',
    },
    {
      settings: { length: 4, base: 10 },
      attempts: [
        { guess: '1234', bulls: 1, cows: 2 },
        { guess: '1256', bulls: 2, cows: 1 },
        { guess: '1257', bulls: 4, cows: 0 },
      ],
      duration: 30_000,
      completedAt: 300,
      outcome: 'won',
    },
    {
      settings: { length: 4, base: 10 },
      attempts: [{ guess: '1234', bulls: 0, cows: 0 }],
      duration: 10_000,
      completedAt: 400,
      outcome: 'lost',
    },
    {
      settings: { length: 4, base: 10 },
      attempts: [
        { guess: '1234', bulls: 2, cows: 1 },
        { guess: '1256', bulls: 4, cows: 0 },
      ],
      duration: 40_000,
      completedAt: 100,
      outcome: 'won',
    },
  ];

  it('should include only won games', () => {
    const leaderboard = getLeaderboard(results);

    expect(leaderboard).toHaveLength(3);
    expect(leaderboard.every((result) => result.outcome === 'won')).toBe(true);
  });

  it('should sort games by attempts count in ascending order', () => {
    const leaderboard = getLeaderboard(results);

    expect(leaderboard.map((result) => result.attempts.length)).toEqual([2, 2, 3]);
  });

  it('should sort games by duration when attempts count is equal', () => {
    const leaderboard = getLeaderboard(results);

    expect(leaderboard.map((result) => result.duration)).toEqual([40_000, 60_000, 30_000]);
  });

  it('should not mutate the original results array', () => {
    const originalResults = [...results];

    getLeaderboard(results);

    expect(results).toEqual(originalResults);
  });

  it('should return an empty array when there are no results', () => {
    expect(getLeaderboard([])).toEqual([]);
  });

  it('should return only the top 5 results', () => {
    const additionalResults = Array.from({ length: 7 }, (_, index): GameResult => ({
      settings: { length: 4, base: 10 },
      attempts: Array.from({ length: index + 1 }, () => ({
        guess: '1234',
        bulls: 4,
        cows: 0,
      })),
      duration: (index + 1) * 1000,
      completedAt: index,
      outcome: 'won',
    }));

    const leaderboard = getLeaderboard(additionalResults);

    expect(leaderboard).toHaveLength(5);
    expect(leaderboard.map((result) => result.attempts.length)).toEqual([1, 2, 3, 4, 5]);
  });
});
