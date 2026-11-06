import type { PlayingState, WonState } from './types';

interface SubmitGuessOptions {
  readonly state: PlayingState;
  readonly guess: string;
  readonly now?: () => number;
}

export function submitGuess(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options: SubmitGuessOptions,
): PlayingState | WonState {
  throw new Error('Not implemented');
}
