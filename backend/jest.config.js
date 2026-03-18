export default {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js', '**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/db/**',
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
  testTimeout: 15000,
};
