import { describe, expect, it } from 'vitest';
import { createDigitValidator } from '../src/createDigitValidator';

describe('createDigitValidator', () => {
  it('should be defined', () => {
    expect(createDigitValidator).toBeDefined();
  });

  it('should return a function', () => {
    expect(typeof createDigitValidator(2)).toBe('function');
  });

  it('should accept valid binary digits', () => {
    const isValidDigit = createDigitValidator(2);

    expect(isValidDigit('0')).toBe(true);
    expect(isValidDigit('1')).toBe(true);
  });

  it('should reject invalid binary digits', () => {
    const isValidDigit = createDigitValidator(2);

    expect(isValidDigit('2')).toBe(false);
  });

  it('should accept valid octal digits', () => {
    const isValidDigit = createDigitValidator(8);

    expect(isValidDigit('0')).toBe(true);
    expect(isValidDigit('7')).toBe(true);
  });

  it('should reject invalid octal digits', () => {
    const isValidDigit = createDigitValidator(8);

    expect(isValidDigit('8')).toBe(false);
  });

  it('should accept valid decimal digits', () => {
    const isValidDigit = createDigitValidator(10);

    expect(isValidDigit('0')).toBe(true);
    expect(isValidDigit('9')).toBe(true);
  });

  it('should reject invalid decimal digits', () => {
    const isValidDigit = createDigitValidator(10);

    expect(isValidDigit('A')).toBe(false);
  });

  it('should accept valid hexadecimal digits', () => {
    const isValidDigit = createDigitValidator(16);

    expect(isValidDigit('0')).toBe(true);
    expect(isValidDigit('9')).toBe(true);
    expect(isValidDigit('A')).toBe(true);
    expect(isValidDigit('F')).toBe(true);
  });

  it('should reject invalid hexadecimal digits', () => {
    const isValidDigit = createDigitValidator(16);

    expect(isValidDigit('G')).toBe(false);
  });

  it('should accept hexadecimal digits regardless of case', () => {
    const isValidDigit = createDigitValidator(16);

    expect(isValidDigit('A')).toBe(true);
    expect(isValidDigit('a')).toBe(true);
    expect(isValidDigit('F')).toBe(true);
    expect(isValidDigit('f')).toBe(true);
  });
});
