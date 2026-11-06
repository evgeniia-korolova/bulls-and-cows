import { createDigitValidator } from './createDigitValidator';

export function isValidGuess(guess: string, length: number, base: number): boolean {
  if (guess.length !== length) return false;
  const isValidDigit = createDigitValidator(base);
  if (![...guess].every(isValidDigit)) return false;

  const guessSet = new Set([...guess].map((char) => char.toLowerCase()));
  if (guessSet.size !== length) return false;

  return true;
}
