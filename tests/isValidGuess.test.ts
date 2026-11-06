import { describe, expect, it } from 'vitest';
import { isValidGuess } from '../src/isValidGuess';

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
