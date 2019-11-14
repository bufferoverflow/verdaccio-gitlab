/* eslint comma-dangle: 0 */

module.exports = {
  name: 'verdaccio-gitlab-unit-jest',
  verbose: true,
  rootDir: '..',
  collectCoverage: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  testURL: 'http://localhost',
  collectCoverageFrom: ['src/*.{ts}'],
  testRegex: 'test/unit/.*\\.spec\\.ts',
  coveragePathIgnorePatterns: ['node_modules', 'fixtures'],
};
