/* eslint comma-dangle: 0 */

module.exports = {
  name: 'verdaccio-gitlab-unit-jest',
  verbose: true,
  collectCoverage: true,
  testRegex: '(test/unit.*\\.spec|test/unit/webui/.*\\.spec)\\.js',
  coveragePathIgnorePatterns: [
    'node_modules',
    'fixtures',
    '<rootDir>/test',
  ]
};
