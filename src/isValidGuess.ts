import { createDigitValidator } from './createDigitValidator';
import { GuessValidationError } from './game/types';

export function isValidGuess(guess: string, length: number, base: number): boolean {
  if (guess.length !== length) return false;
  const isValidDigit = createDigitValidator(base);
  if (![...guess].every(isValidDigit)) return false;

  const guessSet = new Set([...guess].map((char) => char.toLowerCase()));
  if (guessSet.size !== length) return false;

  return true;
}

export function getGuessValidationError(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  guess: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  length: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  base: number,
): GuessValidationError | null {
  throw new Error('Not implemented');
}
