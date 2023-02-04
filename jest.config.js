const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.paths.json');

module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/functions/**/index.ts',
    '!<rootDir>/src/functions/**/schema.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text-summary'],
  moduleDirectories: ['node_modules', '.'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' }),
  testPathIgnorePatterns: [
    '<rootDir>/.webpack/',
    '<rootDir>/.serverless/',
    '<rootDir>/coverage/',
    '<rootDir>/node_modules/',
  ],
  testMatch: ['<rootDir>/src/app/**/*.spec.ts'],
};
