export const GAME_BASES = {
  BINARY: 2,
  OCTAL: 8,
  DECIMAL: 10,
  HEXADECIMAL: 16,
} as const;

export type GameBase = (typeof GAME_BASES)[keyof typeof GAME_BASES];
