import { GameBase } from './constants';

export interface GameSettings {
  readonly length: number;
  readonly base: GameBase;
}

export interface GameAttempt {
  readonly guess: string;
  readonly bulls: number;
  readonly cows: number;
}

export interface SetupState {
  readonly status: 'setup';
  readonly settings: GameSettings;
}

export interface PlayingState {
  readonly status: 'playing';
  readonly settings: GameSettings;
  readonly secret: string;
  readonly history: readonly GameAttempt[];
  readonly currentGuess: string;
  readonly startedAt: number;
}

export type GameOutcome = 'won' | 'lost';

export interface GameResult {
  readonly settings: GameSettings;
  readonly attempts: readonly GameAttempt[];
  readonly duration: number;
  readonly completedAt: number;
  readonly outcome: GameOutcome;
}

export interface WonState {
  readonly status: 'won';
  readonly result: GameResult;
}

export interface LostState {
  readonly status: 'lost';
  readonly result: GameResult;
}

export type GameState = SetupState | PlayingState | WonState | LostState;

export type GuessValidationError = 'invalid-length' | 'invalid-digit' | 'duplicate-digits';
