import type { Config } from 'jest';

const config: Config = {
  displayName: 'telemetry',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        diagnostics: false,
      },
    ],
  },
  moduleNameMapper: {
    '^@taskly/telemetry$': '<rootDir>/src/index.ts'
  },
  moduleFileExtensions: ['ts', 'js'],
  coverageDirectory: '../../coverage/packages/telemetry',
  passWithNoTests: true,
};

export default config;
