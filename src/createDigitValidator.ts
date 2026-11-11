export function createDigitValidator(base: number): (char: string) => boolean {
  const digitsArr = Array.from({ length: base }, (_, index) => index.toString(base));

  return (char) => digitsArr.includes(char.toLowerCase());
}

export function filterValidDigits(value: string, base: number): string {
  const isValidDigit = createDigitValidator(base);

  return Array.from(value).filter(isValidDigit).join('');
}
