import { describe, expect, it } from 'vitest';
import { STORAGE_KEY } from '../../src/storage/constants';
import { loadGameData } from '../../src/storage/storage';
import type { StorageAdapter, StoredGameData } from '../../src/storage/types';

describe('loadGameData', () => {
  const mockData: StoredGameData = {
    version: 1,
    settings: {
      length: 4,
      base: 10,
    },
    results: [],
  };

  function createMockStorage(initialValue: string | null): StorageAdapter {
    let value = initialValue;

    return {
      getItem: () => value,
      setItem: (_key, newValue) => {
        value = newValue;
      },
    };
  }

  it('should load and parse saved game data', () => {
    const storage = createMockStorage(JSON.stringify(mockData));

    expect(loadGameData({ storage })).toEqual(mockData);
  });

  it('should return null when no data is saved', () => {
    const storage = createMockStorage(null);

    expect(loadGameData({ storage })).toBeNull();
  });

  it('should return null when saved data contains invalid JSON', () => {
    const storage = createMockStorage('{invalid json');

    expect(loadGameData({ storage })).toBeNull();
  });

  it('should use the correct storage key', () => {
    let requestedKey = '';

    const storage: StorageAdapter = {
      getItem: (key) => {
        requestedKey = key;
        return null;
      },
      setItem: () => {},
    };

    loadGameData({ storage });

    expect(requestedKey).toBe(STORAGE_KEY);
  });
});
