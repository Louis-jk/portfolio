import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const featureImportPattern = {
  group: ['@/features/*', '@/features/**'],
  message: 'Import features only from widgets or app routes.',
};

const widgetImportPattern = {
  group: ['@/widgets/*', '@/widgets/**'],
  message: 'Import widgets only from app routes.',
};

const adminProjectsPattern = {
  group: ['@/features/projects/admin', '@/features/projects/admin/**'],
  message: 'Public project UI must not import admin CMS code.',
};

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['src/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [featureImportPattern, widgetImportPattern] },
      ],
    },
  },
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [widgetImportPattern] },
      ],
    },
  },
  {
    files: ['src/features/projects/public/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [adminProjectsPattern] },
      ],
    },
  },
  {
    files: ['src/entities/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            featureImportPattern,
            widgetImportPattern,
            { group: ['@/components/*', '@/components/**'], message: 'Entities must not import UI components.' },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
