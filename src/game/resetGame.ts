import { LostState, SetupState, WonState } from './types';

interface ResetGameOptions {
  readonly state: WonState | LostState;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function resetGame(options: ResetGameOptions): SetupState {
  throw new Error('Not implemented');
}
