import { describe, expect, it } from 'vitest';
import { GAME_BASES } from '../../src/game/constants';
import type { LostState, WonState } from '../../src/game/types';
import { resetGame } from '../../src/game/resetGame';

describe('resetGame', () => {
  const settings = {
    length: 4,
    base: GAME_BASES.DECIMAL,
  };

  const result = {
    settings,
    attempts: [{ guess: '4271', bulls: 4, cows: 0 }],
    duration: 5500,
    completedAt: 6500,
    outcome: 'won' as const,
  };

  const wonState: WonState = {
    status: 'won',
    result,
  };

  const lostState: LostState = {
    status: 'lost',
    result: {
      ...result,
      outcome: 'lost',
    },
  };

  it('should reset a won game to setup state', () => {
    expect(resetGame({ state: wonState })).toEqual({
      status: 'setup',
      settings,
    });
  });

  it('should reset a lost game to setup state', () => {
    expect(resetGame({ state: lostState })).toEqual({
      status: 'setup',
      settings,
    });
  });

  it('should preserve game settings', () => {
    const customSettings = {
      length: 6,
      base: GAME_BASES.HEXADECIMAL,
    };

    const state: WonState = {
      status: 'won',
      result: {
        ...result,
        settings: customSettings,
      },
    };

    expect(resetGame({ state })).toEqual({
      status: 'setup',
      settings: customSettings,
    });
  });
});
