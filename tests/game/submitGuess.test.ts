import { describe, expect, it } from 'vitest';
import { submitGuess } from '../../src/game/submitGuess';
import { GAME_BASES } from '../../src/game/constants';
import { PlayingState } from '../../src/game/types';

describe('submitGuess', () => {
  const mockPlayingState: PlayingState = {
    status: 'playing',
    settings: {
      length: 4,
      base: GAME_BASES.DECIMAL,
    },
    secret: '4271',
    history: [],
    currentGuess: '1234',
    startedAt: 1000,
  };

  it('should be defined', () => {
    expect(submitGuess).toBeDefined();
  });

  it('should add a valid non-winning guess to history', () => {
    const result = submitGuess({
      state: mockPlayingState,
      guess: '1234',
    });

    expect(result).toEqual({
      ...mockPlayingState,
      currentGuess: '',
      history: [
        {
          guess: '1234',
          bulls: 1,
          cows: 2,
        },
      ],
    });
  });

  it('should throw an error for an invalid guess', () => {
    expect(() =>
      submitGuess({
        state: mockPlayingState,
        guess: '1123',
      }),
    ).toThrow('Invalid guess');
  });

  it('should finish the game when the guess is correct', () => {
    const now = () => 6500;

    const result = submitGuess({
      state: mockPlayingState,
      guess: '4271',
      now,
    });

    expect(result).toEqual({
      status: 'won',
      result: {
        settings: mockPlayingState.settings,
        attempts: [
          {
            guess: '4271',
            bulls: 4,
            cows: 0,
          },
        ],
        duration: 5500,
        completedAt: 6500,
        outcome: 'won',
      },
    });
  });

  it('should preserve previous attempts when the game is won', () => {
    const state: PlayingState = {
      ...mockPlayingState,
      history: [
        {
          guess: '1234',
          bulls: 1,
          cows: 2,
        },
      ],
    };

    const result = submitGuess({
      state,
      guess: '4271',
      now: () => 6500,
    });

    expect(result).toEqual({
      status: 'won',
      result: {
        settings: state.settings,
        attempts: [
          {
            guess: '1234',
            bulls: 1,
            cows: 2,
          },
          {
            guess: '4271',
            bulls: 4,
            cows: 0,
          },
        ],
        duration: 5500,
        completedAt: 6500,
        outcome: 'won',
      },
    });
  });

  it('should not mutate the original game state', () => {
    const state = structuredClone(mockPlayingState);

    submitGuess({
      state,
      guess: '1234',
    });

    expect(state).toEqual(mockPlayingState);
  });
});
