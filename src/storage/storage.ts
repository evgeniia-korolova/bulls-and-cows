import { GAME_BASES } from '../game/constants';
import { GameSettings } from '../game/types';
import { STORAGE_KEY } from './constants';
import { StoredGameData, StorageAdapter } from './types';

interface LoadGameDataOptions {
  readonly storage?: StorageAdapter;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isGameSettings(value: unknown): value is GameSettings {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.length === 'number' &&
    Number.isInteger(value.length) &&
    value.length >= 2 &&
    value.length <= 6 &&
    Object.values(GAME_BASES).some((base) => base === value.base) &&
    value.length <= (value.base as number)
  );
}

function isGameAttempt(value: unknown, length: number): boolean {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.guess === 'string' &&
    value.guess.length === length &&
    typeof value.bulls === 'number' &&
    Number.isInteger(value.bulls) &&
    value.bulls >= 0 &&
    typeof value.cows === 'number' &&
    Number.isInteger(value.cows) &&
    value.cows >= 0 &&
    value.bulls + value.cows <= length
  );
}

function isGameResult(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  const settings = value.settings;

  if (!isGameSettings(settings)) {
    return false;
  }

  const length = settings.length;

  return (
    Array.isArray(value.attempts) &&
    value.attempts.every((attempt) => isGameAttempt(attempt, length)) &&
    typeof value.duration === 'number' &&
    Number.isFinite(value.duration) &&
    value.duration >= 0 &&
    typeof value.completedAt === 'number' &&
    Number.isFinite(value.completedAt) &&
    (value.outcome === 'won' || value.outcome === 'lost')
  );
}

function isStoredGameData(value: unknown): value is StoredGameData {
  return (
    isRecord(value) &&
    value.version === 1 &&
    isGameSettings(value.settings) &&
    Array.isArray(value.results) &&
    value.results.every(isGameResult)
  );
}

export function loadGameData(options?: LoadGameDataOptions): StoredGameData | null {
  try {
    const storage = options?.storage ?? (typeof localStorage === 'undefined' ? null : localStorage);

    if (!storage) {
      return null;
    }

    const serializedData = storage.getItem(STORAGE_KEY);

    if (serializedData === null) {
      return null;
    }

    const parsedData: unknown = JSON.parse(serializedData);

    return isStoredGameData(parsedData) ? parsedData : null;
  } catch {
    return null;
  }
}
