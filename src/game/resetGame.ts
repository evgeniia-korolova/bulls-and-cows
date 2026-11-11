import { LostState, SetupState, WonState } from './types';

interface ResetGameOptions {
  readonly state: WonState | LostState;
}

export function resetGame(options: ResetGameOptions): SetupState {
  return {
    status: 'setup',
    settings: options.state.result.settings,
  };
}
