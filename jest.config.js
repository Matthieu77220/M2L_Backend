export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: [
    '**/test/**/*.test.js',
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  collectCoverageFrom: [
    'controllers/**/*.js',
    '!**/node_modules/**'
  ],
  moduleFileExtensions: ['js', 'json'],
  testPathIgnorePatterns: ['/node_modules/']
};
