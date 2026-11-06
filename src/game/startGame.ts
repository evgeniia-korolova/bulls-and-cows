import { PlayingState, SetupState } from './types';

interface StartGameOptions {
  readonly random?: () => number;
  readonly now?: () => number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function startGame(state: SetupState, options?: StartGameOptions): PlayingState {
  throw new Error('Not implemented');
}
