// @ts-check
import { defineConfig } from 'eslint-define-config';

export default defineConfig({
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
});