import { describe, expect, it, vi } from 'vitest';
import { generateSecret } from '../src/generateSecret';

describe('generateSecret', () => {
  it('should be defined', () => {
    expect(generateSecret).toBeDefined();
  });

  it('should return a string', () => {
    const secret = generateSecret(4, 10);

    expect(typeof secret).toBe('string');
  });

  // ------ first parameter : length (2–6)
  it('should return a secret with the requested length', () => {
    const secret = generateSecret(4, 10);

    expect(secret).toHaveLength(4);
  });

  it('should return a secret with only unique digits', () => {
    const secret = generateSecret(4, 10);
    const testSecret = new Set(secret);

    expect(secret.length).toEqual(testSecret.size);
  });

  it('should throw an error when length exceeds the binary base', () => {
    expect(() => generateSecret(4, 2)).toThrow();
  });

  it('should throw an error when length exceeds the octal base', () => {
    expect(() => generateSecret(7, 8)).toThrow();
  });

  it('should throw an error when length is less than 2', () => {
    expect(() => generateSecret(1, 10)).toThrow();
  });

  it('should throw an error when length is more than 6', () => {
    expect(() => generateSecret(7, 10)).toThrow();
  });

  it('should return a secret with minimum allowed length', () => {
    const secret = generateSecret(2, 2);

    expect(secret).toHaveLength(2);
  });

  it('should throw an error when length exceeds the binary base', () => {
    expect(() => generateSecret(6, 2)).toThrow();
  });

  // ===== first parameter valid digits for different bases

  it('should use only valid digits for the binary base', () => {
    const secret = generateSecret(2, 2);

    expect(secret).toMatch(/^[01]{2}$/);
  });

  it('should use only valid octal digits', () => {
    const secret = generateSecret(4, 8);

    expect(secret).toMatch(/^[0-7]{4}$/);
  });

  it('should use only valid decimal digits', () => {
    const secret = generateSecret(4, 10);

    expect(secret).toMatch(/^[0-9]{4}$/);
  });

  it('should use only valid hexadecimal digits', () => {
    const secret = generateSecret(4, 16);

    expect(secret).toMatch(/^[0-9A-F]{4}$/);
  });

  // ===== second parameter: base (supported number systems)

  it('should generate a secret for octal base', () => {
    const secret = generateSecret(4, 8);

    expect(secret).toHaveLength(4);
  });

  it('should generate a secret for decimal base', () => {
    const secret = generateSecret(4, 10);

    expect(secret).toHaveLength(4);
  });

  it('should generate a secret for hexadecimal base', () => {
    const secret = generateSecret(4, 16);

    expect(secret).toHaveLength(4);
  });

  // ===== second parameter: invalid base

  it('should throw an error when base is 0', () => {
    expect(() => generateSecret(4, 0)).toThrow();
  });

  it('should throw an error when base is 1', () => {
    expect(() => generateSecret(4, 1)).toThrow();
  });

  it('should throw an error when base is unsupported (3)', () => {
    expect(() => generateSecret(4, 3)).toThrow();
  });

  it('should throw an error when base is unsupported (7)', () => {
    expect(() => generateSecret(4, 7)).toThrow();
  });

  it('should throw an error when base is negative', () => {
    expect(() => generateSecret(4, -2)).toThrow();
  });

  it('should throw an error when base is not an Integer', () => {
    expect(() => generateSecret(4, 2.1)).toThrow();
  });

  it('should throw an error when base is NaN', () => {
    expect(() => generateSecret(4, NaN)).toThrow();
  });

  it('should throw an error when base is Infinity', () => {
    expect(() => generateSecret(4, Infinity)).toThrow();
  });

  // ===== length

  it('should throw an error when length is not an Integer', () => {
    expect(() => generateSecret(4.2, 2)).toThrow();
  });

  it('should throw an error when length is NaN', () => {
    expect(() => generateSecret(NaN, 2)).toThrow();
  });

  it('should throw an error when length is negative', () => {
    expect(() => generateSecret(-4, 2)).toThrow();
  });

  it('should throw an error when length is Infinity', () => {
    expect(() => generateSecret(Infinity, 2)).toThrow();
  });

  it('should throw an error when length is 0', () => {
    expect(() => generateSecret(0, 2)).toThrow();
  });

  //==== random

  it('should call random for each generated digit', () => {
    const random = vi.fn(() => 0.5);

    generateSecret(4, 10, random);

    expect(random).toHaveBeenCalledTimes(4);
  });

  it('should return a string when custom random function is provided', () => {
    const random = vi.fn(() => 0.5);

    const secret = generateSecret(4, 10, random);

    expect(typeof secret).toBe('string');
  });

  it('should generate a deterministic secret from random value', () => {
    const random = () => 0.5;

    const secret = generateSecret(4, 10, random);
    const anotherSecret = generateSecret(4, 10, random);

    expect(secret).toBe(anotherSecret);
  });

  it('should preserve leading zeros in the generated secret', () => {
    const random = () => 0;

    const secret = generateSecret(4, 10, random);

    expect(secret.startsWith('0')).toBe(true);
  });
});
