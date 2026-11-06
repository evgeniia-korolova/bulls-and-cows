import { afterEach, describe, expect, it, vi } from 'vitest';
import { GAME_BASES } from '../../src/game/constants';
import type { SetupState } from '../../src/game/types';
import { startGame } from '../../src/game/startGame';

describe('startGame', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockSetupState: SetupState = {
    status: 'setup',
    settings: {
      length: 4,
      base: GAME_BASES.DECIMAL,
    },
  };
  it('should be defined', () => {
    expect(startGame).toBeDefined();
  });

  it('should initialize a new game with the provided settings', () => {
    const random = () => 0;
    const now = () => 123456789;
    const round = startGame(mockSetupState, { random, now });
    expect(round).toEqual({
      status: 'playing',
      secret: '0123',
      history: [],
      currentGuess: '',
      startedAt: 123456789,
      settings: {
        length: 4,
        base: GAME_BASES.DECIMAL,
      },
    });
  });

  it('should initialize a new game with default options', () => {
    vi.spyOn(Date, 'now').mockReturnValue(123456789);

    const round = startGame(mockSetupState);

    expect(round).toEqual({
      status: 'playing',
      secret: expect.any(String),
      history: [],
      currentGuess: '',
      startedAt: 123456789,
      settings: mockSetupState.settings,
    });

    expect(round.secret).toHaveLength(mockSetupState.settings.length);
    expect(new Set(round.secret).size).toBe(round.secret.length);
  });
});
