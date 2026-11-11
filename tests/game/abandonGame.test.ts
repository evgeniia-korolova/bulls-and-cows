import { describe, expect, it } from 'vitest';
import { abandonGame } from '../../src/game/abandonGame';
import { PlayingState } from '../../src/game/types';
import { GAME_BASES } from '../../src/game/constants';

describe('', () => {
  const mockPlayingState: PlayingState = {
    status: 'playing',
    settings: {
      length: 4,
      base: GAME_BASES.DECIMAL,
    },
    secret: '4271',
    history: [
      { guess: '1234', bulls: 1, cows: 2 },
      { guess: '5678', bulls: 0, cows: 1 },
    ],
    currentGuess: '123',
    startedAt: 1000,
  };

  it('should be defined', () => {
    expect(abandonGame).toBeDefined();
  });

  it('should finish the game with lost status', () => {
    const result = abandonGame({
      state: mockPlayingState,
      now: () => 6500,
    });

    expect(result).toEqual({
      status: 'lost',
      result: {
        settings: mockPlayingState.settings,
        attempts: mockPlayingState.history,
        duration: 5500,
        completedAt: 6500,
        outcome: 'lost',
      },
    });
  });

  it('should not mutate the original game state', () => {
    const state = structuredClone(mockPlayingState);

    abandonGame({
      state,
      now: () => 6500,
    });

    expect(state).toEqual(mockPlayingState);
  });
});
