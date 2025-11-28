import type { Config } from 'jest';

const config: Config = {
  displayName: 'front',
  preset: '../../jest.preset.js',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/../../jest.setup.ts'],
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        diagnostics: false,
      },
    ],
  },
  moduleNameMapper: {
    '^@features/(.*)$': '<rootDir>/features/$1',
    '^@taskly/design-system$': '<rootDir>/../../packages/design-system/src/index.ts',
    '^@taskly/types$': '<rootDir>/../../packages/types/src/index.ts',
    '^@taskly/telemetry$': '<rootDir>/../../packages/telemetry/src/index.ts',
    '^.+\\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/front',
  passWithNoTests: true,
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/tests/e2e/', // Exclude e2e tests from Jest (run with Playwright)
  ],
};

export default config;
