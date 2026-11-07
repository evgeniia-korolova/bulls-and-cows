import { StoredGameData, StorageAdapter } from './types';

interface LoadGameDataOptions {
  readonly storage?: StorageAdapter;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function loadGameData(options?: LoadGameDataOptions): StoredGameData | null {
  throw new Error('Not implemented');
}
