import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default defineConfig([
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    ...js.configs.recommended,
  },
  {
    files: ['**/*.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
  },
  prettier,
]);
