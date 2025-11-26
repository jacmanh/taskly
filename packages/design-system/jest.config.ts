import type { Config } from 'jest';

const config: Config = {
  displayName: 'design-system',
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
    '^@taskly/design-system$': '<rootDir>/src/index.ts',
    '^@taskly/types$': '<rootDir>/../types/src/index.ts',
    '^@taskly/telemetry$': '<rootDir>/../telemetry/src/index.ts',
    '^.+\\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/design-system',
  passWithNoTests: true,
};

export default config;
