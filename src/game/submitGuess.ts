import { evaluateGuess } from '../evaluateGuess';
import { isValidGuess } from '../isValidGuess';
import type { PlayingState, WonState } from './types';

interface SubmitGuessOptions {
  readonly state: PlayingState;
  readonly guess: string;
  readonly now: () => number;
}

export function submitGuess(options: SubmitGuessOptions): PlayingState | WonState {
  const { state, guess } = options;

  if (!isValidGuess(guess, state.settings.length, state.settings.base)) {
    throw new Error('Invalid guess');
  }

  const attempt = {
    guess,
    ...evaluateGuess(state.secret, guess),
  };

  const attempts = [...state.history, attempt];

  const completedAt = options.now?.() ?? Date.now();

  if (attempt.bulls === state.settings.length) {
    return {
      status: 'won',
      result: {
        settings: state.settings,
        attempts,
        duration: completedAt - state.startedAt,
        completedAt,
        outcome: 'won',
      },
    };
  }

  return {
    ...state,
    history: attempts,
    currentGuess: '',
  };
}
