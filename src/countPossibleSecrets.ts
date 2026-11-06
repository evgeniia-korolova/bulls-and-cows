const cache = new Map<string, number>();

export function countPossibleSecrets(length: number, base: number): number {
  const key = `${length}-${base}`;

  const cachedResult = cache.get(key);

  if (cachedResult !== undefined) {
    return cachedResult;
  }

  if (length === 0) {
    return 1;
  }

  if (length > base) {
    return 0;
  }

  const result = base * countPossibleSecrets(length - 1, base - 1);

  cache.set(key, result);

  return result;
}
