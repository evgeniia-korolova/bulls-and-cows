import { describe, expect, it } from 'vitest';
import { countPossibleSecrets } from '../src/countPossibleSecrets';

describe('countPossibleSecrets', () => {
  it('should calculate the number of possible secrets for decimal base', () => {
    expect(countPossibleSecrets(4, 10)).toBe(5040);
  });

  it('should calculate the number of possible secrets for octal base', () => {
    expect(countPossibleSecrets(2, 8)).toBe(56);
  });

  it('should calculate the number of possible secrets for binary base', () => {
    expect(countPossibleSecrets(2, 2)).toBe(2);
  });

  it('should calculate the number of possible secrets when length equals base', () => {
    expect(countPossibleSecrets(4, 4)).toBe(24);
  });

  it('should return zero when length exceeds base', () => {
    expect(countPossibleSecrets(4, 2)).toBe(0);
  });

  it('should return one when length is zero', () => {
    expect(countPossibleSecrets(0, 10)).toBe(1);
  });
});
