import { describe, expect, it } from 'vitest';
import { evaluateGuess } from '../src/evaluateGuess';

describe('evaluateGuess', () => {
  it('should be defined', () => {
    expect(evaluateGuess).toBeDefined();
  });

  it('should return an object', () => {
    const result = evaluateGuess('4', '10');

    expect(typeof result).toBe('object');
  });

  it('should return an object with bulls and cows', () => {
    const result = evaluateGuess('14', '10');

    expect(result).toEqual({ bulls: 1, cows: 0 });
  });

  it('should count all matching digits as bulls', () => {
    const result = evaluateGuess('1234', '1234');

    expect(result).toEqual({ bulls: 4, cows: 0 });
  });

  it('should count all  misplaced digits as cows', () => {
    const result = evaluateGuess('1234', '4321');

    expect(result).toEqual({ bulls: 0, cows: 4 });
  });

  it('should count all matching and misplaced digits correctly', () => {
    const result = evaluateGuess('1234', '1325');

    expect(result).toEqual({ bulls: 1, cows: 2 });
  });

  it('should return zero bulls and cows when no digits match', () => {
    const result = evaluateGuess('1234', '6895');

    expect(result).toEqual({ bulls: 0, cows: 0 });
  });

  it('should not count bulls as cows', () => {
    const result = evaluateGuess('1123', '1114');

    expect(result).toEqual({ bulls: 2, cows: 0 });
  });

  it('should not count the same secret digit more than once', () => {
    const result = evaluateGuess('1234', '1111');

    expect(result).toEqual({ bulls: 1, cows: 0 });
  });

  it('should count hexadecimal digits as bulls regardless of case', () => {
    const result = evaluateGuess('aF01', 'Af01');

    expect(result).toEqual({ bulls: 4, cows: 0 });
  });

  it('should count hexadecimal digits as cows regardless of case', () => {
    const result = evaluateGuess('aB12', '2bA3');

    expect(result).toEqual({ bulls: 1, cows: 2 });
  });
});
