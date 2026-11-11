import { describe, expect, it } from 'vitest';
import { isValidGuess, getGuessValidationError } from '../src/isValidGuess';

describe('isValidGuess', () => {
  it('should be defined', () => {
    expect(isValidGuess).toBeDefined();
  });

  it('should return true for a valid guess', () => {
    expect(isValidGuess('1234', 4, 10)).toBe(true);
  });

  it('should return true for a valid hexadecimal guess', () => {
    expect(isValidGuess('aB3F', 4, 16)).toBe(true);
  });

  it('should return false when guess length is incorrect', () => {
    expect(isValidGuess('123', 4, 10)).toBe(false);
    expect(isValidGuess('12345', 4, 10)).toBe(false);
  });

  it('should return false when guess contains invalid digits', () => {
    expect(isValidGuess('1284', 4, 8)).toBe(false);
    expect(isValidGuess('12G4', 4, 16)).toBe(false);
  });

  it('should return false when guess contains repeated digits', () => {
    expect(isValidGuess('1123', 4, 10)).toBe(false);
    expect(isValidGuess('AAB3', 4, 16)).toBe(false);
  });

  it('should accept hexadecimal digits regardless of case', () => {
    expect(isValidGuess('aB3F', 4, 16)).toBe(true);
    expect(isValidGuess('AB3F', 4, 16)).toBe(true);
  });
});

describe('getGuessValidationError', () => {
  it('should return null for a valid guess', () => {
    expect(getGuessValidationError('1234', 4, 10)).toBeNull();
  });

  it('should return invalid-length when guess length is incorrect', () => {
    expect(getGuessValidationError('123', 4, 10)).toBe('invalid-length');
    expect(getGuessValidationError('12345', 4, 10)).toBe('invalid-length');
  });

  it('should return invalid-digit when guess contains invalid digits', () => {
    expect(getGuessValidationError('1284', 4, 8)).toBe('invalid-digit');
    expect(getGuessValidationError('12G4', 4, 16)).toBe('invalid-digit');
  });

  it('should return duplicate-digits when guess contains repeated digits', () => {
    expect(getGuessValidationError('1123', 4, 10)).toBe('duplicate-digits');
    expect(getGuessValidationError('AAB3', 4, 16)).toBe('duplicate-digits');
  });

  it('should accept hexadecimal digits regardless of case', () => {
    expect(getGuessValidationError('aB3F', 4, 16)).toBeNull();
  });
});
