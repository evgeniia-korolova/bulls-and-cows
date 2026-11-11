import { generateSecret } from '../generateSecret';
import { PlayingState, SetupState } from './types';

interface StartGameOptions {
  readonly random?: () => number;
  readonly now: () => number;
}

export function startGame(state: SetupState, options?: StartGameOptions): PlayingState {
  const secret = generateSecret(state.settings.length, state.settings.base, options?.random);
  const startedAt = options?.now?.() ?? Date.now();

  return {
    status: 'playing',
    secret,
    history: [],
    currentGuess: '',
    startedAt,
    settings: state.settings,
  };
}
