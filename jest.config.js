const { defaults } = require('jest-config');
module.exports = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  transform: {
    "^.+\\.(ts|tsx)$": "<rootDir>/config/test-preprocessor.js"
  },
  testRegex: '\\.spec\\.(ts|tsx)$',
  collectCoverageFrom: [
    'src/**/*.{ts|tsx}',
    '!src/index.tsx',
  ],
};
