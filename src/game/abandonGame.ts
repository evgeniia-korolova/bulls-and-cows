import { LostState, PlayingState } from './types';

interface AbandonGameOptions {
  readonly state: PlayingState;
  readonly now: () => number;
}

export function abandonGame(options: AbandonGameOptions): LostState {
  const { state } = options;
  const completedAt = options.now?.() ?? Date.now();

  return {
    status: 'lost',
    result: {
      settings: state.settings,
      attempts: state.history,
      duration: completedAt - state.startedAt,
      completedAt,
      outcome: 'lost',
    },
  };
}
