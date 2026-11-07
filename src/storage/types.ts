import { GameResult, GameSettings } from '../game/types';

export interface StoredGameData {
  readonly version: 1;
  readonly settings: GameSettings;
  readonly results: readonly GameResult[];
}

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
