const SUPPORTED_BASES = [2, 8, 10, 16] as const;
type SupportedBase = (typeof SUPPORTED_BASES)[number];

export function generateSecret(
  length: number,
  base: number,
  random: () => number = Math.random,
): string {
  if (!Number.isInteger(length) || length < 2 || length > 6) {
    throw new RangeError('Invalid length value');
  }

  if (!SUPPORTED_BASES.includes(base as SupportedBase)) {
    throw new RangeError('Invalid base value');
  }

  if (length > base) {
    throw new RangeError('Length cannot exceed base');
  }

  const availableDigits = Array.from({ length: base }, (_, index) =>
    index.toString(base).toUpperCase(),
  );

  const secret: string[] = [];

  for (let i = 0; i < length; i++) {
    const index = Math.floor(random() * availableDigits.length);
    secret.push(availableDigits[index]);
    availableDigits.splice(index, 1);
  }

  return secret.join('');
}
