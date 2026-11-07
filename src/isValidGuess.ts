import { createDigitValidator } from './createDigitValidator';
import { GuessValidationError } from './game/types';

export function isValidGuess(guess: string, length: number, base: number): boolean {
  return getGuessValidationError(guess, length, base) === null;
}

export function getGuessValidationError(
  guess: string,

  length: number,

  base: number,
): GuessValidationError | null {
  if (guess.length !== length) {
    return 'invalid-length';
  }

  const isValidDigit = createDigitValidator(base);

  if (![...guess].every(isValidDigit)) {
    return 'invalid-digit';
  }

  const guessSet = new Set([...guess].map((char) => char.toLowerCase()));

  if (guessSet.size !== length) {
    return 'duplicate-digits';
  }

  return null;
}
