import { LostState, PlayingState } from './types';

interface AbandonGameOptions {
  readonly state: PlayingState;
  readonly now?: () => number;
}

export function abandonGame(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options: AbandonGameOptions,
): LostState {
  throw new Error('Not implemented');
}
